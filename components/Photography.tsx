import React from "react";
import { Link } from "react-router-dom";
import { Section } from "./Section";
import { PhotoCarousel } from "./PhotoCarousel";
import { usePhotos, PhotoWithTimestamp } from "../hooks/usePhotos";

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

  const allPhotos = photos.length > 0 ? photos : fallbackPhotos;
  const displayPhotos = allPhotos.slice(0, 6);
  const hasMorePhotos = allPhotos.length > 6;

  return (
    <Section
      id="photography"
      title="Photography"
      highlightedWordOverride="Photography"
      bgColor="#F4F3EE"
    >
      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-terracotta"></div>
        </div>
      )}

      {error && !loading && (
        <div className="text-warm-gray text-center text-sm mb-6">
          Using offline gallery
        </div>
      )}

      {!loading && (
        <>
          <PhotoCarousel photos={displayPhotos} />

          {hasMorePhotos && (
            <div className="mt-10 pt-6 border-t border-warm-gray-light">
              <Link
                to="/photos"
                className="text-sm font-medium text-terracotta hover:text-terracotta-light transition-colors duration-200"
              >
                View all photos &rarr;
              </Link>
            </div>
          )}
        </>
      )}
    </Section>
  );
};
