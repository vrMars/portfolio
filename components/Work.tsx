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
      title="Writing"
      highlightedWordOverride="Writing"
      bgColor="#EAE8E1"
    >
      {featuredPosts.length > 0 && (
        <div>
          {featuredPosts.map((post, index) => (
            <React.Fragment key={post.slug}>
              <BlogCard post={post} />
              {index < featuredPosts.length - 1 && (
                <hr className="rule-thin my-8" />
              )}
            </React.Fragment>
          ))}
          <div className="mt-10 pt-6 border-t border-warm-gray-light">
            <Link
              to="/blog"
              className="text-sm font-medium text-terracotta hover:text-terracotta-light transition-colors duration-200"
            >
              View all posts &rarr;
            </Link>
          </div>
        </div>
      )}
    </Section>
  );
};
