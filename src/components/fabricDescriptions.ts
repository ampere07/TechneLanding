import type { FabricFocus } from '../three/FabricStage';

/** Text alternatives for the 3D model, one for each service it can highlight. */
export const FABRIC_DESCRIPTIONS: Record<FabricFocus, string> = {
  overview:
    'Scale model of a data hall: customer, partner and CDN cabinets connected by overhead fiber trays to a central fabric, with upstream carriers entering through a riser and virtual switch and router layers above the fabric.',
  colocation: 'Scale model of a data hall with the customer cabinets highlighted.',
  'ip-transit': 'Map of Asia with the Techne fabric rack standing at Manila, and lines running out from the rack to cities in Japan, South Korea, Taiwan, Hong Kong, Vietnam, Thailand, Singapore, Malaysia, Indonesia and India, glowing once each is connected.',
  content: 'Scale model of a data hall showing light travelling along the wires from the CDN cache cabinets, through the Techne fabric, to a customer cabinet.',
  'metro-e': 'Scale model of two separate facilities side by side, with a link carrying light between a point A rack in the first and a point B rack in the second.',
  vxc: 'Scale model of a data hall showing one private path between a customer port and a partner port.',
  vswitch: 'Scale model of a data hall zoomed to the Techne fabric rack, where two cables hanging from the virtual switch above are plugged into the two ports of one server.',
  vrouter: 'Scale model of a data hall showing a virtual router above the fabric routing between a customer cabinet and upstream carriers.',
  consulting: 'Scale model of a data hall zoomed to the Techne fabric rack, where an engineer pushes a server into the rack while an analyst works at a table with a laptop.',
};
