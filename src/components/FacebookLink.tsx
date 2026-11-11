import React from 'react';
import { CONTACT } from '../content/site';

/**
 * A round Facebook button in Facebook's own blue, so it is easy to spot. It opens Techne's Facebook page in a new
 * tab. It is an ordinary web address, so on a phone with the Facebook app installed the phone offers the app, and
 * otherwise the page opens in the browser.
 */
export const FacebookLink: React.FC<{ className?: string }> = ({ className = '' }) => (
  <a
    href={CONTACT.facebook}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Techne on Facebook (opens in a new tab)"
    title="Follow Techne on Facebook"
    className={`inline-flex items-center justify-center w-[42px] h-[42px] shrink-0 rounded-full bg-[#1877f2] text-white shadow-[0_2px_8px_-2px_rgb(24_119_242_/_0.6)] hover:bg-[#0f63d4] hover:-translate-y-0.5 hover:shadow-[0_6px_14px_-4px_rgb(24_119_242_/_0.7)] cursor-pointer transition-[background-color,transform,box-shadow] duration-150 ${className}`}
  >
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.6V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.4H7.6V13h2.7v8h3.2z" />
    </svg>
  </a>
);
