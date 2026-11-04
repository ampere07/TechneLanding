import type { FabricFocus } from '../three/FabricStage';

/** Text alternatives for the 3D model, one for each service it can highlight. */
export const FABRIC_DESCRIPTIONS: Record<FabricFocus, string> = {
  overview:
    'Scale model of a data hall: customer, partner and CDN cabinets connected by overhead fiber trays to a central fabric, with upstream carriers entering through a riser and virtual switch and router layers above the fabric.',
  colocation: 'Scale model of a data hall with the customer cabinets highlighted.',
  'ip-transit': 'Scale model of a data hall showing traffic from upstream carriers through edge routers to a customer cabinet.',
  content: 'Scale model of a data hall showing traffic from CDN cache cabinets through the fabric to a customer cabinet.',
  'metro-e': 'Scale model of a data hall showing one transport path from a point A cabinet to a point B cabinet.',
  vxc: 'Scale model of a data hall showing one private path between a customer port and a partner port.',
  vswitch: 'Scale model of a data hall showing a virtual switch above the fabric joining several customer and partner cabinets.',
  vrouter: 'Scale model of a data hall showing a virtual router above the fabric routing between a customer cabinet and upstream carriers.',
  consulting: 'Scale model of a data hall drawn as a line blueprint, representing whole-network design and audit.',
};
