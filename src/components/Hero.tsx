import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PANEL_IDS } from '../constants';
import { FACTS, LOCATION } from '../content/site';
import { FabricView } from './FabricView';
import { Odometer } from './Odometer';

// Three facts share the top row and two share the bottom, so both rows fill the panel.
const facts = [
  { value: FACTS.backbone, label: 'Backbone capacity', span: 'sm:col-span-2 pl-0' },
  { value: FACTS.ports, label: 'Port speeds', span: 'sm:col-span-2 pl-4 lg:pl-3 xl:pl-4' },
  { value: FACTS.sla, label: 'Availability SLA', span: 'sm:col-span-2 pl-0 sm:pl-4 lg:pl-3 xl:pl-4' },
  { value: FACTS.noc, label: 'Network operations center', span: 'sm:col-span-3 pl-4 sm:pl-0' },
  { value: LOCATION.facility, label: `Data center in ${LOCATION.city}`, span: 'col-span-2 sm:col-span-3 pl-0 sm:pl-4 lg:pl-3 xl:pl-4' },
];

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
});

interface HeroProps {
  slotRef?: React.Ref<HTMLDivElement>;
  /** True when the home page's shared travelling model is drawn into this slot. */
  sharedModel?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ slotRef, sharedModel = false }) => (
  <section className="bg-paper-2 border-b border-rule overflow-hidden">
    <div className="wrap grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-center gap-6 lg:gap-4 pt-12 lg:pt-10 pb-6 lg:pb-10">
      <div>
        <motion.h1 className="heading-1" {...enter(0.05)}>IP transit, Metro-E, colocation and virtual interconnection for Philippine networks</motion.h1>
        <motion.p className="lede mt-5" {...enter(0.15)}>
          Techne is a carrier-neutral network provider and engineering firm. We host your equipment, deliver your
          upstream, and connect you to carriers and partners over one fabric, backed by a 24/7 operations team.
        </motion.p>
        <motion.div className="flex flex-wrap gap-3 mt-6" {...enter(0.25)}>
          <Link to={`/${PANEL_IDS.CONTACT}`} className="btn-primary">Contact us</Link>
          <Link to={`/${PANEL_IDS.SERVICES}`} className="btn-secondary">View all services</Link>
        </motion.div>

        <motion.dl aria-label="Network facts" className="grid grid-cols-2 sm:grid-cols-6 gap-px mt-7 bg-rule border-y border-rule" {...enter(0.35)}>
          {facts.map((fact) => (
            <div key={fact.label} className={`flex flex-col-reverse justify-end gap-0.5 bg-paper-2 pr-4 lg:pr-3 xl:pr-4 py-3 ${fact.span}`}>
              <dt className="text-[0.8125rem] leading-snug text-ink-2">{fact.label}</dt>
              <dd className="font-display text-[1.0625rem] min-[360px]:text-[1.25rem] lg:text-[1rem] xl:text-[1.25rem] font-semibold tracking-tight leading-tight tabular-nums whitespace-nowrap text-ink"><Odometer value={fact.value} /></dd>
            </div>
          ))}
        </motion.dl>
      </div>

      <div ref={slotRef} className="h-[320px] sm:h-[440px] lg:h-[560px] xl:-mr-20">
        {!sharedModel && <FabricView focus="overview" className="h-full" />}
      </div>
    </div>
  </section>
);
