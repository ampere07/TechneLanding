import React, { useEffect, useRef } from 'react';

/** True once the loading screen has gone, or has started to fade away. Until then the page is hidden behind it. */
const pageIsShowing = () => {
  const splash = document.getElementById('splash');
  return !splash || splash.classList.contains('splash--out');
};

/** One digit: a strip of the digits 0 to 9, twice over, that rolls up until the right digit is showing. */
const Digit: React.FC<{ digit: number; place: number }> = ({ digit, place }) => {
  const strip = useRef<HTMLSpanElement>(null);
  const box = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = strip.current;
    const host = box.current;
    if (!el || !host) return;
    const end = -((10 + digit) / 20) * 100;
    let animation: Animation | undefined;
    let wait = 0;
    // The roll starts when the number scrolls into view, one time.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        animation = el.animate([{ transform: 'translateY(0%)' }, { transform: `translateY(${end}%)` }], {
          duration: 1500 + place * 220,
          delay: 150,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          fill: 'backwards',
        });
      },
      { threshold: 0.4 },
    );
    // Do not start while the loading screen covers the page, or the roll would be over before anyone saw it.
    const begin = () => {
      if (pageIsShowing()) observer.observe(host);
      else wait = window.setTimeout(begin, 80);
    };
    begin();
    // Until the roll runs, and after it, the strip rests on the right digit.
    el.style.transform = `translateY(${end}%)`;
    return () => {
      window.clearTimeout(wait);
      observer.disconnect();
      animation?.cancel();
    };
  }, [digit, place]);

  return (
    <span ref={box} aria-hidden="true" className="inline-block overflow-hidden align-top" style={{ height: '1.25em', lineHeight: '1.25em' }}>
      <span ref={strip} className="flex flex-col will-change-transform">
        {Array.from({ length: 20 }, (_, i) => (
          <span key={i} className="block text-center" style={{ height: '1.25em' }}>
            {i % 10}
          </span>
        ))}
      </span>
    </span>
  );
};

/**
 * Shows a figure like a car's odometer: each digit is a wheel that rolls up to its number the first time the figure
 * is seen. Anything that is not a digit, such as "+", "." or "Gbps", stays still. A figure that does not start with
 * a number is shown as plain text.
 */
export const Odometer: React.FC<{ value: string }> = ({ value }) => {
  if (!/^\d/.test(value)) return <>{value}</>;
  const characters = [...value];
  // The digits on the right keep rolling a little longer than those on the left, like the wheels of a counter.
  const digitCount = characters.filter((c) => /\d/.test(c)).length;
  let seen = 0;
  return (
    <span aria-label={value}>
      {characters.map((character, index) => {
        if (!/\d/.test(character)) return <React.Fragment key={index}>{character}</React.Fragment>;
        seen += 1;
        return <Digit key={index} digit={Number(character)} place={digitCount - seen} />;
      })}
    </span>
  );
};
