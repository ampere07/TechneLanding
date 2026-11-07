import * as THREE from 'three';
import { ASIA, DESTINATIONS, mapPoint } from './asiaMap';
import { CONTENT_LOGOS } from '../content/logos';

/**
 * FabricStage draws Techne's interconnection hall as an axonometric scale model:
 * customer, partner and CDN cabinets on a raised floor, overhead fiber trays, a
 * core fabric, and the virtual switch and router drawn as translucent layers
 * above it. Selecting a service highlights the part of the hall that service uses,
 * so the same model explains every product on the site.
 */

export type FabricFocus =
  | 'overview'
  | 'colocation'
  | 'ip-transit'
  | 'content'
  | 'metro-e'
  | 'vxc'
  | 'vswitch'
  | 'vrouter'
  | 'consulting';

/** A rectangle inside the stage, in CSS pixels. The model is fitted to it. */
export interface FabricFrame {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Where the model sits at each end of its trip down the home page. */
export interface FabricJourneyLayout {
  hero: FabricFrame;
  panel: FabricFrame;
}

type CabinetStyle = 'customer' | 'partner' | 'cdn' | 'edge' | 'fabric';
type Tone = 'normal' | 'lit' | 'dim' | 'ghost';

interface CabinetColors {
  body: string;
  door: string;
  unit: string;
}

const COLORS = {
  slabTop: '#f7f9fa',
  slabSide: '#cfd9e0',
  grid: '#dde4e9',
  tray: '#aebcc6',
  trayDim: '#e3e9ed',
  fibre: '#8ea3b1',
  fibreDim: '#e2e8ec',
  fibreLit: '#0e8a8f',
  pulse: '#0fa3a6',
  slab: '#63b4b5',
  slabEdge: '#0e6b70',
  ghostBody: '#f4f8f9',
  ghostLine: '#0e6b70',
  ledOn: ['#35d0c4', '#35d0c4', '#7fe08a', '#f2b84b'],
  ledOff: '#26404f',
};

const STYLE_COLORS: Record<CabinetStyle, CabinetColors> = {
  customer: { body: '#123448', door: '#1b465d', unit: '#0b2536' },
  partner: { body: '#56697a', door: '#677c8d', unit: '#3d4e5c' },
  cdn: { body: '#2f6f78', door: '#3c8590', unit: '#1f525a' },
  edge: { body: '#2b3a45', door: '#3a4c59', unit: '#1b2730' },
  fabric: { body: '#dfe7ec', door: '#eef3f6', unit: '#9fb2bf' },
};

const LIT_COLORS: CabinetColors = { body: '#0e6b70', door: '#138a8f', unit: '#0a5054' };
const DIM_COLORS: CabinetColors = { body: '#cfd8df', door: '#dbe2e7', unit: '#c0cbd3' };
const GHOST_COLORS: CabinetColors = { body: COLORS.ghostBody, door: COLORS.ghostBody, unit: COLORS.ghostBody };

// Hall dimensions, in model units.
const CAB_W = 0.64;
const CAB_H = 2;
const CAB_D = 0.92;
const CAB_STEP = 0.72;
/** How deep a piece of rack equipment is. Its front face sits on the cabinet face and the rest goes back into the cabinet. */
const UNIT_D = 0.6;
const UNIT_FRONT = CAB_D / 2 + 0.028;
const TRAY_Y = 2.46;
const BACK_Z = -2.45;
const FRONT_Z = 2.15;
const SWITCH_Y = 3.25;
const ROUTER_Y = 4.25;
const RISER_TOP = 5.25;

// Size of the whole hall on screen, in model units, used to fit it to a frame.
const MODEL_W = 15.2;
const MODEL_H = 9.9;

/**
 * How the hall builds itself, in seconds. The core cabinets go up first and the build
 * spreads outward. Each cabinet's shell rises, then its equipment slides in from the
 * bottom to the top and its lights come on. Cable trays, fiber and the virtual layers follow.
 * Reduced motion plays the same order faster, with parts appearing in place.
 */
const BUILD = {
  lead: 0.45, // waits for the canvas to fade in
  sweep: 1.35, // time for the build to reach the outermost cabinet
  rise: 0.55, // a cabinet shell rising from the floor
  slotDelay: 0.3, // when the first unit starts sliding in, after its cabinet starts
  slotGap: 0.05, // gap between one unit and the next
  slide: 0.34, // one unit sliding in
  slideDistance: 0.75,
  traysAt: 2.0,
  traysGrow: 0.7,
  fibresAt: 2.4,
  fibresDraw: 1.1,
  layersAt: 3.0,
  layersFade: 0.8,
  layersDrop: 0.7,
  end: 3.95,
  reducedSpeed: 1.7,
};

/**
 * The Colocation view empties the customer cabinets, then carries the equipment in. Units go in
 * in a random order. A unit stays hidden until its turn, then appears at full size out in front
 * of its cabinet and is pushed into its slot, so only the units being installed are on show. It
 * runs when the visitor picks Colocation, and it is short and contained, so it plays with
 * reduced motion too.
 */
const INSTALL = {
  first: 0.4, // waits for the camera to start moving to the customer cabinets
  stagger: 0.3, // gap between one cabinet starting and the next
  gap: 0.14, // gap between one unit starting and the next
  slide: 0.6, // one unit travelling into its slot
  distance: 2.2, // how far in front of the cabinet a unit starts
};

/** When and how far each unit travels. `carried` keeps units full size and moving, whatever the motion setting. */
interface MountTiming {
  first: number;
  gap: number;
  slide: number;
  distance: number;
  carried?: boolean;
  /** For carried units: the turn each slot takes, so slots can be filled in any order. */
  order?: number[];
}

interface Cabinet {
  id: string;
  group: THREE.Group;
  /** Body, door and outline, scaled together so the cabinet can rise from the floor. */
  shell: THREE.Group;
  units: THREE.InstancedMesh;
  slots: { y: number; h: number }[];
  /** When this cabinet starts building, in seconds into the sequence. */
  start: number;
  x: number;
  z: number;
  body: THREE.MeshStandardMaterial;
  door: THREE.MeshStandardMaterial;
  unit: THREE.MeshStandardMaterial;
  leds: THREE.InstancedMesh;
  style: CabinetStyle;
  tone: Tone;
  /** A slot left empty, because something else is being installed in it. */
  hole?: number;
}

const UP = new THREE.Vector3(0, 1, 0);
const SHOULDER = new THREE.Vector3();
const ELBOW = new THREE.Vector3();
const HAND = new THREE.Vector3();
const AIM = new THREE.Vector3();

interface PersonLook {
  top: string;
  legs: string;
  skin: string;
  hair: string;
}

const PEOPLE: Record<'engineer' | 'analyst', PersonLook> = {
  engineer: { top: '#e0a030', legs: '#1c2b36', skin: '#d9a98a', hair: '#2a1f1a' },
  analyst: { top: '#1f3b52', legs: '#3d4e5c', skin: '#8d5a3b', hair: '#14181c' },
};

/**
 * The Network Consulting view zooms to the Techne fabric rack. An engineer pushes a server into the
 * rack while an analyst works at a table with a laptop. Times are in seconds after the view opens.
 * It plays once and holds with reduced motion, and repeats the install without it.
 */
const CONSULT = {
  engineerIn: 1.0, // when the engineer appears, after the camera has started to move
  analystIn: 1.35,
  appear: 0.6,
  start: 1.9, // when the install starts
  hold: 0.6, // the engineer holds the server out in front of the rack
  push: 1.5, // pushing the server into the rack
  seated: 1.4, // the server stays in the rack
  pull: 1.3, // taking the server back out, ready to go again
  distance: 0.95, // how far in front of the rack the server is held
};

interface Person {
  root: THREE.Group;
  legs: THREE.Group[];
  head: THREE.Group;
  arms: { upper: THREE.Mesh; lower: THREE.Mesh; hand: THREE.Mesh }[];
  shoulderY: number;
}

/**
 * The Content view sends light along the wires. A packet leaves each CDN cache in turn, runs along
 * its wire to the Techne fabric, then along the wire out to the customer's equipment. It runs on
 * its own clock, so it plays with reduced motion too, for a few rounds before it stops.
 */
const CONTENT_LIGHT = {
  speed: 3.2, // model units per second
  lead: 0.6, // waits for the camera to start moving
  stagger: 0.55, // gap between one cache sending and the next
  rest: 1.1, // a pause between rounds
  trail: 8, // pieces in the glowing tail
  spacing: 0.13, // distance between pieces of the tail
  reducedRounds: 4, // enough rounds for every logo to travel once
};

interface LightPath {
  points: THREE.Vector3[];
  cumulative: number[];
  total: number;
}

/**
 * The Metro-E view adds a second facility beside the hall, at first just an empty floor. A link
 * draws out from Point A, a rack in the hall, with a light at its head. When it reaches the
 * floor, Point B, a single rack, grows out of the ground and the servers are carried in. After
 * that, light runs along the link between the two, one way and then the other. It runs on its
 * own clock, so it plays with reduced motion too.
 */
const METRO = {
  facilityX: 10.6, // centre of the second facility, and of its one rack
  facilityW: 3.4,
  facilityD: 3.2,
  height: 3.1, // how high the link runs between the buildings
  floorIn: 0.2, // when the floor starts to rise
  floorTime: 0.9,
  lineStart: 1.1, // when the link starts to draw out from Point A
  drawSpeed: 3.0, // how fast the link draws, in model units a second
  rackTime: 0.9, // the rack growing out of the floor
  serverGap: 0.09, // gap between one server starting and the next
  serverSlide: 0.6, // one server going in
  serverDistance: 1.6, // how far in front of the rack a server starts
  speed: 3.4, // speed of the light running along the finished link
  packets: 3,
  stagger: 0.45,
  rest: 0.9,
  trail: 8,
  spacing: 0.13,
  reducedRounds: 2,
};

interface MetroScene {
  group: THREE.Group;
  floor: THREE.Group;
  link: THREE.Mesh;
  linkSegments: number;
  path: LightPath;
  core: THREE.InstancedMesh;
  glow: THREE.InstancedMesh;
  rack: THREE.Group;
  slots: { y: number; h: number }[];
  units: THREE.InstancedMesh;
  leds: THREE.InstancedMesh;
  ring: THREE.Mesh;
  order: number[];
}

/**
 * The IP Transit view clears the hall away, leaving the Techne fabric rack standing on a map of
 * Asia at Manila. A line draws out from the rack to a place in each country, one after another.
 * When a line arrives, a ring spreads from the place and the line glows steadily, like a stable
 * connection. It plays once and holds, with or without reduced motion.
 */
const IP = {
  lead: 1.0, // waits for the camera to start moving
  stagger: 0.32, // gap between one line starting and the next
  draw: 1.5, // time to draw a line, plus a little more for each unit of distance
  perUnit: 0.07,
  trafficSpeed: 2.8, // how fast the traffic runs along a line, in model units a second
  reducedTraffic: 12, // with reduced motion, the traffic runs for this long and then stops
  segments: 64,
  glowIn: 0.6, // time for a line to reach its steady glow
  ripple: 1.1,
};

const IP_COLORS = {
  land: new THREE.Color('#e9eff3'),
  landLit: new THREE.Color('#cde8e6'),
  line: new THREE.Color('#63b4b5'),
  lit: new THREE.Color('#35d0c4'),
};

interface IpLine {
  place: (typeof DESTINATIONS)[number];
  curve: THREE.QuadraticBezierCurve3;
  line: THREE.Mesh;
  halo: THREE.Mesh;
  marker: THREE.Mesh;
  ripple: THREE.Mesh;
  distance: number;
  length: number;
}

interface IpScene {
  group: THREE.Group;
  fills: { name: string; material: THREE.MeshBasicMaterial }[];
  outline: THREE.LineBasicMaterial;
  lines: IpLine[];
  core: THREE.InstancedMesh;
  glow: THREE.InstancedMesh;
  trafficCore: THREE.InstancedMesh;
  trafficGlow: THREE.InstancedMesh;
}

/**
 * The Virtual Cross Connect view follows how a VXC works. It is a point-to-point Layer 2 circuit between
 * two ports, with a VLAN ID on each end, delivered over more than one path so it can fail over. The circuit
 * draws out from the customer port to the partner port, VLAN tags appear on both ends, and traffic runs
 * along it. Then the main path drops, traffic moves to the backup path, and the main path comes back.
 */
const VXC = {
  lead: 0.8,
  drawSpeed: 4.2,
  trafficSpeed: 3.6,
  packets: 2,
  stagger: 0.5,
  traffic: 4.5, // running on the main path
  fail: 0.9, // the main path drops
  backup: 4.2, // running on the backup path
  restore: 0.9, // the main path comes back
  rest: 0.5,
};

/**
 * The Virtual Router view follows how a cloud router works. It joins several VXCs into one routing
 * domain, and BGP sessions run over those VXCs. Three VXCs attach to the router and come up, then each
 * side advertises its route into the router, the router passes the routes on, and traffic is routed from
 * the customer to the upstream network. Nothing here is hardware, so the router is the layer above the fabric.
 */
const VROUTER = {
  lead: 0.8,
  spokeStagger: 0.55,
  spokeDraw: 1.7,
  loopStart: 4.4,
  routeTravel: 1.6,
  routeStagger: 0.35,
  routesIn: 0,
  routesOut: 2.6,
  traffic: 5.2,
  passes: 2,
  passTime: 2.4,
  loop: 10.8,
  speed: 3,
};

interface FlowRig {
  core: THREE.InstancedMesh;
  glow: THREE.InstancedMesh;
  packets: number;
  trail: number;
}

interface VxcFlow {
  group: THREE.Group;
  primary: LightPath;
  backup: LightPath;
  primaryTube: THREE.Mesh;
  primarySegments: number;
  primaryMaterial: THREE.MeshBasicMaterial;
  halo: THREE.Mesh;
  backupTube: THREE.Mesh;
  backupMaterial: THREE.MeshBasicMaterial;
  ports: THREE.Mesh[];
  chips: { a: THREE.Sprite; b: THREE.Sprite; down: THREE.Sprite; reroute: THREE.Sprite };
  rig: FlowRig;
}

interface RouterSpoke {
  path: LightPath;
  tube: THREE.Mesh;
  segments: number;
  material: THREE.MeshBasicMaterial;
  bgp: THREE.Sprite;
  route: THREE.Sprite;
}

interface RouterFlow {
  group: THREE.Group;
  spokes: RouterSpoke[];
  rig: FlowRig;
  ring: THREE.Mesh;
}

/**
 * The Virtual Switch view follows how a virtual switch works. It makes separate ports behave as if they
 * were on one Ethernet switch, a shared broadcast domain, and it works like any switch. When a frame
 * arrives from an address it has not seen, it learns that address and which port it is on. If it does not
 * yet know where the destination is, it floods the frame to every other port. When the destination replies,
 * the switch learns that port too, and from then on frames go out of only the one port that is needed.
 */
const VSWITCH = {
  lead: 0.8,
  spokeStagger: 0.45,
  spokeDraw: 1.6,
  loopStart: 4.0,
  speed: 3.2,
  loop: 14.5,
  // When each step starts, in seconds into the loop.
  frameIn: 0,
  flood: 1.5,
  replyIn: 4.2,
  replyOut: 5.7,
  frameAgain: 8.4,
  unicast: 9.9,
};

interface SwitchMember {
  path: LightPath;
  tube: THREE.Mesh;
  segments: number;
  material: THREE.MeshBasicMaterial;
  port: THREE.Sprite;
  rig: FlowRig;
}

interface SwitchFlow {
  group: THREE.Group;
  members: SwitchMember[];
  macs: THREE.Sprite[];
  flood: THREE.Sprite;
  known: THREE.Sprite;
  ring: THREE.Mesh;
}

interface ConsultScene {
  group: THREE.Group;
  cabinet: Cabinet;
  slot: number;
  slotY: number;
  server: THREE.Group;
  engineer: Person;
  analyst: Person;
}

interface Fibre {
  id: string;
  mesh: THREE.Mesh;
  material: THREE.MeshBasicMaterial;
  samples: THREE.Vector3[];
  length: number;
  indexCount: number;
  tone: Tone;
  flow: number; // 1 runs from cabinet to fabric, -1 runs back, 0 is idle.
  level: number;
}

interface Slab {
  id: 'vswitch' | 'vrouter';
  face: THREE.MeshStandardMaterial;
  edge: THREE.LineBasicMaterial;
  ports: THREE.MeshBasicMaterial;
  tone: Tone;
  faceLevel: number;
  lineLevel: number;
}

interface LabelDef {
  id: string;
  text: string;
  at: [number, number, number];
  side?: 'left' | 'right';
}

interface FocusSpec {
  azimuth: number;
  elevation: number;
  cabinets: string[] | 'all';
  fibres: Record<string, number> | 'all';
  slabs: string[] | 'all';
  labels: string[];
  target: [number, number, number];
  zoom: number;
  blueprint?: boolean;
}

const LABELS: LabelDef[] = [
  { id: 'customers', text: 'Customer cabinets', at: [-3.2, TRAY_Y + 0.02, FRONT_Z] },
  { id: 'your-rack', text: 'Your equipment', at: [-3.2, TRAY_Y + 0.02, FRONT_Z] },
  { id: 'your-port', text: 'Your port', at: [-2.12, TRAY_Y + 0.02, FRONT_Z] },
  { id: 'metro-a', text: 'Point A', at: [4.04, TRAY_Y + 0.02, FRONT_Z] },
  { id: 'metro-b', text: 'Point B', at: [10.6, TRAY_Y + 0.02, FRONT_Z] },
  { id: 'metro-facility-a', text: 'Vitro Makati 2', at: [3.0, 0.02, 3.9] },
  { id: 'metro-facility-b', text: 'Client', at: [10.6, 0.02, 3.7] },
  { id: 'partners', text: 'Partner networks', at: [1.82, TRAY_Y + 0.02, BACK_Z] },
  { id: 'partner-port', text: 'Partner port', at: [1.82, TRAY_Y + 0.02, BACK_Z] },
  { id: 'cdn', text: 'CDN caches', at: [-4.28, TRAY_Y + 0.02, BACK_Z] },
  { id: 'edge', text: 'Edge routers', at: [3.86, TRAY_Y + 0.02, BACK_Z] },
  { id: 'carriers', text: 'Upstream carriers', at: [5.26, RISER_TOP + 0.12, BACK_Z] },
  { id: 'fabric', text: 'Techne fabric', at: [-0.7, 1.15, 0.46], side: 'left' },
  { id: 'vswitch', text: 'Virtual Switch', at: [1.5, SWITCH_Y, 0.95], side: 'right' },
  { id: 'vrouter', text: 'Virtual Router', at: [1.5, ROUTER_Y, 0.95], side: 'right' },
  { id: 'virtual', text: 'Virtual Switch and Router', at: [0.75, ROUTER_Y + 0.02, -0.92] },
  { id: 'vxc', text: 'Virtual Cross Connect', at: [0, TRAY_Y + 0.03, -1.1] },
  { id: 'consult-rack', text: 'Techne fabric rack', at: [0, CAB_H + 0.04, CAB_D / 2 + 0.02] },
  ...DESTINATIONS.map((place) => {
    const [x, z] = mapPoint(place.lon, place.lat);
    return { id: `ip-${place.name}`, text: place.name, at: [x, 0.04, z] as [number, number, number] };
  }),
  { id: 'design', text: 'Full network design and audit', at: [0, ROUTER_Y + 0.1, -0.9] },
];

const FOCUS: Record<FabricFocus, FocusSpec> = {
  overview: {
    azimuth: 31,
    elevation: 29,
    cabinets: 'all',
    fibres: 'all',
    slabs: 'all',
    labels: ['customers', 'partners', 'cdn', 'carriers', 'virtual', 'fabric'],
    target: [0, 1.15, 0],
    zoom: 1,
  },
  colocation: {
    azimuth: 22,
    elevation: 25,
    cabinets: ['cu0', 'cu1', 'cu2', 'cu3'],
    fibres: {},
    slabs: [],
    labels: ['your-rack'],
    target: [-2.3, 1.0, 1.5],
    zoom: 1.45,
  },
  'ip-transit': {
    azimuth: 16,
    elevation: 50,
    cabinets: ['fa0', 'fa1'],
    fibres: {},
    slabs: [],
    labels: ['fabric', ...DESTINATIONS.map((place) => `ip-${place.name}`)],
    target: [-3.4, 0.2, -2.0],
    zoom: 0.95,
  },
  content: {
    azimuth: 18,
    elevation: 31,
    cabinets: ['cd0', 'cd1', 'cd2', 'fa0', 'fa1', 'cu1'],
    fibres: { cd0: 1, cd1: 1, cd2: 1, cu1: -1 },
    slabs: [],
    labels: ['cdn', 'fabric', 'your-rack'],
    target: [-2, 1.1, 0],
    zoom: 1.24,
  },
  'metro-e': {
    azimuth: 24,
    elevation: 30,
    cabinets: ['nb2'],
    fibres: {},
    slabs: [],
    labels: ['metro-a', 'metro-b', 'metro-facility-a', 'metro-facility-b'],
    target: [7.5, 1.1, 1.2],
    zoom: 1.25,
  },
  vxc: {
    azimuth: 33,
    elevation: 35,
    cabinets: ['cu3', 'pa1', 'fa0', 'fa1'],
    fibres: {},
    slabs: [],
    labels: ['your-port', 'partner-port', 'vxc'],
    target: [-0.2, 1.9, 0],
    zoom: 1.5,
  },
  vswitch: {
    azimuth: 26,
    elevation: 37,
    cabinets: ['cu0', 'cu2', 'pa0', 'pa2', 'fa0', 'fa1'],
    fibres: {},
    slabs: ['vswitch'],
    labels: ['vswitch', 'fabric'],
    target: [-0.9, 2.4, 0],
    zoom: 1.55,
  },
  vrouter: {
    azimuth: 41,
    elevation: 34,
    cabinets: ['cu1', 'ed0', 'pa1', 'fa0', 'fa1'],
    fibres: {},
    slabs: ['vrouter'],
    labels: ['vrouter', 'carriers', 'fabric'],
    target: [0, 2.5, 0],
    zoom: 1.38,
  },
  consulting: {
    azimuth: 24,
    elevation: 26,
    cabinets: ['fa0', 'fa1'],
    fibres: {},
    slabs: [],
    labels: ['consult-rack'],
    target: [0.5, 0.8, 1.0],
    zoom: 2.7,
  },
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/** Small deterministic generator, so the model looks identical on every load. */
const seeded = (start: number) => {
  let seed = start;
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Builds a right-angled cable route with small radiused corners. */
const routedPath = (points: THREE.Vector3[], radius = 0.13) => {
  const path = new THREE.CurvePath<THREE.Vector3>();
  let cursor = points[0].clone();
  for (let i = 1; i < points.length - 1; i++) {
    const cur = points[i];
    const toPrev = points[i - 1].clone().sub(cur);
    const toNext = points[i + 1].clone().sub(cur);
    const r = Math.min(radius, toPrev.length() / 2, toNext.length() / 2);
    if (r < 1e-3) continue;
    const a = cur.clone().add(toPrev.normalize().multiplyScalar(r));
    const b = cur.clone().add(toNext.normalize().multiplyScalar(r));
    if (cursor.distanceTo(a) > 1e-3) path.add(new THREE.LineCurve3(cursor, a));
    path.add(new THREE.QuadraticBezierCurve3(a, cur.clone(), b));
    cursor = b;
  }
  path.add(new THREE.LineCurve3(cursor, points[points.length - 1].clone()));
  return path;
};

export interface FabricStageOptions {
  focus: FabricFocus;
  showLabels: boolean;
  /** 'focus' moves the camera to the service. 'full' keeps the whole hall in frame. */
  framing?: 'focus' | 'full';
  /** Makes the model travel between two frames as the page scrolls. */
  journey?: FabricJourneyLayout & { progress: number };
  onReady?: () => void;
}

export class FabricStage {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -60, 80);
  private model = new THREE.Group();
  private cabinets: Cabinet[] = [];
  private fibres: Fibre[] = [];
  private slabs: Slab[] = [];
  private trayMaterial = new THREE.MeshStandardMaterial({ color: COLORS.tray, roughness: 0.7 });
  /** Everything built from the tray material, with how each part grows during the build. */
  private trayParts: { mesh: THREE.Mesh; kind: 'x' | 'z' | 'hanger' | 'cap' }[] = [];
  private riserMaterial = new THREE.LineBasicMaterial({ color: COLORS.slab, transparent: true, opacity: 0.55 });
  private blueprintLine = new THREE.LineBasicMaterial({
    color: COLORS.ghostLine,
    transparent: true,
    opacity: 0,
  });
  private pulses!: THREE.InstancedMesh;
  private pulsesPerFibre = 3;
  private labelEls = new Map<string, HTMLDivElement>();
  private labelLayer: HTMLDivElement;
  private showLabels: boolean;
  private framing: 'focus' | 'full';
  private focus: FabricFocus;
  private requestedFocus: FabricFocus;
  private journey: FabricJourneyLayout | null = null;
  private journeyProgress = 0;
  private journeyGoal = 0;
  private journeySwing = 0;
  private appliedSwing = 0;
  private shadowSwing = 0;
  private labelsTravelling = false;
  private lastClip = '';
  private cablingGroup = new THREE.Group();
  private virtualGroup = new THREE.Group();
  private viewRect: FabricFrame = { x: 0, y: 0, w: 1, h: 1 };
  private pointerSource: EventTarget;
  private azimuth = 0;
  private azimuthGoal = 0;
  private elevation = 0;
  private elevationGoal = 0;
  private blueprint = 0;
  private reduced: boolean;
  private time = 0;
  private buildTime = 0;
  private consultScene: ConsultScene | null = null;
  private consultOn = false;
  private consultTime = 0;
  private switchFlow: SwitchFlow | null = null;
  private switchFlowOn = false;
  private switchFlowTime = 0;
  private contentLight: { paths: LightPath[]; core: THREE.InstancedMesh; glow: THREE.InstancedMesh; sprites: THREE.Sprite[] } | null = null;
  private contentTextures: (THREE.Texture | undefined)[] = [];
  private contentOn = false;
  private contentTime = 0;
  private contentShown = false;
  private metroScene: MetroScene | null = null;
  private metroOn = false;
  private metroTime = 0;
  private metroShown = false;
  private flowTextures: THREE.Texture[] = [];
  private vxcFlow: VxcFlow | null = null;
  private vxcOn = false;
  private vxcTime = 0;
  private routerFlow: RouterFlow | null = null;
  private routerOn = false;
  private routerTime = 0;
  private floorGroup = new THREE.Group();
  private ipScene: IpScene | null = null;
  private ipOn = false;
  private ipTime = 0;
  /** How far the hall has sunk away to show the map. 0 is the hall in place and 1 is gone. */
  private ipHide = 0;
  /** How far the front-row cabinets have sunk into the floor, to clear the view. 0 is in place and 1 is gone. */
  private consultHide = 0;
  /** The equipment-install animation, while it plays. */
  private install: { time: number; end: number; orders: number[][] } | null = null;
  private introDone = false;
  private building = true;
  private layerFade = 0;
  private layerDrop = 0;
  private lastFrame = 0;
  private raf = 0;
  private running = false;
  private inView = true;
  private settleUntil = 0;
  private ledClock = 0;
  private ledRandom = seeded(77);
  private target = new THREE.Vector3();
  private targetGoal = new THREE.Vector3();
  private zoom = 1;
  private zoomGoal = 1;
  private pointer = new THREE.Vector2();
  private pointerGoal = new THREE.Vector2();
  private size = { w: 1, h: 1 };
  private readonly scratch = new THREE.Vector3();
  private readonly matrix = new THREE.Matrix4();
  private readonly quaternion = new THREE.Quaternion();
  private readonly scale = new THREE.Vector3();
  private readonly color = new THREE.Color();
  private ro: ResizeObserver;
  private io: IntersectionObserver;
  private onReady?: () => void;
  private readySent = false;

  constructor(container: HTMLElement, options: FabricStageOptions) {
    this.container = container;
    this.requestedFocus = options.focus;
    if (options.journey) {
      this.journey = { hero: options.journey.hero, panel: options.journey.panel };
      this.journeyProgress = this.journeyGoal = clamp01(options.journey.progress);
    }
    this.focus = this.effectiveFocus();
    this.pointerSource = options.journey ? window : container;
    this.showLabels = options.showLabels;
    this.framing = options.framing ?? 'focus';
    this.onReady = options.onReady;
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    container.appendChild(this.renderer.domElement);

    this.labelLayer = document.createElement('div');
    this.labelLayer.setAttribute('aria-hidden', 'true');
    this.labelLayer.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none;';
    container.appendChild(this.labelLayer);

    this.model.add(this.cablingGroup, this.virtualGroup);
    this.buildLights();
    this.buildFloor();
    this.buildHall();
    this.buildVirtualLayers();
    this.buildPulses();
    this.buildLabels();
    this.buildConsult();
    this.buildSwitchFlow();
    this.buildContentLight();
    this.buildMetro();
    this.buildIpMap();
    this.buildVxcFlow();
    this.buildRouterFlow();
    this.scene.add(this.model);

    this.applyFocus(true);
    this.target.copy(this.targetGoal);
    this.zoom = this.zoomGoal;
    this.azimuth = this.azimuthGoal;
    this.elevation = this.elevationGoal;

    this.resize();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(container);

    this.io = new IntersectionObserver(
      ([entry]) => {
        this.inView = entry.isIntersecting;
        this.syncLoop();
      },
      { rootMargin: '80px' },
    );
    this.io.observe(container);

    document.addEventListener('visibilitychange', this.syncLoop);
    this.pointerSource.addEventListener('pointermove', this.handlePointer as EventListener);
    this.pointerSource.addEventListener('pointerleave', this.handlePointerLeave);

    this.applyBuild(0);
    this.settleUntil = performance.now() + 2500;
    this.syncLoop();
  }

  setFocus(focus: FabricFocus) {
    this.requestedFocus = focus;
    this.syncFocus();
  }

  setJourneyLayout(layout: FabricJourneyLayout) {
    this.journey = layout;
    this.applyJourneyFrame();
  }

  setJourneyProgress(progress: number) {
    this.journeyGoal = clamp01(progress);
    this.settleUntil = performance.now() + 1400;
  }

  /** The whole hall shows while the model travels. The selected service takes over once it lands. */
  private effectiveFocus(): FabricFocus {
    return this.journey && this.journeyProgress < 0.97 ? 'overview' : this.requestedFocus;
  }

  private syncFocus() {
    const focus = this.effectiveFocus();
    if (focus === this.focus) return;
    this.focus = focus;
    this.applyFocus(false);
    if (focus === 'colocation') this.startInstall();
    else this.endInstall();
  }

  setShowLabels(show: boolean) {
    this.showLabels = show;
    this.applyLabelVisibility();
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    this.running = false;
    this.ro.disconnect();
    this.io.disconnect();
    document.removeEventListener('visibilitychange', this.syncLoop);
    this.pointerSource.removeEventListener('pointermove', this.handlePointer as EventListener);
    this.pointerSource.removeEventListener('pointerleave', this.handlePointerLeave);
    this.scene.traverse((object) => {
      const item = object as THREE.Mesh;
      item.geometry?.dispose?.();
      const material = item.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(material)) material.forEach((m) => m.dispose());
      else material?.dispose?.();
    });
    this.contentTextures.forEach((texture) => texture?.dispose());
    this.flowTextures.forEach((texture) => texture.dispose());
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
    this.labelLayer.remove();
  }

  private buildLights() {
    this.scene.add(new THREE.HemisphereLight('#ffffff', '#aebbc4', 1.75));

    const sun = new THREE.DirectionalLight('#ffffff', 1.9);
    sun.position.set(-5, 13, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.radius = 5;
    sun.shadow.bias = -0.0006;
    const c = sun.shadow.camera;
    c.left = -11;
    c.right = 11;
    c.top = 11;
    c.bottom = -11;
    c.near = 1;
    c.far = 34;
    this.scene.add(sun);

    const fill = new THREE.DirectionalLight('#dfeef2', 0.45);
    fill.position.set(8, 4, 8);
    this.scene.add(fill);
  }

  private buildFloor() {
    const width = 12.4;
    const depth = 7.8;
    const height = 0.26;

    const side = () => new THREE.MeshStandardMaterial({ color: COLORS.slabSide, roughness: 0.9 });
    const top = new THREE.MeshStandardMaterial({ color: COLORS.slabTop, roughness: 0.95 });
    const slab = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), [
      side(),
      side(),
      top,
      side(),
      side(),
      side(),
    ]);
    slab.position.y = -height / 2;
    slab.receiveShadow = true;
    this.model.add(this.floorGroup);
    this.floorGroup.add(slab);

    // Raised floor tiles.
    const points: number[] = [];
    for (let x = -width / 2; x <= width / 2 + 1e-3; x += 1) {
      points.push(x, 0.002, -depth / 2, x, 0.002, depth / 2);
    }
    for (let z = -depth / 2; z <= depth / 2 + 1e-3; z += 1) {
      points.push(-width / 2, 0.002, z, width / 2, 0.002, z);
    }
    const gridGeometry = new THREE.BufferGeometry();
    gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    this.floorGroup.add(new THREE.LineSegments(gridGeometry, new THREE.LineBasicMaterial({ color: COLORS.grid })));

    // Soft ground shadow beneath the whole model.
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(128, 128, 30, 128, 128, 128);
      gradient.addColorStop(0, 'rgba(11,37,54,0.28)');
      gradient.addColorStop(0.65, 'rgba(11,37,54,0.1)');
      gradient.addColorStop(1, 'rgba(11,37,54,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);
    }
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(width * 1.34, depth * 1.42),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, depthWrite: false }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.62;
    this.floorGroup.add(ground);
  }

  private buildHall() {
    const random = seeded(2047);
    const unitGeometry = new THREE.BoxGeometry(1, 1, 1);
    const ledGeometry = new THREE.BoxGeometry(0.03, 0.022, 0.006);
    const bodyGeometry = new THREE.BoxGeometry(CAB_W, CAB_H, CAB_D);
    const doorGeometry = new THREE.BoxGeometry(CAB_W - 0.05, CAB_H - 0.08, 0.012);
    const edgeGeometry = new THREE.EdgesGeometry(bodyGeometry);

    const addCabinet = (id: string, x: number, z: number, style: CabinetStyle) => {
      const palette = STYLE_COLORS[style];
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      const shell = new THREE.Group();
      group.add(shell);

      const body = new THREE.MeshStandardMaterial({ color: palette.body, roughness: 0.62, metalness: 0.08 });
      const door = new THREE.MeshStandardMaterial({ color: palette.door, roughness: 0.58, metalness: 0.08 });
      const unit = new THREE.MeshStandardMaterial({ color: palette.unit, roughness: 0.55 });

      const bodyMesh = new THREE.Mesh(bodyGeometry, body);
      bodyMesh.position.y = CAB_H / 2;
      bodyMesh.castShadow = true;
      bodyMesh.receiveShadow = true;
      shell.add(bodyMesh);

      const doorMesh = new THREE.Mesh(doorGeometry, door);
      doorMesh.position.set(0, CAB_H / 2, CAB_D / 2 + 0.006);
      shell.add(doorMesh);

      const edgeLines = new THREE.LineSegments(edgeGeometry, this.blueprintLine);
      edgeLines.position.y = CAB_H / 2;
      shell.add(edgeLines);

      // Rack-mounted equipment on the cabinet face.
      const slots: { y: number; h: number }[] = [];
      let cursor = 0.12;
      while (cursor < CAB_H - 0.2) {
        const h = random() < 0.28 ? 0.15 : 0.075;
        if (cursor + h > CAB_H - 0.12) break;
        if (random() > 0.14) slots.push({ y: cursor + h / 2, h });
        cursor += h + 0.02;
      }
      const units = new THREE.InstancedMesh(unitGeometry, unit, slots.length);
      const leds = new THREE.InstancedMesh(
        ledGeometry,
        new THREE.MeshBasicMaterial({ color: '#ffffff' }),
        slots.length * 3,
      );
      let ledIndex = 0;
      slots.forEach((slot, i) => {
        this.matrix.compose(
          this.scratch.set(0, slot.y, CAB_D / 2 + 0.018),
          this.quaternion.identity(),
          this.scale.set(CAB_W - 0.12, slot.h, 0.02),
        );
        units.setMatrixAt(i, this.matrix);
        for (let k = 0; k < 3; k++) {
          this.matrix.makeTranslation(-CAB_W / 2 + 0.11 + k * 0.05, slot.y, CAB_D / 2 + 0.031);
          leds.setMatrixAt(ledIndex, this.matrix);
          leds.setColorAt(ledIndex, this.color.set(this.pickLed(random)));
          ledIndex++;
        }
      });
      units.instanceMatrix.needsUpdate = true;
      leds.instanceMatrix.needsUpdate = true;
      if (leds.instanceColor) leds.instanceColor.needsUpdate = true;
      units.frustumCulled = false;
      leds.frustumCulled = false;
      group.add(units, leds);

      this.model.add(group);
      this.cabinets.push({ id, group, shell, units, slots, start: 0, x, z, body, door, unit, leds, style, tone: 'normal' });
    };

    // Back row, seen across the hall: CDN caches, partner networks, edge routers.
    [-5, -4.28, -3.56].forEach((x, i) => addCabinet(`cd${i}`, x, BACK_Z, 'cdn'));
    [1.1, 1.82, 2.54].forEach((x, i) => addCabinet(`pa${i}`, x, BACK_Z, 'partner'));
    [3.5, 4.22].forEach((x, i) => addCabinet(`ed${i}`, x, BACK_Z, 'edge'));

    // Front row: the customer's own cabinets, plus neighbours on the same floor.
    [-4.28, -3.56, -2.84, -2.12].forEach((x, i) => addCabinet(`cu${i}`, x, FRONT_Z, 'customer'));
    [2.6, 3.32, 4.04].forEach((x, i) => addCabinet(`nb${i}`, x, FRONT_Z, 'partner'));

    // Core fabric at the center of the hall.
    [-CAB_STEP / 2, CAB_STEP / 2].forEach((x, i) => addCabinet(`fa${i}`, x, 0, 'fabric'));

    this.buildTrays();
    this.buildFibres();

    // The build spreads outward from the core, so each cabinet starts a little after the last.
    const radius = Math.max(...this.cabinets.map((cabinet) => Math.hypot(cabinet.x, cabinet.z)));
    for (const cabinet of this.cabinets) {
      cabinet.start = BUILD.lead + (Math.hypot(cabinet.x, cabinet.z) / radius) * BUILD.sweep;
    }
  }

  private pickLed(random: () => number) {
    if (random() < 0.3) return COLORS.ledOff;
    return COLORS.ledOn[Math.floor(random() * COLORS.ledOn.length)];
  }

  private buildTrays() {
    const addTray = (x1: number, z1: number, x2: number, z2: number) => {
      const length = Math.hypot(x2 - x1, z2 - z1);
      const alongX = Math.abs(x2 - x1) > Math.abs(z2 - z1);
      const geometry = alongX
        ? new THREE.BoxGeometry(length, 0.03, 0.42)
        : new THREE.BoxGeometry(0.42, 0.03, length);
      const tray = new THREE.Mesh(geometry, this.trayMaterial);
      tray.position.set((x1 + x2) / 2, TRAY_Y - 0.04, (z1 + z2) / 2);
      tray.castShadow = true;
      this.cablingGroup.add(tray);
      this.trayParts.push({ mesh: tray, kind: alongX ? 'x' : 'z' });
    };
    addTray(-5.5, BACK_Z, 5.75, BACK_Z);
    addTray(-4.8, FRONT_Z, 4.5, FRONT_Z);
    addTray(0, BACK_Z, 0, FRONT_Z);

    // Hangers that carry the trays down to the floor at the row ends.
    const rod = new THREE.BoxGeometry(0.04, TRAY_Y, 0.04);
    [
      [-5.5, BACK_Z - 0.18],
      [-5.5, BACK_Z + 0.18],
      [5.75, BACK_Z - 0.18],
      [5.75, BACK_Z + 0.18],
      [-4.8, FRONT_Z - 0.18],
      [-4.8, FRONT_Z + 0.18],
      [4.5, FRONT_Z - 0.18],
      [4.5, FRONT_Z + 0.18],
    ].forEach(([x, z]) => {
      const mesh = new THREE.Mesh(rod, this.trayMaterial);
      mesh.position.set(x, TRAY_Y / 2 - 0.02, z);
      mesh.castShadow = true;
      this.cablingGroup.add(mesh);
      this.trayParts.push({ mesh, kind: 'hanger' });
    });
  }

  private buildFibres() {
    const y = TRAY_Y + 0.01;
    const top = CAB_H + 0.01;

    /** Cabinet top, up to the row tray, along it to the spine, then into the fabric. */
    const cabinetRoute = (x: number, rowZ: number, lane: number, fabricX: number) => {
      const spineX = lane * 0.035;
      const side = Math.sign(rowZ);
      const laneZ = rowZ - side * (0.04 + Math.abs(lane) * 0.03);
      const dropZ = side * (0.08 + Math.abs(lane) * 0.03);
      const end = fabricX + lane * 0.02;
      return [
        new THREE.Vector3(x, top, rowZ),
        new THREE.Vector3(x, y, rowZ),
        new THREE.Vector3(x, y, laneZ),
        new THREE.Vector3(spineX, y, laneZ),
        new THREE.Vector3(spineX, y, dropZ),
        new THREE.Vector3(end, y, dropZ),
        new THREE.Vector3(end, top, dropZ),
      ];
    };

    const add = (id: string, points: THREE.Vector3[]) => {
      const path = routedPath(points);
      const length = path.getLength();
      const material = new THREE.MeshBasicMaterial({ color: COLORS.fibre });
      const geometry = new THREE.TubeGeometry(path, Math.ceil(length * 12), 0.024, 5, false);
      const mesh = new THREE.Mesh(geometry, material);
      this.cablingGroup.add(mesh);
      this.fibres.push({
        id,
        mesh,
        material,
        samples: path.getSpacedPoints(Math.ceil(length * 10)),
        length,
        indexCount: geometry.index ? geometry.index.count : 0,
        tone: 'normal',
        flow: 1,
        level: 0,
      });
    };

    // Customer row.
    [-4.28, -3.56, -2.84, -2.12].forEach((x, i) => add(`cu${i}`, cabinetRoute(x, FRONT_Z, i - 1.5, -CAB_STEP / 2)));
    // CDN caches.
    [-5, -4.28, -3.56].forEach((x, i) => add(`cd${i}`, cabinetRoute(x, BACK_Z, i - 3.4, -CAB_STEP / 2)));
    // Partners.
    [1.1, 1.82, 2.54].forEach((x, i) => add(`pa${i}`, cabinetRoute(x, BACK_Z, i + 0.6, CAB_STEP / 2)));
    // Edge routers to the fabric.
    [3.5, 4.22].forEach((x, i) => add(`ed${i}`, cabinetRoute(x, BACK_Z, i + 3.6, CAB_STEP / 2)));

    // Upstream carriers down the riser and into the edge routers.
    [5.1, 5.42].forEach((riserX, i) => {
      const cabX = i === 0 ? 3.6 : 4.32;
      const laneZ = BACK_Z - 0.08 - i * 0.07;
      add(`up${i}`, [
        new THREE.Vector3(riserX, RISER_TOP, BACK_Z),
        new THREE.Vector3(riserX, y, BACK_Z),
        new THREE.Vector3(riserX, y, laneZ),
        new THREE.Vector3(cabX, y, laneZ),
        new THREE.Vector3(cabX, top, laneZ),
      ]);

      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.12, 20), this.trayMaterial);
      cap.position.set(riserX, RISER_TOP + 0.04, BACK_Z);
      cap.castShadow = true;
      this.cablingGroup.add(cap);
      this.trayParts.push({ mesh: cap, kind: 'cap' });
    });
  }

  private buildVirtualLayers() {
    const add = (id: Slab['id'], y: number) => {
      const face = new THREE.MeshStandardMaterial({
        color: COLORS.slab,
        transparent: true,
        opacity: 0.3,
        roughness: 0.3,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const edge = new THREE.LineBasicMaterial({ color: COLORS.slabEdge, transparent: true, opacity: 0.85 });
      const ports = new THREE.MeshBasicMaterial({ color: COLORS.slabEdge, transparent: true, opacity: 0.85 });

      const geometry = new THREE.BoxGeometry(3, 0.05, 1.9);
      const slab = new THREE.Mesh(geometry, face);
      slab.position.set(0, y, 0);
      slab.renderOrder = 2;
      this.virtualGroup.add(slab);

      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), edge);
      edges.position.copy(slab.position);
      edges.renderOrder = 3;
      this.virtualGroup.add(edges);

      // Port markers around the rim of the virtual device.
      const portGeometry = new THREE.BoxGeometry(0.13, 0.03, 0.08);
      const portMesh = new THREE.InstancedMesh(portGeometry, ports, 12);
      for (let i = 0; i < 6; i++) {
        const px = -1.2 + i * 0.48;
        this.matrix.makeTranslation(px, y + 0.04, 0.78);
        portMesh.setMatrixAt(i, this.matrix);
        this.matrix.makeTranslation(px, y + 0.04, -0.78);
        portMesh.setMatrixAt(i + 6, this.matrix);
      }
      portMesh.instanceMatrix.needsUpdate = true;
      portMesh.renderOrder = 3;
      this.virtualGroup.add(portMesh);

      this.slabs.push({ id, face, edge, ports, tone: 'normal', faceLevel: 0.3, lineLevel: 0.85 });
    };

    add('vswitch', SWITCH_Y);
    add('vrouter', ROUTER_Y);

    // Thin risers showing the virtual layers run on the physical fabric below.
    const risers: number[] = [];
    [
      [-1.3, -0.8],
      [1.3, -0.8],
      [-1.3, 0.8],
      [1.3, 0.8],
    ].forEach(([x, z]) => {
      risers.push(x, TRAY_Y, z, x, ROUTER_Y, z);
    });
    const riserGeometry = new THREE.BufferGeometry();
    riserGeometry.setAttribute('position', new THREE.Float32BufferAttribute(risers, 3));
    this.virtualGroup.add(
      new THREE.LineSegments(
        riserGeometry,
        this.riserMaterial,
      ),
    );
  }

  private buildPulses() {
    const geometry = new THREE.SphereGeometry(0.058, 10, 8);
    const material = new THREE.MeshBasicMaterial({ color: COLORS.pulse });
    this.pulses = new THREE.InstancedMesh(geometry, material, this.fibres.length * this.pulsesPerFibre);
    this.pulses.frustumCulled = false;
    this.cablingGroup.add(this.pulses);
  }

  private buildLabels() {
    for (const def of LABELS) {
      const el = document.createElement('div');
      el.className = def.side ? `fabric-label fabric-label--${def.side}` : 'fabric-label';
      el.style.opacity = '0';
      const tag = document.createElement('span');
      tag.className = 'fabric-label__tag';
      tag.textContent = def.text;
      el.appendChild(tag);
      this.labelLayer.appendChild(el);
      this.labelEls.set(def.id, el);
    }
  }

  private applyFocus(immediate: boolean) {
    const spec = FOCUS[this.focus];
    const blueprint = !!spec.blueprint;

    for (const cabinet of this.cabinets) {
      if (blueprint) cabinet.tone = 'ghost';
      else if (spec.cabinets === 'all') cabinet.tone = 'normal';
      else cabinet.tone = spec.cabinets.includes(cabinet.id) ? 'lit' : 'dim';
      cabinet.leds.visible = cabinet.tone !== 'dim' && cabinet.tone !== 'ghost';
    }

    for (const fibre of this.fibres) {
      if (spec.fibres === 'all') {
        fibre.tone = blueprint ? 'lit' : 'normal';
        fibre.flow = 1;
      } else if (fibre.id in spec.fibres) {
        fibre.tone = 'lit';
        fibre.flow = spec.fibres[fibre.id];
      } else {
        fibre.tone = 'dim';
        fibre.flow = 0;
      }
    }

    for (const slab of this.slabs) {
      if (spec.slabs === 'all') slab.tone = 'normal';
      else slab.tone = spec.slabs.includes(slab.id) ? 'lit' : 'dim';
    }

    const camera = this.framing === 'full' ? FOCUS.overview : spec;
    this.targetGoal.set(...camera.target);
    this.zoomGoal = camera.zoom;
    this.azimuthGoal = THREE.MathUtils.degToRad(camera.azimuth);
    this.elevationGoal = THREE.MathUtils.degToRad(camera.elevation);
    this.applyLabelVisibility();
    this.settleUntil = performance.now() + 1800;
    if (immediate) this.updateTones(1);
  }

  private applyLabelVisibility() {
    const spec = FOCUS[this.focus];
    const wholeHall = this.framing === 'full' || this.focus === 'overview' || this.focus === 'consulting';
    const fits = !wholeHall || this.viewRect.w >= 560;
    this.labelsTravelling = this.isTravelling();
    for (const [id, el] of this.labelEls) {
      const show = this.showLabels && fits && !this.building && !this.labelsTravelling && spec.labels.includes(id);
      el.style.opacity = show ? '1' : '0';
    }
  }

  /** Labels hide while the model moves, and return once it has settled at either end. */
  private isTravelling() {
    return !!this.journey && this.journeyProgress > 0.05 && this.journeyProgress < 0.97;
  }

  private updateTones(k: number) {
    const spec = FOCUS[this.focus];

    this.blueprint += ((spec.blueprint ? 1 : 0) - this.blueprint) * k;
    this.blueprintLine.opacity = this.blueprint;

    for (const cabinet of this.cabinets) {
      let palette = STYLE_COLORS[cabinet.style];
      // The fabric rack keeps its own colours, except in the consulting view, where it is the subject.
      if (cabinet.tone === 'lit' && (cabinet.style !== 'fabric' || this.focus === 'consulting' || this.focus === 'vswitch' || this.focus === 'content' || this.focus === 'ip-transit' || this.focus === 'vrouter')) palette = LIT_COLORS;
      if (cabinet.tone === 'dim') palette = DIM_COLORS;
      if (cabinet.tone === 'ghost') palette = GHOST_COLORS;
      cabinet.body.color.lerp(this.color.set(palette.body), k);
      cabinet.door.color.lerp(this.color.set(palette.door), k);
      cabinet.unit.color.lerp(this.color.set(palette.unit), k);
    }

    for (const fibre of this.fibres) {
      const goal = fibre.tone === 'lit' ? COLORS.fibreLit : fibre.tone === 'dim' ? COLORS.fibreDim : COLORS.fibre;
      fibre.material.color.lerp(this.color.set(goal), k);
      fibre.level += ((fibre.flow !== 0 ? 1 : 0) - fibre.level) * k;
    }

    for (const slab of this.slabs) {
      const faceOpacity = slab.tone === 'lit' ? 0.62 : slab.tone === 'dim' ? 0.08 : 0.3;
      const lineOpacity = slab.tone === 'dim' ? 0.2 : 0.9;
      slab.faceLevel += (faceOpacity - slab.faceLevel) * k;
      slab.lineLevel += (lineOpacity - slab.lineLevel) * k;
      slab.face.opacity = slab.faceLevel * this.layerFade;
      slab.edge.opacity = slab.lineLevel * this.layerFade;
      slab.ports.opacity = slab.lineLevel * this.layerFade;
    }
    this.riserMaterial.opacity = 0.55 * this.layerFade;

    const trayGoal = spec.cabinets === 'all' ? COLORS.tray : COLORS.trayDim;
    this.trayMaterial.color.lerp(this.color.set(trayGoal), k);
  }

  /** Lays the whole hall out as it looks `e` seconds into the build. A large `e` gives the finished hall. */
  private applyBuild(e: number) {
    for (const cabinet of this.cabinets) {
      const rise = clamp01((e - cabinet.start) / BUILD.rise);
      cabinet.shell.visible = rise > 0;
      cabinet.shell.scale.y = this.reduced ? 1 : Math.max(0.001, easeOut(rise));
      this.mountUnits(cabinet, e);
    }

    // Cable trays fade in, then the fiber draws itself along them.
    const trayProgress = clamp01((e - BUILD.traysAt) / BUILD.traysGrow);
    this.growTrays(this.reduced ? (trayProgress > 0 ? 1 : 0) : easeOut(trayProgress));
    for (const fibre of this.fibres) {
      const p = easeOut(clamp01((e - BUILD.fibresAt) / BUILD.fibresDraw));
      const count = Math.floor((fibre.indexCount * p) / 6) * 6;
      (fibre.mesh.geometry as THREE.BufferGeometry).setDrawRange(0, count);
    }

    // The virtual switch and router come in last and lower onto the fabric.
    const layers = clamp01((e - BUILD.layersAt) / BUILD.layersFade);
    this.layerFade = layers;
    this.layerDrop = this.reduced ? 0 : (1 - easeOut(layers)) * BUILD.layersDrop;
    this.applyLayerOffsets();
  }

  /** Trays extend along their length, hangers lower from the tray and riser caps swell. At 1 they are as modelled. */
  private growTrays(amount: number) {
    const k = Math.max(0.001, amount);
    for (const { mesh, kind } of this.trayParts) {
      mesh.visible = amount > 0.001;
      if (kind === 'x') mesh.scale.set(k, 1, 1);
      else if (kind === 'z') mesh.scale.set(1, 1, k);
      else if (kind === 'cap') mesh.scale.setScalar(k);
      else {
        // A hanger lowers from the tray, so its top stays put while it lengthens.
        mesh.scale.set(1, k, 1);
        mesh.position.y = TRAY_Y - 0.02 - (TRAY_Y * k) / 2;
      }
    }
  }

  /** Slides each piece of equipment onto the cabinet face, bottom to top, and lights it as it seats. */
  private mountUnits(
    cabinet: Cabinet,
    e: number,
    timing: MountTiming = { first: cabinet.start + BUILD.slotDelay, gap: BUILD.slotGap, slide: BUILD.slide, distance: BUILD.slideDistance },
  ) {
    const { slots, units, leds } = cabinet;
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      const hidden = cabinet.hole === i;
      const turn = timing.order ? timing.order[i] : i;
      const p = clamp01((e - timing.first - turn * timing.gap) / timing.slide);
      const carried = !!timing.carried;
      // A carried unit stays hidden until its turn, then appears outside the cabinet and travels in.
      const shown = hidden ? 0 : carried ? (p > 0 ? easeOut(clamp01(p * 10)) : 0) : this.reduced ? (p > 0 ? 1 : 0) : easeOut(clamp01(p * 5));
      const slide = carried ? (1 - easeInOut(p)) * timing.distance : this.reduced ? 0 : (1 - easeOut(p)) * timing.distance;
      this.matrix.compose(
        this.scratch.set(0, slot.y, UNIT_FRONT - (UNIT_D * shown) / 2 + slide),
        this.quaternion.identity(),
        this.scale.set((CAB_W - 0.12) * shown, slot.h * shown, UNIT_D * shown),
      );
      units.setMatrixAt(i, this.matrix);

      const lit = hidden ? 0 : carried ? shown : this.reduced ? (p > 0.7 ? 1 : 0) : clamp01((p - 0.7) / 0.3);
      for (let k = 0; k < 3; k++) {
        this.matrix.compose(
          this.scratch.set(-CAB_W / 2 + 0.11 + k * 0.05, slot.y, CAB_D / 2 + 0.031 + slide),
          this.quaternion.identity(),
          this.scale.set(lit, lit, lit),
        );
        leds.setMatrixAt(i * 3 + k, this.matrix);
      }
    }
    units.instanceMatrix.needsUpdate = true;
    leds.instanceMatrix.needsUpdate = true;
  }

  /** Vertical offsets for the layers, from the scroll journey and from the build. */
  private applyLayerOffsets() {
    const swing = this.reduced ? 0 : this.journeySwing;
    this.virtualGroup.position.y = swing * 0.7 + this.layerDrop;
    this.cablingGroup.position.y = swing * 0.25;
  }

  private finishIntro() {
    this.introDone = true;
    this.building = false;
    this.applyBuild(BUILD.end + 10);
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.shadowMap.needsUpdate = true;
    this.settleUntil = performance.now() + 500;
    this.applyLabelVisibility();
  }

  /**
   * Advances the build by the time since the last frame. A long stall, such as the first frame
   * compiling its shaders, is capped, so the opening of the build is never skipped.
   */
  private updateIntro(elapsed: number, now: number) {
    if (this.introDone) return;
    this.buildTime += elapsed * (this.reduced ? BUILD.reducedSpeed : 1);
    this.applyBuild(this.buildTime);
    // Keep drawing while the build plays, even when reduced motion would otherwise hold the frame.
    this.settleUntil = now + 400;
    if (this.buildTime >= BUILD.end) this.finishIntro();
  }

  private installCabinets() {
    const ids = FOCUS.colocation.cabinets;
    return Array.isArray(ids) ? this.cabinets.filter((cabinet) => ids.includes(cabinet.id)) : [];
  }

  private installTiming(index: number): MountTiming {
    return {
      first: INSTALL.first + index * INSTALL.stagger,
      gap: INSTALL.gap,
      slide: INSTALL.slide,
      distance: INSTALL.distance,
      carried: true,
      order: this.install?.orders[index],
    };
  }

  /** Empties the customer cabinets, then lets the equipment slide back in. */
  private startInstall() {
    if (!this.introDone) return;
    const cabinets = this.installCabinets();
    // Each cabinet fills its slots in a new random order every time.
    const orders = cabinets.map((cabinet) => {
      const order = cabinet.slots.map((_, i) => i);
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      return order;
    });
    const end = Math.max(0, ...cabinets.map((cabinet, i) => INSTALL.first + i * INSTALL.stagger + cabinet.slots.length * INSTALL.gap + INSTALL.slide));
    this.install = { time: 0, end, orders };
    cabinets.forEach((cabinet, i) => this.mountUnits(cabinet, 0, this.installTiming(i)));
  }

  private endInstall() {
    if (!this.install) return;
    this.install = null;
    for (const cabinet of this.installCabinets()) this.mountUnits(cabinet, BUILD.end + 10);
  }

  private updateInstall(elapsed: number, now: number) {
    if (!this.install) return;
    this.install.time += elapsed;
    this.installCabinets().forEach((cabinet, i) => this.mountUnits(cabinet, this.install?.time ?? 0, this.installTiming(i)));
    // Keep drawing while the equipment goes in.
    this.settleUntil = now + 400;
    if (this.install.time >= this.install.end) this.endInstall();
  }

  /** The people, the table and the server for the Network Consulting view. Hidden until that view opens. */
  private buildConsult() {
    const cabinet = this.cabinets.find((item) => item.id === 'fa0');
    if (!cabinet || !cabinet.slots.length) return;

    const group = new THREE.Group();
    group.visible = false;
    this.model.add(group);

    const box = new THREE.BoxGeometry(1, 1, 1);
    const ball = new THREE.SphereGeometry(1, 20, 14);
    const disc = new THREE.CircleGeometry(1, 28);
    const material = (color: string, roughness = 0.8) => new THREE.MeshStandardMaterial({ color, roughness });
    const part = (
      parent: THREE.Object3D,
      geometry: THREE.BufferGeometry,
      mat: THREE.Material,
      size: [number, number, number],
      at: [number, number, number],
    ) => {
      const mesh = new THREE.Mesh(geometry, mat);
      mesh.scale.set(...size);
      mesh.position.set(...at);
      parent.add(mesh);
      return mesh;
    };
    const shadowMaterial = new THREE.MeshBasicMaterial({ color: '#0b2536', transparent: true, opacity: 0.14, depthWrite: false });
    const blob = (parent: THREE.Object3D, size: [number, number], at: [number, number]) => {
      const mesh = part(parent, disc, shadowMaterial, [size[0], size[1], 1], [at[0], 0.012, at[1]]);
      mesh.rotation.x = -Math.PI / 2;
    };

    // A chibi-style person: a round head with hair on a small boxy body. Facing +z, feet on the floor.
    const makePerson = (look: PersonLook, seated: boolean): Person => {
      const root = new THREE.Group();
      group.add(root);
      const top = material(look.top, 0.75);
      const trousers = material(look.legs, 0.8);
      const skin = material(look.skin, 0.6);
      const hair = material(look.hair, 0.55);
      const shoes = material('#16202a', 0.6);
      const hip = seated ? 0.38 : 0.4;
      const legs: THREE.Group[] = [];
      for (const sx of [-0.06, 0.06]) {
        if (seated) {
          part(root, box, trousers, [0.12, 0.12, 0.28], [sx, hip, 0.14]);
          part(root, box, trousers, [0.11, 0.3, 0.12], [sx, 0.2, 0.27]);
          part(root, box, shoes, [0.12, 0.05, 0.18], [sx, 0.025, 0.31]);
        } else {
          // The leg swings from the hip.
          const leg = new THREE.Group();
          leg.position.set(sx, hip, 0);
          part(leg, box, trousers, [0.12, 0.35, 0.14], [0, -0.175, 0]);
          part(leg, box, shoes, [0.12, 0.05, 0.19], [0, -0.375, 0.03]);
          root.add(leg);
          legs.push(leg);
        }
      }
      part(root, box, top, [0.34, 0.46, 0.21], [0, hip + 0.23, 0]);

      // Head: round, with hair and ears, and no face, sized to suit the body.
      const head = new THREE.Group();
      head.position.set(0, hip + 0.64, 0);
      part(head, ball, skin, [0.24, 0.216, 0.222], [0, 0, 0]);
      for (const sx of [-1, 1]) part(head, ball, skin, [0.03, 0.039, 0.024], [sx * 0.24, -0.012, 0]);
      const hairCap = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.56), hair);
      hairCap.scale.set(0.249, 0.231, 0.231);
      hairCap.rotation.x = -0.28;
      head.add(hairCap);
      head.scale.setScalar(0.82);
      root.add(head);
      blob(root, [0.3, 0.26], [0, 0]);

      // Arms are boxes stretched between the shoulder, elbow and hand.
      const arms = [0, 1].map(() => ({
        upper: part(group, box, top, [1, 1, 1], [0, 0, 0]),
        lower: part(group, box, top, [1, 1, 1], [0, 0, 0]),
        hand: part(group, box, skin, [1, 1, 1], [0, 0, 0]),
      }));
      return { root, legs, head, arms, shoulderY: hip + 0.38 };
    };

    const engineer = makePerson(PEOPLE.engineer, false);
    const analyst = makePerson(PEOPLE.analyst, true);

    // The analyst's chair moves with the analyst.
    const chair = material('#3d4e5c', 0.6);
    part(analyst.root, box, chair, [0.4, 0.05, 0.4], [0, 0.295, 0.04]);
    part(analyst.root, box, chair, [0.38, 0.4, 0.04], [0, 0.52, -0.16]);
    part(analyst.root, box, chair, [0.05, 0.27, 0.05], [0, 0.135, 0.04]);
    part(analyst.root, box, chair, [0.36, 0.03, 0.05], [0, 0.015, 0.04]);
    part(analyst.root, box, chair, [0.05, 0.03, 0.36], [0, 0.015, 0.04]);

    // The table and the laptop.
    const tableTop = material('#c7d1d8', 0.6);
    const metal = material('#2b3a45', 0.5);
    part(group, box, tableTop, [0.62, 0.04, 1.2], [1.4, 0.6, 1.0]);
    for (const dx of [-0.27, 0.27]) {
      for (const dz of [-0.54, 0.54]) part(group, box, metal, [0.04, 0.58, 0.04], [1.4 + dx, 0.29, 1.0 + dz]);
    }
    part(group, box, metal, [0.24, 0.018, 0.34], [1.47, 0.629, 1.0]);
    const screen = new THREE.Group();
    screen.position.set(1.36, 0.638, 1.0);
    screen.rotation.z = 0.28;
    part(screen, box, metal, [0.012, 0.22, 0.34], [0, 0.11, 0]);
    part(screen, box, new THREE.MeshBasicMaterial({ color: '#9fe6e8' }), [0.004, 0.19, 0.3], [0.007, 0.11, 0]);
    group.add(screen);
    blob(group, [0.55, 0.62], [1.7, 1.0]);

    // The server the engineer carries. It uses the cabinet's own equipment colour.
    let slot = 0;
    cabinet.slots.forEach((candidate, i) => {
      if (Math.abs(candidate.y - 0.8) < Math.abs(cabinet.slots[slot].y - 0.8)) slot = i;
    });
    const { y: slotY, h: slotH } = cabinet.slots[slot];
    const server = new THREE.Group();
    part(server, box, cabinet.unit, [CAB_W - 0.12, slotH, UNIT_D], [0, 0, 0]);
    const ledGeometry = new THREE.BoxGeometry(0.03, 0.022, 0.006);
    ['#35d0c4', '#7fe08a', '#f2b84b'].forEach((color, k) => {
      part(server, ledGeometry, new THREE.MeshBasicMaterial({ color }), [1, 1, 1], [-CAB_W / 2 + 0.11 + k * 0.05, 0, UNIT_D / 2 + 0.003]);
    });
    group.add(server);

    this.consultScene = { group, cabinet, slot, slotY, server, engineer, analyst };
  }

  /** Stretches a box between two points. */
  private aimLimb(mesh: THREE.Mesh, from: THREE.Vector3, to: THREE.Vector3, thickness: number) {
    AIM.subVectors(to, from);
    const length = AIM.length();
    mesh.visible = thickness > 0.002 && length > 0.001;
    if (!mesh.visible) return;
    mesh.position.copy(from).addScaledVector(AIM, 0.5);
    mesh.scale.set(thickness, length, thickness);
    mesh.quaternion.setFromUnitVectors(UP, AIM.normalize());
  }

  /** Bends an arm from the person's shoulder to a hand position, with the elbow dropped and pushed out. */
  private poseArm(person: Person, index: number, hand: THREE.Vector3, pop: number) {
    const arm = person.arms[index];
    const side = index === 0 ? -1 : 1;
    const yaw = person.root.rotation.y;
    const { x, z } = person.root.position;
    SHOULDER.set(x + side * 0.17 * Math.cos(yaw), person.shoulderY * pop, z - side * 0.17 * Math.sin(yaw));
    ELBOW.copy(SHOULDER).add(hand).multiplyScalar(0.5);
    ELBOW.y -= 0.07;
    ELBOW.x += side * 0.05 * Math.cos(yaw);
    ELBOW.z -= side * 0.05 * Math.sin(yaw);
    this.aimLimb(arm.upper, SHOULDER, ELBOW, 0.1 * pop);
    this.aimLimb(arm.lower, ELBOW, hand, 0.09 * pop);
    arm.hand.visible = pop > 0.02;
    arm.hand.position.copy(hand);
    arm.hand.scale.setScalar(Math.max(0.001, 0.095 * pop));
  }

  /** The front-row cabinets sink into the floor while the consulting view is open, so they never block the people. */
  private updateConsultClearing(on: boolean, elapsed: number, now: number) {
    const goal = on ? 1 : 0;
    if (this.consultHide === goal) return;
    const step = elapsed * 2.2;
    this.consultHide = goal > this.consultHide ? Math.min(goal, this.consultHide + step) : Math.max(goal, this.consultHide - step);
    this.applyHallClearing();
    this.settleUntil = now + 400;
    // The shadows are drawn once, so draw them again when the cabinets have moved.
    if (this.consultHide === goal) this.renderer.shadowMap.needsUpdate = true;
  }

  /** The whole hall sinks into the floor while the IP Transit view is open, except the fabric rack. */
  private updateIpClearing(on: boolean, elapsed: number, now: number) {
    const goal = on ? 1 : 0;
    if (this.ipHide === goal) return;
    const step = elapsed * 1.6;
    this.ipHide = goal > this.ipHide ? Math.min(goal, this.ipHide + step) : Math.max(goal, this.ipHide - step);
    this.applyHallClearing();
    this.settleUntil = now + 400;
    if (this.ipHide === goal) this.renderer.shadowMap.needsUpdate = true;
  }

  private applyHallClearing() {
    const front = Math.max(0.001, 1 - easeInOut(this.consultHide));
    const rest = Math.max(0.001, 1 - easeInOut(this.ipHide));
    for (const cabinet of this.cabinets) {
      let scale = 1;
      if (/^(cu|nb)/.test(cabinet.id)) scale = Math.min(scale, front);
      if (!cabinet.id.startsWith('fa')) scale = Math.min(scale, rest);
      cabinet.group.scale.setScalar(scale);
      cabinet.group.visible = scale > 0.02;
    }
    for (const part of [this.floorGroup, this.cablingGroup, this.virtualGroup]) {
      part.scale.y = rest;
      part.visible = rest > 0.02;
    }
  }

  private updateConsult(elapsed: number, now: number) {
    const scene = this.consultScene;
    const on = !!scene && this.focus === 'consulting' && this.introDone;
    if (on !== this.consultOn) {
      this.consultOn = on;
      this.consultTime = 0;
      if (scene) {
        scene.group.visible = on;
        // The slot the server goes into stays empty while the engineer carries the server.
        if (on) scene.cabinet.hole = scene.slot;
        else if (scene.cabinet.hole === scene.slot) scene.cabinet.hole = undefined;
        this.mountUnits(scene.cabinet, BUILD.end + 10);
      }
    }
    this.updateConsultClearing(on, elapsed, now);
    if (!scene || !on) return;

    this.consultTime += elapsed;
    const t = this.consultTime;
    const { engineer, analyst, server, cabinet } = scene;
    const popEngineer = easeOut(clamp01((t - CONSULT.engineerIn) / CONSULT.appear));
    const popAnalyst = easeOut(clamp01((t - CONSULT.analystIn) / CONSULT.appear));
    const motion = this.reduced ? 0 : 1;

    // How far the server is from the rack: held out, pushed in, left there, then pulled out again.
    const cycle = CONSULT.hold + CONSULT.push + CONSULT.seated + CONSULT.pull;
    const elapsedInstall = t - CONSULT.start;
    const u = elapsedInstall < 0 ? 0 : this.reduced ? Math.min(elapsedInstall, CONSULT.hold + CONSULT.push + CONSULT.seated) : elapsedInstall % cycle;
    let distance = CONSULT.distance;
    let walking = 0;
    if (u > CONSULT.hold && u <= CONSULT.hold + CONSULT.push) {
      distance = CONSULT.distance * (1 - easeInOut((u - CONSULT.hold) / CONSULT.push));
      walking = 1;
    } else if (u > CONSULT.hold + CONSULT.push && u <= CONSULT.hold + CONSULT.push + CONSULT.seated) {
      distance = 0;
    } else if (u > CONSULT.hold + CONSULT.push + CONSULT.seated) {
      distance = CONSULT.distance * easeInOut((u - CONSULT.hold - CONSULT.push - CONSULT.seated) / CONSULT.pull);
      walking = 1;
    }

    const serverX = cabinet.x;
    const serverZ = UNIT_FRONT - UNIT_D / 2 + distance;
    server.position.set(serverX, scene.slotY, serverZ);
    server.scale.setScalar(Math.max(0.001, popEngineer));
    server.visible = popEngineer > 0.01;

    // The engineer steps toward the rack as the server goes in, facing the server.
    const bodyX = serverX - (CAB_W - 0.12) / 2 - 0.32;
    const bodyZ = serverZ + UNIT_D / 2 + 0.4;
    engineer.root.position.set(bodyX, 0, bodyZ);
    const bodyYaw = Math.atan2(serverX - bodyX, serverZ - bodyZ);
    engineer.root.rotation.y = bodyYaw;
    // The body faces the rack, and the head turns back toward the viewer so the face shows.
    const turn = 0.35 - bodyYaw;
    engineer.head.rotation.y = THREE.MathUtils.clamp(Math.atan2(Math.sin(turn), Math.cos(turn)), -1.25, 1.25);
    engineer.root.scale.setScalar(Math.max(0.001, popEngineer));
    engineer.root.visible = popEngineer > 0.01;
    const swing = Math.sin(t * 6) * 0.35 * walking * motion;
    engineer.legs[0].rotation.x = swing;
    engineer.legs[1].rotation.x = -swing;

    const edge = serverX - (CAB_W - 0.12) / 2 - 0.015;
    const front = serverZ + UNIT_D / 2;
    this.poseArm(engineer, 0, HAND.set(edge, scene.slotY, front - 0.06), popEngineer);
    this.poseArm(engineer, 1, HAND.set(edge, scene.slotY, front - 0.3), popEngineer);

    // The analyst sits at the table and types.
    analyst.root.position.set(1.95, 0, 1.0);
    analyst.root.rotation.y = -Math.PI / 2;
    analyst.root.scale.setScalar(Math.max(0.001, popAnalyst));
    analyst.root.visible = popAnalyst > 0.01;
    analyst.head.rotation.x = 0.2 + Math.sin(t * 0.9) * 0.03 * motion;
    analyst.head.rotation.y = 0.85;
    const key = (phase: number) => 0.652 + Math.sin(t * 13 + phase) * 0.008 * motion;
    this.poseArm(analyst, 0, HAND.set(1.52, key(0), 0.93), popAnalyst);
    this.poseArm(analyst, 1, HAND.set(1.52, key(2.4), 1.07), popAnalyst);

    // With reduced motion the view still redraws until the install has played once.
    if (!this.reduced || t < CONSULT.start + CONSULT.hold + CONSULT.push + CONSULT.seated + 0.5) this.settleUntil = now + 400;
  }

  // ---------- Virtual Switch ----------

  private buildSwitchFlow() {
    const group = new THREE.Group();
    group.visible = false;
    this.model.add(group);
    const top = CAB_H + 0.01;
    const y = SWITCH_Y + 0.04;
    // Two customer ports in front and two partner ports at the back, each joined to the switch layer.
    const specs: { from: [number, number]; to: [number, number, number]; control: [number, number, number] }[] = [
      { from: [-4.28, FRONT_Z], to: [-1.2, y, 0.78], control: [-2.4, y - 0.3, 1.6] },
      { from: [-2.84, FRONT_Z], to: [-0.24, y, 0.78], control: [-1.2, y - 0.3, 1.6] },
      { from: [1.1, BACK_Z], to: [0.72, y, -0.78], control: [0.9, y - 0.3, -1.6] },
      { from: [2.54, BACK_Z], to: [1.2, y, -0.78], control: [1.9, y - 0.3, -1.6] },
    ];
    const members: SwitchMember[] = specs.map((spec, i) => {
      const start = new THREE.Vector3(spec.from[0], top, spec.from[1]);
      const lift = new THREE.Vector3(spec.from[0], 2.8, spec.from[1]);
      const end = new THREE.Vector3(...spec.to);
      const path = this.toLightPath(new THREE.CubicBezierCurve3(start, lift, new THREE.Vector3(...spec.control), end).getPoints(70));
      const material = new THREE.MeshBasicMaterial({ color: '#63b4b5' });
      const { mesh, segments } = this.makeTube(group, path, 0.03, material);
      return { path, tube: mesh, segments, material, port: this.makeChip(group, `Port ${i + 1}`, 'ink'), rig: this.makeRig(group, 1) };
    });
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.4, 0.45, 48),
      new THREE.MeshBasicMaterial({ color: '#35d0c4', transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(0, SWITCH_Y + 0.06, 0);
    ring.visible = false;
    group.add(ring);
    this.switchFlow = {
      group,
      members,
      macs: [this.makeChip(group, 'aa:01 → Port 1'), this.makeChip(group, 'bb:04 → Port 4')],
      flood: this.makeChip(group, 'Destination unknown: sent to every port', 'amber'),
      known: this.makeChip(group, 'Destination known: sent to one port'),
      ring,
    };
  }

  private updateSwitchFlow(elapsed: number, now: number) {
    const flow = this.switchFlow;
    if (!flow) return;
    const on = this.focus === 'vswitch' && this.introDone;
    if (on !== this.switchFlowOn) {
      this.switchFlowOn = on;
      this.switchFlowTime = 0;
      flow.group.visible = on;
      flow.ring.visible = false;
      for (const member of flow.members) {
        this.drawTube(member.tube, member.segments, 0);
        member.material.color.set('#63b4b5');
        member.port.visible = false;
        this.hideRig(member.rig);
      }
      for (const chip of [...flow.macs, flow.flood, flow.known]) chip.visible = false;
      this.settleUntil = now + 400;
    }
    if (!on) return;

    this.switchFlowTime += elapsed;
    const t = this.switchFlowTime;
    const { members, macs, flood, known, ring } = flow;
    const tmp = new THREE.Vector3();
    const point = new THREE.Vector3();

    // 1. Each member's port joins the switch.
    members.forEach((member, i) => {
      const start = VSWITCH.lead + i * VSWITCH.spokeStagger;
      const progress = clamp01((t - start) / VSWITCH.spokeDraw);
      this.drawTube(member.tube, member.segments, easeInOut(progress));
      const up = clamp01((t - start - VSWITCH.spokeDraw) / 0.5);
      member.material.color.set('#63b4b5').lerp(new THREE.Color('#12a2a6'), up);
      this.pointOnPath(member.path, member.path.total * 0.9, point);
      this.showChip(member.port, easeOut(up), tmp.copy(point).setY(point.y + 0.3), 0.17);
    });

    const local0 = t - VSWITCH.loopStart;
    let animating = t < VSWITCH.loopStart + VSWITCH.loop;
    if (local0 < 0) {
      for (const member of members) this.hideRig(member.rig);
    } else {
      const local = this.reduced ? Math.min(local0, VSWITCH.loop - 0.01) : local0 % VSWITCH.loop;
      const speed = VSWITCH.speed;
      // A light along one member's wire: in towards the switch, or out towards the member.
      const run = (member: SwitchMember, since: number, out: boolean) => {
        if (since < 0 || since * speed > member.path.total + 0.5) {
          this.hideRig(member.rig);
          return since >= 0 ? 1 : 0;
        }
        this.drawRig(member.rig, member.path, [since * speed], out);
        return 0;
      };
      for (const member of members) this.hideRig(member.rig);
      const inTime = members[0].path.total / speed;
      let lit = 0;

      // A frame from port 1 for a port the switch has not seen: the switch learns port 1, then floods it everywhere.
      run(members[0], local - VSWITCH.frameIn, false);
      const learned1 = local > VSWITCH.frameIn + inTime;
      const flooded = local - VSWITCH.flood;
      if (flooded >= 0 && flooded < VSWITCH.replyIn - VSWITCH.flood) {
        for (let i = 1; i < members.length; i++) run(members[i], flooded, true);
        lit = Math.max(lit, 1 - clamp01(flooded / 1.4));
      }
      // The reply from port 4 goes straight back to port 1, and the switch learns port 4.
      run(members[3], local - VSWITCH.replyIn, false);
      const learned4 = local > VSWITCH.replyIn + members[3].path.total / speed;
      run(members[0], local - VSWITCH.replyOut, true);
      // The next frame from port 1 now goes to port 4 only.
      run(members[0], local - VSWITCH.frameAgain, false);
      run(members[3], local - VSWITCH.unicast, true);

      this.showChip(macs[0], learned1 ? easeOut(clamp01((local - VSWITCH.frameIn - inTime) / 0.4)) : 0, tmp.set(-1.1, SWITCH_Y + 0.5, 0.5), 0.18);
      this.showChip(macs[1], learned4 ? easeOut(clamp01((local - VSWITCH.replyIn - members[3].path.total / speed) / 0.4)) : 0, tmp.set(1.1, SWITCH_Y + 0.5, -0.1), 0.18);
      const floodShow = local >= VSWITCH.flood && local < VSWITCH.replyIn ? easeOut(clamp01((local - VSWITCH.flood) / 0.4)) : 0;
      const knownShow = local >= VSWITCH.unicast + 0.2 && local < VSWITCH.loop - 0.4 ? easeOut(clamp01((local - VSWITCH.unicast - 0.2) / 0.4)) : 0;
      this.showChip(flood, floodShow, tmp.set(0, SWITCH_Y + 1.05, 0), 0.2);
      this.showChip(known, knownShow, tmp.set(0, SWITCH_Y + 1.05, 0), 0.2);

      ring.visible = lit > 0.02;
      if (ring.visible) {
        ring.scale.setScalar(1 + (1 - lit) * 3);
        (ring.material as THREE.MeshBasicMaterial).opacity = lit * 0.7;
      }
      animating = !this.reduced || local0 < VSWITCH.loop;
      if (this.reduced && local0 >= VSWITCH.loop) {
        for (const member of members) this.hideRig(member.rig);
        ring.visible = false;
        flood.visible = false;
        known.visible = false;
      }
    }
    if (!this.reduced || animating) this.settleUntil = now + 400;
  }

  /** One path for each CDN cache: along its wire into the fabric, then along the customer's wire out. */
  private buildContentLight() {
    const out = this.fibres.find((fibre) => fibre.id === 'cu1');
    if (!out) return;
    const paths: LightPath[] = [];
    for (const id of ['cd0', 'cd1', 'cd2']) {
      const into = this.fibres.find((fibre) => fibre.id === id);
      if (!into) continue;
      // Both wires are stored from the cabinet to the fabric, so the outgoing one is turned round.
      const points = [...into.samples, ...[...out.samples].reverse()].map((point) => point.clone());
      const cumulative = [0];
      for (let i = 1; i < points.length; i++) cumulative.push(cumulative[i - 1] + points[i].distanceTo(points[i - 1]));
      paths.push({ points, cumulative, total: cumulative[cumulative.length - 1] });
    }
    if (!paths.length) return;

    const count = paths.length * CONTENT_LIGHT.trail;
    const ball = new THREE.SphereGeometry(1, 12, 10);
    const core = new THREE.InstancedMesh(ball, new THREE.MeshBasicMaterial({ color: '#eafffc' }), count);
    const glow = new THREE.InstancedMesh(
      ball,
      new THREE.MeshBasicMaterial({ color: '#35d0c4', transparent: true, opacity: 0.34, depthWrite: false, blending: THREE.AdditiveBlending }),
      count,
    );
    for (const mesh of [core, glow]) {
      mesh.frustumCulled = false;
      mesh.renderOrder = 5;
      this.matrix.makeScale(0, 0, 0);
      for (let i = 0; i < count; i++) mesh.setMatrixAt(i, this.matrix);
      this.cablingGroup.add(mesh);
    }

    // A logo rides each light. It is a small white chip, drawn once from the site's own logo files.
    const sprites = paths.map(() => {
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthTest: false, depthWrite: false }));
      sprite.visible = false;
      sprite.renderOrder = 10;
      this.cablingGroup.add(sprite);
      return sprite;
    });
    this.contentLight = { paths, core, glow, sprites };
    this.loadContentLogos();
  }

  /** Draws each logo onto a white chip with a teal edge, in its own colours. */
  private loadContentLogos() {
    const width = 320;
    const height = 160;
    const chip = (ctx: CanvasRenderingContext2D) => {
      const r = 30;
      ctx.beginPath();
      ctx.moveTo(6 + r, 6);
      ctx.arcTo(width - 6, 6, width - 6, height - 6, r);
      ctx.arcTo(width - 6, height - 6, 6, height - 6, r);
      ctx.arcTo(6, height - 6, 6, 6, r);
      ctx.arcTo(6, 6, width - 6, 6, r);
      ctx.closePath();
    };
    CONTENT_LOGOS.forEach((logo, index) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        chip(ctx);
        ctx.fillStyle = 'rgba(255,255,255,0.97)';
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#35d0c4';
        ctx.stroke();
        const iw = image.naturalWidth || 300;
        const ih = image.naturalHeight || 150;
        const fit = Math.min((width - 80) / iw, (height - 60) / ih);
        ctx.drawImage(image, (width - iw * fit) / 2, (height - ih * fit) / 2, iw * fit, ih * fit);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        this.contentTextures[index] = texture;
      };
      image.src = logo.src;
    });
  }

  /** The point a given distance along a path. */
  private pointOnPath(path: LightPath, distance: number, into: THREE.Vector3) {
    const { cumulative, points } = path;
    let low = 0;
    let high = cumulative.length - 1;
    while (high - low > 1) {
      const middle = (low + high) >> 1;
      if (cumulative[middle] <= distance) low = middle;
      else high = middle;
    }
    const span = cumulative[high] - cumulative[low] || 1;
    return into.lerpVectors(points[low], points[high], clamp01((distance - cumulative[low]) / span));
  }

  private updateContentLight(elapsed: number, now: number) {
    const light = this.contentLight;
    if (!light) return;
    const on = this.focus === 'content' && this.introDone;
    if (on !== this.contentOn) {
      this.contentOn = on;
      this.contentTime = 0;
    }
    if (!on) {
      if (this.contentShown) this.hideContentLight();
      return;
    }

    this.contentTime += elapsed;
    const { paths, core, glow, sprites } = light;
    const run = Math.max(...paths.map((path) => path.total)) / CONTENT_LIGHT.speed;
    const round = run + (paths.length - 1) * CONTENT_LIGHT.stagger + CONTENT_LIGHT.rest;
    const t = this.contentTime - CONTENT_LIGHT.lead;
    if (t < 0) return;
    if (this.reduced && t > CONTENT_LIGHT.reducedRounds * round) {
      if (this.contentShown) this.hideContentLight();
      return;
    }
    const local = t % round;
    const roundNumber = Math.floor(t / round);

    const at = new THREE.Vector3();
    paths.forEach((path, p) => {
      const head = (local - p * CONTENT_LIGHT.stagger) * CONTENT_LIGHT.speed;

      // The logo rides just above the head of the light.
      const sprite = sprites[p];
      const texture = this.contentTextures[(roundNumber * paths.length + p) % CONTENT_LOGOS.length];
      const fade = clamp01(head / 0.5) * clamp01((path.total - head) / 0.6);
      if (texture && head >= 0 && head <= path.total && fade > 0.02) {
        const material = sprite.material as THREE.SpriteMaterial;
        if (material.map !== texture) {
          material.map = texture;
          material.needsUpdate = true;
        }
        this.pointOnPath(path, head, at);
        sprite.position.set(at.x, at.y + 0.36, at.z);
        sprite.scale.set(0.96 * fade, 0.48 * fade, 1);
        sprite.visible = true;
      } else {
        sprite.visible = false;
      }

      for (let k = 0; k < CONTENT_LIGHT.trail; k++) {
        const distance = head - k * CONTENT_LIGHT.spacing;
        const index = p * CONTENT_LIGHT.trail + k;
        // The light fades in as it leaves the cache and out as it reaches the equipment.
        const edge = clamp01(distance / 0.4) * clamp01((path.total - distance) / 0.5);
        if (head < 0 || distance < 0 || distance > path.total || edge <= 0) {
          this.matrix.makeScale(0, 0, 0);
          core.setMatrixAt(index, this.matrix);
          glow.setMatrixAt(index, this.matrix);
          continue;
        }
        this.pointOnPath(path, distance, at);
        const size = Math.pow(1 - k / CONTENT_LIGHT.trail, 1.4) * edge;
        this.matrix.compose(at, this.quaternion.identity(), this.scale.set(size * 0.1, size * 0.1, size * 0.1));
        core.setMatrixAt(index, this.matrix);
        this.matrix.compose(at, this.quaternion.identity(), this.scale.set(size * 0.3, size * 0.3, size * 0.3));
        glow.setMatrixAt(index, this.matrix);
      }
    });
    core.instanceMatrix.needsUpdate = true;
    glow.instanceMatrix.needsUpdate = true;
    this.contentShown = true;
    // With reduced motion the view still redraws while the light plays.
    this.settleUntil = now + 400;
  }

  private hideContentLight() {
    const light = this.contentLight;
    if (!light) return;
    this.matrix.makeScale(0, 0, 0);
    for (let i = 0; i < light.core.count; i++) {
      light.core.setMatrixAt(i, this.matrix);
      light.glow.setMatrixAt(i, this.matrix);
    }
    light.core.instanceMatrix.needsUpdate = true;
    light.glow.instanceMatrix.needsUpdate = true;
    for (const sprite of light.sprites) sprite.visible = false;
    this.contentShown = false;
    this.settleUntil = performance.now() + 200;
  }

  /** The second facility, its one rack, the link and the light on it. Hidden until the Metro-E view opens. */
  private buildMetro() {
    const group = new THREE.Group();
    group.visible = false;
    this.model.add(group);

    const { facilityX: fx, facilityW: fw, facilityD: fd } = METRO;
    const fz = FRONT_Z;
    const floorHeight = 0.26;

    // The floor and everything on it that rises with it.
    const floor = new THREE.Group();
    group.add(floor);
    const edge = () => new THREE.MeshStandardMaterial({ color: COLORS.slabSide, roughness: 0.9 });
    const slab = new THREE.Mesh(new THREE.BoxGeometry(fw, floorHeight, fd), [
      edge(),
      edge(),
      new THREE.MeshStandardMaterial({ color: COLORS.slabTop, roughness: 0.95 }),
      edge(),
      edge(),
      edge(),
    ]);
    slab.position.set(fx, -floorHeight / 2, fz);
    slab.receiveShadow = true;
    floor.add(slab);

    // Raised floor tiles and a teal outline, so it reads as a separate building.
    const points: number[] = [];
    for (let x = -fw / 2; x <= fw / 2 + 1e-3; x += 1) points.push(fx + x, 0.002, fz - fd / 2, fx + x, 0.002, fz + fd / 2);
    for (let z = -fd / 2; z <= fd / 2 + 1e-3; z += 1) points.push(fx - fw / 2, 0.002, fz + z, fx + fw / 2, 0.002, fz + z);
    const tiles = new THREE.BufferGeometry();
    tiles.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    floor.add(new THREE.LineSegments(tiles, new THREE.LineBasicMaterial({ color: COLORS.grid })));
    const outline = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(fw, floorHeight, fd)),
      new THREE.LineBasicMaterial({ color: COLORS.slabEdge, transparent: true, opacity: 0.55 }),
    );
    outline.position.copy(slab.position);
    floor.add(outline);

    // Where the rack will stand, marked on the floor.
    const footprint = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(fx - CAB_W / 2, 0.012, fz - CAB_D / 2),
        new THREE.Vector3(fx + CAB_W / 2, 0.012, fz - CAB_D / 2),
        new THREE.Vector3(fx + CAB_W / 2, 0.012, fz + CAB_D / 2),
        new THREE.Vector3(fx - CAB_W / 2, 0.012, fz + CAB_D / 2),
      ]),
      new THREE.LineBasicMaterial({ color: COLORS.slabEdge }),
    );
    floor.add(footprint);

    // A soft shadow on the ground beneath it.
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 15, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(11,37,54,0.28)');
      gradient.addColorStop(0.65, 'rgba(11,37,54,0.1)');
      gradient.addColorStop(1, 'rgba(11,37,54,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
    }
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(fw * 1.4, fd * 1.45),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, depthWrite: false }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(fx, -0.62, fz);
    floor.add(ground);

    // A ring that spreads from the footprint when the link arrives.
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.3, 0.34, 40),
      new THREE.MeshBasicMaterial({ color: COLORS.pulse, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(fx, 0.03, fz);
    ring.visible = false;
    group.add(ring);

    // The one rack. It grows out of the floor, then its servers are carried in.
    const rack = new THREE.Group();
    rack.position.set(fx, 0, fz);
    rack.visible = false;
    const rackBody = new THREE.Mesh(new THREE.BoxGeometry(CAB_W, CAB_H, CAB_D), new THREE.MeshStandardMaterial({ color: '#0e6b70', roughness: 0.62, metalness: 0.08 }));
    rackBody.position.y = CAB_H / 2;
    rack.add(rackBody);
    const rackDoor = new THREE.Mesh(
      new THREE.BoxGeometry(CAB_W - 0.05, CAB_H - 0.08, 0.012),
      new THREE.MeshStandardMaterial({ color: '#138a8f', roughness: 0.58, metalness: 0.08 }),
    );
    rackDoor.position.set(0, CAB_H / 2, CAB_D / 2 + 0.006);
    rack.add(rackDoor);
    group.add(rack);

    const random = seeded(909);
    const slots: { y: number; h: number }[] = [];
    let cursor = 0.12;
    while (cursor < CAB_H - 0.2) {
      const h = random() < 0.28 ? 0.15 : 0.075;
      if (cursor + h > CAB_H - 0.12) break;
      if (random() > 0.14) slots.push({ y: cursor + h / 2, h });
      cursor += h + 0.02;
    }
    const units = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: '#0a5054', roughness: 0.55 }), slots.length);
    const leds = new THREE.InstancedMesh(new THREE.BoxGeometry(0.03, 0.022, 0.006), new THREE.MeshBasicMaterial({ color: '#ffffff' }), slots.length * 3);
    for (let i = 0; i < slots.length * 3; i++) leds.setColorAt(i, this.color.set(this.pickLed(random)));
    units.frustumCulled = false;
    leds.frustumCulled = false;
    group.add(units, leds);

    // The link rises from Point A, runs between the buildings on a pole, and ends above the rack's place.
    const pointA = 4.04;
    const linkZ = fz + 0.3;
    const route = routedPath([
      new THREE.Vector3(pointA, CAB_H + 0.01, linkZ),
      new THREE.Vector3(pointA, METRO.height, linkZ),
      new THREE.Vector3(fx, METRO.height, linkZ),
      new THREE.Vector3(fx, CAB_H + 0.01, linkZ),
    ]);
    const length = route.getLength();
    const linkSegments = Math.ceil(length * 12);
    const link = new THREE.Mesh(new THREE.TubeGeometry(route, linkSegments, 0.03, 6, false), new THREE.MeshBasicMaterial({ color: COLORS.fibreLit }));
    link.visible = false;
    group.add(link);
    const post = new THREE.MeshStandardMaterial({ color: COLORS.tray, roughness: 0.7 });
    const pole = new THREE.Mesh(new THREE.BoxGeometry(0.09, METRO.height + 0.3, 0.09), post);
    pole.position.set(7.4, (METRO.height - 0.3) / 2, linkZ);
    group.add(pole);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.07, 0.09), post);
    arm.position.set(7.4, METRO.height - 0.06, linkZ);
    group.add(arm);

    // The light that runs along the link.
    const samples = route.getSpacedPoints(Math.ceil(length * 10));
    const cumulative = [0];
    for (let i = 1; i < samples.length; i++) cumulative.push(cumulative[i - 1] + samples[i].distanceTo(samples[i - 1]));
    const path: LightPath = { points: samples, cumulative, total: cumulative[cumulative.length - 1] };
    const count = METRO.packets * METRO.trail;
    const ball = new THREE.SphereGeometry(1, 12, 10);
    const core = new THREE.InstancedMesh(ball, new THREE.MeshBasicMaterial({ color: '#eafffc' }), count);
    const glow = new THREE.InstancedMesh(
      ball,
      new THREE.MeshBasicMaterial({ color: '#35d0c4', transparent: true, opacity: 0.34, depthWrite: false, blending: THREE.AdditiveBlending }),
      count,
    );
    for (const mesh of [core, glow]) {
      mesh.frustumCulled = false;
      mesh.renderOrder = 5;
      this.matrix.makeScale(0, 0, 0);
      for (let i = 0; i < count; i++) mesh.setMatrixAt(i, this.matrix);
      group.add(mesh);
    }

    this.metroScene = { group, floor, link, linkSegments, path, core, glow, rack, slots, units, leds, ring, order: slots.map((_, i) => i) };
  }

  private hideMetroLight() {
    const scene = this.metroScene;
    if (!scene) return;
    this.matrix.makeScale(0, 0, 0);
    for (let i = 0; i < scene.core.count; i++) {
      scene.core.setMatrixAt(i, this.matrix);
      scene.glow.setMatrixAt(i, this.matrix);
    }
    scene.core.instanceMatrix.needsUpdate = true;
    scene.glow.instanceMatrix.needsUpdate = true;
    this.metroShown = false;
  }

  /** Puts a light, with a glowing tail, at each given distance along the link. A negative distance leaves it out. */
  private placeMetroLight(scene: MetroScene, heads: number[], backwards: boolean) {
    const { path, core, glow } = scene;
    const at = new THREE.Vector3();
    for (let p = 0; p < METRO.packets; p++) {
      const head = heads[p] ?? -1;
      for (let k = 0; k < METRO.trail; k++) {
        const distance = head - k * METRO.spacing;
        const index = p * METRO.trail + k;
        const fade = clamp01(distance / 0.4) * clamp01((path.total - distance) / 0.5);
        if (head < 0 || distance < 0 || distance > path.total || fade <= 0) {
          this.matrix.makeScale(0, 0, 0);
          core.setMatrixAt(index, this.matrix);
          glow.setMatrixAt(index, this.matrix);
          continue;
        }
        this.pointOnPath(path, backwards ? path.total - distance : distance, at);
        const size = Math.pow(1 - k / METRO.trail, 1.4) * fade;
        this.matrix.compose(at, this.quaternion.identity(), this.scale.set(size * 0.1, size * 0.1, size * 0.1));
        core.setMatrixAt(index, this.matrix);
        this.matrix.compose(at, this.quaternion.identity(), this.scale.set(size * 0.3, size * 0.3, size * 0.3));
        glow.setMatrixAt(index, this.matrix);
      }
    }
    core.instanceMatrix.needsUpdate = true;
    glow.instanceMatrix.needsUpdate = true;
    this.metroShown = true;
  }

  /** Each server starts hidden, then appears in front of the rack in its turn and is pushed into its slot. */
  private placeMetroServers(scene: MetroScene, seconds: number) {
    const x = METRO.facilityX;
    scene.slots.forEach((slot, i) => {
      const p = clamp01((seconds - scene.order[i] * METRO.serverGap) / METRO.serverSlide);
      const shown = p > 0 ? easeOut(clamp01(p * 10)) : 0;
      const slide = (1 - easeInOut(p)) * METRO.serverDistance;
      this.matrix.compose(
        this.scratch.set(x, slot.y, FRONT_Z + UNIT_FRONT - (UNIT_D * shown) / 2 + slide),
        this.quaternion.identity(),
        this.scale.set((CAB_W - 0.12) * shown, slot.h * shown, UNIT_D * shown),
      );
      scene.units.setMatrixAt(i, this.matrix);
      for (let k = 0; k < 3; k++) {
        this.matrix.compose(
          this.scratch.set(x - CAB_W / 2 + 0.11 + k * 0.05, slot.y, FRONT_Z + CAB_D / 2 + 0.031 + slide),
          this.quaternion.identity(),
          this.scale.set(shown, shown, shown),
        );
        scene.leds.setMatrixAt(i * 3 + k, this.matrix);
      }
    });
    scene.units.instanceMatrix.needsUpdate = true;
    scene.leds.instanceMatrix.needsUpdate = true;
    if (scene.leds.instanceColor) scene.leds.instanceColor.needsUpdate = true;
  }

  private updateMetro(elapsed: number, now: number) {
    const scene = this.metroScene;
    if (!scene) return;
    const on = this.focus === 'metro-e' && this.introDone;
    if (on !== this.metroOn) {
      this.metroOn = on;
      this.metroTime = 0;
      scene.group.visible = on;
      // Start again from an empty floor: no link, no rack, no servers, and a new order for the servers.
      scene.floor.scale.y = 0.001;
      scene.link.visible = false;
      scene.rack.visible = false;
      scene.ring.visible = false;
      scene.order = scene.slots.map((_, i) => i).sort(() => Math.random() - 0.5);
      this.placeMetroServers(scene, 0);
      this.hideMetroLight();
      this.settleUntil = now + 400;
    }
    if (!on) return;

    this.metroTime += elapsed;
    const t = this.metroTime;
    const { path } = scene;

    // 1. The empty floor rises.
    scene.floor.scale.y = Math.max(0.001, easeOut(clamp01((t - METRO.floorIn) / METRO.floorTime)));

    // 2. The link draws out from Point A, with a light at its head.
    const drawTime = path.total / METRO.drawSpeed;
    const drawn = clamp01((t - METRO.lineStart) / drawTime);
    scene.link.visible = drawn > 0;
    (scene.link.geometry as THREE.BufferGeometry).setDrawRange(0, Math.floor(drawn * scene.linkSegments) * 36);
    const arrival = METRO.lineStart + drawTime;
    const drawing = t > METRO.lineStart && t < arrival;

    // 3. The link arrives, a ring spreads, and the rack grows out of the floor.
    const rackGrowth = clamp01((t - arrival) / METRO.rackTime);
    scene.rack.visible = rackGrowth > 0;
    scene.rack.scale.y = Math.max(0.001, easeOut(rackGrowth));
    const spread = (t - arrival) / 1.1;
    scene.ring.visible = spread >= 0 && spread <= 1;
    if (scene.ring.visible) {
      scene.ring.scale.setScalar(1 + spread * 4);
      (scene.ring.material as THREE.MeshBasicMaterial).opacity = (1 - spread) * 0.6;
    }

    // 4. The servers are carried in, one after another, in a random order.
    const serversStart = arrival + METRO.rackTime * 0.8;
    this.placeMetroServers(scene, Math.max(0, t - serversStart));
    const serversDone = serversStart + scene.slots.length * METRO.serverGap + METRO.serverSlide;

    // 5. Then light runs along the finished link, from A to B and then from B to A.
    const run = path.total / METRO.speed;
    const round = run + (METRO.packets - 1) * METRO.stagger + METRO.rest;
    const lightTime = t - (serversDone + 0.4);
    let animating = t < serversDone + 0.4;
    if (drawing) {
      this.placeMetroLight(scene, [(t - METRO.lineStart) * METRO.drawSpeed], false);
    } else if (lightTime >= 0 && !(this.reduced && lightTime > METRO.reducedRounds * round)) {
      const backwards = Math.floor(lightTime / round) % 2 === 1;
      const local = lightTime % round;
      this.placeMetroLight(scene, Array.from({ length: METRO.packets }, (_, p) => (local - p * METRO.stagger) * METRO.speed), backwards);
      animating = true;
    } else if (this.metroShown) {
      this.hideMetroLight();
    }
    if (!this.reduced || animating) this.settleUntil = now + 400;
  }

  /** The map of Asia and a line to a place in each country. Hidden until the IP Transit view opens. */
  private buildIpMap() {
    const group = new THREE.Group();
    group.visible = false;
    this.model.add(group);

    // The countries, flat on the ground, with Manila at the centre.
    const outline = new THREE.LineBasicMaterial({ color: '#a9bcc8', transparent: true, opacity: 0 });
    const fills: IpScene['fills'] = [];
    for (const country of ASIA) {
      const material = new THREE.MeshBasicMaterial({ color: IP_COLORS.land.clone(), transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
      fills.push({ name: country.name, material });
      for (const ring of country.rings) {
        const shape = new THREE.Shape();
        const edge: number[] = [];
        for (let i = 0; i < ring.length; i += 2) {
          const [x, z] = mapPoint(ring[i], ring[i + 1]);
          if (i === 0) shape.moveTo(x, -z);
          else shape.lineTo(x, -z);
          edge.push(x, 0.01, z);
        }
        const land = new THREE.Mesh(new THREE.ShapeGeometry(shape), material);
        land.rotation.x = -Math.PI / 2;
        land.position.y = 0.004;
        group.add(land);
        const border = new THREE.BufferGeometry();
        border.setAttribute('position', new THREE.Float32BufferAttribute(edge, 3));
        group.add(new THREE.LineLoop(border, outline));
      }
    }

    // A soft shadow under the rack.
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(1, 28),
      new THREE.MeshBasicMaterial({ color: '#0b2536', transparent: true, opacity: 0.16, depthWrite: false }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.scale.set(0.9, 0.6, 1);
    shadow.position.y = 0.012;
    group.add(shadow);

    // One line from the top of the fabric rack to a place in each country.
    const start = new THREE.Vector3(0, CAB_H + 0.01, 0);
    const lines: IpLine[] = DESTINATIONS.map((place) => {
      const [x, z] = mapPoint(place.lon, place.lat);
      const end = new THREE.Vector3(x, 0.03, z);
      const distance = Math.hypot(x, z);
      const control = start.clone().add(end).multiplyScalar(0.5);
      control.y = 1.0 + distance * 0.5;
      const curve = new THREE.QuadraticBezierCurve3(start, control, end);

      const line = new THREE.Mesh(new THREE.TubeGeometry(curve, IP.segments, 0.028, 6, false), new THREE.MeshBasicMaterial({ color: IP_COLORS.line.clone() }));
      line.visible = false;
      group.add(line);
      const halo = new THREE.Mesh(
        new THREE.TubeGeometry(curve, IP.segments, 0.1, 6, false),
        new THREE.MeshBasicMaterial({ color: IP_COLORS.lit.clone(), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }),
      );
      halo.visible = false;
      group.add(halo);
      const marker = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.03, 16), new THREE.MeshBasicMaterial({ color: IP_COLORS.line.clone() }));
      marker.position.set(x, 0.02, z);
      group.add(marker);
      const ripple = new THREE.Mesh(
        new THREE.RingGeometry(0.09, 0.115, 32),
        new THREE.MeshBasicMaterial({ color: IP_COLORS.lit.clone(), transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }),
      );
      ripple.rotation.x = -Math.PI / 2;
      ripple.position.set(x, 0.03, z);
      ripple.visible = false;
      group.add(ripple);
      return { place, curve, line, halo, marker, ripple, distance, length: curve.getLength() };
    });

    // The light at the head of each line while it is being drawn.
    const ball = new THREE.SphereGeometry(1, 12, 10);
    const core = new THREE.InstancedMesh(ball, new THREE.MeshBasicMaterial({ color: '#eafffc' }), lines.length);
    const glow = new THREE.InstancedMesh(
      ball,
      new THREE.MeshBasicMaterial({ color: '#35d0c4', transparent: true, opacity: 0.34, depthWrite: false, blending: THREE.AdditiveBlending }),
      lines.length,
    );
    for (const mesh of [core, glow]) {
      mesh.frustumCulled = false;
      mesh.renderOrder = 5;
      this.matrix.makeScale(0, 0, 0);
      for (let i = 0; i < lines.length; i++) mesh.setMatrixAt(i, this.matrix);
      group.add(mesh);
    }

    // Two lights on every line, running in opposite directions, once the line is up. They go back and
    // forth between the country and the rack, like traffic on a connection that is active.
    const trafficCore = new THREE.InstancedMesh(ball, new THREE.MeshBasicMaterial({ color: '#eafffc' }), lines.length * 2);
    const trafficGlow = new THREE.InstancedMesh(
      ball,
      new THREE.MeshBasicMaterial({ color: '#35d0c4', transparent: true, opacity: 0.4, depthWrite: false, blending: THREE.AdditiveBlending }),
      lines.length * 2,
    );
    for (const mesh of [trafficCore, trafficGlow]) {
      mesh.frustumCulled = false;
      mesh.renderOrder = 6;
      this.matrix.makeScale(0, 0, 0);
      for (let i = 0; i < lines.length * 2; i++) mesh.setMatrixAt(i, this.matrix);
      group.add(mesh);
    }

    this.ipScene = { group, fills, outline, lines, core, glow, trafficCore, trafficGlow };
  }

  private updateIp(elapsed: number, now: number) {
    const scene = this.ipScene;
    const on = !!scene && this.focus === 'ip-transit' && this.introDone;
    if (on !== this.ipOn) {
      this.ipOn = on;
      this.ipTime = 0;
      if (scene) scene.group.visible = on;
    }
    this.updateIpClearing(on, elapsed, now);
    if (!scene || !on) return;

    this.ipTime += elapsed;
    const t = this.ipTime;
    const mapIn = clamp01((t - 0.2) / 0.8);
    scene.outline.opacity = 0.9 * mapIn;
    for (const fill of scene.fills) fill.material.opacity = mapIn;

    let lastDone = 0;
    const arrivals: number[] = [];
    scene.lines.forEach((entry, i) => {
      const start = IP.lead + i * IP.stagger;
      const duration = IP.draw + entry.distance * IP.perUnit;
      const arrival = start + duration;
      arrivals[i] = arrival;
      lastDone = Math.max(lastDone, arrival + IP.glowIn + IP.ripple);

      // The line draws out from the rack, with a light at its head.
      const progress = easeInOut(clamp01((t - start) / duration));
      const geometry = entry.line.geometry as THREE.BufferGeometry;
      geometry.setDrawRange(0, Math.floor(progress * IP.segments) * 36);
      entry.line.visible = progress > 0;
      if (t > start && t < arrival) {
        entry.curve.getPointAt(progress, HAND);
        this.matrix.compose(HAND, this.quaternion.identity(), this.scale.set(0.09, 0.09, 0.09));
        scene.core.setMatrixAt(i, this.matrix);
        this.matrix.compose(HAND, this.quaternion.identity(), this.scale.set(0.28, 0.28, 0.28));
        scene.glow.setMatrixAt(i, this.matrix);
      } else {
        this.matrix.makeScale(0, 0, 0);
        scene.core.setMatrixAt(i, this.matrix);
        scene.glow.setMatrixAt(i, this.matrix);
      }

      // Once it arrives, the line glows steadily, like a connection that is up.
      const glow = clamp01((t - arrival) / IP.glowIn);
      const pulse = this.reduced ? 1 : 1 + Math.sin(t * 2.2 + i * 0.9) * 0.18;
      (entry.line.material as THREE.MeshBasicMaterial).color.copy(IP_COLORS.line).lerp(IP_COLORS.lit, glow);
      entry.halo.visible = glow > 0;
      (entry.halo.material as THREE.MeshBasicMaterial).opacity = 0.34 * glow * pulse;
      (entry.marker.material as THREE.MeshBasicMaterial).color.copy(IP_COLORS.line).lerp(IP_COLORS.lit, glow);
      entry.marker.scale.setScalar(1 + glow * 0.45);
      const fill = scene.fills.find((candidate) => candidate.name === entry.place.country);
      if (fill) fill.material.color.copy(IP_COLORS.land).lerp(IP_COLORS.landLit, glow);

      // A ring spreads from the place when the line arrives.
      const ring = (t - arrival) / IP.ripple;
      entry.ripple.visible = ring >= 0 && ring <= 1;
      if (entry.ripple.visible) {
        entry.ripple.scale.setScalar(1 + ring * 5);
        (entry.ripple.material as THREE.MeshBasicMaterial).opacity = (1 - ring) * 0.6;
      }
    });
    scene.core.instanceMatrix.needsUpdate = true;
    scene.glow.instanceMatrix.needsUpdate = true;

    // Once a line is up, two lights run along it in opposite directions, back and forth.
    const traffic = !this.reduced || t < lastDone + IP.reducedTraffic;
    scene.lines.forEach((entry, i) => {
      const active = traffic ? clamp01((t - arrivals[i] - IP.glowIn * 0.5) / 0.5) : 0;
      for (let j = 0; j < 2; j++) {
        const index = i * 2 + j;
        if (active <= 0) {
          this.matrix.makeScale(0, 0, 0);
          scene.trafficCore.setMatrixAt(index, this.matrix);
          scene.trafficGlow.setMatrixAt(index, this.matrix);
          continue;
        }
        const along = ((t * IP.trafficSpeed) / entry.length + j + i * 0.37) % 2;
        entry.curve.getPointAt(clamp01(along < 1 ? along : 2 - along), HAND);
        this.matrix.compose(HAND, this.quaternion.identity(), this.scale.set(0.075 * active, 0.075 * active, 0.075 * active));
        scene.trafficCore.setMatrixAt(index, this.matrix);
        this.matrix.compose(HAND, this.quaternion.identity(), this.scale.set(0.24 * active, 0.24 * active, 0.24 * active));
        scene.trafficGlow.setMatrixAt(index, this.matrix);
      }
    });
    scene.trafficCore.instanceMatrix.needsUpdate = true;
    scene.trafficGlow.instanceMatrix.needsUpdate = true;

    // With reduced motion the view redraws until the traffic has run for a while, then holds still.
    if (!this.reduced || t < lastDone + IP.reducedTraffic) this.settleUntil = now + 400;
  }

  /** A path made of points, with the running length at each point, so a light can be placed along it. */
  private toLightPath(points: THREE.Vector3[]): LightPath {
    const cumulative = [0];
    for (let i = 1; i < points.length; i++) cumulative.push(cumulative[i - 1] + points[i].distanceTo(points[i - 1]));
    return { points, cumulative, total: cumulative[cumulative.length - 1] };
  }

  /** A tube along a path, drawn a piece at a time by its draw range. */
  private makeTube(parent: THREE.Object3D, path: LightPath, radius: number, material: THREE.Material) {
    const step = Math.max(1, Math.floor(path.points.length / 70));
    const kept = path.points.filter((_, i) => i % step === 0 || i === path.points.length - 1);
    const segments = Math.max(12, Math.ceil(path.total * 14));
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(kept), segments, radius, 6, false), material);
    mesh.visible = false;
    parent.add(mesh);
    return { mesh, segments };
  }

  private drawTube(mesh: THREE.Mesh, segments: number, progress: number) {
    (mesh.geometry as THREE.BufferGeometry).setDrawRange(0, Math.floor(clamp01(progress) * segments) * 36);
    mesh.visible = progress > 0;
  }

  /** A small label that is drawn once onto a canvas and shown as a sprite, hidden until it is used. */
  private makeChip(parent: THREE.Object3D, text: string, tone: 'teal' | 'amber' | 'ink' = 'teal') {
    const height = 64;
    const font = '600 32px "IBM Plex Mono", ui-monospace, Consolas, monospace';
    const probe = document.createElement('canvas').getContext('2d');
    if (probe) probe.font = font;
    const width = Math.ceil((probe ? probe.measureText(text).width : text.length * 20) + 46);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const colors = { teal: ['#12a2a6', '#0b5a5e'], amber: ['#d99a1f', '#7a4f00'], ink: ['#5f717d', '#27313c'] }[tone];
    if (ctx) {
      const r = 18;
      ctx.beginPath();
      ctx.moveTo(4 + r, 4);
      ctx.arcTo(width - 4, 4, width - 4, height - 4, r);
      ctx.arcTo(width - 4, height - 4, 4, height - 4, r);
      ctx.arcTo(4, height - 4, 4, 4, r);
      ctx.arcTo(4, 4, width - 4, 4, r);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255,255,255,0.97)';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = colors[0];
      ctx.stroke();
      ctx.font = font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = colors[1];
      ctx.fillText(text, width / 2, height / 2 + 1);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.flowTextures.push(texture);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false }));
    sprite.userData.aspect = width / height;
    sprite.renderOrder = 10;
    sprite.visible = false;
    parent.add(sprite);
    return sprite;
  }

  private showChip(sprite: THREE.Sprite, amount: number, at?: THREE.Vector3, height = 0.2) {
    const a = clamp01(amount);
    sprite.visible = a > 0.01;
    sprite.scale.set(height * (sprite.userData.aspect as number) * a, height * a, 1);
    if (at) sprite.position.copy(at);
  }

  private makeRig(parent: THREE.Object3D, packets: number, trail = 8): FlowRig {
    const count = packets * trail;
    const ball = new THREE.SphereGeometry(1, 12, 10);
    const core = new THREE.InstancedMesh(ball, new THREE.MeshBasicMaterial({ color: '#eafffc' }), count);
    const glow = new THREE.InstancedMesh(
      ball,
      new THREE.MeshBasicMaterial({ color: '#35d0c4', transparent: true, opacity: 0.34, depthWrite: false, blending: THREE.AdditiveBlending }),
      count,
    );
    for (const mesh of [core, glow]) {
      mesh.frustumCulled = false;
      mesh.renderOrder = 6;
      this.matrix.makeScale(0, 0, 0);
      for (let i = 0; i < count; i++) mesh.setMatrixAt(i, this.matrix);
      parent.add(mesh);
    }
    return { core, glow, packets, trail };
  }

  private hideRig(rig: FlowRig) {
    this.matrix.makeScale(0, 0, 0);
    for (let i = 0; i < rig.core.count; i++) {
      rig.core.setMatrixAt(i, this.matrix);
      rig.glow.setMatrixAt(i, this.matrix);
    }
    rig.core.instanceMatrix.needsUpdate = true;
    rig.glow.instanceMatrix.needsUpdate = true;
  }

  /** Puts a light with a glowing tail at each head distance along the path. A negative head leaves that light out. */
  private drawRig(rig: FlowRig, path: LightPath, heads: number[], backwards = false) {
    const at = new THREE.Vector3();
    for (let p = 0; p < rig.packets; p++) {
      const head = heads[p] ?? -1;
      for (let k = 0; k < rig.trail; k++) {
        const distance = head - k * 0.12;
        const index = p * rig.trail + k;
        const fade = clamp01(distance / 0.4) * clamp01((path.total - distance) / 0.5);
        if (head < 0 || distance < 0 || distance > path.total || fade <= 0) {
          this.matrix.makeScale(0, 0, 0);
          rig.core.setMatrixAt(index, this.matrix);
          rig.glow.setMatrixAt(index, this.matrix);
          continue;
        }
        this.pointOnPath(path, backwards ? path.total - distance : distance, at);
        const size = Math.pow(1 - k / rig.trail, 1.4) * fade;
        this.matrix.compose(at, this.quaternion.identity(), this.scale.set(size * 0.1, size * 0.1, size * 0.1));
        rig.core.setMatrixAt(index, this.matrix);
        this.matrix.compose(at, this.quaternion.identity(), this.scale.set(size * 0.3, size * 0.3, size * 0.3));
        rig.glow.setMatrixAt(index, this.matrix);
      }
    }
    rig.core.instanceMatrix.needsUpdate = true;
    rig.glow.instanceMatrix.needsUpdate = true;
  }

  // ---------- Virtual Cross Connect ----------

  private buildVxcFlow() {
    const from = this.fibres.find((fibre) => fibre.id === 'cu3');
    const to = this.fibres.find((fibre) => fibre.id === 'pa1');
    if (!from || !to) return;
    const group = new THREE.Group();
    group.visible = false;
    this.model.add(group);

    // The main path follows the wires through the fabric. The backup path arcs over the top, a different way round.
    const primary = this.toLightPath([...from.samples, ...[...to.samples].reverse()].map((point) => point.clone()));
    const startPoint = from.samples[0];
    const endPoint = to.samples[0];
    const apex = startPoint.clone().add(endPoint).multiplyScalar(0.5);
    apex.y = 4.7;
    const backup = this.toLightPath(new THREE.QuadraticBezierCurve3(startPoint.clone(), apex, endPoint.clone()).getPoints(90));

    const primaryMaterial = new THREE.MeshBasicMaterial({ color: '#12a2a6' });
    const { mesh: primaryTube, segments: primarySegments } = this.makeTube(group, primary, 0.04, primaryMaterial);
    const halo = new THREE.Mesh(
      primaryTube.geometry,
      new THREE.MeshBasicMaterial({ color: '#35d0c4', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    halo.scale.setScalar(1);
    halo.visible = false;
    group.add(halo);
    const backupMaterial = new THREE.MeshBasicMaterial({ color: '#9fb2bf', transparent: true, opacity: 0.9 });
    const { mesh: backupTube } = this.makeTube(group, backup, 0.022, backupMaterial);

    // A glowing port on top of each cabinet.
    const ports = [startPoint, endPoint].map((point) => {
      const port = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), new THREE.MeshBasicMaterial({ color: '#eafffc' }));
      port.position.copy(point);
      port.visible = false;
      group.add(port);
      return port;
    });

    const chips = {
      a: this.makeChip(group, 'VLAN 100'),
      b: this.makeChip(group, 'VLAN 200'),
      down: this.makeChip(group, 'Main path down', 'amber'),
      reroute: this.makeChip(group, 'Traffic moves to backup path', 'teal'),
    };
    this.vxcFlow = { group, primary, backup, primaryTube, primarySegments, primaryMaterial, halo, backupTube, backupMaterial, ports, chips, rig: this.makeRig(group, VXC.packets) };
  }

  private updateVxcFlow(elapsed: number, now: number) {
    const flow = this.vxcFlow;
    if (!flow) return;
    const on = this.focus === 'vxc' && this.introDone;
    if (on !== this.vxcOn) {
      this.vxcOn = on;
      this.vxcTime = 0;
      flow.group.visible = on;
      this.hideRig(flow.rig);
      flow.backupTube.visible = false;
      this.drawTube(flow.primaryTube, flow.primarySegments, 0);
      flow.halo.visible = false;
      for (const port of flow.ports) port.visible = false;
      for (const chip of Object.values(flow.chips)) chip.visible = false;
      this.settleUntil = now + 400;
    }
    if (!on) return;

    this.vxcTime += elapsed;
    const { primary, backup, rig } = flow;
    const drawTime = primary.total / VXC.drawSpeed;
    const t = this.vxcTime - VXC.lead;
    const drawn = clamp01(t / drawTime);
    this.drawTube(flow.primaryTube, flow.primarySegments, easeInOut(drawn));
    flow.ports[0].visible = t > 0;
    flow.ports[0].scale.setScalar(1 + (this.reduced ? 0 : Math.sin(this.vxcTime * 5) * 0.12));

    const cycle = VXC.traffic + VXC.fail + VXC.backup + VXC.restore + VXC.rest;
    const u = t - drawTime;
    const lift = new THREE.Vector3();
    let animating = u < 0.6;

    if (t < 0) {
      this.hideRig(rig);
    } else if (u < 0) {
      // The circuit is being drawn, with a light at its head.
      this.drawRig(rig, primary, [t * VXC.drawSpeed]);
    } else {
      flow.ports[1].visible = true;
      flow.ports[1].scale.setScalar(1 + (this.reduced ? 0 : Math.sin(this.vxcTime * 5 + 1) * 0.12));
      // Each end gets a VLAN tag, and a second path appears, so the circuit is protected.
      this.showChip(flow.chips.a, easeOut(clamp01(u / 0.4)), lift.copy(flow.primary.points[0]).setY(CAB_H + 0.55));
      this.showChip(flow.chips.b, easeOut(clamp01((u - 0.2) / 0.4)), lift.copy(primary.points[primary.points.length - 1]).setY(CAB_H + 0.55));
      flow.backupTube.visible = true;
      flow.halo.visible = true;

      const time = this.reduced ? Math.min(u, VXC.traffic + VXC.fail + VXC.backup + VXC.restore) : u % cycle;
      const failAt = VXC.traffic;
      const backupAt = failAt + VXC.fail;
      const restoreAt = backupAt + VXC.backup;
      const endAt = restoreAt + VXC.restore;
      const failing = time >= failAt && time < restoreAt;
      const onBackup = time >= backupAt && time < restoreAt;
      const mid = primary.points[Math.floor(primary.points.length * 0.5)];

      // The main path: teal when it is up, amber while it is down.
      const down = time >= failAt && time < restoreAt ? 1 : time >= restoreAt && time < endAt ? 1 - (time - restoreAt) / VXC.restore : 0;
      flow.primaryMaterial.color.set('#12a2a6').lerp(new THREE.Color('#e3a52a'), down);
      (flow.halo.material as THREE.MeshBasicMaterial).opacity = 0.3 * (1 - down);
      flow.primaryMaterial.opacity = 1;
      flow.backupMaterial.color.set('#9fb2bf').lerp(new THREE.Color('#12a2a6'), onBackup ? 1 : 0);
      this.showChip(flow.chips.down, failing ? easeOut(clamp01((time - failAt) / 0.4)) : 0, lift.copy(mid).setY(mid.y + 0.45));
      this.showChip(flow.chips.reroute, onBackup ? easeOut(clamp01((time - backupAt) / 0.4)) : 0, lift.copy(backup.points[45]).setY(backup.points[45].y + 0.3));

      // Traffic runs both ways along whichever path is up.
      const path = onBackup ? backup : primary;
      const run = path.total / VXC.trafficSpeed;
      const period = run + (VXC.packets - 1) * VXC.stagger + 0.7;
      const since = onBackup ? time - backupAt : time < failAt ? time : time >= endAt ? time - endAt : -1;
      if (since >= 0 && !(this.reduced && u > cycle)) {
        const backwards = Math.floor(since / period) % 2 === 1;
        const local = since % period;
        this.drawRig(rig, path, Array.from({ length: VXC.packets }, (_, p) => (local - p * VXC.stagger) * VXC.trafficSpeed), backwards);
      } else {
        this.hideRig(rig);
      }
      animating = !this.reduced || u < cycle;
      if (this.reduced && u >= cycle) {
        this.hideRig(rig);
        flow.chips.down.visible = false;
        flow.chips.reroute.visible = false;
      }
    }
    if (!this.reduced || animating) this.settleUntil = now + 400;
  }

  // ---------- Virtual Router ----------

  private buildRouterFlow() {
    const group = new THREE.Group();
    group.visible = false;
    this.model.add(group);
    const top = CAB_H + 0.01;
    const y = ROUTER_Y + 0.04;
    const specs: { id: string; from: [number, number]; to: [number, number, number]; control: [number, number, number]; route: string; tone: 'teal' | 'ink' }[] = [
      { id: 'cu1', from: [-3.56, FRONT_Z], to: [-1.2, y, 0.78], control: [-1.9, y - 0.2, 1.7], route: '10.10.0.0/24', tone: 'teal' },
      { id: 'ed0', from: [3.5, BACK_Z], to: [1.2, y, -0.78], control: [2.2, y - 0.2, -1.6], route: '0.0.0.0/0', tone: 'teal' },
      { id: 'pa1', from: [1.82, BACK_Z], to: [0.72, y, -0.78], control: [0.9, y - 0.2, -1.7], route: '172.16.0.0/16', tone: 'teal' },
    ];
    const spokes: RouterSpoke[] = specs.map((spec) => {
      const start = new THREE.Vector3(spec.from[0], top, spec.from[1]);
      const lift = new THREE.Vector3(spec.from[0], 3.3, spec.from[1]);
      const end = new THREE.Vector3(...spec.to);
      const path = this.toLightPath(new THREE.CubicBezierCurve3(start, lift, new THREE.Vector3(...spec.control), end).getPoints(70));
      const material = new THREE.MeshBasicMaterial({ color: '#63b4b5' });
      const { mesh, segments } = this.makeTube(group, path, 0.03, material);
      return {
        path,
        tube: mesh,
        segments,
        material,
        bgp: this.makeChip(group, 'BGP up'),
        route: this.makeChip(group, spec.route, spec.id === 'ed0' ? 'ink' : 'teal'),
      };
    });

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.4, 0.45, 48),
      new THREE.MeshBasicMaterial({ color: '#35d0c4', transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(0, ROUTER_Y + 0.06, 0);
    ring.visible = false;
    group.add(ring);

    this.routerFlow = { group, spokes, rig: this.makeRig(group, 2), ring };
  }

  private updateRouterFlow(elapsed: number, now: number) {
    const flow = this.routerFlow;
    if (!flow) return;
    const on = this.focus === 'vrouter' && this.introDone;
    if (on !== this.routerOn) {
      this.routerOn = on;
      this.routerTime = 0;
      flow.group.visible = on;
      this.hideRig(flow.rig);
      flow.ring.visible = false;
      for (const spoke of flow.spokes) {
        this.drawTube(spoke.tube, spoke.segments, 0);
        spoke.material.color.set('#63b4b5');
        spoke.bgp.visible = false;
        spoke.route.visible = false;
      }
      this.settleUntil = now + 400;
    }
    if (!on) return;

    this.routerTime += elapsed;
    const t = this.routerTime;
    const { spokes, rig, ring } = flow;
    const tmp = new THREE.Vector3();
    const point = new THREE.Vector3();

    // 1. Each VXC attaches to the router, and a BGP session comes up over it.
    spokes.forEach((spoke, i) => {
      const start = VROUTER.lead + i * VROUTER.spokeStagger;
      const progress = clamp01((t - start) / VROUTER.spokeDraw);
      this.drawTube(spoke.tube, spoke.segments, easeInOut(progress));
      const up = clamp01((t - start - VROUTER.spokeDraw - 0.1) / 0.5);
      spoke.material.color.set('#63b4b5').lerp(new THREE.Color('#12a2a6'), up);
      this.pointOnPath(spoke.path, spoke.path.total * 0.5, point);
      this.showChip(spoke.bgp, easeOut(up), tmp.copy(point).setY(point.y + 0.32), 0.23);
    });

    // 2 and 3. Routes go into the router, then out to the other sides, then traffic is routed through it.
    const local0 = t - VROUTER.loopStart;
    let animating = t < VROUTER.loopStart + VROUTER.loop;
    if (local0 < 0) {
      for (const spoke of spokes) spoke.route.visible = false;
      this.hideRig(rig);
    } else {
      const local = this.reduced ? Math.min(local0, VROUTER.loop - 0.01) : local0 % VROUTER.loop;
      const travel = (since: number) => clamp01(since / VROUTER.routeTravel);
      const chipFade = (p: number) => clamp01(p / 0.12) * clamp01((1 - p) / 0.12);
      let flash = 0;
      for (const spoke of spokes) spoke.route.visible = false;

      // The routes each side advertises travel in to the router.
      spokes.forEach((spoke, i) => {
        const p = travel(local - VROUTER.routesIn - i * VROUTER.routeStagger);
        if (p > 0 && p < 1) {
          this.pointOnPath(spoke.path, easeInOut(p) * spoke.path.total, point);
          this.showChip(spoke.route, chipFade(p), tmp.copy(point).setY(point.y + 0.22), 0.23);
        }
        if (p >= 1) flash = Math.max(flash, 1 - clamp01((local - VROUTER.routesIn - i * VROUTER.routeStagger - VROUTER.routeTravel) / 0.9));
      });
      // The router passes each route on to the next side.
      spokes.forEach((spoke, i) => {
        const owner = spokes[(i + 1) % spokes.length];
        const p = travel(local - VROUTER.routesOut - i * VROUTER.routeStagger);
        if (p > 0 && p < 1) {
          this.pointOnPath(spoke.path, (1 - easeInOut(p)) * spoke.path.total, point);
          this.showChip(owner.route, chipFade(p), tmp.copy(point).setY(point.y + 0.22), 0.23);
        }
      });

      // The router lights up as routes arrive.
      ring.visible = flash > 0.02;
      if (ring.visible) {
        ring.scale.setScalar(1 + (1 - flash) * 3);
        (ring.material as THREE.MeshBasicMaterial).opacity = flash * 0.7;
      }

      // Traffic goes from the customer, through the router, to the upstream network.
      const route = this.toLightPath([...spokes[0].path.points, ...[...spokes[1].path.points].reverse()]);
      const since = local - VROUTER.traffic;
      if (since >= 0 && since < VROUTER.passes * VROUTER.passTime) {
        const pass = since % VROUTER.passTime;
        this.drawRig(rig, route, [pass * VROUTER.speed, (pass - 0.45) * VROUTER.speed]);
      } else {
        this.hideRig(rig);
      }
      animating = !this.reduced || local0 < VROUTER.loop;
      if (this.reduced && local0 >= VROUTER.loop) {
        this.hideRig(rig);
        ring.visible = false;
        for (const spoke of spokes) spoke.route.visible = false;
      }
    }
    if (!this.reduced || animating) this.settleUntil = now + 400;
  }

  private updatePulses() {
    let index = 0;
    const speed = 0.95;
    const introDone = this.introDone;
    for (const fibre of this.fibres) {
      const seedPhase = (fibre.id.charCodeAt(0) + fibre.id.charCodeAt(2)) * 0.137;
      for (let k = 0; k < this.pulsesPerFibre; k++) {
        let visible = introDone ? fibre.level : 0;
        if (this.focus === 'consulting' || this.focus === 'content' || this.focus === 'vxc' || this.focus === 'vrouter' || this.focus === 'vswitch') visible = 0;
        if (visible < 0.02) {
          this.matrix.makeScale(0, 0, 0);
        } else {
          const phase = k / this.pulsesPerFibre + seedPhase;
          let u = ((this.time * speed) / fibre.length + phase) % 1;
          if (fibre.flow < 0) u = 1 - u;
          const sample = Math.min(fibre.samples.length - 1, Math.floor(u * fibre.samples.length));
          const edgeFade = Math.min(1, Math.min(u, 1 - u) * 14);
          const s = visible * edgeFade;
          this.matrix.compose(fibre.samples[sample], this.quaternion.identity(), this.scale.set(s, s, s));
        }
        this.pulses.setMatrixAt(index++, this.matrix);
      }
    }
    this.pulses.instanceMatrix.needsUpdate = true;
  }

  private updateLeds(dt: number) {
    this.ledClock += dt;
    if (this.ledClock < 0.28) return;
    this.ledClock = 0;
    const random = this.ledRandom;
    for (const cabinet of this.cabinets) {
      if (!cabinet.leds.visible || random() > 0.5) continue;
      const i = Math.floor(random() * cabinet.leds.count);
      cabinet.leds.setColorAt(i, this.color.set(this.pickLed(random)));
      if (cabinet.leds.instanceColor) cabinet.leds.instanceColor.needsUpdate = true;
    }
  }

  private updateCamera(dt: number) {
    const k = 1 - Math.exp(-dt * 3.2);
    this.target.lerp(this.targetGoal, k);
    this.zoom += (this.zoomGoal - this.zoom) * k;
    this.azimuth += (this.azimuthGoal - this.azimuth) * k;
    this.elevation += (this.elevationGoal - this.elevation) * k;
    this.pointer.lerp(this.pointerGoal, 1 - Math.exp(-dt * 2.5));

    // On the way down the page the camera swings round to face the racks, then returns.
    const swing = this.journeySwing;
    const sway = this.reduced ? 0 : Math.sin(this.time * 0.16) * 0.055;
    const strength = this.reduced ? 0.3 : 1;
    const azimuth = this.azimuth + sway + this.pointer.x * 0.07 - swing * 0.5 * strength;
    const elevation = this.elevation - this.pointer.y * 0.04 + swing * 0.17 * strength;
    const distance = 30;
    this.camera.position.set(
      this.target.x + Math.sin(azimuth) * Math.cos(elevation) * distance,
      this.target.y + Math.sin(elevation) * distance,
      this.target.z + Math.cos(azimuth) * Math.cos(elevation) * distance,
    );
    this.camera.lookAt(this.target);
    this.updateFrustum();
    this.camera.updateMatrixWorld();
  }

  /** Fits the model to the current frame, without resizing the canvas. */
  private updateFrustum() {
    const { w, h } = this.size;
    const frame = this.viewRect;
    const unitsPerPixel = Math.max(MODEL_H / frame.h, MODEL_W / frame.w) / (this.zoom * (1 - this.journeySwing * (this.reduced ? 0.02 : 0.08)));
    const centerX = frame.x + frame.w / 2;
    const centerY = frame.y + frame.h / 2;
    this.camera.left = -centerX * unitsPerPixel;
    this.camera.right = (w - centerX) * unitsPerPixel;
    this.camera.top = centerY * unitsPerPixel;
    this.camera.bottom = -(h - centerY) * unitsPerPixel;
    this.camera.updateProjectionMatrix();
  }

  private updateJourney(dt: number) {
    if (!this.journey) return;
    this.journeyProgress += (this.journeyGoal - this.journeyProgress) * (1 - Math.exp(-dt * 6));
    if (Math.abs(this.journeyGoal - this.journeyProgress) < 1e-4) this.journeyProgress = this.journeyGoal;
    this.applyJourneyFrame();
    this.syncFocus();
    if (this.isTravelling() !== this.labelsTravelling) this.applyLabelVisibility();
  }

  /** Places the model along its route, and lifts the hall apart at the midpoint. */
  private applyJourneyFrame() {
    if (!this.journey) return;
    const p = this.journeyProgress;
    const eased = p * p * p * (p * (p * 6 - 15) + 10);
    const { hero, panel } = this.journey;
    const lerp = THREE.MathUtils.lerp;
    const frame = this.viewRect;
    frame.x = lerp(hero.x, panel.x, eased);
    frame.y = lerp(hero.y, panel.y, eased);
    frame.w = lerp(hero.w, panel.w, eased);
    frame.h = lerp(hero.h, panel.h, eased);
    this.journeySwing = Math.sin(Math.PI * eased);

    const { w, h } = this.size;
    const clip =
      eased < 0.001
        ? 'none'
        : `inset(${frame.y.toFixed(1)}px ${(w - frame.x - frame.w).toFixed(1)}px ${(h - frame.y - frame.h).toFixed(1)}px ${frame.x.toFixed(1)}px round ${(3 * eased).toFixed(1)}px)`;
    if (clip !== this.lastClip) {
      this.container.style.clipPath = clip;
      this.lastClip = clip;
    }

    if (!this.reduced && Math.abs(this.journeySwing - this.appliedSwing) > 1e-3) {
      this.appliedSwing = this.journeySwing;
      this.applyLayerOffsets();
      const settled = this.journeySwing < 1e-3;
      if (settled || Math.abs(this.journeySwing - this.shadowSwing) > 0.05) {
        this.shadowSwing = this.journeySwing;
        this.renderer.shadowMap.needsUpdate = true;
      }
    }
  }

  private updateLabels() {
    if (!this.showLabels) return;
    const { w, h } = this.size;
    const spec = FOCUS[this.focus];

    // Tags stay inside both the model's frame and the visible window. The frame can run past the window edge.
    const box = this.container.getBoundingClientRect();
    const limits = {
      left: Math.max(this.viewRect.x, -box.left),
      right: Math.min(this.viewRect.x + this.viewRect.w, window.innerWidth - box.left),
    };
    for (const def of LABELS) {
      if (!spec.labels.includes(def.id)) continue;
      const el = this.labelEls.get(def.id);
      if (!el) continue;
      this.scratch.set(...def.at).project(this.camera);
      const x = (this.scratch.x * 0.5 + 0.5) * w;
      const y = (-this.scratch.y * 0.5 + 0.5) * h;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      this.keepTagInFrame(def, el, x, limits);
    }
  }

  /** Slides a label's tag sideways when it would otherwise run past an edge. */
  private keepTagInFrame(def: LabelDef, el: HTMLDivElement, x: number, limits: { left: number; right: number }) {
    if (def.side) return;
    const tag = el.firstElementChild as HTMLElement | null;
    if (!tag) return;
    const half = tag.offsetWidth / 2;
    const margin = 8;
    const overRight = x + half + margin - limits.right;
    const overLeft = limits.left + margin - (x - half);
    const shift = overRight > 0 ? -overRight : overLeft > 0 ? overLeft : 0;
    tag.style.transform = `translateX(calc(-50% + ${shift.toFixed(1)}px))`;
  }

  private resize() {
    const w = this.container.clientWidth || 1;
    const h = this.container.clientHeight || 1;
    this.size = { w, h };
    const narrow = w < 560;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, narrow ? 1.75 : 2));
    this.renderer.setSize(w, h, false);
    if (this.journey) this.applyJourneyFrame();
    else this.viewRect = { x: 0, y: 0, w, h };
    this.updateFrustum();
    this.applyLabelVisibility();
    this.settleUntil = performance.now() + 400;
  }

  private handlePointer = (event: PointerEvent) => {
    if (this.reduced || event.pointerType === 'touch') return;
    const rect = this.container.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    ) {
      this.pointerGoal.set(0, 0);
      return;
    }
    this.pointerGoal.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      ((event.clientY - rect.top) / rect.height) * 2 - 1,
    );
  };

  private handlePointerLeave = () => {
    this.pointerGoal.set(0, 0);
  };

  private syncLoop = () => {
    const shouldRun = this.inView && document.visibilityState === 'visible';
    if (shouldRun && !this.running) {
      this.running = true;
      this.lastFrame = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    } else if (!shouldRun && this.running) {
      this.running = false;
      cancelAnimationFrame(this.raf);
    }
  };

  private frame = (now: number) => {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this.frame);

    const sinceLast = (now - this.lastFrame) / 1000;
    const dt = Math.min(0.05, sinceLast);
    this.lastFrame = now;

    // With reduced motion the model holds still and only redraws after a change.
    if (this.reduced && this.introDone && now > this.settleUntil) return;
    if (!this.reduced) {
      this.time += dt;
      this.updateLeds(dt);
    }

    this.updateJourney(dt);
    this.updateIntro(Math.min(0.12, sinceLast), now);
    this.updateInstall(Math.min(0.12, sinceLast), now);
    this.updateConsult(Math.min(0.12, sinceLast), now);
    this.updateSwitchFlow(Math.min(0.12, sinceLast), now);
    this.updateContentLight(Math.min(0.12, sinceLast), now);
    this.updateMetro(Math.min(0.12, sinceLast), now);
    this.updateIp(Math.min(0.12, sinceLast), now);
    this.updateVxcFlow(Math.min(0.12, sinceLast), now);
    this.updateRouterFlow(Math.min(0.12, sinceLast), now);
    this.updateTones(1 - Math.exp(-dt * 5));
    this.updatePulses();
    this.updateCamera(dt);
    this.renderer.render(this.scene, this.camera);
    this.updateLabels();

    if (!this.readySent) {
      this.readySent = true;
      this.onReady?.();
    }
  };
}
