import React from 'react';
import { Check, Minus } from 'lucide-react';
import phMap from '../assets/ph_map.png';
import { CONTENT_LOGOS, PLATFORM_LOGOS, type Logo } from '../content/logos';
import { FACILITY_COUNT, LOCATIONS } from '../content/site';

// Pin positions as a percentage of the Philippine map image.
const MAP_PINS = [
  { city: 'Manila', left: 47.5, top: 39.5, side: 'left' },
  { city: 'Cebu City', left: 62.5, top: 64, side: 'left' },
  { city: 'Davao City', left: 71.5, top: 83.5, side: 'right' },
] as const;

const Available: React.FC<{ yes: boolean }> = ({ yes }) =>
  yes ? (
    <span className="inline-flex items-center gap-1.5 text-ink whitespace-nowrap">
      <Check size={16} className="text-accent" aria-hidden="true" />
      Available
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-ink-3 whitespace-nowrap">
      <Minus size={16} aria-hidden="true" />
      Not offered
    </span>
  );

/** Service availability by metro and facility. */
export const NetworkMap: React.FC = () => (
  <section id="locations" className="section bg-paper-2 border-y border-rule">
    <div className="wrap">
      <div className="max-w-3xl mb-10">
        <h2 className="heading-2">Where you can connect</h2>
        <p className="lede mt-3">
          Techne services are available at {FACILITY_COUNT} data center facilities in {LOCATIONS.length} cities. If your site is not listed, tell us where it is and we will check what can reach it.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-8 lg:gap-12 items-start">
        <figure className="max-w-[380px] mx-auto w-full lg:max-w-none">
          <div className="relative aspect-square">
            <img src={phMap} alt="" className="absolute inset-0 w-full h-full object-contain opacity-30 mix-blend-multiply" draggable="false" />
            {MAP_PINS.map((pin) => (
              <div key={pin.city} className="absolute" style={{ left: `${pin.left}%`, top: `${pin.top}%` }}>
                <span className="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-accent ring-2 ring-paper-2" />
                <span
                  className={`absolute -top-3 whitespace-nowrap text-[0.8125rem] font-semibold text-ink ${pin.side === 'left' ? 'right-3' : 'left-3'}`}
                >
                  {pin.city}
                </span>
              </div>
            ))}
          </div>
          <figcaption className="text-[0.8125rem] text-ink-3 mt-2">Philippine locations shown. Hong Kong and Singapore are listed in the table.</figcaption>
        </figure>

        <div className="md:hidden border-t-2 border-ink">
          {LOCATIONS.map((location) => (
            <div key={location.city} className="py-4 border-b border-rule">
              <h3 className="heading-3">{location.city}</h3>
              <p className="body-copy mt-1">{location.facilities.join(', ')}</p>
              <dl className="mt-3 space-y-1.5 text-[0.875rem]">
                <div className="flex items-center justify-between gap-4"><dt className="text-ink-2">Colocation</dt><dd><Available yes={location.colocation} /></dd></div>
                <div className="flex items-center justify-between gap-4"><dt className="text-ink-2">Transit and Content</dt><dd><Available yes /></dd></div>
                <div className="flex items-center justify-between gap-4"><dt className="text-ink-2">Virtual services</dt><dd><Available yes /></dd></div>
              </dl>
            </div>
          ))}
        </div>

        <div className="hidden md:block table-scroll bg-paper border border-rule rounded-[4px]">
          <table className="data-table min-w-[680px]">
            <thead>
              <tr>
                <th scope="col">City</th>
                <th scope="col">Facilities</th>
                <th scope="col">Colocation</th>
                <th scope="col">Transit and Content</th>
                <th scope="col">Virtual services</th>
              </tr>
            </thead>
            <tbody>
              {LOCATIONS.map((location) => (
                <tr key={location.city}>
                  <th scope="row" className="whitespace-nowrap">{location.city}</th>
                  <td>{location.facilities.join(', ')}</td>
                  <td><Available yes={location.colocation} /></td>
                  <td><Available yes /></td>
                  <td><Available yes /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
);

const LogoTile: React.FC<{ logo: Logo }> = ({ logo }) => (
  <div className="bg-paper h-20 md:h-24 flex items-center justify-center px-6">
    <img
      src={logo.src}
      alt={logo.name}
      loading="lazy"
      className="max-h-8 md:max-h-9 max-w-[120px] w-auto object-contain grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-[filter,opacity] duration-150"
      draggable="false"
    />
  </div>
);

export const LogoGrid: React.FC<{ logos: Logo[] }> = ({ logos }) => (
  <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-rule border border-rule rounded-[4px] overflow-hidden">
    {logos.map((logo) => (
      <LogoTile key={logo.name} logo={logo} />
    ))}
  </div>
);

/** Content networks and the vendor platforms Techne works with. */
export const TrustedBrands: React.FC = () => (
  <section className="section bg-paper">
    <div className="wrap space-y-14">
      <div>
        <div className="max-w-3xl mb-8">
          <h2 className="heading-2">Connected to leading content networks</h2>
          <p className="lede mt-3">Direct connections to CDNs and content platforms keep popular traffic local for your subscribers.</p>
        </div>
        <LogoGrid logos={CONTENT_LOGOS} />
      </div>

      <div>
        <h3 className="heading-3 mb-5">Hardware and software platforms we deploy and support</h3>
        <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
          {PLATFORM_LOGOS.map((logo) => (
            <img
              key={logo.name}
              src={logo.src}
              alt={logo.name}
              loading="lazy"
              className="h-7 md:h-8 max-w-[110px] w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-[filter,opacity] duration-150"
              draggable="false"
            />
          ))}
        </div>
      </div>
    </div>
  </section>
);
