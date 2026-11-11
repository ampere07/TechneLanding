import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PANEL_IDS } from '../constants';
import { PARTNERS, type Partner } from '../content/partners';
import { flyPartner } from './PartnerFlyer';
import { JOURNEY, JOURNEY_FINAL, JOURNEY_INTRO, JOURNEY_TITLE, type JourneyStep } from '../content/journey';
import { Reveal } from './Reveal';
import { AfterIntro } from './AfterIntro';
import { Inline } from './RichText';

/** Where the line runs: down the left edge on phones and down the middle on wide screens. */
const SPINE = 'left-[7px] lg:left-1/2 lg:-translate-x-1/2';

/**
 * Follows the scroll through one year. The line below the year fills as the visitor scrolls down toward the next
 * one, and the year's marker lights up when the line reaches it. It is driven by the visitor's own scrolling, so
 * it keeps working under a reduced-motion setting.
 */
function useYear() {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 72%', 'end 72%'] });
  const [reached, setReached] = useState(false);
  useMotionValueEvent(scrollYProgress, 'change', (value) => setReached(value > 0.001));
  return { ref, progress: scrollYProgress, reached };
}

/**
 * A paragraph whose lines are spaced so that, on wide screens, the text runs exactly from the top of its box to
 * the bottom. The box is as tall as the picture beside it. On phones it is an ordinary paragraph.
 */
const FitParagraph: React.FC<{ text: string }> = ({ text }) => {
  const ref = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const paragraph = ref.current;
    const box = paragraph?.parentElement;
    if (!paragraph || !box) return;
    const wide = window.matchMedia('(min-width: 1024px)');

    const fit = () => {
      paragraph.style.lineHeight = '';
      paragraph.style.marginTop = '';
      if (!wide.matches) return;
      const size = parseFloat(getComputedStyle(paragraph).fontSize);
      const height = box.clientHeight;
      // Count the lines of the text as it is drawn, and measure how tall one line of letters is.
      paragraph.style.lineHeight = '1.5';
      const range = document.createRange();
      range.selectNodeContents(paragraph);
      const pieces = [...range.getClientRects()].filter((rect) => rect.height > 0 && rect.height < size * 2.2);
      const lines = new Set(pieces.map((rect) => Math.round(rect.top))).size;
      if (lines < 2 || pieces.length === 0) return;
      const letters = Math.min(...pieces.map((rect) => rect.height));
      // The text runs from the top of the first line's letters to the bottom of the last line's letters.
      const spacing = (height - letters) / (lines - 1);
      paragraph.style.lineHeight = `${spacing}px`;
      paragraph.style.marginTop = `${-(spacing - letters) / 2}px`;
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    wide.addEventListener('change', fit);
    document.fonts?.ready.then(fit, () => undefined);
    return () => {
      observer.disconnect();
      wide.removeEventListener('change', fit);
    };
  }, [text]);

  return (
    <p ref={ref} className="body-copy text-[1.1875rem] lg:text-[1.25rem] leading-relaxed text-justify lg:absolute lg:inset-x-0 lg:top-0">
      <Inline text={text} />
    </p>
  );
};

/** The marker on the line. It is hollow until the line arrives, then fills in. */
const Marker: React.FC<{ reached: boolean }> = ({ reached }) => (
  <span
    aria-hidden="true"
    className={`absolute left-0 lg:left-1/2 lg:-translate-x-1/2 top-3 z-10 h-4 w-4 rounded-full border-2 transition-[background-color,border-color,box-shadow] duration-500 ${
      reached ? 'bg-accent border-accent shadow-[0_0_0_5px_rgb(14_107_112_/_0.14)]' : 'bg-paper border-rule-strong'
    }`}
  />
);

/** The piece of line between one year and the next, grey underneath and teal as it fills. */
const Line: React.FC<{ progress: ReturnType<typeof useYear>['progress'] }> = ({ progress }) => (
  <>
    <span aria-hidden="true" className={`absolute ${SPINE} top-5 -bottom-3 w-0.5 bg-rule`} />
    <span aria-hidden="true" className={`absolute ${SPINE} top-5 -bottom-3 w-0.5 overflow-hidden`}>
      <motion.span className="block h-full w-full origin-top bg-accent" style={{ scaleY: progress }} />
    </span>
  </>
);

const YearStep: React.FC<{ step: JourneyStep; index: number }> = ({ step, index }) => {
  const { ref, progress, reached } = useYear();
  const flip = index % 2 === 1;
  return (
    <li ref={ref} className="relative pb-16 md:pb-24">
      <Line progress={progress} />
      <Marker reached={reached} />

      <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-6 pl-10 lg:pl-0">
        <figure className={flip ? 'lg:order-2' : ''}>
          <img
            src={step.image}
            alt={step.alt}
            loading="lazy"
            draggable="false"
            className="w-full aspect-[4/3] object-cover rounded-[4px] border border-rule"
            style={{ objectPosition: step.focus }}
          />
          {step.caption && <figcaption className="text-[0.8125rem] text-ink-3 mt-2">{step.caption}</figcaption>}
        </figure>

        <div className={flip ? 'lg:order-1' : ''}>
          <p className="font-display text-[2.5rem] md:text-[3rem] font-semibold tracking-tight leading-none text-ink">{step.year}</p>
          <dl className="mt-6 border-t border-rule">
            {step.facts.map((fact) => (
              <div key={fact.label} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-4 py-3 border-b border-rule">
                <dt className="text-[0.875rem] text-ink-3">{fact.label}</dt>
                <dd className="text-[0.9375rem] font-semibold text-ink leading-snug">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 space-y-4">
            {step.paragraphs.map((paragraph) => (
              <p key={paragraph} className="body-copy leading-relaxed text-justify hyphens-auto">
                <Inline text={paragraph} />
              </p>
            ))}
          </div>
        </div>
      </Reveal>
    </li>
  );
};

/** The last part: where the line ends, with Techne Consulting. */
const FinalStep: React.FC = () => {
  const { ref, reached } = useYear();
  return (
    <li ref={ref} className="relative">
      <Marker reached={reached} />
      <div className="pl-10 lg:pl-0">
        <Reveal className="lg:text-center lg:pt-10">
          <p className="font-display text-[2.5rem] md:text-[3rem] font-semibold tracking-tight leading-none text-ink">{JOURNEY_FINAL.year}</p>
        </Reveal>

        {/* The picture and the opening paragraph sit side by side at the same height. The rest of the story runs underneath. */}
        <div className="mt-8 max-w-5xl lg:mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[46%_minmax(0,1fr)] gap-6 lg:gap-10 items-stretch">
            <Reveal className="lg:min-h-[300px]">
              <img
                src={JOURNEY_FINAL.image}
                alt={JOURNEY_FINAL.alt}
                loading="lazy"
                draggable="false"
                className="w-full aspect-[16/10] lg:aspect-auto lg:h-full object-cover rounded-[4px] border border-rule"
                style={{ objectPosition: '22% 40%' }}
              />
            </Reveal>

            <Reveal className="relative">
              {JOURNEY_FINAL.paragraphs.map((paragraph) => (
                <FitParagraph key={paragraph} text={paragraph} />
              ))}
            </Reveal>
          </div>

          {/* Under the picture: the founding of Techne Consulting, why it was created, and how the journey comes together. */}
          <div className="pt-10 space-y-5">
            <Reveal>
              <p className="font-display text-[1.5rem] md:text-[1.875rem] font-semibold tracking-tight leading-snug text-ink">
                <Inline text={JOURNEY_FINAL.founding} />
              </p>
            </Reveal>
            <Reveal>
              <p className="text-[1.1875rem] font-medium leading-snug text-ink text-justify">
                <Inline text={JOURNEY_FINAL.purpose} />
              </p>
            </Reveal>
            <Reveal>
              <p className="body-copy text-[1.0625rem] leading-relaxed text-justify">{JOURNEY_FINAL.closing}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </li>
  );
};

export const JourneyTimeline: React.FC<{ ready: boolean; started: boolean }> = ({ ready, started }) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [offset, setOffset] = useState<{ x: number; y: number } | null>(null);
  const calm = !!useReducedMotion();

  // Choosing a partner: its logo glides to the middle of the screen and then the partner's page opens. A modified
  // click (new tab, new window) and people who ask for less motion get the ordinary link.
  const openPartner = (event: React.MouseEvent<HTMLAnchorElement>, partner: Partner) => {
    if (calm || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const mark = event.currentTarget.querySelector<HTMLElement>('[data-partner-logo]');
    if (!mark) return;
    const box = mark.getBoundingClientRect();
    const started = flyPartner({
      to: `/${PANEL_IDS.PARTNERS}/${partner.slug}`,
      name: partner.name,
      src: partner.src,
      darkLogo: partner.darkLogo,
      rect: { left: box.left, top: box.top, width: box.width, height: box.height },
      fontSize: window.getComputedStyle(mark).fontSize,
    });
    if (started) event.preventDefault();
  };

  // Work out how far the title is from the middle of the screen, so it can start there.
  useLayoutEffect(() => {
    if (ready) return;
    // The page opens at the top. When the visitor arrives from a page they had scrolled down, the browser can still
    // be at the old position for a moment, which used to put the title in the wrong place, out of sight.
    window.scrollTo(0, 0);
    const measure = () => {
      const box = titleRef.current;
      const heading = headingRef.current;
      if (!box || !heading) return;
      box.style.transform = 'none';
      const rect = heading.getBoundingClientRect();
      // Measured from the top of the page, not from the top of the window, so scrolling cannot change the answer.
      setOffset({
        x: document.documentElement.clientWidth / 2 - (rect.left + window.scrollX + rect.width / 2),
        y: window.innerHeight / 2 - (rect.top + window.scrollY + rect.height / 2),
      });
      box.style.transform = '';
    };
    measure();
    // The title is wider or narrower once the page font has loaded, so it is measured again then.
    let alive = true;
    void document.fonts?.ready.then(() => {
      if (alive) measure();
    });
    window.addEventListener('resize', measure);
    return () => {
      alive = false;
      window.removeEventListener('resize', measure);
    };
  }, [ready]);

  // While the title waits in the middle, the page cannot be scrolled.
  useLayoutEffect(() => {
    if (ready) return;
    const stop = (event: Event) => event.preventDefault();
    window.addEventListener('wheel', stop, { passive: false });
    window.addEventListener('touchmove', stop, { passive: false });
    return () => {
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchmove', stop);
    };
  }, [ready]);

  const centred = !ready && offset;
  const EASE = 'cubic-bezier(0.65, 0, 0.35, 1)';

  // 1. The title and its line fade in from nothing. 2. A shine then sweeps across the letters.
  useLayoutEffect(() => {
    if (!started || ready) return;
    const fade = titleRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 900, easing: 'ease', fill: 'backwards' });
    const shine = headingRef.current?.animate([{ backgroundPosition: '130% 0' }, { backgroundPosition: '-30% 0' }], {
      duration: 1200,
      delay: 900,
      easing: 'ease-in-out',
      fill: 'both',
    });
    return () => {
      fade?.cancel();
      shine?.cancel();
    };
  }, [started, ready]);

  // 3. The title and its line glide from the middle of the screen to their place at the top of the page.
  useLayoutEffect(() => {
    if (!ready || !offset) return;
    const animation = titleRef.current?.animate(
      [{ transform: `translate(${offset.x}px, ${offset.y}px)` }, { transform: 'translate(0, 0)' }],
      { duration: 1000, easing: EASE },
    );
    return () => animation?.cancel();
    // The move is run once, from where the title was waiting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <section aria-labelledby="journey-title" className="section bg-paper">
      <div className="wrap">
        <div
          ref={titleRef}
          className="max-w-3xl mx-auto text-center relative z-10"
          style={{
            transform: centred ? `translate(${offset.x}px, ${offset.y}px)` : 'translate(0, 0)',
            opacity: started && (offset || ready) ? 1 : 0,
          }}
        >
          <h1
            ref={headingRef}
            id="journey-title"
            className={`heading-1 w-fit mx-auto ${ready ? '' : 'journey-shine'}`}
          >
            {JOURNEY_TITLE}
          </h1>
          <AfterIntro ready={ready} delay={1050}>
            <p className="lede mt-4 mx-auto">{JOURNEY_INTRO}</p>
            <div className="mt-8">
              <p className="text-[0.8125rem] font-medium uppercase tracking-wider text-ink-3">Our partners</p>
              <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
                {PARTNERS.map((partner) => {
                  const logo = partner.src ? (
                    <span className="flex items-center px-2 py-1 group-hover:-translate-y-0.5 transition-transform duration-150">
                      <img
                        src={partner.src}
                        alt={partner.about ? '' : partner.name}
                        data-partner-logo
                        className={`${partner.darkLogo ? 'logo-on-dark ' : ''}h-12 md:h-16 w-auto max-w-[150px] object-contain`}
                        draggable={false}
                      />
                    </span>
                  ) : (
                    <span data-partner-logo className="font-display text-[1.5rem] md:text-[1.75rem] font-bold tracking-tight text-ink group-hover:text-accent transition-colors duration-150">{partner.name}</span>
                  );
                  return (
                    <li key={partner.slug}>
                      {partner.about ? (
                        <Link
                          to={`/${PANEL_IDS.PARTNERS}/${partner.slug}`}
                          aria-label={`${partner.name}${partner.type ? `: ${partner.type}` : ''}. See details`}
                          className="group inline-flex items-center"
                          onClick={(event) => openPartner(event, partner)}
                        >
                          {logo}
                        </Link>
                      ) : (
                        <span className="group inline-flex items-center">{logo}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </AfterIntro>
        </div>

        <AfterIntro ready={ready}>
          <ol className="relative mt-12 md:mt-16">
            {JOURNEY.map((step, index) => (
              <YearStep key={step.year} step={step} index={index} />
            ))}
            <FinalStep />
          </ol>
        </AfterIntro>
      </div>
    </section>
  );
};
