import * as THREE from 'three';

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
const TRAY_Y = 2.46;
const BACK_Z = -2.45;
const FRONT_Z = 2.15;
const SWITCH_Y = 3.25;
const ROUTER_Y = 4.25;
const RISER_TOP = 5.25;

// Size of the whole hall on screen, in model units, used to fit it to a frame.
const MODEL_W = 15.2;
const MODEL_H = 9.9;

interface Cabinet {
  id: string;
  group: THREE.Group;
  x: number;
  z: number;
  body: THREE.MeshStandardMaterial;
  door: THREE.MeshStandardMaterial;
  unit: THREE.MeshStandardMaterial;
  leds: THREE.InstancedMesh;
  style: CabinetStyle;
  tone: Tone;
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
    azimuth: 40,
    elevation: 30,
    cabinets: ['ed0', 'ed1', 'cu1'],
    fibres: { up0: -1, up1: -1, ed0: 1, ed1: 1, cu1: -1 },
    slabs: [],
    labels: ['carriers', 'edge', 'your-rack'],
    target: [0.5, 1.5, -0.3],
    zoom: 1.04,
  },
  content: {
    azimuth: 18,
    elevation: 31,
    cabinets: ['cd0', 'cd1', 'cd2', 'cu1'],
    fibres: { cd0: 1, cd1: 1, cd2: 1, cu1: -1 },
    slabs: [],
    labels: ['cdn', 'your-rack'],
    target: [-2, 1.1, 0],
    zoom: 1.24,
  },
  vxc: {
    azimuth: 33,
    elevation: 35,
    cabinets: ['cu3', 'pa1'],
    fibres: { cu3: 1, pa1: -1 },
    slabs: [],
    labels: ['your-port', 'partner-port', 'vxc'],
    target: [-0.3, 1.1, -0.1],
    zoom: 1.22,
  },
  vswitch: {
    azimuth: 26,
    elevation: 37,
    cabinets: ['cu0', 'cu2', 'pa0', 'pa2', 'fa0', 'fa1'],
    fibres: { cu0: 1, cu2: 1, pa0: -1, pa2: -1 },
    slabs: ['vswitch'],
    labels: ['vswitch', 'fabric'],
    target: [-0.1, 1.5, -0.1],
    zoom: 1.12,
  },
  vrouter: {
    azimuth: 41,
    elevation: 34,
    cabinets: ['cu1', 'ed0', 'fa0', 'fa1'],
    fibres: { cu1: 1, ed0: 1, up0: 1 },
    slabs: ['vrouter'],
    labels: ['vrouter', 'carriers', 'fabric'],
    target: [0.3, 1.8, -0.3],
    zoom: 1.06,
  },
  consulting: {
    azimuth: 45,
    elevation: 33,
    cabinets: 'all',
    fibres: 'all',
    slabs: 'all',
    labels: ['design'],
    target: [0, 1.15, 0],
    zoom: 1,
    blueprint: true,
  },
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
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
  private introStart = -1;
  private readonly introLength = 2.1;
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

    if (this.reduced) this.finishIntro();
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
    this.model.add(slab);

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
    this.model.add(new THREE.LineSegments(gridGeometry, new THREE.LineBasicMaterial({ color: COLORS.grid })));

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
    this.model.add(ground);
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

      const body = new THREE.MeshStandardMaterial({ color: palette.body, roughness: 0.62, metalness: 0.08 });
      const door = new THREE.MeshStandardMaterial({ color: palette.door, roughness: 0.58, metalness: 0.08 });
      const unit = new THREE.MeshStandardMaterial({ color: palette.unit, roughness: 0.55 });

      const bodyMesh = new THREE.Mesh(bodyGeometry, body);
      bodyMesh.position.y = CAB_H / 2;
      bodyMesh.castShadow = true;
      bodyMesh.receiveShadow = true;
      group.add(bodyMesh);

      const doorMesh = new THREE.Mesh(doorGeometry, door);
      doorMesh.position.set(0, CAB_H / 2, CAB_D / 2 + 0.006);
      group.add(doorMesh);

      const edgeLines = new THREE.LineSegments(edgeGeometry, this.blueprintLine);
      edgeLines.position.y = CAB_H / 2;
      group.add(edgeLines);

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
      group.add(units, leds);

      this.model.add(group);
      this.cabinets.push({ id, group, x, z, body, door, unit, leds, style, tone: 'normal' });
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

      this.slabs.push({ id, face, edge, ports, tone: 'normal' });
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
        new THREE.LineBasicMaterial({ color: COLORS.slab, transparent: true, opacity: 0.55 }),
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
      const show = this.showLabels && fits && !this.labelsTravelling && spec.labels.includes(id);
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
      if (cabinet.tone === 'lit' && cabinet.style !== 'fabric') palette = LIT_COLORS;
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
      slab.face.opacity += (faceOpacity - slab.face.opacity) * k;
      slab.edge.opacity += (lineOpacity - slab.edge.opacity) * k;
      slab.ports.opacity += (lineOpacity - slab.ports.opacity) * k;
    }

    const trayGoal = spec.cabinets === 'all' ? COLORS.tray : COLORS.trayDim;
    this.trayMaterial.color.lerp(this.color.set(trayGoal), k);
  }

  private finishIntro() {
    this.introStart = -2;
    for (const cabinet of this.cabinets) cabinet.group.scale.y = 1;
    for (const fibre of this.fibres) {
      (fibre.mesh.geometry as THREE.BufferGeometry).setDrawRange(0, fibre.indexCount);
    }
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.shadowMap.needsUpdate = true;
  }

  private updateIntro(now: number) {
    if (this.introStart === -2) return;
    if (this.introStart < 0) this.introStart = now;
    const elapsed = (now - this.introStart) / 1000;

    for (const cabinet of this.cabinets) {
      const distance = Math.hypot(cabinet.x, cabinet.z) / 7;
      const p = clamp01((elapsed - distance * 0.45) / 0.75);
      cabinet.group.scale.y = Math.max(0.001, easeOut(p));
    }
    for (const fibre of this.fibres) {
      const p = easeOut(clamp01((elapsed - 0.75) / 1.1));
      const count = Math.floor((fibre.indexCount * p) / 6) * 6;
      (fibre.mesh.geometry as THREE.BufferGeometry).setDrawRange(0, count);
    }
    if (elapsed > this.introLength) this.finishIntro();
  }

  private updatePulses() {
    let index = 0;
    const speed = 0.95;
    const introDone = this.introStart === -2;
    for (const fibre of this.fibres) {
      const seedPhase = (fibre.id.charCodeAt(0) + fibre.id.charCodeAt(2)) * 0.137;
      for (let k = 0; k < this.pulsesPerFibre; k++) {
        let visible = introDone ? fibre.level : 0;
        if (this.focus === 'consulting') visible = 0;
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
      this.virtualGroup.position.y = this.journeySwing * 0.7;
      this.cablingGroup.position.y = this.journeySwing * 0.25;
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
    for (const def of LABELS) {
      if (!spec.labels.includes(def.id)) continue;
      const el = this.labelEls.get(def.id);
      if (!el) continue;
      this.scratch.set(...def.at).project(this.camera);
      const x = (this.scratch.x * 0.5 + 0.5) * w;
      const y = (-this.scratch.y * 0.5 + 0.5) * h;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      this.keepTagInFrame(def, el, x);
    }
  }

  /** Slides a label's tag sideways when it would otherwise run past the frame edge. */
  private keepTagInFrame(def: LabelDef, el: HTMLDivElement, x: number) {
    if (def.side) return;
    const tag = el.firstElementChild as HTMLElement | null;
    if (!tag) return;
    const half = tag.offsetWidth / 2;
    const margin = 6;
    const overRight = x + half + margin - (this.viewRect.x + this.viewRect.w);
    const overLeft = this.viewRect.x + margin - (x - half);
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

    const dt = Math.min(0.05, (now - this.lastFrame) / 1000);
    this.lastFrame = now;

    // With reduced motion the model holds still and only redraws after a change.
    if (this.reduced && now > this.settleUntil) return;
    if (!this.reduced) {
      this.time += dt;
      this.updateLeds(dt);
    }

    this.updateJourney(dt);
    this.updateIntro(now);
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
