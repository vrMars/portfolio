import React, { createContext, useEffect, useMemo } from 'react';
import { Routes, Route, useParams, Link, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BackgroundManager } from './components/BackgroundManager';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { BlogHome } from './components/BlogHome';
import { BlogPage } from './components/BlogPage';
import { BLOG_POSTS } from './constants';
import { MainLayout } from './components/MainLayout';
import { Blog } from './components/Work';
import { Photography } from './components/Photography';
import { PhotosPage } from './components/PhotosPage';
import { Resume } from './components/Resume';

export const ActiveSectionContext = createContext<(id: string) => void>(() => {});

function App() {
  const location = useLocation();
  const noop = useMemo(() => (() => {}), []);

  // Auto-enable reduced effects for users who prefer reduced motion
  // or when a quick FPS probe suggests a lower refresh budget.
  useEffect(() => {
    const root = document.documentElement;

    // Respect OS preference immediately
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      root.classList.add('reduced-effects');
    }

    // Heuristic FPS probe: sample ~40 frames and estimate average frame time
    let rafId = 0;
    let frames = 0;
    let start = performance.now();
    const sampleFrames = 40;

    const tick = () => {
      frames += 1;
      if (frames >= sampleFrames) {
        const elapsed = performance.now() - start;
        const avgFrame = elapsed / frames; // ms per frame
        // If avg frame > 18ms (~55fps) enable reduced effects
        if (avgFrame > 18) {
          root.classList.add('reduced-effects');
        }
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="bg-transparent">
      <BackgroundManager />
      <ActiveSectionContext.Provider value={noop}>
      <Navbar />
        <main>
          <Routes location={location}>
            <Route path="/" element={<MainLayout />}>
              <Route
                index
                element={
                  <div className="pt-20">
                    <Blog />
                    <Photography />
                    <Resume />
                  </div>
                }
              />
              <Route path="blog" element={<BlogHome posts={BLOG_POSTS} />} />
              <Route path="blog/:slug" element={<BlogPageWrapper />} />
              <Route path="photos" element={<PhotosPage />} />
            </Route>
          </Routes>
        </main>
      </ActiveSectionContext.Provider>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}

const BlogPageWrapper: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!post) {
    return (
      <main className="py-32">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center space-y-6">
          <h1 className="text-4xl font-semibold text-white/90">Post not found</h1>
          <p className="text-slate-200/70">
            The article you were looking for doesn’t exist anymore. Head back to the blog to browse the latest stories.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/blog" className="inline-flex items-center text-sm font-medium text-sky-200 hover:text-white transition-colors">
              ← Back to all posts
            </Link>
            <Link to="/" className="inline-flex items-center text-sm font-medium text-sky-200 hover:text-white transition-colors">
              Return to portfolio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return <BlogPage key={post.slug} post={post} />;
};

export default App;
