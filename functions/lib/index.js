"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePhoto = exports.deletePhoto = exports.uploadPhoto = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const exifr_1 = __importDefault(require("exifr"));
const sharp_1 = __importDefault(require("sharp"));
const uuid_1 = require("uuid");
admin.initializeApp();
const db = admin.firestore();
const bucket = admin.storage().bucket();
// Get API key from environment variable
// Set in functions/.env file: API_KEY=your-secret-key
const getApiKey = () => {
    return process.env.API_KEY;
};
// Helper to format EXIF data (filters out undefined values for Firestore)
function formatExifData(exif) {
    if (!exif)
        return {};
    const make = exif.Make;
    const model = exif.Model;
    const result = {};
    if (make && model)
        result.camera = `${make} ${model}`.trim();
    if (exif.LensModel)
        result.lens = exif.LensModel;
    if (exif.FocalLength)
        result.focalLength = `${Math.round(exif.FocalLength)}mm`;
    if (exif.FNumber)
        result.aperture = `f/${exif.FNumber}`;
    if (exif.ExposureTime)
        result.shutterSpeed = formatShutterSpeed(exif.ExposureTime);
    if (exif.ISO)
        result.iso = String(exif.ISO);
    if (exif.DateTimeOriginal)
        result.date = formatDate(exif.DateTimeOriginal);
    const location = formatGPS(exif.GPSLatitude, exif.GPSLongitude);
    if (location)
        result.location = location;
    return result;
}
function formatShutterSpeed(seconds) {
    if (seconds >= 1)
        return `${seconds}s`;
    return `1/${Math.round(1 / seconds)}s`;
}
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}
function formatGPS(lat, lon) {
    if (lat === undefined || lon === undefined)
        return undefined;
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
}
// Validate API key from request
function validateApiKey(req) {
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
exports.uploadPhoto = functions
    .runWith({
    memory: "1GB",
    timeoutSeconds: 120,
})
    .https.onRequest(async (req, res) => {
    // CORS headers
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Photo-Caption, X-Original-Filename, X-Display-Mode");
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
        let imageBuffer;
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
        }
        else {
            // Raw image upload with metadata in headers
            if (!req.rawBody || req.rawBody.length === 0) {
                res.status(400).json({ error: "Missing image data" });
                return;
            }
            imageBuffer = req.rawBody;
            caption = req.headers["x-photo-caption"] || "";
            displayMode =
                req.headers["x-display-mode"] || "soft-shadow";
            originalFilename =
                req.headers["x-original-filename"] || "";
        }
        // Validate file size (max 30MB)
        const MAX_FILE_SIZE = 30 * 1024 * 1024;
        if (imageBuffer.length > MAX_FILE_SIZE) {
            res.status(413).json({ error: "File too large. Max 30MB." });
            return;
        }
        // Generate unique ID
        const photoId = (0, uuid_1.v4)();
        if (!originalFilename) {
            originalFilename = `photo_${photoId}.jpg`;
        }
        console.log(`Processing upload: ${photoId} (${originalFilename})`);
        // Extract EXIF data
        let exifData = {};
        let photoTimestamp = Date.now(); // Default to upload time
        try {
            const rawExif = await exifr_1.default.parse(imageBuffer, {
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
        }
        catch (exifError) {
            console.warn("Failed to extract EXIF data:", exifError);
        }
        // Auto-rotate based on EXIF orientation and convert to JPEG
        // .rotate() without args auto-rotates based on EXIF orientation tag
        const processedImage = await (0, sharp_1.default)(imageBuffer)
            .rotate()
            .jpeg({ quality: 90 })
            .toBuffer();
        // Get dimensions AFTER rotation
        const processedMetadata = await (0, sharp_1.default)(processedImage).metadata();
        const width = processedMetadata.width || 0;
        const height = processedMetadata.height || 0;
        // Generate thumbnail (max 600px on longest side)
        const thumbnailBuffer = await (0, sharp_1.default)(imageBuffer)
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
        const photoDoc = {
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
    }
    catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            error: "Upload failed",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
// Delete photo endpoint
exports.deletePhoto = functions.https.onRequest(async (req, res) => {
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
        const photoId = req.query.id;
        if (!photoId) {
            res.status(400).json({ error: "Missing photo ID" });
            return;
        }
        // Delete from Storage
        const originalFile = bucket.file(`photos/originals/${photoId}.jpg`);
        const thumbFile = bucket.file(`photos/thumbnails/thumb_${photoId}.jpg`);
        await Promise.all([
            originalFile.delete().catch(() => { }),
            thumbFile.delete().catch(() => { }),
        ]);
        // Delete from Firestore
        await db.collection("photos").doc(photoId).delete();
        res.status(200).json({ success: true, message: "Photo deleted" });
    }
    catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({
            error: "Delete failed",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
// Update photo metadata endpoint
exports.updatePhoto = functions.https.onRequest(async (req, res) => {
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
        const updates = {};
        if (caption !== undefined)
            updates.caption = caption;
        if (isVisible !== undefined)
            updates.isVisible = isVisible;
        if (sortOrder !== undefined)
            updates.sortOrder = sortOrder;
        if (displayMode !== undefined)
            updates.displayMode = displayMode;
        if (Object.keys(updates).length === 0) {
            res.status(400).json({ error: "No updates provided" });
            return;
        }
        await db.collection("photos").doc(id).update(updates);
        res.status(200).json({ success: true, message: "Photo updated" });
    }
    catch (error) {
        console.error("Update error:", error);
        res.status(500).json({
            error: "Update failed",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
//# sourceMappingURL=index.js.map