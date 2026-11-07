import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Lock, LockOpen } from 'lucide-react';
import { HOME_NETWORK, TRANSIT_NETWORKS, type TransitNetwork } from '../content/transit';
import { PHILIPPINES_PATH, WORLD, WORLD_H, WORLD_W } from '../content/worldMap';

/**
 * A globe the visitor can turn. The map is drawn once onto a canvas and wrapped round a sphere, and the
 * Philippines sits on a second, slightly larger layer so it stands out. Each country's network is a label
 * that follows its place on the globe and fades out when that place turns away.
 *
 * Drag to turn it, or use the arrow keys. The page still scrolls when a finger moves up or down.
 */

const TEX_W = 2048;
const TEX_H = 1024;
const PH_SCALE = 2.6;
const DEG = Math.PI / 180;
const LAT_LIMIT = 62;

interface Pin {
  key: string;
  kind: 'home' | 'open' | 'locked';
  asn: string;
  country: string;
  lon: number;
  lat: number;
  side: TransitNetwork['side'];
}

const PINS: Pin[] = [
  { key: 'home', kind: 'home', asn: HOME_NETWORK.asn, country: `${HOME_NETWORK.country}, Vitro Makati 2`, lon: HOME_NETWORK.lon, lat: HOME_NETWORK.lat, side: 'right' },
  ...TRANSIT_NETWORKS.map((network) => ({
    key: network.country,
    kind: (network.unlocked ? 'open' : 'locked') as Pin['kind'],
    asn: network.asn,
    country: network.country,
    lon: network.lon,
    lat: network.lat,
    side: network.side,
  })),
];

const SIDE: Record<Pin['side'], string> = {
  left: 'right-full mr-1.5 top-1/2 -translate-y-1/2',
  right: 'left-full ml-1.5 top-1/2 -translate-y-1/2',
  top: 'bottom-full mb-1.5 left-1/2 -translate-x-1/2',
  bottom: 'top-full mt-1.5 left-1/2 -translate-x-1/2',
};

const UNLOCKED = new Set(TRANSIT_NETWORKS.filter((network) => network.unlocked).map((network) => network.country));

/** The direction from the centre of the globe to a place on its surface. */
const toVector = (lon: number, lat: number, into = new THREE.Vector3()) =>
  into.set(Math.cos(lat * DEG) * Math.cos(lon * DEG), Math.sin(lat * DEG), -Math.cos(lat * DEG) * Math.sin(lon * DEG));

/** Draws the map paths onto a canvas that covers the whole world, using the paths' own box. */
const drawWorld = () => {
  const canvas = document.createElement('canvas');
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  ctx.fillStyle = '#e8f0f4';
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  // The paths cover latitude 84 to -58, so they are placed within the full 90 to -90.
  ctx.setTransform(TEX_W / WORLD_W, 0, 0, (TEX_H * (142 / 180)) / WORLD_H, 0, TEX_H * (6 / 180));
  ctx.lineWidth = 0.8;
  ctx.strokeStyle = '#f7fafc';
  for (const country of WORLD) {
    const path = new Path2D(country.d);
    ctx.fillStyle = UNLOCKED.has(country.name) ? '#a6d4d4' : '#cfd9e1';
    ctx.fill(path);
    ctx.stroke(path);
  }
  return canvas;
};

/** The Philippines, drawn larger around Manila on a see-through layer, with a soft shadow. */
const drawPhilippines = () => {
  const canvas = document.createElement('canvas');
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  const cx = ((HOME_NETWORK.lon + 180) / 360) * WORLD_W;
  const cy = ((84 - HOME_NETWORK.lat) / 142) * WORLD_H;
  ctx.setTransform(TEX_W / WORLD_W, 0, 0, (TEX_H * (142 / 180)) / WORLD_H, 0, TEX_H * (6 / 180));
  ctx.translate(cx, cy);
  ctx.scale(PH_SCALE, PH_SCALE);
  ctx.translate(-cx, -cy);
  const path = new Path2D(PHILIPPINES_PATH);
  ctx.shadowColor = 'rgba(11,37,54,0.45)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = '#0e6b70';
  ctx.fill(path);
  ctx.shadowColor = 'transparent';
  ctx.lineWidth = 1.2 / PH_SCALE;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke(path);
  return canvas;
};

interface GlobeProps {
  onFailed: () => void;
}

const Globe: React.FC<GlobeProps> = ({ onFailed }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const failedRef = useRef(onFailed);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      failedRef.current();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:pan-y;cursor:grab';
    host.insertBefore(renderer.domElement, host.firstChild);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 20);
    camera.position.set(0, 0, 3.7);

    const spin = new THREE.Group();
    spin.rotation.order = 'XYZ';
    scene.add(spin);

    const earthTexture = new THREE.CanvasTexture(drawWorld());
    earthTexture.colorSpace = THREE.SRGBColorSpace;
    earthTexture.anisotropy = 4;
    spin.add(new THREE.Mesh(new THREE.SphereGeometry(1, 72, 54), new THREE.MeshBasicMaterial({ map: earthTexture })));

    const phTexture = new THREE.CanvasTexture(drawPhilippines());
    phTexture.colorSpace = THREE.SRGBColorSpace;
    spin.add(new THREE.Mesh(new THREE.SphereGeometry(1.012, 72, 54), new THREE.MeshBasicMaterial({ map: phTexture, transparent: true, depthWrite: false })));

    // Meridians and parallels every 30 degrees, so the curve of the surface can be read as it turns.
    const grid: number[] = [];
    const at = new THREE.Vector3();
    const addLine = (fn: (t: number) => [number, number]) => {
      let previous: THREE.Vector3 | null = null;
      for (let i = 0; i <= 72; i++) {
        const [lo, la] = fn(i / 72);
        const point = toVector(lo, la, at).multiplyScalar(1.004).clone();
        if (previous) grid.push(previous.x, previous.y, previous.z, point.x, point.y, point.z);
        previous = point;
      }
    };
    for (let lo = -180; lo < 180; lo += 30) addLine((t) => [lo, -90 + t * 180]);
    for (let la = -60; la <= 60; la += 30) addLine((t) => [-180 + t * 360, la]);
    const gridGeometry = new THREE.BufferGeometry();
    gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(grid, 3));
    spin.add(new THREE.LineSegments(gridGeometry, new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.4, depthWrite: false })));

    // Shading that does not turn with the earth: the edge darkens and the side away from the light falls into shade.
    const shade = new THREE.Mesh(
      new THREE.SphereGeometry(1.016, 72, 54),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vView = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            float edge = pow(1.0 - max(dot(vNormal, vView), 0.0), 5.5);
            float lit = smoothstep(-0.25, 0.85, dot(vNormal, normalize(vec3(-0.55, 0.5, 0.7))));
            float shadow = (1.0 - lit) * 0.3;
            float shine = pow(max(dot(vNormal, normalize(vec3(-0.45, 0.45, 0.77))), 0.0), 18.0) * 0.1;
            vec3 color = mix(vec3(0.1, 0.27, 0.36), vec3(1.0), shine / max(shine + edge * 0.3 + shadow, 0.001));
            gl_FragColor = vec4(color, clamp(edge * 0.3 + shadow + shine, 0.0, 0.7));
          }`,
      }),
    );
    shade.renderOrder = 2;
    scene.add(shade);

    // A soft glow round the edge, so the globe sits in the page instead of looking cut out.
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(1.1, 72, 54),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            float strength = pow(max(0.5 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 3.5);
            gl_FragColor = vec4(0.25, 0.62, 0.68, clamp(strength * 1.1, 0.0, 0.25));
          }`,
      }),
    );
    scene.add(glow);

    // Where the globe is facing: the longitude and latitude at the centre.
    let lon = calm ? HOME_NETWORK.lon : HOME_NETWORK.lon - 80;
    let lat = 14;
    let velocityLon = 0;
    let velocityLat = 0;
    let dragging = false;
    let last = { x: 0, y: 0 };
    let intro = calm ? 1 : 0;
    let inView = true;
    let raf = 0;
    let lastTime = performance.now();
    let width = 1;
    let height = 1;

    const apply = () => {
      spin.rotation.y = (-90 - lon) * DEG;
      spin.rotation.x = lat * DEG;
    };

    const resize = () => {
      width = host.clientWidth || 1;
      height = host.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    const place = new THREE.Vector3();
    const updateChips = () => {
      spin.updateMatrixWorld();
      PINS.forEach((pin, i) => {
        const el = chipRefs.current[i];
        if (!el) return;
        place.copy(toVector(pin.lon, pin.lat, place)).applyMatrix4(spin.matrixWorld);
        const facing = (place.z - 0.18) / 0.22;
        const opacity = Math.max(0, Math.min(1, facing));
        place.project(camera);
        el.style.transform = `translate(${(place.x * 0.5 + 0.5) * width}px, ${(-place.y * 0.5 + 0.5) * height}px)`;
        el.style.opacity = String(opacity);
        el.style.visibility = opacity > 0 ? 'visible' : 'hidden';
      });
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      if (!inView) return;

      if (intro < 1) {
        intro = Math.min(1, intro + dt / 1.8);
        lon = HOME_NETWORK.lon - 80 * Math.pow(1 - intro, 3);
      }
      if (!dragging && (Math.abs(velocityLon) > 0.01 || Math.abs(velocityLat) > 0.01)) {
        lon += velocityLon * dt;
        lat = Math.max(-LAT_LIMIT, Math.min(LAT_LIMIT, lat + velocityLat * dt));
        const decay = Math.exp(-dt * 3.2);
        velocityLon *= decay;
        velocityLat *= decay;
      }
      apply();
      updateChips();
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    io.observe(host);

    // Degrees of turn for each pixel dragged. A full width of the globe is about 100 degrees.
    const perPixel = () => 100 / Math.max(1, width * 0.8);
    const el = renderer.domElement;
    const down = (event: PointerEvent) => {
      dragging = true;
      intro = 1;
      velocityLon = velocityLat = 0;
      last = { x: event.clientX, y: event.clientY };
      el.setPointerCapture(event.pointerId);
      el.style.cursor = 'grabbing';
      setTouched(true);
    };
    const move = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - last.x;
      const dy = event.pointerType === 'touch' ? 0 : event.clientY - last.y;
      last = { x: event.clientX, y: event.clientY };
      const k = perPixel();
      lon -= dx * k;
      lat = Math.max(-LAT_LIMIT, Math.min(LAT_LIMIT, lat + dy * k));
      // Keep the speed of the last moves, so the globe keeps turning a little after the release.
      velocityLon = calm ? 0 : -dx * k * 60;
      velocityLat = calm ? 0 : dy * k * 60;
    };
    const up = (event: PointerEvent) => {
      dragging = false;
      el.style.cursor = 'grab';
      if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);

    const keys = (event: KeyboardEvent) => {
      const step = 12;
      if (event.key === 'ArrowLeft') lon -= step;
      else if (event.key === 'ArrowRight') lon += step;
      else if (event.key === 'ArrowUp') lat = Math.min(LAT_LIMIT, lat + step);
      else if (event.key === 'ArrowDown') lat = Math.max(-LAT_LIMIT, lat - step);
      else return;
      event.preventDefault();
      intro = 1;
      setTouched(true);
    };
    host.addEventListener('keydown', keys);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      host.removeEventListener('keydown', keys);
      earthTexture.dispose();
      phTexture.dispose();
      scene.traverse((object) => {
        const item = object as THREE.Mesh;
        item.geometry?.dispose?.();
        (item.material as THREE.Material | undefined)?.dispose?.();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      role="group"
      aria-roledescription="interactive globe"
      aria-label="Globe with the Philippines enlarged and highlighted. Hong Kong and Australia are unlocked and the other countries are locked. Drag, or use the arrow keys, to turn it."
      tabIndex={0}
      className="relative mx-auto w-full max-w-[640px] aspect-square outline-none"
    >
      {PINS.map((pin, i) => (
        <div
          key={pin.key}
          ref={(node) => {
            chipRefs.current[i] = node;
          }}
          className="absolute left-0 top-0 pointer-events-none will-change-transform"
          style={{ visibility: 'hidden' }}
        >
          <span
            className={`absolute -left-1 -top-1 rounded-full ${
              pin.kind === 'home' ? 'w-3 h-3 -left-1.5 -top-1.5 bg-white ring-2 ring-accent' : pin.kind === 'open' ? 'w-2 h-2 bg-accent' : 'w-2 h-2 bg-ink-3/60'
            }`}
          />
          <span
            className={`absolute ${SIDE[pin.side]} whitespace-nowrap rounded-[2px] border leading-tight ${
              pin.kind === 'home'
                ? 'bg-paper border-accent px-2 py-1 shadow-sm mt-5'
                : pin.kind === 'open'
                  ? 'bg-paper border-accent text-ink px-1.5 py-0.5 text-[0.6875rem] flex items-center gap-1'
                  : 'hidden md:flex items-center gap-1 bg-paper/80 border-rule border-dashed text-ink-3 px-1.5 py-0.5 text-[0.6875rem]'
            }`}
          >
            {pin.kind === 'home' ? (
              <>
                <span className="block text-[0.6875rem] text-ink-2">{pin.country}</span>
                <span className="block font-data text-[0.8125rem] font-semibold text-accent">{pin.asn}</span>
              </>
            ) : (
              <>
                {pin.kind === 'open' ? <LockOpen size={11} className="text-accent" aria-hidden="true" /> : <Lock size={11} aria-hidden="true" />}
                <span className="font-data font-semibold">{pin.asn}</span>
                <span>{pin.country}</span>
              </>
            )}
          </span>
        </div>
      ))}
      <p
        aria-hidden="true"
        className={`absolute left-1/2 -translate-x-1/2 -bottom-7 text-[0.8125rem] text-ink-3 transition-opacity duration-300 ${touched ? 'opacity-0' : 'opacity-100'}`}
      >
        Drag to turn the globe
      </p>
    </div>
  );
};

export default Globe;
