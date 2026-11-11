import React from 'react';
import { CONTACT } from '../content/site';

/**
 * A round Facebook button. At rest it is only an outline in Techne's teal. Pointing at it fills the circle with
 * Facebook's own blue and the "f" turns white. It opens Techne's Facebook page in a new tab. It is an ordinary web
 * address, so on a phone with the Facebook app installed the phone offers the app, and otherwise the page opens in
 * the browser.
 */
export const FacebookLink: React.FC<{ className?: string }> = ({ className = '' }) => (
  <a
    href={CONTACT.facebook}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Techne on Facebook (opens in a new tab)"
    title="Follow Techne on Facebook"
    className={`group inline-flex items-center justify-center w-[42px] h-[42px] shrink-0 rounded-full border-2 border-accent text-accent bg-transparent hover:bg-[#1877f2] hover:border-[#1877f2] hover:text-white focus-visible:bg-[#1877f2] focus-visible:border-[#1877f2] focus-visible:text-white hover:-translate-y-0.5 hover:shadow-[0_6px_14px_-4px_rgb(24_119_242_/_0.7)] cursor-pointer transition-[background-color,border-color,color,transform,box-shadow] duration-200 ${className}`}
  >
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="fill-transparent group-hover:fill-current group-focus-visible:fill-current transition-[fill] duration-200"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  </a>
);
