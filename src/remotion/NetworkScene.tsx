import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

/**
 * NetworkScene — the hero signature element.
 *
 * An ambient "carrier-neutral exchange fabric": a Techne core node peering with
 * exchange points, datacenters and CDN caches, with packets streaming along the
 * spokes and routing pulses radiating from the core.
 *
 * Every animated value is PERIODIC over `durationInFrames` (sin waves + modulo
 * cycles whose periods divide the duration), so the Player loops seamlessly with
 * no boot/redraw flicker. Built with Remotion's frame-driven `interpolate` —
 * never CSS transitions/animations, which don't render deterministically.
 */

export const SCENE = { width: 1000, height: 1000, fps: 30, durationInFrames: 300 };

const CX = SCENE.width / 2;
const CY = SCENE.height / 2;

const C = {
  paper: 'oklch(98.5% 0.005 199)',
  paper2: 'oklch(96% 0.010 199)',
  ink: 'oklch(9% 0.020 200)',
  ink2: 'oklch(46% 0.030 199)',
  rule: 'oklch(88% 0.015 199)',
  accent: 'oklch(55% 0.130 199)',
};

type Sat = { id: string; label: string; angle: number; radius: number; dir: 1 | -1 };

// Peripheral peers — real PH exchange / DC / CDN vocabulary grounds the graphic
// in the subject. `dir` alternates packet flow so traffic reads as bidirectional.
const SATELLITES: Sat[] = [
  { id: 'phopenix', label: 'PHOpenIX', angle: -90, radius: 345, dir: -1 },
  { id: 'vitro', label: 'VITRO DC', angle: -38, radius: 365, dir: 1 },
  { id: 'aws', label: 'AWS DX', angle: 16, radius: 315, dir: -1 },
  { id: 'cloudflare', label: 'CLOUDFLARE', angle: 70, radius: 360, dir: 1 },
  { id: 'ggc', label: 'GOOGLE GGC', angle: 128, radius: 330, dir: -1 },
  { id: 'akamai', label: 'AKAMAI', angle: 180, radius: 365, dir: 1 },
  { id: 'edge', label: 'ISP EDGE', angle: 226, radius: 325, dir: -1 },
];

const POLAR = (angle: number, radius: number) => {
  const r = (angle * Math.PI) / 180;
  return { x: CX + Math.cos(r) * radius, y: CY + Math.sin(r) * radius };
};

const NODES = SATELLITES.map((s) => ({ ...s, ...POLAR(s.angle, s.radius) }));

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const PACKET_PERIOD = 75; // divides durationInFrames → seamless loop
const PACKETS_PER_EDGE = 3;
const GLOW_PERIOD = 100; // divides durationInFrames
const RING_PERIOD = 150; // divides durationInFrames

export const NetworkScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Breathing glow for a node, offset by phase so they don't pulse in unison.
  const breathe = (phase: number) =>
    0.5 + 0.5 * Math.sin((2 * Math.PI * frame) / GLOW_PERIOD + phase);

  return (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <svg
        width={SCENE.width}
        height={SCENE.height}
        viewBox={`0 0 ${SCENE.width} ${SCENE.height}`}
      >
        <defs>
          {/* Faint engineered dot-grid — technical texture without noise. */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill={C.ink} opacity="0.05" />
          </pattern>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.accent} stopOpacity="0.18" />
            <stop offset="100%" stopColor={C.accent} stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width={SCENE.width} height={SCENE.height} fill="url(#grid)" />

        {/* Soft ambient halo behind the core */}
        <circle cx={CX} cy={CY} r={300} fill="url(#coreGlow)" />

        {/* Outer mesh ring — static structure between adjacent peers (the "fabric"). */}
        {NODES.map((n, i) => {
          const m = NODES[(i + 1) % NODES.length];
          return (
            <line
              key={`mesh-${n.id}`}
              x1={n.x}
              y1={n.y}
              x2={m.x}
              y2={m.y}
              stroke={C.rule}
              strokeWidth={1}
              opacity={0.7}
            />
          );
        })}

        {/* Core spokes */}
        {NODES.map((n) => (
          <line
            key={`spoke-${n.id}`}
            x1={CX}
            y1={CY}
            x2={n.x}
            y2={n.y}
            stroke={C.accent}
            strokeWidth={1.5}
            opacity={0.28}
          />
        ))}

        {/* Routing pulse rings radiating from the core */}
        {[0, 50, 100].map((offset) => {
          const p = ((frame + offset) % RING_PERIOD) / RING_PERIOD;
          const r = interpolate(p, [0, 1], [22, 168]);
          const o = interpolate(p, [0, 1], [0.4, 0]);
          return (
            <circle
              key={`ring-${offset}`}
              cx={CX}
              cy={CY}
              r={r}
              fill="none"
              stroke={C.accent}
              strokeWidth={1.5}
              opacity={o}
            />
          );
        })}

        {/* Packets streaming along each spoke */}
        {NODES.map((n, i) =>
          Array.from({ length: PACKETS_PER_EDGE }).map((_, k) => {
            const offset = i * 17 + k * (PACKET_PERIOD / PACKETS_PER_EDGE);
            const raw = ((frame + offset) % PACKET_PERIOD) / PACKET_PERIOD;
            const t = n.dir === 1 ? raw : 1 - raw;
            const x = lerp(CX, n.x, t);
            const y = lerp(CY, n.y, t);
            const o = Math.sin(Math.PI * raw); // fade in/out at endpoints
            return (
              <circle
                key={`pkt-${n.id}-${k}`}
                cx={x}
                cy={y}
                r={3.5}
                fill={C.accent}
                opacity={o}
              />
            );
          })
        )}

        {/* Satellite peers */}
        {NODES.map((n, i) => {
          const g = breathe(i * 1.1);
          const onLeft = n.x < CX;
          return (
            <g key={`node-${n.id}`}>
              <circle cx={n.x} cy={n.y} r={16} fill={C.accent} opacity={0.1 + g * 0.12} />
              <circle cx={n.x} cy={n.y} r={6} fill={C.paper} stroke={C.accent} strokeWidth={2} />
              <text
                x={n.x + (onLeft ? -18 : 18)}
                y={n.y + 5}
                textAnchor={onLeft ? 'end' : 'start'}
                fontFamily="'IBM Plex Mono', monospace"
                fontSize={19}
                fontWeight={500}
                letterSpacing="0.04em"
                fill={C.ink2}
              >
                {n.label}
              </text>
            </g>
          );
        })}

        {/* Core node */}
        <circle cx={CX} cy={CY} r={30} fill={C.accent} opacity={0.12 + breathe(0) * 0.06} />
        <circle cx={CX} cy={CY} r={15} fill={C.accent} />
        <circle cx={CX} cy={CY} r={6} fill={C.paper} />
        <text
          x={CX}
          y={CY + 56}
          textAnchor="middle"
          fontFamily="'IBM Plex Mono', monospace"
          fontSize={20}
          fontWeight={600}
          letterSpacing="0.12em"
          fill={C.ink}
        >
          TECHNE&nbsp;CORE
        </text>

        {/* Live capacity readout — periodic counter that resets cleanly on loop */}
        <text
          x={CX}
          y={CY - 48}
          textAnchor="middle"
          fontFamily="'IBM Plex Mono', monospace"
          fontSize={15}
          fontWeight={500}
          letterSpacing="0.1em"
          fill={C.accent}
        >
          {`AS·PEER ${Math.round(interpolate(frame, [0, durationInFrames], [120, 214]))} Gbps`}
        </text>
      </svg>
    </AbsoluteFill>
  );
};
