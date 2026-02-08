import React from "react";
import { Link } from "react-router-dom";
import { Section } from "./Section";
import { PhotoGallery } from "./PhotoGallery";
import { usePhotos, PhotoWithTimestamp } from "../hooks/usePhotos";

// Fallback photos used when Firestore is unavailable or empty
const fallbackPhotos: PhotoWithTimestamp[] = [
  {
    id: "1",
    src: "/photos/DSC00810.jpg",
    thumb: "/photos/thumb_DSC00810.jpg",
    width: 6000,
    height: 4000,
    caption: "Photo Title 1",
    displayMode: "soft-shadow",
    timestamp: new Date("2024-12-15").getTime(),
    exif: {
      camera: "Sony A7IV",
      lens: "Sony 24-70mm f/2.8 GM",
      focalLength: "35mm",
      aperture: "f/2.8",
      shutterSpeed: "1/250s",
      iso: "100",
      date: "Dec 15, 2024",
    },
  },
  {
    id: "2",
    src: "/photos/DSC00819.jpg",
    thumb: "/photos/thumb_DSC00819.jpg",
    width: 6000,
    height: 4000,
    caption: "Photo Title 2",
    displayMode: "soft-shadow",
    timestamp: new Date("2024-12-14").getTime(),
    exif: {
      camera: "Sony A7IV",
      lens: "Sony 85mm f/1.4 GM",
      focalLength: "85mm",
      aperture: "f/1.4",
      shutterSpeed: "1/500s",
      iso: "200",
    },
  },
  {
    id: "3",
    src: "/photos/DSC00826.jpg",
    thumb: "/photos/thumb_DSC00826.jpg",
    width: 12000,
    height: 8000,
    caption: "Photo Title 3",
    displayMode: "soft-shadow",
    timestamp: new Date("2024-12-13").getTime(),
    exif: {
      camera: "Sony A7IV",
      focalLength: "50mm",
      aperture: "f/2.0",
      shutterSpeed: "1/125s",
      iso: "400",
    },
  },
  {
    id: "4",
    src: "/photos/DSC00827.jpg",
    thumb: "/photos/thumb_DSC00827.jpg",
    width: 11182,
    height: 7601,
    caption: "Photo Title 4",
    displayMode: "soft-shadow",
    timestamp: new Date("2024-12-12").getTime(),
    exif: {
      camera: "Sony A7IV",
      focalLength: "35mm",
      aperture: "f/2.8",
      shutterSpeed: "1/160s",
      iso: "320",
    },
  },
];

export const Photography: React.FC = () => {
  const { photos, loading, error } = usePhotos();

  // Use Firestore photos if available, otherwise fall back to static photos
  const allPhotos = photos.length > 0 ? photos : fallbackPhotos;

  // Only show first 6 photos on homepage
  const displayPhotos = allPhotos.slice(0, 6);
  const hasMorePhotos = allPhotos.length > 6;

  return (
    <Section
      id="photography"
      title="Photography"
      highlightedWordOverride="Photo"
      surfaceClassName="p-8 md:p-12"
    >
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {error && !loading && (
        <div className="text-amber-600 text-center text-sm mb-4">
          Using offline gallery
        </div>
      )}

      {!loading && (
        <>
          <PhotoGallery photos={displayPhotos} defaultDisplayMode="soft-shadow" />

          {hasMorePhotos && (
            <div className="flex justify-center mt-8">
              <Link
                to="/photos"
                className="group flex flex-col items-center gap-2 text-gray-500 hover:text-indigo-500 transition-colors"
              >
                <span className="text-sm font-medium">View all photos</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 animate-bounce"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </Link>
            </div>
          )}
        </>
      )}
    </Section>
  );
};
