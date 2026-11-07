import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { PANEL_IDS } from '../constants';
import { postBySlug, type BlogBlock } from '../content/blog';
import { Inline } from './RichText';
import { Reveal } from './Reveal';

const Block: React.FC<{ block: BlogBlock }> = ({ block }) => {
  switch (block.type) {
    case 'p':
      return <p className="body-copy text-[1.0625rem] leading-relaxed"><Inline text={block.text} /></p>;
    case 'list':
      return (
        <ol className="list-decimal pl-6 space-y-2 body-copy text-[1.0625rem] marker:text-ink-3 marker:font-semibold">
          {block.items.map((item) => (
            <li key={item} className="pl-1">{item}</li>
          ))}
        </ol>
      );
    case 'figure':
      return (
        <figure className="my-4">
          <img src={block.src} alt={block.alt} className="w-full rounded-[4px] border border-rule" loading="lazy" />
          <figcaption className="text-[0.8125rem] text-ink-3 mt-2">{block.caption}</figcaption>
        </figure>
      );
    case 'callout':
      return (
        <p className="bg-paper-2 border border-rule rounded-[4px] px-6 py-5 text-[1.1875rem] leading-snug text-ink">
          <Inline text={block.text} />
        </p>
      );
    case 'quote':
      return (
        <blockquote className="my-2 py-5 border-y border-rule text-[1.25rem] leading-snug text-ink font-display">
          <Inline text={block.text} />
        </blockquote>
      );
  }
};

/** One article. An address that matches no article goes back to the list. */
export const BlogPost: React.FC = () => {
  const { slug } = useParams();
  const post = postBySlug(slug);
  if (!post) return <Navigate to={`/${PANEL_IDS.BLOG}`} replace />;

  return (
    <>
      <section className="bg-paper-2 border-b border-rule">
        <div className="wrap py-10 md:py-14">
          <nav aria-label="Breadcrumb" className="text-[0.8125rem] text-ink-3 mb-5">
            <Link to={`/${PANEL_IDS.BLOG}`} className="hover:text-accent transition-colors duration-150">Blog</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-ink-2">{post.title}</span>
          </nav>
          <Reveal distance={12}>
            <h1 className="heading-1 max-w-4xl">{post.title}</h1>
            <p className="text-[0.9375rem] text-ink-2 mt-4">
              <span className="font-semibold text-ink">{post.event}</span>
              <span className="mx-2 text-ink-3" aria-hidden="true">·</span>
              <span>{post.date}</span>
            </p>
          </Reveal>
        </div>
      </section>

      <article className="section bg-paper">
        <div className="wrap">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {post.blocks.map((block, i) => (
                <Reveal key={i} distance={block.type === 'figure' ? 28 : 16}>
                  <Block block={block} />
                </Reveal>
              ))}
            </div>

            {post.events && post.events.length > 0 && (
              <div className="mt-10 pt-6 border-t border-rule">
                <h2 className="text-[0.9375rem] font-semibold text-ink">{post.eventsHeading}</h2>
                <ul className="mt-3 space-y-2">
                  {post.events.map((event) => (
                    <li key={event.href}>
                      <a href={event.href} target="_blank" rel="noopener noreferrer" className="text-link">
                        {event.label}
                        <ExternalLink size={14} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-3">
              <Link to={`/${PANEL_IDS.BLOG}`} className="btn-secondary">All articles</Link>
              <Link to={`/${PANEL_IDS.CONTACT}`} className="btn-primary">Talk to our team</Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};
