import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Photo } from "../components/PhotoGallery";

export interface PhotoWithTimestamp extends Photo {
  timestamp: number;
}

interface UsePhotosResult {
  photos: PhotoWithTimestamp[];
  loading: boolean;
  error: Error | null;
}

export function usePhotos(): UsePhotosResult {
  const [photos, setPhotos] = useState<PhotoWithTimestamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const photosRef = collection(db, "photos");
    const q = query(
      photosRef,
      where("isVisible", "==", true),
      orderBy("sortOrder", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const photosData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            src: data.src,
            thumb: data.thumb,
            width: data.width,
            height: data.height,
            alt: data.alt,
            caption: data.caption,
            displayMode: data.displayMode,
            exif: data.exif,
            timestamp: data.sortOrder || Date.now(),
          } as PhotoWithTimestamp;
        });
        setPhotos(photosData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching photos:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { photos, loading, error };
}
