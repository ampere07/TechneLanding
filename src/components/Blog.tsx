import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PANEL_IDS } from '../constants';
import { BLOG_POSTS } from '../content/blog';
import { Reveal } from './Reveal';

/** The list of articles. */
export const Blog: React.FC = () => (
  <>
    <section className="bg-paper-2 border-b border-rule">
      <div className="wrap py-12 md:py-16">
        <Reveal distance={12}>
          <h1 className="heading-1">Engagement</h1>
          <p className="lede mt-4">News and notes from the Techne team on networks, peering and infrastructure in the Philippines.</p>
        </Reveal>
      </div>
    </section>

    <section className="section bg-paper">
      <div className="wrap">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post, index) => (
            <Reveal key={post.slug} delay={Math.min(index, 5) * 0.08} className="flex">
              <article className="bg-paper border border-rule rounded-[4px] overflow-hidden flex flex-col w-full group">
                <Link to={`/${PANEL_IDS.BLOG}/${post.slug}`} className="block" aria-label={post.title}>
                  <span className="block overflow-hidden">
                    <img src={post.image} alt="" className="w-full aspect-[16/9] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" loading="lazy" draggable="false" />
                  </span>
                </Link>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-[0.8125rem] leading-snug text-ink-3 mb-3">
                    <span className="block font-semibold text-ink-2">{post.event}</span>
                    <span className="block mt-0.5">{post.date}</span>
                  </p>
                  <h2 className="heading-3">
                    <Link to={`/${PANEL_IDS.BLOG}/${post.slug}`} className="hover:text-accent transition-colors duration-150">{post.title}</Link>
                  </h2>
                  <p className="body-copy mt-3 flex-1">{post.summary}</p>
                  <Link to={`/${PANEL_IDS.BLOG}/${post.slug}`} className="text-link mt-5">
                    Read the article
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  </>
);
