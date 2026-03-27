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
import { SectionDivider } from './components/SectionDivider';

export const ActiveSectionContext = createContext<(id: string) => void>(() => {});

function App() {
  const location = useLocation();
  const noop = useMemo(() => (() => {}), []);

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
                  <div className="pt-[72px]">
                    <Photography />
                    <SectionDivider topColor="#F4F3EE" bottomColor="#EAE8E1" />
                    <Blog />
                    <SectionDivider topColor="#EAE8E1" bottomColor="#F4F3EE" />
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
      <main className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center space-y-6">
          <h1 className="font-serif text-4xl font-semibold text-black">Post not found</h1>
          <p className="text-neutral-500">
            The article you were looking for doesn't exist anymore.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/blog" className="text-sm font-medium text-terracotta hover:text-terracotta-light transition-colors">
              &larr; Back to all posts
            </Link>
            <Link to="/" className="text-sm font-medium text-terracotta hover:text-terracotta-light transition-colors">
              Return home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return <BlogPage key={post.slug} post={post} />;
};

export default App;
