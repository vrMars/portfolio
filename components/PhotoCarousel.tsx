import React, { useEffect, useRef, useCallback } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import PhotoSwipe from 'photoswipe';
import 'photoswipe/style.css';
import type { Photo } from './PhotoGallery';

interface PhotoCarouselProps {
  photos: Photo[];
  galleryId?: string;
  fadeBgColor?: string;
}

export const PhotoCarousel: React.FC<PhotoCarouselProps> = ({
  photos,
  galleryId = 'photo-carousel',
  fadeBgColor = '#F4F3EE',
}) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);

  // Horizontal scroll with mouse wheel
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  // PhotoSwipe lightbox
  useEffect(() => {
    if (!galleryRef.current) return;

    const lightbox = new PhotoSwipeLightbox({
      gallery: `#${galleryId}`,
      children: 'a.gallery-item',
      pswpModule: PhotoSwipe,
      bgOpacity: 0.95,
      showHideAnimationType: 'fade',
      padding: { top: 40, bottom: 80, left: 40, right: 40 },
      initialZoomLevel: 'fit',
      secondaryZoomLevel: 1.5,
      maxZoomLevel: 2,
    });

    lightbox.on('uiRegister', function () {
      lightbox.pswp?.ui?.registerElement({
        name: 'exif-hud',
        order: 9,
        isButton: false,
        appendTo: 'wrapper',
        onInit: (el) => {
          el.className = 'pswp__exif-container';
        },
      });
    });

    const updateExif = () => {
      const pswp = lightbox.pswp;
      if (!pswp) return;

      const currentSlide = pswp.currSlide;
      const currentSrc = currentSlide?.data?.src;
      const photo = photos.find((p) => p.src === currentSrc);
      const exifContainer = pswp.element?.querySelector('.pswp__exif-container');

      if (exifContainer && photo?.exif) {
        const exif = photo.exif;
        const hasExif = Object.values(exif).some(Boolean);

        if (hasExif) {
          exifContainer.innerHTML = `
            <div class="pswp__exif-hud">
              ${exif.camera ? `<div class="exif-row"><span class="exif-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" /><path fill-rule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3H4.5a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM12 17.25a5.25 5.25 0 100-10.5 5.25 5.25 0 000 10.5z" clip-rule="evenodd" /></svg></span><span>${exif.camera}</span></div>` : ''}
              ${exif.lens ? `<div class="exif-row"><span class="exif-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg></span><span>${exif.lens}</span></div>` : ''}
              <div class="exif-settings">
                ${exif.focalLength ? `<span>${exif.focalLength}</span>` : ''}
                ${exif.aperture ? `<span>${exif.aperture}</span>` : ''}
                ${exif.shutterSpeed ? `<span>${exif.shutterSpeed}</span>` : ''}
                ${exif.iso ? `<span>ISO ${exif.iso}</span>` : ''}
              </div>
              ${exif.date ? `<div class="exif-row exif-date"><span class="exif-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clip-rule="evenodd" /></svg></span><span>${exif.date}</span></div>` : ''}
              ${exif.location ? `<div class="exif-row"><span class="exif-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" /></svg></span><span>${exif.location}</span></div>` : ''}
            </div>
          `;
        } else {
          exifContainer.innerHTML = '';
        }
      } else if (exifContainer) {
        exifContainer.innerHTML = '';
      }
    };

    lightbox.on('change', updateExif);
    lightbox.on('openingAnimationEnd', updateExif);
    lightbox.init();
    lightboxRef.current = lightbox;

    return () => {
      lightbox.destroy();
      lightboxRef.current = null;
    };
  }, [photos, galleryId]);

  return (
    <>
      <style>{`
        .carousel-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .carousel-scroll::-webkit-scrollbar {
          display: none;
        }
        .pswp__exif-container {
          position: absolute;
          bottom: 16px;
          left: 16px;
          z-index: 10;
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

      <div ref={galleryRef} className="relative">
        {/* Right edge fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to left, ${fadeBgColor}, transparent)`,
          }}
        />
        {/* Left edge fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to right, ${fadeBgColor}, transparent)`,
          }}
        />

        <div
          ref={scrollRef}
          id={galleryId}
          className="carousel-scroll flex gap-3 md:gap-4 overflow-x-auto overflow-y-hidden pl-2 pr-16"
          style={{
            scrollSnapType: 'x mandatory',
            height: 'clamp(280px, 35vw, 400px)',
          }}
        >
          {photos.map((photo, index) => (
            <a
              key={photo.id}
              href={photo.src}
              data-pswp-width={photo.width}
              data-pswp-height={photo.height}
              data-index={index}
              className="gallery-item gallery-image flex-shrink-0 rounded-sm overflow-hidden group cursor-pointer"
              style={{
                scrollSnapAlign: 'start',
                height: '100%',
                aspectRatio: `${photo.width} / ${photo.height}`,
              }}
              aria-label={photo.alt || `View photo ${index + 1}`}
            >
              <img
                src={photo.thumb}
                alt={photo.alt || `Photo ${index + 1}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </a>
          ))}
        </div>
      </div>
    </>
  );
};
