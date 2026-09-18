import React, { useEffect, useRef } from 'react';
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
}) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);
  const isLightboxOpenRef = useRef(false);

  // References for direct GPU transforms with zero React re-render overhead
  const leftImg1Ref = useRef<HTMLImageElement>(null);
  const leftImg2Ref = useRef<HTMLImageElement>(null);
  const leftGapRef = useRef<HTMLDivElement>(null);
  const rightImg1Ref = useRef<HTMLImageElement>(null);
  const rightImg2Ref = useRef<HTMLImageElement>(null);
  const rightGapRef = useRef<HTMLDivElement>(null);
  const containerHeightRef = useRef<number>(350);
  const containerWidthRef = useRef<number>(1000);

  // Measure carousel dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (scrollRef.current) {
        containerHeightRef.current = scrollRef.current.clientHeight || 350;
        containerWidthRef.current = scrollRef.current.clientWidth || 1000;
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

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

  // Auto-scroll loop with pure-math inverted wrap-around, circumference delay & whitespace handling
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let isPaused = false;
    let isResetting = false;
    let animId: number;
    let lastTime = performance.now();
    let scrollPos = el.scrollLeft;
    const speed = 30; // pixels per second

    const pause = () => {
      isPaused = true;
      scrollPos = el.scrollLeft;
    };

    const resume = () => {
      scrollPos = el.scrollLeft;
      lastTime = performance.now();
      isPaused = false;
    };

    const handleScroll = () => {
      if (isPaused) {
        scrollPos = el.scrollLeft;
        updateRollProjections(scrollPos);
      }
    };

    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', resume, { passive: true });
    el.addEventListener('scroll', handleScroll, { passive: true });

    const setImg = (
      img: HTMLImageElement | null,
      p: Photo,
      pw: number,
      offset: number
    ) => {
      if (!img) return;
      const src = p.thumb || p.src;
      if (img.dataset.src !== src) {
        img.src = src;
        img.dataset.src = src;
      }
      img.style.display = 'block';
      img.style.width = `${pw}px`;
      img.style.transformOrigin = '0 0';
      img.style.transform = `translateX(${offset}px) scaleX(-1)`;
    };

    // Pure analytical math accounting for cylinder circumference travel, inverted projection, and dimmed white gaps
    const updateRollProjections = (currentScroll: number) => {
      const h = containerHeightRef.current || 350;
      const w = containerWidthRef.current || 1000;
      const isMob = w < 768;
      const gap = isMob ? 12 : 16;
      const padding = 8;
      const rollW = isMob ? 16 : 20;

      // Arc length around the cylinder before emerging onto front: ~ (PI / 2) * rollW
      const circDelay = Math.PI * 0.5 * rollW;

      // Left roll visible window in strip coordinates
      const leftFront = currentScroll + rollW - circDelay;
      const leftSMin = leftFront - rollW;
      const leftSMax = leftFront;

      // Right roll visible window in strip coordinates
      const rightInner = currentScroll + w - rollW;
      const rightFront = rightInner + circDelay;
      const rightSMin = rightFront;
      const rightSMax = rightFront + rollW;

      let curX = padding;
      let leftPhotoCount = 0;
      let rightPhotoCount = 0;
      let leftGapVisible = false;
      let rightGapVisible = false;

      for (let i = 0; i < photos.length; i++) {
        const p = photos[i];
        const pw = h * (p.width / p.height);
        const photoStart = curX;
        const photoEnd = curX + pw;

        // --- Left cylinder check ---
        if (photoStart < leftSMax && photoEnd > leftSMin) {
          const d = leftFront - photoStart;
          if (leftPhotoCount === 0) {
            setImg(leftImg1Ref.current, p, pw, d);
            leftPhotoCount++;
          } else if (leftPhotoCount === 1) {
            setImg(leftImg2Ref.current, p, pw, d);
            leftPhotoCount++;
          }
        }

        // Gap after this photo
        if (i < photos.length - 1) {
          const gapStart = photoEnd;
          const gapEnd = photoEnd + gap;
          if (gapStart < leftSMax && gapEnd > leftSMin) {
            const xB = leftFront - gapEnd;
            const xA = leftFront - gapStart;
            const visL = Math.max(0, xB);
            const visR = Math.min(rollW, xA);
            const gw = visR - visL;
            if (gw > 0 && leftGapRef.current) {
              leftGapRef.current.style.display = 'block';
              leftGapRef.current.style.left = `${visL}px`;
              leftGapRef.current.style.width = `${gw}px`;
              leftGapVisible = true;
            }
          }
        }

        // --- Right cylinder check ---
        if (photoStart < rightSMax && photoEnd > rightSMin) {
          const offset = rightFront - photoStart + rollW;
          if (rightPhotoCount === 0) {
            setImg(rightImg1Ref.current, p, pw, offset);
            rightPhotoCount++;
          } else if (rightPhotoCount === 1) {
            setImg(rightImg2Ref.current, p, pw, offset);
            rightPhotoCount++;
          }
        }

        // Gap after this photo
        if (i < photos.length - 1) {
          const gapStart = photoEnd;
          const gapEnd = photoEnd + gap;
          if (gapStart < rightSMax && gapEnd > rightSMin) {
            const xB = rightFront + rollW - gapEnd;
            const xA = rightFront + rollW - gapStart;
            const visL = Math.max(0, xB);
            const visR = Math.min(rollW, xA);
            const gw = visR - visL;
            if (gw > 0 && rightGapRef.current) {
              rightGapRef.current.style.display = 'block';
              rightGapRef.current.style.left = `${visL}px`;
              rightGapRef.current.style.width = `${gw}px`;
              rightGapVisible = true;
            }
          }
        }

        curX = photoEnd + gap;
      }

      // Hide unneeded slots
      if (leftPhotoCount === 0 && leftImg1Ref.current) {
        leftImg1Ref.current.style.display = 'none';
      }
      if (leftPhotoCount < 2 && leftImg2Ref.current) {
        leftImg2Ref.current.style.display = 'none';
      }
      if (!leftGapVisible && leftGapRef.current) {
        leftGapRef.current.style.display = 'none';
      }

      if (rightPhotoCount === 0 && rightImg1Ref.current) {
        rightImg1Ref.current.style.display = 'none';
      }
      if (rightPhotoCount < 2 && rightImg2Ref.current) {
        rightImg2Ref.current.style.display = 'none';
      }
      if (!rightGapVisible && rightGapRef.current) {
        rightGapRef.current.style.display = 'none';
      }
    };

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!isPaused && !isResetting && !isLightboxOpenRef.current && el) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll > 1) {
          if (scrollPos >= maxScroll - 1) {
            isResetting = true;
            setTimeout(() => {
              el.scrollTo({ left: 0, behavior: 'smooth' });
              setTimeout(() => {
                scrollPos = 0;
                lastTime = performance.now();
                isResetting = false;
              }, 1200);
            }, 2000);
          } else {
            scrollPos += speed * dt;
            el.scrollLeft = scrollPos;
          }
        }
      }

      updateRollProjections(isResetting ? el.scrollLeft : scrollPos);
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', resume);
      el.removeEventListener('scroll', handleScroll);
    };
  }, [photos]);

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

    lightbox.on('beforeOpen', () => {
      isLightboxOpenRef.current = true;
    });

    lightbox.on('close', () => {
      isLightboxOpenRef.current = false;
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
        {/* Left Roll: Ingesting photos right-to-left, wrapping around circumference, emerging out & over inverted */}
        <div
          className="absolute left-0 top-0 bottom-0 w-4 md:w-5 pointer-events-none z-10 select-none overflow-hidden rounded-l-sm"
          style={{
            backgroundColor: '#0e0d0c',
            boxShadow: '2px 0 8px -1px rgba(0,0,0,0.35), 1px 0 3px rgba(0,0,0,0.25)',
            borderRight: '1px solid rgba(255,255,255,0.08)',
          }}
          aria-hidden="true"
        >
          {/* Dimmed wrap-around inverted photo slices (supports dual slice during gap transition) */}
          <img
            ref={leftImg1Ref}
            alt=""
            className="absolute top-0 bottom-0 h-full object-cover max-w-none pointer-events-none"
            style={{
              display: 'none',
              opacity: 0.38,
              filter: 'contrast(1.1) brightness(0.85)',
            }}
          />
          <img
            ref={leftImg2Ref}
            alt=""
            className="absolute top-0 bottom-0 h-full object-cover max-w-none pointer-events-none"
            style={{
              display: 'none',
              opacity: 0.38,
              filter: 'contrast(1.1) brightness(0.85)',
            }}
          />

          {/* Dimmed white gap between photos */}
          <div
            ref={leftGapRef}
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{
              display: 'none',
              backgroundColor: '#FAF8F5',
              opacity: 0.38,
              filter: 'contrast(1.1) brightness(0.85)',
            }}
          />

          {/* Opaque 3D cylindrical lighting overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, rgba(12,11,10,0.85) 0%, rgba(20,18,16,0.3) 30%, rgba(255,255,255,0.18) 55%, rgba(18,16,14,0.45) 80%, rgba(12,11,10,0.9) 100%)',
            }}
          />

          {/* Specular gloss highlight reflection */}
          <div
            className="absolute left-1 top-0 bottom-0 w-0.5 opacity-30 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, transparent, rgba(255,255,255,0.45) 20%, rgba(255,255,255,0.45) 80%, transparent)',
            }}
          />
        </div>

        {/* Right Roll: Photo coming over inverted, wrapping around circumference, unrolling normal underneath */}
        <div
          className="absolute right-0 top-0 bottom-0 w-4 md:w-5 pointer-events-none z-10 select-none overflow-hidden rounded-r-sm"
          style={{
            backgroundColor: '#0e0d0c',
            boxShadow: '-2px 0 8px -1px rgba(0,0,0,0.35), -1px 0 3px rgba(0,0,0,0.25)',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
          }}
          aria-hidden="true"
        >
          {/* Dimmed wrap-around inverted photo slices (supports dual slice during gap transition) */}
          <img
            ref={rightImg1Ref}
            alt=""
            className="absolute top-0 bottom-0 h-full object-cover max-w-none pointer-events-none"
            style={{
              display: 'none',
              opacity: 0.38,
              filter: 'contrast(1.1) brightness(0.85)',
            }}
          />
          <img
            ref={rightImg2Ref}
            alt=""
            className="absolute top-0 bottom-0 h-full object-cover max-w-none pointer-events-none"
            style={{
              display: 'none',
              opacity: 0.38,
              filter: 'contrast(1.1) brightness(0.85)',
            }}
          />

          {/* Dimmed white gap between photos */}
          <div
            ref={rightGapRef}
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{
              display: 'none',
              backgroundColor: '#FAF8F5',
              opacity: 0.38,
              filter: 'contrast(1.1) brightness(0.85)',
            }}
          />

          {/* Opaque 3D cylindrical lighting overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, rgba(12,11,10,0.9) 0%, rgba(18,16,14,0.45) 20%, rgba(255,255,255,0.18) 45%, rgba(20,18,16,0.3) 70%, rgba(12,11,10,0.85) 100%)',
            }}
          />

          {/* Specular gloss highlight reflection */}
          <div
            className="absolute right-1 top-0 bottom-0 w-0.5 opacity-30 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, transparent, rgba(255,255,255,0.45) 20%, rgba(255,255,255,0.45) 80%, transparent)',
            }}
          />
        </div>

        <div
          ref={scrollRef}
          id={galleryId}
          className="carousel-scroll flex gap-3 md:gap-4 overflow-x-auto overflow-y-hidden px-2"
          style={{
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
