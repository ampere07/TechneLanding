import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PANEL_IDS } from '../constants';
import blogInfra from '../assets/blog_infra.png';
import blogSec from '../assets/blog_sec.png';
import blogNet from '../assets/blog_net.png';

export const Blog: React.FC = () => {
  const posts = [
    {
      id: PANEL_IDS.BLOG_INFRA,
      title: "Optimizing Core Infrastructure for Scalability",
      excerpt: "How resilient backbone design, BGP route optimization, and capacity planning let ISPs grow their subscriber base without re-architecting the core.",
      date: "May 10, 2026",
      author: "Cliff Richard Perez Jr",
      category: "Infrastructure",
      image: blogInfra
    },
    {
      id: PANEL_IDS.BLOG_SECURITY,
      title: "The Future of Network Security in the Philippines",
      excerpt: "From NTC Protective DNS mandates to BSP compliance, a look at how local operators are hardening their networks against evolving threats.",
      date: "April 28, 2026",
      author: "Cliff Richard Perez Jr",
      category: "Security",
      image: blogSec
    },
    {
      id: PANEL_IDS.BLOG_NETWORKING,
      title: "Understanding Next-Gen Global Connectivity",
      excerpt: "Why carrier-neutral exchange paths and direct CDN peering are reshaping how Philippine networks reach the rest of the world.",
      date: "April 15, 2026",
      author: "Cliff Richard Perez Jr",
      category: "Networking",
      image: blogNet
    }
  ];

  return (
    <section className="py-24 bg-paper min-h-[80vh]">
      <div className="container mx-auto px-6 max-w-7xl">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 border-b border-rule pb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-ink tracking-tight leading-tight">
              Insights
            </h1>
            <p className="font-body text-[1.125rem] text-ink-2 mt-3 max-w-xl leading-relaxed">
              Latest perspectives on networking, infrastructure, and enterprise IT.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.28, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col"
            >
              <Link to={`/${post.id}`} className="flex flex-col h-full">
                <div className="mb-5 overflow-hidden rounded-[4px] bg-paper-2 aspect-[16/9] border border-rule relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    draggable="false"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest bg-paper/90 text-ink-2 px-2 py-1 rounded-[2px] border border-rule/50">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col flex-1 pt-1">
                  <p className="font-mono text-[10px] text-ink-2 uppercase tracking-widest mb-3">{post.date}</p>
                  <h2 className="font-display text-xl font-bold text-ink leading-tight mb-3 group-hover:text-accent transition-colors duration-[180ms]">
                    {post.title}
                  </h2>
                  <p className="font-body text-sm text-ink-2 leading-relaxed line-clamp-3 flex-1 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between border-t border-rule pt-4 mt-auto">
                    <span className="font-body text-xs text-ink-2">{post.author}</span>
                    <span className="font-display text-xs font-semibold text-accent flex items-center gap-1 group-hover:gap-1.5 transition-all duration-[180ms]">
                      Read More
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
};
