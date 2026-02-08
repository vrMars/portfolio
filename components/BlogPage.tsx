import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { Section } from './Section';

interface BlogPageProps {
  post: BlogPost;
}

export const BlogPage: React.FC<BlogPageProps> = ({ post }) => {
  return (
    <Section
      id={`blog-${post.slug}`}
      title={`Blog — ${post.title}`}
      highlightedWordOverride="Blog"
      initiallyVisible
      activeSectionOverride="blog"
      surfaceClassName="space-y-10"
    >
      <article className="max-w-3xl mx-auto space-y-10">
        <nav className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.25em] text-gray-400">
          <Link to="/" className="font-medium text-indigo-500 hover:text-purple-500 transition-colors">
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <Link to="/blog" className="font-medium text-indigo-500 hover:text-purple-500 transition-colors">
            Blog
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-600">{post.title}</span>
        </nav>
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
            <span>{post.publishDate}</span>
            {post.readTime && <span>• {post.readTime}</span>}
            <span>• {post.source}</span>
          </div>
          <h1 className="text-4xl font-semibold text-gray-800 tracking-tight md:text-5xl">{post.title}</h1>
          {post.tags && (
            <ul className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tag} className="glass-button text-xs uppercase tracking-wide text-gray-500 px-3 py-1 rounded-full">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </header>

        {post.heroImage && (
          <div className="overflow-hidden rounded-[2rem] glass-panel" style={{ padding: 0 }}>
            <img src={post.heroImage} alt={post.title} className="w-full h-80 object-cover" loading="lazy" />
            <div className="h-1 w-full bg-gradient-to-r from-indigo-400/60 via-purple-400/60 to-pink-400/60" />
          </div>
        )}

        {post.content.some((c) => /<[^>]+>/.test(c)) ? (
          <div
            className="prose max-w-none text-gray-700 leading-relaxed [&_img]:rounded-2xl [&_img]:shadow-[8px_8px_16px_#c8ccd4,-8px_-8px_16px_#ffffff] [&_figure]:my-8 [&_figcaption]:mt-2 [&_figcaption]:text-sm [&_figcaption]:text-gray-500 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-1 [&_a]:text-indigo-500 [&_a:hover]:text-purple-500 [&_h2]:text-gray-800 [&_h3]:text-gray-800"
            dangerouslySetInnerHTML={{ __html: post.content.join('\n') }}
          />
        ) : (
          <div className="space-y-6 text-lg leading-relaxed text-gray-700">
            {post.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}

        <footer className="pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <Link to="/blog" className="inline-flex items-center text-sm font-medium text-indigo-500 hover:text-purple-500 transition-colors">
            ← Back to all posts
          </Link>
          <Link to="/" className="inline-flex items-center text-sm font-medium text-indigo-500 hover:text-purple-500 transition-colors">
            Return to portfolio
          </Link>
        </footer>
      </article>
    </Section>
  );
};
