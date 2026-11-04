import { PANEL_IDS } from '../constants';

/** Builds a link to the contact page with the Subject and message already filled in. */
export const quoteLink = (subject: string, details: string[]) => ({
  pathname: `/${PANEL_IDS.CONTACT}`,
  search: `?${new URLSearchParams({
    subject: `Quote request: ${subject}`,
    message: ['Hello Techne,', '', ...details, '', 'Please let me know the next steps.'].join('\n'),
  }).toString()}`,
});

/** A quote request for a whole service, used by the service pages. */
export const serviceQuoteLink = (service: string) =>
  quoteLink(service, [`I would like a quote for ${service}.`, '', 'Location:', 'Capacity needed:', 'Timeline:']);
