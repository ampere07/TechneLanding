import React from 'react';
import { Link } from 'react-router-dom';
import { PANEL_IDS } from '../constants';

/** Turns *italic*, **bold** and [links](post:slug) in a line of text into emphasis and links. */
export const Inline: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split(/(\[[^\]]+\]\(post:[a-z0-9-]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/).map((part, i) => {
      const link = /^\[([^\]]+)\]\(post:([a-z0-9-]+)\)$/.exec(part);
      if (link) {
        return (
          <Link key={i} to={`/${PANEL_IDS.BLOG}/${link[2]}`} className="text-accent underline underline-offset-2 decoration-accent/40 hover:decoration-accent transition-colors duration-150">
            <Inline text={link[1]} />
          </Link>
        );
      }
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return <strong key={i} className="font-semibold text-ink">{part.slice(2, -2)}</strong>;
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
      return <React.Fragment key={i}>{part}</React.Fragment>;
    })}
  </>
);
