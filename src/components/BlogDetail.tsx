import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Tag, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PANEL_IDS } from '../constants';

interface BlogDetailProps {
  title: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image: string;
}

export const BlogDetail: React.FC<BlogDetailProps> = ({
  title, content, date, author, category, image
}) => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.28 }}
      className="bg-paper min-h-screen"
    >
      <div className="container mx-auto px-6 py-20 max-w-4xl">

        {/* Back link */}
        <button
          onClick={() => navigate(`/${PANEL_IDS.BLOG}`)}
          className="flex items-center gap-1.5 font-body text-sm text-ink-2 hover:text-accent transition-colors duration-[180ms] mb-12"
        >
          <ChevronLeft size={16} />
          <span>Back to Insights</span>
        </button>

        {/* Metadata strip */}
        <div className="flex items-center gap-4 mb-6 border-b border-rule pb-6">
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent bg-accent/8 px-2.5 py-1 rounded-[2px] border border-accent/20">
            {category}
          </span>
          <span className="w-1 h-1 rounded-full bg-rule" />
          <span className="font-mono text-xs text-ink-2 flex items-center gap-1.5">
            <Calendar size={11} />
            {date}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink leading-tight tracking-tight mb-8">
          {title}
        </h1>

        {/* Author */}
        <div className="flex items-center gap-3 mb-12 pb-8 border-b border-rule">
          <div className="w-9 h-9 rounded-[4px] bg-accent/10 flex items-center justify-center text-accent font-display font-bold text-sm">
            {author.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <p className="font-display font-semibold text-sm text-ink">{author}</p>
            <p className="font-mono text-[10px] text-ink-2 uppercase tracking-widest mt-0.5">Senior Network Engineer</p>
          </div>
        </div>

        {/* Hero image */}
        <div className="rounded-[4px] overflow-hidden mb-12 border border-rule">
          <img
            src={image}
            alt={title}
            className="w-full h-auto object-cover max-h-[500px]"
            draggable="false"
          />
        </div>

        {/* Body */}
        <div className="font-body text-[1.0625rem] text-ink-2 leading-[1.8] space-y-6 whitespace-pre-line mb-16">
          {content}
        </div>

        {/* Footer bar */}
        <div className="border-t border-rule pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 font-body text-sm text-accent hover:text-accent-hover transition-colors duration-[180ms]"
          >
            <Tag size={14} />
            <span>Share this Insight</span>
          </button>
          <button
            onClick={() => navigate(`/${PANEL_IDS.BLOG}`)}
            className="btn-secondary text-sm py-2.5 px-6"
          >
            Return to Blog Index
          </button>
        </div>

      </div>

      {/* Copy toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200]"
          >
            <div className="bg-paper border border-rule rounded-[4px] px-5 py-3 flex items-center gap-2.5 shadow-sm">
              <CheckCircle2 size={16} className="text-accent" />
              <span className="font-display font-semibold text-sm text-ink">Link copied to clipboard</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};
