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
          <nav className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.25em] text-slate-200/60">
            <Link to="/" className="font-medium text-sky-200 hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-slate-500">/</span>
          <Link to="/blog" className="font-medium text-sky-200 hover:text-white transition-colors">
            Blog
          </Link>
          <span className="text-slate-500">/</span>
          <span className="text-slate-100/80">{post.title}</span>
        </nav>
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200/60">
            <span>{post.publishDate}</span>
            {post.readTime && <span>• {post.readTime}</span>}
            <span>• {post.source}</span>
          </div>
          <h1 className="text-4xl font-semibold text-white/90 tracking-tight md:text-5xl">{post.title}</h1>
          {post.tags && (
            <ul className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tag} className="glass-button text-xs uppercase tracking-wide text-slate-100/80 px-3 py-1 rounded-full">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </header>

        {post.heroImage && (
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(12,16,28,0.7)] backdrop-blur-lg">
            <img src={post.heroImage} alt={post.title} className="w-full h-80 object-cover" loading="lazy" />
            <div className="h-1 w-full bg-gradient-to-r from-sky-200/50 via-rose-200/50 to-amber-200/50" />
          </div>
        )}

        {post.content.some((c) => /<[^>]+>/.test(c)) ? (
          <div
            className="prose prose-invert max-w-none text-slate-200/85 leading-relaxed [&_img]:rounded-2xl [&_img]:border [&_img]:border-white/10 [&_figure]:my-8 [&_figcaption]:mt-2 [&_figcaption]:text-sm [&_figcaption]:text-slate-300/70 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-1"
            dangerouslySetInnerHTML={{ __html: post.content.join('\n') }}
          />
        ) : (
          <div className="space-y-6 text-lg leading-relaxed text-slate-200/85">
            {post.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}

        <footer className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <Link to="/blog" className="inline-flex items-center text-sm font-medium text-sky-200 hover:text-white transition-colors">
            ← Back to all posts
          </Link>
          <Link to="/" className="inline-flex items-center text-sm font-medium text-sky-200 hover:text-white transition-colors">
            Return to portfolio
          </Link>
        </footer>
      </article>
      </Section>
  );
};
