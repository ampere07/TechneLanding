import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SERVICES, SERVICE_GROUPS } from '../content/site';
import { ClosingCTA } from './ClosingCTA';
import { ServiceFinder, VirtualCompare } from './HomeSections';

/** Index of all services, grouped the same way as the main menu. */
export const Services: React.FC = () => (
  <>
    <section className="bg-paper-2 border-b border-rule">
      <div className="wrap py-12 md:py-16">
        <h1 className="heading-1">Services</h1>
        <p className="lede mt-4">
          Colocation, connectivity, virtual services and network consulting for ISPs and enterprises in the Philippines, all on one carrier-neutral network.
        </p>
      </div>
    </section>

    <section className="section bg-paper">
      <div className="wrap space-y-12">
        {SERVICE_GROUPS.map((group) => (
          <div key={group}>
            <h2 className="heading-2 mb-5">{group}</h2>
            <div className="border-t-2 border-ink">
              {SERVICES.filter((service) => service.group === group).map((service) => (
                <div key={service.id} className="grid grid-cols-1 md:grid-cols-[minmax(0,3fr)_minmax(0,6fr)_auto] gap-x-8 gap-y-2 py-5 border-b border-rule">
                  <h3 className="heading-3">
                    <Link to={service.path} className="hover:text-accent transition-colors duration-150">{service.name}</Link>
                  </h3>
                  <div>
                    <p className="body-copy">{service.summary}</p>
                    <p className="text-[0.875rem] text-ink-2 mt-2">
                      <span className="font-semibold text-ink">Built for: </span>
                      {service.builtFor}
                    </p>
                  </div>
                  <Link to={service.path} className="text-link self-start">
                    Details
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>

    <ServiceFinder />
    <VirtualCompare />
    <ClosingCTA />
  </>
);
