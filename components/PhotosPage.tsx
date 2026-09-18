import React, { useEffect, useRef, useState, useMemo } from "react";
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

type GalleryItem =
  | {
      type: "date";
      id: string;
      month: string;
      year: string;
    }
  | {
      type: "photo";
      id: string;
      photo: PhotoWithTimestamp;
    };

interface GalleryRow {
  id: string;
  items: GalleryItem[];
}

function buildGalleryRows(
  photos: PhotoWithTimestamp[],
  containerWidth: number
): GalleryRow[] {
  if (photos.length === 0) return [];

  const isMobile = containerWidth < 640;
  const isTablet = containerWidth < 1024;
  const targetH = isMobile ? 140 : isTablet ? 190 : 250;

  // Step 1: Pack photos into justified rows (standard algorithm)
  const rows: PhotoWithTimestamp[][] = [];
  let currentRow: PhotoWithTimestamp[] = [];
  let currentW = 0;

  photos.forEach((p) => {
    const ar = p.width / p.height;
    const pw = targetH * ar;
    if (currentW + pw > containerWidth * 1.05 && currentRow.length >= 2) {
      rows.push(currentRow);
      currentRow = [p];
      currentW = pw;
    } else {
      currentRow.push(p);
      currentW += pw;
    }
  });
  if (currentRow.length > 0) rows.push(currentRow);

  // If last row has only 1 photo, merge with previous row if possible
  if (rows.length > 1 && rows[rows.length - 1].length === 1) {
    const single = rows.pop()![0];
    rows[rows.length - 1].push(single);
  }

  // Step 2: Convert to GalleryRows
  const galleryRows: GalleryRow[] = rows.map((r, rIdx) => ({
    id: `row-${rIdx}`,
    items: r.map((p) => ({
      type: "photo" as const,
      id: p.id,
      photo: p,
    })),
  }));

  // Step 3: Insert Date Chips
  // Identify every unique month
  const months: {
    monthYear: string;
    month: string;
    year: string;
    photoId: string;
  }[] = [];

  photos.forEach((p) => {
    const d = new Date(p.timestamp);
    const monthYear = d.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    const month = d.toLocaleDateString("en-US", { month: "long" }).toUpperCase();
    const year = d.getFullYear().toString();

    if (!months.find((m) => m.monthYear === monthYear)) {
      months.push({ monthYear, month, year, photoId: p.id });
    }
  });

  // For each month, find which row contains its first photo and insert date chip
  // Invariant: Never insert at index 0, Never insert at index length!
  months.forEach((m) => {
    let targetRowIndex = -1;
    let targetPhotoPos = -1;

    for (let r = 0; r < galleryRows.length; r++) {
      const pos = galleryRows[r].items.findIndex(
        (it) => it.type === "photo" && it.photo.id === m.photoId
      );
      if (pos !== -1) {
        targetRowIndex = r;
        targetPhotoPos = pos;
        break;
      }
    }

    if (targetRowIndex === -1) return;

    const dateItem: GalleryItem = {
      type: "date",
      id: `date-${m.monthYear.replace(/\s+/g, "-")}`,
      month: m.month,
      year: m.year,
    };

    const row = galleryRows[targetRowIndex];
    // Position within row: must be strictly > 0 and < row.items.length
    let insertPos = 1;
    if (targetPhotoPos === 0) {
      insertPos = 1;
    } else if (targetPhotoPos >= row.items.length - 1) {
      insertPos = Math.max(1, row.items.length - 1);
    } else {
      insertPos = targetPhotoPos;
    }

    row.items.splice(insertPos, 0, dateItem);
  });

  return galleryRows;
}

export const PhotosPage: React.FC = () => {
  const { photos, loading, error } = usePhotos();
  const galleryRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(() =>
    typeof window !== "undefined"
      ? Math.min(1152, Math.max(320, window.innerWidth - 48))
      : 1000
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!galleryRef.current) return;
    const updateWidth = () => {
      if (galleryRef.current) {
        const w = galleryRef.current.clientWidth;
        if (w > 0) setContainerWidth(w);
      }
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(galleryRef.current);
    return () => ro.disconnect();
  }, []);

  const allPhotos = photos.length > 0 ? photos : fallbackPhotos;
  const galleryRows = useMemo(
    () => buildGalleryRows(allPhotos, containerWidth),
    [allPhotos, containerWidth]
  );

  const isMobile = containerWidth < 640;
  const isTablet = containerWidth < 1024;
  const targetH = isMobile ? 140 : isTablet ? 190 : 250;
  const gapPx = isMobile ? 5 : 8;

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
      `}</style>

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <nav className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.15em] text-warm-gray">
            <Link
              to="/"
              className="text-terracotta hover:text-terracotta-light transition-colors"
            >
              Home
            </Link>
            <span>/</span>
            <span className="text-neutral-600">Photography</span>
          </nav>
          <Link
            to="/#photography"
            className="text-sm font-medium text-terracotta hover:text-terracotta-light transition-colors duration-200"
          >
            &larr; Back
          </Link>
        </div>
        <hr className="rule-double mb-4" />
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-black tracking-tight">
          Photography
        </h1>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            id="photos-page-gallery"
            className="flex flex-col"
            style={{ gap: `${gapPx}px` }}
          >
            {galleryRows.map((row) => {
              const photosInRow = row.items.filter(
                (it): it is { type: "photo"; id: string; photo: PhotoWithTimestamp } =>
                  it.type === "photo"
              );
              const dateItemsInRow = row.items.filter((it) => it.type === "date");
              const sumAr = photosInRow.reduce(
                (sum, it) => sum + it.photo.width / it.photo.height,
                0
              );

              const dateChipW = isMobile ? 55 : isTablet ? 70 : 85;
              const totalGaps = (row.items.length - 1) * gapPx;
              const availableW = Math.max(
                100,
                (containerWidth || 1000) - totalGaps - dateItemsInRow.length * dateChipW
              );
              const calculatedH = sumAr > 0 ? Math.round(availableW / sumAr) : targetH;
              const rowHeight = Math.min(
                isMobile ? 240 : 360,
                Math.max(isMobile ? 110 : 160, calculatedH)
              );

              return (
                <div
                  key={row.id}
                  className="flex w-full items-stretch"
                  style={{
                    height: `${rowHeight}px`,
                    gap: `${gapPx}px`,
                  }}
                >
                  {row.items.map((item) => {
                    if (item.type === "date") {
                      return (
                        <div
                          key={item.id}
                          className="flex-shrink-0 flex flex-col justify-center bg-transparent select-none px-2 sm:px-3 md:px-4 text-left items-start"
                        >
                          <span className="block font-serif font-bold text-xs sm:text-sm md:text-base text-black tracking-tight leading-none whitespace-nowrap">
                            {item.month}
                          </span>
                          <span className="block font-serif font-bold text-[10px] sm:text-xs text-neutral-400 tracking-tight mt-0.5 sm:mt-1 whitespace-nowrap">
                            {item.year}
                          </span>
                        </div>
                      );
                    }

                    const photo = item.photo;
                    const ar = photo.width / photo.height;
                    return (
                      <a
                        key={photo.id}
                        href={photo.src}
                        data-pswp-width={photo.width}
                        data-pswp-height={photo.height}
                        className="photo-item relative overflow-hidden rounded-[2px] block group cursor-pointer"
                        style={{
                          flex: `${ar} 1 0%`,
                          height: "100%",
                        }}
                        aria-label={photo.alt || photo.caption || "View photo"}
                      >
                        <img
                          src={photo.thumb}
                          alt={photo.alt || photo.caption || "Photograph"}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                      </a>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
