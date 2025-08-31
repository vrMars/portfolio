import React from 'react';
import { Section } from './Section';
import { BlogCard } from './BlogCard';
import { BLOG_POSTS } from '../constants';

export const Blog: React.FC = () => {
  return (
    <Section id="blog" title="From My Blog" className="bg-black/70 backdrop-blur-lg">
      <div className="max-w-3xl mx-auto space-y-6">
        {BLOG_POSTS.map((post, index) => (
          <BlogCard key={index} post={post} />
        ))}
      </div>
    </Section>
  );
};