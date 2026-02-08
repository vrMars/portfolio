import React from 'react';
import { Link } from 'react-router-dom';
import { Section } from './Section';
import { ProjectCard } from './ProjectCard';
import { BlogCard } from './BlogCard';
import { PROJECTS, BLOG_POSTS } from '../constants';

export const Blog: React.FC = () => {
  const featuredPosts = BLOG_POSTS.slice(0, 3);

  return (
    <Section
      id="blog"
      title="Blog"
      highlightedWordOverride="Blog"
      withSurface={false}
      surfaceClassName="space-y-8"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>

      {featuredPosts.length > 0 && (
        <div className="space-y-6 mt-8">
          {featuredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
          <div className="flex justify-center pt-2">
            <Link
              to="/blog"
              className="glass-button rounded-full px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-indigo-500 transition-colors"
            >
              View all posts
            </Link>
          </div>
        </div>
      )}
    </Section>
  );
};
