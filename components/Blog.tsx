import React from 'react';
import { Link } from 'react-router-dom';
import { Section } from './Section';
import { BlogCard } from './BlogCard';
import { BLOG_POSTS } from '../constants';

export const Blog: React.FC = () => {
  const featuredPosts = BLOG_POSTS.slice(0, 3);

  return (
    <Section
      id="blog"
      title="Blog"
      highlightedWordOverride="Blog"
      surfaceClassName="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <span className="text-sm uppercase tracking-[0.3em] text-slate-200/60">Recent writing</span>
        <Link to="/blog" className="glass-button rounded-full px-5 py-2 text-sm font-medium text-white/80 hover:text-white">
          View all posts
        </Link>
      </div>
      <div className="space-y-6">
        {featuredPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </Section>
  );
};
