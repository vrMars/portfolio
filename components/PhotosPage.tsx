import React, { useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import PhotoSwipe from "photoswipe";
import "photoswipe/style.css";
import { usePhotos, PhotoWithTimestamp } from "../hooks/usePhotos";

// Fallback photos
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
];

// Group photos by month
interface PhotoGroup {
  label: string;
  photos: PhotoWithTimestamp[];
}

function groupPhotosByMonth(photos: PhotoWithTimestamp[]): PhotoGroup[] {
  const groups: Map<string, PhotoWithTimestamp[]> = new Map();

  photos.forEach((photo) => {
    const date = new Date(photo.timestamp);
    const monthYear = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    if (!groups.has(monthYear)) {
      groups.set(monthYear, []);
    }
    groups.get(monthYear)!.push(photo);
  });

  return Array.from(groups.entries()).map(([label, photos]) => ({
    label,
    photos,
  }));
}

function distributeToColumns(photos: PhotoWithTimestamp[], numCols: number): PhotoWithTimestamp[][] {
  const cols: PhotoWithTimestamp[][] = Array.from({ length: numCols }, () => []);
  const colHeights: number[] = Array(numCols).fill(0);
  photos.forEach((photo) => {
    const shortest = colHeights.indexOf(Math.min(...colHeights));
    cols[shortest].push(photo);
    colHeights[shortest] += photo.height / photo.width;
  });
  return cols;
}

export const PhotosPage: React.FC = () => {
  const { photos, loading, error } = usePhotos();
  const galleryRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const allPhotos = photos.length > 0 ? photos : fallbackPhotos;
  const photoGroups = useMemo(() => groupPhotosByMonth(allPhotos), [allPhotos]);

  // Initialize PhotoSwipe
  useEffect(() => {
    if (!galleryRef.current || allPhotos.length === 0) return;

    const lightbox = new PhotoSwipeLightbox({
      gallery: "#photos-page-gallery",
      children: "a.photo-item",
      pswpModule: PhotoSwipe,
      bgOpacity: 0.95,
      showHideAnimationType: "fade",
      padding: { top: 40, bottom: 80, left: 40, right: 40 },
      initialZoomLevel: "fit",
      secondaryZoomLevel: 1.5,
      maxZoomLevel: 2,
    });

    lightbox.on("uiRegister", function () {
      lightbox.pswp?.ui?.registerElement({
        name: "exif-hud",
        order: 9,
        isButton: false,
        appendTo: "wrapper",
        onInit: (el) => {
          el.className = "pswp__exif-container";
        },
      });
    });

    const updateExif = () => {
      const pswp = lightbox.pswp;
      if (!pswp) return;

      const currentSlide = pswp.currSlide;
      const currentSrc = currentSlide?.data?.src;
      const photo = allPhotos.find((p) => p.src === currentSrc);
      const exifContainer = pswp.element?.querySelector(".pswp__exif-container");

      if (exifContainer && photo?.exif) {
        const exif = photo.exif;
        const hasExif = Object.values(exif).some(Boolean);

        if (hasExif) {
          exifContainer.innerHTML = `
            <div class="pswp__exif-hud">
              ${exif.camera ? `<div class="exif-row"><span class="exif-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" /><path fill-rule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3H4.5a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM12 17.25a5.25 5.25 0 100-10.5 5.25 5.25 0 000 10.5z" clip-rule="evenodd" /></svg></span><span>${exif.camera}</span></div>` : ""}
              ${exif.lens ? `<div class="exif-row"><span class="exif-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg></span><span>${exif.lens}</span></div>` : ""}
              <div class="exif-settings">
                ${exif.focalLength ? `<span>${exif.focalLength}</span>` : ""}
                ${exif.aperture ? `<span>${exif.aperture}</span>` : ""}
                ${exif.shutterSpeed ? `<span>${exif.shutterSpeed}</span>` : ""}
                ${exif.iso ? `<span>ISO ${exif.iso}</span>` : ""}
              </div>
              ${exif.date ? `<div class="exif-row exif-date"><span class="exif-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clip-rule="evenodd" /></svg></span><span>${exif.date}</span></div>` : ""}
              ${exif.location ? `<div class="exif-row"><span class="exif-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" /></svg></span><span>${exif.location}</span></div>` : ""}
            </div>
          `;
        } else {
          exifContainer.innerHTML = "";
        }
      } else if (exifContainer) {
        exifContainer.innerHTML = "";
      }
    };

    lightbox.on("change", updateExif);
    lightbox.on("openingAnimationEnd", updateExif);
    lightbox.init();
    lightboxRef.current = lightbox;

    return () => {
      lightbox.destroy();
      lightboxRef.current = null;
    };
  }, [allPhotos]);

  return (
    <section className="relative py-24 lg:py-32">
      {/* EXIF HUD Styles */}
      <style>{`
        .pswp__exif-container {
          position: absolute;
          bottom: 16px;
          left: 16px;
          z-index: 10;
          pointer-events: none;
        }
        .pswp__exif-hud {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 12px;
          padding: 12px 16px;
          color: white;
          font-size: 13px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 320px;
          line-height: 1.4;
        }
        .exif-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .exif-row:last-child { margin-bottom: 0; }
        .exif-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.7;
          flex-shrink: 0;
        }
        .exif-settings {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 8px 0;
          padding: 8px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        }
        .exif-settings span {
          background: rgba(255, 255, 255, 0.1);
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }
        .exif-date {
          opacity: 0.7;
          font-size: 12px;
        }
        @media (max-width: 640px) {
          .pswp__exif-hud {
            font-size: 11px;
            padding: 10px 12px;
            max-width: 260px;
          }
          .exif-settings span {
            font-size: 10px;
            padding: 3px 6px;
          }
        }
        .justified-gallery {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .justified-gallery::after {
          content: '';
          flex-grow: 999999999;
        }
        .justified-gallery-item {
          height: 220px;
          overflow: hidden;
          border-radius: 16px;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .justified-gallery-item:hover {
          transform: translateY(-4px);
        }
        .justified-gallery-item img {
          height: 100%;
          width: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .justified-gallery-item:hover img {
          transform: scale(1.01);
        }
        @media (max-width: 640px) {
          .justified-gallery {
            display: none;
          }
        }
        .masonry-mobile {
          display: none;
        }
        @media (max-width: 640px) {
          .masonry-mobile {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
          }
          .masonry-mobile-col {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          .masonry-mobile-item {
            overflow: hidden;
            border-radius: 10px;
            cursor: pointer;
          }
          .masonry-mobile-item img {
            width: 100%;
            height: auto;
            display: block;
            transition: transform 0.5s ease;
          }
          .masonry-mobile-item:active img {
            transform: scale(1.01);
          }
        }
      `}</style>

      {/* Header */}
      <div className="mx-auto mb-10 px-6 sm:px-10" style={{ maxWidth: '90%' }}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800">
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Photo
            </span>
            <span className="text-gray-600">graphy</span>
          </h2>
          <Link
            to="/#photography"
            className="inline-flex items-center text-sm font-medium text-indigo-500 hover:text-purple-500 transition-colors"
          >
            ← Back to portfolio
          </Link>
        </div>
      </div>

      {/* Gallery */}
      <div className="mx-auto px-6 sm:px-10" style={{ maxWidth: '90%' }}>
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="text-amber-600 text-center text-sm mb-4">
            Using offline gallery
          </div>
        )}

        {/* Gallery with month groups */}
        {!loading && (
          <div ref={galleryRef} id="photos-page-gallery">
            {photoGroups.map((group, groupIndex) => (
              <div key={group.label} className={groupIndex > 0 ? "mt-10" : ""}>
                {/* Month header */}
                <h3 className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-4 pb-2 border-b border-gray-200/50">
                  {group.label}
                </h3>

                {/* Desktop: justified gallery */}
                <div className="justified-gallery">
                  {group.photos.map((photo) => (
                    <a
                      key={photo.id}
                      href={photo.src}
                      data-pswp-width={photo.width}
                      data-pswp-height={photo.height}
                      className="photo-item justified-gallery-item"
                      style={{ flexGrow: photo.width / photo.height }}
                    >
                      <img
                        src={photo.thumb}
                        alt={photo.alt || photo.caption || "Photo"}
                        loading="lazy"
                        decoding="async"
                      />
                    </a>
                  ))}
                </div>

                {/* Mobile: masonry columns preserving aspect ratio */}
                <div className="masonry-mobile">
                  {distributeToColumns(group.photos, 2).map((col, colIdx) => (
                    <div key={colIdx} className="masonry-mobile-col">
                      {col.map((photo) => (
                        <a
                          key={photo.id}
                          href={photo.src}
                          data-pswp-width={photo.width}
                          data-pswp-height={photo.height}
                          className="photo-item masonry-mobile-item"
                        >
                          <img
                            src={photo.thumb}
                            alt={photo.alt || photo.caption || "Photo"}
                            loading="lazy"
                            decoding="async"
                          />
                        </a>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
