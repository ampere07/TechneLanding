import React from 'react';
import { motion } from 'framer-motion';
import { User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PANEL_IDS } from '../constants';
import blogInfra from '../assets/blog_infra.png';
import blogSec from '../assets/blog_sec.png';
import blogNet from '../assets/blog_net.png';

export const Blog: React.FC = () => {
  const posts = [
    {
      id: PANEL_IDS.BLOG_INFRA,
      title: "Lorem Ipsum",
      excerpt: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      date: "May 10, 2026",
      author: "Cliff Richard Perez Jr",
      category: "Infrastructure",
      image: blogInfra
    },
    {
      id: PANEL_IDS.BLOG_SECURITY,
      title: "Lorem Ipsum",
      excerpt: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      date: "April 28, 2026",
      author: "Cliff Richard Perez Jr",
      category: "Security",
      image: blogSec
    },
    {
      id: PANEL_IDS.BLOG_NETWORKING,
      title: "Lorem Ipsum",
      excerpt: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      date: "April 15, 2026",
      author: "Cliff Richard Perez Jr",
      category: "Networking",
      image: blogNet
    }
  ];

  return (
    <section className="py-24 bg-white min-h-[80vh]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Our <span className="text-brand-blue">Insights</span></h2>
            <p className="text-slate-500 text-lg">
              Stay updated with the latest trends in networking technology, internet services, and enterprise IT solutions.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <Link to={`/${post.id}`}>
                <div className="mb-6 overflow-hidden rounded-3xl bg-slate-50 aspect-[16/9] flex items-center justify-center border border-slate-100 relative shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    draggable="false"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-brand-blue rounded-full uppercase tracking-wider shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-brand-blue transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="pt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-slate-400">
                      <User size={14} />
                      <span className="text-xs font-medium">{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-brand-blue font-bold text-sm group-hover:translate-x-1 transition-transform">
                      <span>Read More</span>
                      <ArrowRight size={16} />
                    </div>
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
