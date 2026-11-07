import * as THREE from 'three';

/**
 * The 3D rack on the splash screen. Servers slide into the rack one at a time, from the bottom up, wait a
 * moment, then slide back out one at a time from the top down, and the whole thing repeats until the page has
 * loaded. It uses the same colours and the same look as the data hall on the home page.
 */

const SLOTS = 6;
const SLOT_PITCH = 0.42;
const SLOT_FIRST = 0.3;
const RACK_W = 1.1;
const RACK_H = 3.0;
const RACK_D = 1.5;
const UNIT_W = 0.92;
const UNIT_H = 0.34;
const UNIT_D = 1.1;
const SEATED_Z = RACK_D / 2 - 0.03; // where a seated server's front face sits: nearly flush with the rack's front
const START_Z = 2.7; // how far in front of its seat a server waits

const TIMING = {
  slide: 0.55, // one server travelling
  gap: 0.34, // gap between one server starting and the next
  hold: 0.7, // the rack stays full
  rest: 0.5, // the rack stays empty
};
const IN_TIME = (SLOTS - 1) * TIMING.gap + TIMING.slide;
const OUT_TIME = IN_TIME;
const CYCLE = IN_TIME + TIMING.hold + OUT_TIME + TIMING.rest;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

export class SplashRack {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -50, 50);
  private servers: { group: THREE.Group; y: number }[] = [];
  private container: HTMLElement;
  private ro: ResizeObserver;
  private raf = 0;
  private start = performance.now();
  private disposed = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
    container.appendChild(this.renderer.domElement);

    this.build();

    // Seen from the front and a little to the right, from slightly above, like the hall.
    const azimuth = (32 * Math.PI) / 180;
    const elevation = (24 * Math.PI) / 180;
    const target = new THREE.Vector3(0.4, 1.35, 1.0);
    this.camera.position.set(
      target.x + Math.sin(azimuth) * Math.cos(elevation) * 20,
      target.y + Math.sin(elevation) * 20,
      target.z + Math.cos(azimuth) * Math.cos(elevation) * 20,
    );
    this.camera.lookAt(target);

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(container);
    this.resize();
    this.raf = requestAnimationFrame(this.frame);
  }

  private build() {
    this.scene.add(new THREE.HemisphereLight('#ffffff', '#aebbc4', 1.9));
    const sun = new THREE.DirectionalLight('#ffffff', 1.7);
    sun.position.set(-5, 12, 8);
    this.scene.add(sun);

    const box = new THREE.BoxGeometry(1, 1, 1);
    const mesh = (material: THREE.Material, size: [number, number, number], at: [number, number, number], parent: THREE.Object3D = this.scene) => {
      const item = new THREE.Mesh(box, material);
      item.scale.set(...size);
      item.position.set(...at);
      parent.add(item);
      return item;
    };

    // The floor, with a soft shadow under the rack.
    mesh(new THREE.MeshStandardMaterial({ color: '#f7f9fa', roughness: 0.95 }), [4.6, 0.2, 4.4], [0.4, -0.1, 1.2]);
    const edge = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(4.6, 0.2, 4.4)),
      new THREE.LineBasicMaterial({ color: '#cfd9e0' }),
    );
    edge.position.set(0.4, -0.1, 1.2);
    this.scene.add(edge);
    const shadow = new THREE.Mesh(new THREE.CircleGeometry(1, 32), new THREE.MeshBasicMaterial({ color: '#0b2536', transparent: true, opacity: 0.13, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2;
    shadow.scale.set(1.5, 1.1, 1);
    shadow.position.set(0.15, 0.01, 0.15);
    this.scene.add(shadow);

    // The rack: an open frame, so the servers can be seen as they go in.
    const frame = new THREE.MeshStandardMaterial({ color: '#123448', roughness: 0.62, metalness: 0.08 });
    const inner = new THREE.MeshStandardMaterial({ color: '#0b2536', roughness: 0.8 });
    mesh(inner, [RACK_W, RACK_H, 0.08], [0, RACK_H / 2, -RACK_D / 2 + 0.04]);
    mesh(frame, [0.07, RACK_H, RACK_D], [-RACK_W / 2 + 0.035, RACK_H / 2, 0]);
    mesh(frame, [0.07, RACK_H, RACK_D], [RACK_W / 2 - 0.035, RACK_H / 2, 0]);
    mesh(frame, [RACK_W, 0.09, RACK_D], [0, RACK_H - 0.045, 0]);
    mesh(frame, [RACK_W, 0.09, RACK_D], [0, 0.045, 0]);
    // A thin teal line down each front post, so it reads as the Techne rack.
    const trim = new THREE.MeshStandardMaterial({ color: '#0e6b70', roughness: 0.5 });
    mesh(trim, [0.03, RACK_H - 0.1, 0.03], [-RACK_W / 2 + 0.06, RACK_H / 2, RACK_D / 2 + 0.005]);
    mesh(trim, [0.03, RACK_H - 0.1, 0.03], [RACK_W / 2 - 0.06, RACK_H / 2, RACK_D / 2 + 0.005]);

    // The servers: a body, a lighter front panel and three small lights, waiting in front of the rack.
    const body = new THREE.MeshStandardMaterial({ color: '#1b465d', roughness: 0.55 });
    const face = new THREE.MeshStandardMaterial({ color: '#2a647d', roughness: 0.5 });
    const leds = ['#35d0c4', '#7fe08a', '#f2b84b'].map((color) => new THREE.MeshBasicMaterial({ color }));
    for (let i = 0; i < SLOTS; i++) {
      const y = SLOT_FIRST + i * SLOT_PITCH;
      const group = new THREE.Group();
      mesh(body, [UNIT_W, UNIT_H, UNIT_D], [0, 0, -UNIT_D / 2], group);
      mesh(face, [UNIT_W, UNIT_H, 0.04], [0, 0, 0.02], group);
      leds.forEach((material, k) => mesh(material, [0.05, 0.035, 0.012], [-UNIT_W / 2 + 0.12 + k * 0.08, 0, 0.05], group));
      mesh(trim, [0.26, 0.03, 0.012], [UNIT_W / 2 - 0.22, 0, 0.05], group);
      group.position.set(0, y, SEATED_Z + START_Z);
      group.visible = false;
      this.scene.add(group);
      this.servers.push({ group, y });
    }
  }

  private resize() {
    const width = this.container.clientWidth || 1;
    const height = this.container.clientHeight || 1;
    this.renderer.setSize(width, height, false);
    const frustum = 5.5;
    const aspect = width / height;
    this.camera.left = (-frustum * aspect) / 2;
    this.camera.right = (frustum * aspect) / 2;
    this.camera.top = frustum / 2;
    this.camera.bottom = -frustum / 2;
    this.camera.updateProjectionMatrix();
  }

  /** Where each server is at a moment in the cycle. A server only shows while it is moving or seated. */
  private place(t: number) {
    const time = t % CYCLE;
    const outStart = IN_TIME + TIMING.hold;
    this.servers.forEach((server, i) => {
      let progress = 0; // 0 is waiting outside the rack, 1 is seated in it
      let visible = false;
      if (time < IN_TIME) {
        progress = clamp01((time - i * TIMING.gap) / TIMING.slide);
        visible = time >= i * TIMING.gap;
      } else if (time < outStart) {
        progress = 1;
        visible = true;
      } else if (time < outStart + OUT_TIME) {
        // Out again, from the top server down.
        progress = 1 - clamp01((time - outStart - (SLOTS - 1 - i) * TIMING.gap) / TIMING.slide);
        visible = progress > 0.001;
      }
      server.group.visible = visible;
      server.group.position.z = SEATED_Z + START_Z * (1 - easeInOut(progress));
      server.group.scale.setScalar(0.85 + 0.15 * clamp01(progress * 8));
    });
  }

  private frame = (now: number) => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.frame);
    this.place((now - this.start) / 1000);
    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
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
  }
}
