/**
 * Client testimonials shown on the home page.
 * PLACEHOLDERS: every entry below is a stand-in. Replace each one with a real quote that the client has agreed to,
 * with the speaker's name, role and company. Do not publish a quote that was not given by that person.
 * `result` is optional: one measurable outcome, such as a capacity, a time saved or a number of sites.
 */
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  result?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'Testimonial placeholder. A short quote from a client about working with Techne, in their own words.',
    name: 'Client name',
    role: 'Role',
    company: 'Company',
    result: 'Result placeholder',
  },
  {
    quote: 'Testimonial placeholder. A short quote from a client about working with Techne, in their own words.',
    name: 'Client name',
    role: 'Role',
    company: 'Company',
    result: 'Result placeholder',
  },
  {
    quote: 'Testimonial placeholder. A short quote from a client about working with Techne, in their own words.',
    name: 'Client name',
    role: 'Role',
    company: 'Company',
    result: 'Result placeholder',
  },
];
