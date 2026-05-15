import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Calendar, Tag, ChevronLeft, CheckCircle2 } from 'lucide-react';
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
      className="bg-white min-h-screen relative"
    >
      <div className="container mx-auto px-6 py-12">
        {/* Back Button */}
        <button 
          onClick={() => navigate(`/${PANEL_IDS.BLOG}`)}
          className="flex items-center space-x-2 text-slate-500 hover:text-brand-blue font-bold text-sm transition-colors mb-12"
        >
          <ChevronLeft size={20} />
          <span>Back to Insights</span>
        </button>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest px-3 py-1 bg-brand-blue/10 rounded-full">
                {category}
              </span>
              <span className="w-1 h-1 bg-slate-200 rounded-full" />
              <div className="flex items-center space-x-2 text-slate-400 text-xs">
                <Calendar size={12} />
                <span>{date}</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-8">
              {title}
            </h1>
            
            <div className="flex items-center space-x-4 text-slate-400 pb-8 border-b border-slate-50">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                <User size={24} className="text-brand-blue" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 leading-none mb-1">{author}</p>
                <p className="text-[10px] uppercase font-bold tracking-wider">Senior Network Engineer</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl shadow-slate-200/50">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-auto object-cover max-h-[500px]" 
              draggable="false"
            />
          </div>

          {/* Content */}
          <div className="prose prose-slate max-w-none">
            <div className="text-slate-600 leading-relaxed space-y-6 text-lg whitespace-pre-line">
              {content}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <button 
              onClick={handleShare}
              className="flex items-center space-x-2 text-brand-blue hover:text-brand-blue/80 font-bold text-sm transition-colors"
            >
              <Tag size={16} />
              <span>Share this Insight</span>
            </button>
            
            <button 
              onClick={() => navigate(`/${PANEL_IDS.BLOG}`)}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all hover:shadow-lg active:scale-95"
            >
              Return to Blog Index
            </button>
          </div>
        </div>
      </div>

      {/* Copy Link Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200]"
          >
            <div className="bg-white text-slate-900 px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 border border-slate-100 ring-1 ring-slate-900/5">
              <CheckCircle2 size={20} className="text-emerald-500" />
              <span className="font-bold text-sm tracking-tight">Link Copied to Clipboard</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};
