import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import exifr from "exifr";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

admin.initializeApp();

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Get API key from environment variable
// Set in functions/.env file: API_KEY=your-secret-key
const getApiKey = (): string | undefined => {
  return process.env.API_KEY;
};

interface ExifData {
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
  date?: string;
  location?: string;
}

interface PhotoDocument {
  id: string;
  src: string;
  thumb: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  displayMode: string;
  exif: ExifData;
  createdAt: admin.firestore.FieldValue;
  sortOrder: number;
  isVisible: boolean;
  originalFilename: string;
}

// Helper to format EXIF data (filters out undefined values for Firestore)
function formatExifData(exif: Record<string, unknown> | null): ExifData {
  if (!exif) return {};

  const make = exif.Make as string | undefined;
  const model = exif.Model as string | undefined;

  const result: ExifData = {};

  if (make && model) result.camera = `${make} ${model}`.trim();
  if (exif.LensModel) result.lens = exif.LensModel as string;
  if (exif.FocalLength) result.focalLength = `${Math.round(exif.FocalLength as number)}mm`;
  if (exif.FNumber) result.aperture = `f/${exif.FNumber}`;
  if (exif.ExposureTime) result.shutterSpeed = formatShutterSpeed(exif.ExposureTime as number);
  if (exif.ISO) result.iso = String(exif.ISO);
  if (exif.DateTimeOriginal) result.date = formatDate(exif.DateTimeOriginal as Date | string);

  const location = formatGPS(
    exif.GPSLatitude as number | undefined,
    exif.GPSLongitude as number | undefined
  );
  if (location) result.location = location;

  return result;
}

function formatShutterSpeed(seconds: number): string {
  if (seconds >= 1) return `${seconds}s`;
  return `1/${Math.round(1 / seconds)}s`;
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatGPS(lat?: number, lon?: number): string | undefined {
  if (lat === undefined || lon === undefined) return undefined;
  return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
}

// Validate API key from request
function validateApiKey(req: functions.https.Request): boolean {
  const authHeader = req.headers.authorization;
  const apiKey = getApiKey();

  if (!apiKey) {
    console.error("API key not configured");
    return false;
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const providedKey = authHeader.split(" ")[1];
  return providedKey === apiKey;
}

// Main upload endpoint
export const uploadPhoto = functions
  .runWith({
    memory: "1GB",
    timeoutSeconds: 120,
  })
  .https.onRequest(async (req, res) => {
    // CORS headers
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Photo-Caption, X-Original-Filename, X-Display-Mode"
    );

    // Handle preflight
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    // Only allow POST
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    // Validate API key
    if (!validateApiKey(req)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      let imageBuffer: Buffer;
      let caption = "";
      let displayMode = "soft-shadow";
      let originalFilename = "";

      const contentType = req.headers["content-type"] || "";

      if (contentType.includes("application/json")) {
        // JSON body with base64 image
        const body = req.body;
        if (!body.image) {
          res.status(400).json({ error: "Missing image data" });
          return;
        }
        imageBuffer = Buffer.from(body.image, "base64");
        caption = body.caption || "";
        displayMode = body.displayMode || "soft-shadow";
        originalFilename = body.filename || "";
      } else {
        // Raw image upload with metadata in headers
        if (!req.rawBody || req.rawBody.length === 0) {
          res.status(400).json({ error: "Missing image data" });
          return;
        }
        imageBuffer = req.rawBody;
        caption = (req.headers["x-photo-caption"] as string) || "";
        displayMode =
          (req.headers["x-display-mode"] as string) || "soft-shadow";
        originalFilename =
          (req.headers["x-original-filename"] as string) || "";
      }

      // Validate file size (max 30MB)
      const MAX_FILE_SIZE = 30 * 1024 * 1024;
      if (imageBuffer.length > MAX_FILE_SIZE) {
        res.status(413).json({ error: "File too large. Max 30MB." });
        return;
      }

      // Generate unique ID
      const photoId = uuidv4();
      if (!originalFilename) {
        originalFilename = `photo_${photoId}.jpg`;
      }

      console.log(`Processing upload: ${photoId} (${originalFilename})`);

      // Extract EXIF data
      let exifData: ExifData = {};
      let photoTimestamp: number = Date.now(); // Default to upload time
      try {
        const rawExif = await exifr.parse(imageBuffer, {
          pick: [
            "Make",
            "Model",
            "LensModel",
            "FocalLength",
            "FNumber",
            "ExposureTime",
            "ISO",
            "DateTimeOriginal",
            "GPSLatitude",
            "GPSLongitude",
          ],
        });
        exifData = formatExifData(rawExif);
        // Use EXIF date for sorting if available
        if (rawExif?.DateTimeOriginal) {
          photoTimestamp = new Date(rawExif.DateTimeOriginal).getTime();
        }
      } catch (exifError) {
        console.warn("Failed to extract EXIF data:", exifError);
      }

      // Auto-rotate based on EXIF orientation and convert to JPEG
      // .rotate() without args auto-rotates based on EXIF orientation tag
      const processedImage = await sharp(imageBuffer)
        .rotate()
        .jpeg({ quality: 90 })
        .toBuffer();

      // Get dimensions AFTER rotation
      const processedMetadata = await sharp(processedImage).metadata();
      const width = processedMetadata.width || 0;
      const height = processedMetadata.height || 0;

      // Generate thumbnail (max 600px on longest side)
      const thumbnailBuffer = await sharp(imageBuffer)
        .rotate()
        .resize(600, 600, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();

      console.log(`Image processed: ${width}x${height}`);

      // Upload original to Storage
      const originalPath = `photos/originals/${photoId}.jpg`;
      const originalFile = bucket.file(originalPath);
      await originalFile.save(processedImage, {
        contentType: "image/jpeg",
        metadata: {
          cacheControl: "public, max-age=31536000",
        },
      });
      await originalFile.makePublic();

      // Upload thumbnail to Storage
      const thumbPath = `photos/thumbnails/thumb_${photoId}.jpg`;
      const thumbFile = bucket.file(thumbPath);
      await thumbFile.save(thumbnailBuffer, {
        contentType: "image/jpeg",
        metadata: {
          cacheControl: "public, max-age=31536000",
        },
      });
      await thumbFile.makePublic();

      // Get the bucket name for URL construction
      const bucketName = bucket.name;

      // Build photo document
      const photoDoc: PhotoDocument = {
        id: photoId,
        src: `https://storage.googleapis.com/${bucketName}/${originalPath}`,
        thumb: `https://storage.googleapis.com/${bucketName}/${thumbPath}`,
        width,
        height,
        alt: caption || originalFilename,
        caption,
        displayMode,
        exif: exifData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        sortOrder: photoTimestamp,
        isVisible: true,
        originalFilename,
      };

      // Save to Firestore
      await db.collection("photos").doc(photoId).set(photoDoc);

      console.log(`Upload complete: ${photoId}`);

      res.status(200).json({
        success: true,
        photoId,
        message: "Photo uploaded successfully",
        url: photoDoc.src,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

// Delete photo endpoint
export const deletePhoto = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "DELETE, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "DELETE") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!validateApiKey(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const photoId = req.query.id as string;
    if (!photoId) {
      res.status(400).json({ error: "Missing photo ID" });
      return;
    }

    // Delete from Storage
    const originalFile = bucket.file(`photos/originals/${photoId}.jpg`);
    const thumbFile = bucket.file(`photos/thumbnails/thumb_${photoId}.jpg`);

    await Promise.all([
      originalFile.delete().catch(() => {}),
      thumbFile.delete().catch(() => {}),
    ]);

    // Delete from Firestore
    await db.collection("photos").doc(photoId).delete();

    res.status(200).json({ success: true, message: "Photo deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      error: "Delete failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update photo metadata endpoint
export const updatePhoto = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "PATCH, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "PATCH") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!validateApiKey(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const { id, caption, isVisible, sortOrder, displayMode } = req.body;

    if (!id) {
      res.status(400).json({ error: "Missing photo ID" });
      return;
    }

    const updates: Record<string, unknown> = {};
    if (caption !== undefined) updates.caption = caption;
    if (isVisible !== undefined) updates.isVisible = isVisible;
    if (sortOrder !== undefined) updates.sortOrder = sortOrder;
    if (displayMode !== undefined) updates.displayMode = displayMode;

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: "No updates provided" });
      return;
    }

    await db.collection("photos").doc(id).update(updates);

    res.status(200).json({ success: true, message: "Photo updated" });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      error: "Update failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
