import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PANEL_IDS } from '../constants';

interface BlogDetailProps {
  title: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image: string;
}

export const BlogDetail: React.FC<BlogDetailProps> = ({ title, content, date, author, category, image }) => {
  const [copied, setCopied] = useState(false);
  const readTime = Math.max(1, Math.round(content.trim().split(/\s+/).length / 200));

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="bg-paper">
      <div className="wrap max-w-[820px] py-10 md:py-14">
        <Link to={`/${PANEL_IDS.BLOG}`} className="text-link mb-8">
          <ChevronLeft size={16} aria-hidden="true" />
          Back to Blog
        </Link>

        <p className="text-[0.875rem] text-ink-3 mt-8 mb-3">
          <span className="font-semibold text-accent">{category}</span>
          <span aria-hidden="true"> · </span>
          {date}
          <span aria-hidden="true"> · </span>
          {readTime} min read
        </p>

        <h1 className="heading-1">{title}</h1>
        <p className="text-[0.9375rem] text-ink-2 mt-5 pb-8 border-b border-rule">By {author}</p>

        <div className="rounded-[4px] overflow-hidden border border-rule my-8">
          <img src={image} alt="" className="w-full h-auto object-cover max-h-[440px]" draggable="false" />
        </div>

        <div className="text-[1.0625rem] text-ink-2 leading-[1.75] whitespace-pre-line">{content}</div>

        <div className="border-t border-rule mt-12 pt-6 flex flex-wrap items-center justify-between gap-4">
          <button type="button" onClick={handleShare} className="text-link cursor-pointer" aria-live="polite">
            {copied ? 'Link copied' : 'Copy link to this article'}
          </button>
          <Link to={`/${PANEL_IDS.BLOG}`} className="btn-secondary">All articles</Link>
        </div>
      </div>
    </article>
  );
};
