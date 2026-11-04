import React from 'react';
import { Link } from 'react-router-dom';
import { PANEL_IDS } from '../constants';
import blogInfra from '../assets/insight-infrastructure.webp';
import blogSec from '../assets/insight-security.webp';
import blogNet from '../assets/insight-connectivity.webp';

const posts = [
  {
    id: PANEL_IDS.BLOG_INFRA,
    title: 'Optimizing Core Infrastructure for Scalability',
    excerpt: 'How resilient backbone design, BGP route optimization and capacity planning let ISPs grow their subscriber base without re-architecting the core.',
    date: 'May 10, 2026',
    author: 'Cliff Richard Perez Jr',
    category: 'Infrastructure',
    image: blogInfra,
  },
  {
    id: PANEL_IDS.BLOG_SECURITY,
    title: 'The Future of Network Security in the Philippines',
    excerpt: 'From NTC Protective DNS mandates to BSP compliance, a look at how local operators are hardening their networks against evolving threats.',
    date: 'April 28, 2026',
    author: 'Cliff Richard Perez Jr',
    category: 'Security',
    image: blogSec,
  },
  {
    id: PANEL_IDS.BLOG_NETWORKING,
    title: 'Understanding Next-Gen Global Connectivity',
    excerpt: 'Why carrier-neutral exchange paths and direct CDN peering are reshaping how Philippine networks reach the rest of the world.',
    date: 'April 15, 2026',
    author: 'Cliff Richard Perez Jr',
    category: 'Networking',
    image: blogNet,
  },
];

export const Blog: React.FC = () => (
  <>
    <section className="bg-paper-2 border-b border-rule">
      <div className="wrap py-12 md:py-16">
        <h1 className="heading-1">Blog</h1>
        <p className="lede mt-4">Articles on networking, infrastructure and enterprise IT from the Techne engineering team.</p>
      </div>
    </section>

    <section className="section bg-paper">
      <div className="wrap grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {posts.map((post) => (
          <article key={post.id}>
            <Link to={`/${post.id}`} className="group block">
              <div className="overflow-hidden rounded-[4px] bg-paper-2 aspect-[16/9] border border-rule mb-4">
                <img src={post.image} alt="" loading="lazy" className="w-full h-full object-cover" draggable="false" />
              </div>
              <p className="text-[0.8125rem] text-ink-3 mb-2">
                <span className="font-semibold text-accent">{post.category}</span>
                <span aria-hidden="true"> · </span>
                {post.date}
              </p>
              <h2 className="text-[1.25rem] font-semibold leading-snug text-ink group-hover:text-accent transition-colors duration-150">{post.title}</h2>
              <p className="body-copy mt-2">{post.excerpt}</p>
              <p className="text-[0.875rem] text-ink-2 mt-3">{post.author}</p>
            </Link>
          </article>
        ))}
      </div>
    </section>
  </>
);
