import React, { useEffect, useRef, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import PhotoSwipe from "photoswipe";
import "photoswipe/style.css";
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
];

type StreamItem =
  | {
      type: "date";
      id: string;
      month: string;
      monthTitle: string;
      year: string;
    }
  | {
      type: "photo";
      id: string;
      photo: PhotoWithTimestamp;
    };

function buildPhotoStream(photos: PhotoWithTimestamp[]): StreamItem[] {
  const items: StreamItem[] = [];
  const monthGroups: {
    monthYear: string;
    month: string;
    year: string;
    photos: PhotoWithTimestamp[];
  }[] = [];

  photos.forEach((photo) => {
    const date = new Date(photo.timestamp);
    const monthYear = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const year = date.getFullYear().toString();

    let grp = monthGroups.find((g) => g.monthYear === monthYear);
    if (!grp) {
      grp = { monthYear, month, year, photos: [] };
      monthGroups.push(grp);
    }
    grp.photos.push(photo);
  });

  monthGroups.forEach((grp) => {
    items.push({
      type: "date",
      id: `date-${grp.monthYear.replace(/\s+/g, "-")}`,
      month: grp.month.toUpperCase(),
      monthTitle: grp.month,
      year: grp.year,
    });
    grp.photos.forEach((photo) => {
      items.push({
        type: "photo",
        id: photo.id,
        photo,
      });
    });
  });

  return items;
}

export const PhotosTestPage: React.FC = () => {
  const { photos, loading, error } = usePhotos();
  const galleryRef = useRef<HTMLDivElement>(null);
  const [casing, setCasing] = useState<"uppercase" | "title">("uppercase");
  const [alignment, setAlignment] = useState<"left" | "center">("left");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const allPhotos = photos.length > 0 ? photos : fallbackPhotos;
  const streamItems = useMemo(() => buildPhotoStream(allPhotos), [allPhotos]);

  useEffect(() => {
    if (!galleryRef.current || allPhotos.length === 0) return;

    const lightbox = new PhotoSwipeLightbox({
      gallery: "#photos-test-gallery",
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
              ${
                exif.camera
                  ? `<div class="exif-row"><span class="exif-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" /><path fill-rule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3H4.5a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM12 17.25a5.25 5.25 0 100-10.5 5.25 5.25 0 000 10.5z" clip-rule="evenodd" /></svg></span><span>${exif.camera}</span></div>`
                  : ""
              }
              ${
                exif.lens
                  ? `<div class="exif-row"><span class="exif-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg></span><span>${exif.lens}</span></div>`
                  : ""
              }
              <div class="exif-settings">
                ${exif.focalLength ? `<span>${exif.focalLength}</span>` : ""}
                ${exif.aperture ? `<span>${exif.aperture}</span>` : ""}
                ${exif.shutterSpeed ? `<span>${exif.shutterSpeed}</span>` : ""}
                ${exif.iso ? `<span>ISO ${exif.iso}</span>` : ""}
              </div>
              ${
                exif.date
                  ? `<div class="exif-row exif-date"><span class="exif-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clip-rule="evenodd" /></svg></span><span>${exif.date}</span></div>`
                  : ""
              }
              ${
                exif.location
                  ? `<div class="exif-row"><span class="exif-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" /></svg></span><span>${exif.location}</span></div>`
                  : ""
              }
            </div>
          `;
        } else {
          exifContainer.innerHTML = "";
        }
      }
    };

    lightbox.on("change", updateExif);
    lightbox.on("afterInit", updateExif);
    lightbox.init();

    return () => {
      lightbox.destroy();
    };
  }, [allPhotos]);

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <style>{`
        .pswp__exif-container {
          position: absolute;
          bottom: 24px;
          left: 24px;
          z-index: 1000;
          pointer-events: none;
        }
        .pswp__exif-hud {
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 8px;
          padding: 12px 16px;
          color: white;
          font-size: 13px;
          font-family: 'Inter', system-ui, sans-serif;
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
          border-radius: 4px;
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

        /* Unified Inline Justified Photo Grid */
        .inline-photo-grid {
          --row-h: 260px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        @media (max-width: 768px) {
          .inline-photo-grid {
            --row-h: 200px;
            gap: 6px;
          }
        }
        @media (max-width: 480px) {
          .inline-photo-grid {
            --row-h: 160px;
            gap: 5px;
          }
        }
        .inline-photo-grid::after {
          content: '';
          flex-grow: 999999999;
        }

        .inline-grid-item {
          height: var(--row-h);
          position: relative;
          overflow: hidden;
          border-radius: 2px;
        }

        .inline-photo-link img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .inline-photo-link:hover img {
          transform: scale(1.03);
        }
      `}</style>

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <nav className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.15em] text-warm-gray">
            <Link
              to="/"
              className="text-terracotta hover:text-terracotta-light transition-colors"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              to="/photos"
              className="text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              Photos (Live)
            </Link>
            <span>/</span>
            <span className="text-neutral-800 font-semibold">Test Grid</span>
          </nav>
          <Link
            to="/photos"
            className="text-sm font-medium text-terracotta hover:text-terracotta-light transition-colors duration-200"
          >
            &larr; Live Version
          </Link>
        </div>
        <hr className="rule-double mb-4" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-black tracking-tight">
              Photography
            </h1>
            <p className="text-xs font-sans uppercase tracking-[0.2em] text-warm-gray mt-2">
              Inline Grid Preview &bull; {allPhotos.length} Photos &bull; Pure Text Month + Date
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 text-xs font-medium self-start md:self-auto">
            <div className="flex items-center gap-1 p-1 bg-neutral-200/60 rounded-md">
              <button
                onClick={() => setCasing("uppercase")}
                className={`px-3 py-1 rounded transition-all ${
                  casing === "uppercase"
                    ? "bg-white text-black shadow-sm font-semibold"
                    : "text-neutral-600 hover:text-black"
                }`}
              >
                UPPERCASE
              </button>
              <button
                onClick={() => setCasing("title")}
                className={`px-3 py-1 rounded transition-all ${
                  casing === "title"
                    ? "bg-white text-black shadow-sm font-semibold"
                    : "text-neutral-600 hover:text-black"
                }`}
              >
                Title Case
              </button>
            </div>

            <div className="flex items-center gap-1 p-1 bg-neutral-200/60 rounded-md">
              <button
                onClick={() => setAlignment("left")}
                className={`px-3 py-1 rounded transition-all ${
                  alignment === "left"
                    ? "bg-white text-black shadow-sm font-semibold"
                    : "text-neutral-600 hover:text-black"
                }`}
              >
                Left
              </button>
              <button
                onClick={() => setAlignment("center")}
                className={`px-3 py-1 rounded transition-all ${
                  alignment === "center"
                    ? "bg-white text-black shadow-sm font-semibold"
                    : "text-neutral-600 hover:text-black"
                }`}
              >
                Center
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {loading && (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-terracotta"></div>
          </div>
        )}

        {error && !loading && (
          <div className="text-warm-gray text-center text-sm mb-4">
            Using offline gallery
          </div>
        )}

        {!loading && (
          <div
            ref={galleryRef}
            id="photos-test-gallery"
            className="inline-photo-grid"
          >
            {streamItems.map((item) => {
              if (item.type === "date") {
                return (
                  <div
                    key={item.id}
                    className={`inline-grid-item flex-shrink-0 flex flex-col justify-center bg-transparent select-none px-5 sm:px-7 md:px-8 ${
                      alignment === "center"
                        ? "items-center text-center"
                        : "items-start text-left"
                    }`}
                    style={{
                      flexGrow: 0.65,
                      flexBasis: "calc(var(--row-h) * 0.72)",
                      minWidth: "170px",
                    }}
                  >
                    <span className="block font-serif font-bold text-2xl sm:text-3xl md:text-[34px] text-black tracking-tight leading-none whitespace-nowrap">
                      {casing === "uppercase" ? item.month : item.monthTitle}
                    </span>
                    <span className="block font-serif font-bold text-base sm:text-lg md:text-xl text-neutral-500 tracking-tight mt-2 whitespace-nowrap">
                      {item.year}
                    </span>
                  </div>
                );
              }

              // Photo item
              const photo = item.photo;
              const ar = photo.width / photo.height;
              return (
                <a
                  key={photo.id}
                  href={photo.src}
                  data-pswp-width={photo.width}
                  data-pswp-height={photo.height}
                  className="photo-item inline-grid-item inline-photo-link group cursor-pointer block"
                  style={{
                    flexGrow: ar,
                    flexBasis: `calc(var(--row-h) * ${ar})`,
                    aspectRatio: `${photo.width} / ${photo.height}`,
                  }}
                  aria-label={photo.alt || photo.caption || "View photo"}
                >
                  <img
                    src={photo.thumb}
                    alt={photo.alt || photo.caption || "Photo"}
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotosTestPage;
