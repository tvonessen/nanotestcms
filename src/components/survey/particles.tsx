'use client';

import React from 'react';

// Spec 9.13 — one full-screen canvas, pointer-events off, cleared when empty.
// All animation is skipped when the device asks for reduced motion.

export type ParticleKind = 'next' | 'gate' | 'milestone' | 'thanks';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  g: number;
  r: number;
  hex: boolean;
  rot: number;
  rotV: number;
  life: number;
  maxLife: number;
  color: string;
}

const KIND_SPEC: Record<
  ParticleKind,
  {
    count: number;
    speed: number;
    spread: number;
    lift: number;
    gravity: number;
    minLife: number;
    maxLife: number;
    hexShare: number;
  }
> = {
  next: {
    count: 12,
    speed: 3.2,
    spread: Math.PI * 2,
    lift: -0.6,
    gravity: 0.13,
    minLife: 38,
    maxLife: 60,
    hexShare: 0,
  },
  gate: {
    count: 22,
    speed: 3.6,
    spread: Math.PI * 2,
    lift: 0,
    gravity: 0.13,
    minLife: 38,
    maxLife: 60,
    hexShare: 0,
  },
  milestone: {
    count: 26,
    speed: 4,
    spread: 2.4,
    lift: -0.4,
    gravity: -0.015,
    minLife: 50,
    maxLife: 72,
    hexShare: 0.4,
  },
  thanks: {
    count: 34,
    speed: 5,
    spread: 1.8,
    lift: -0.9,
    gravity: 0.12,
    minLife: 55,
    maxLife: 77,
    hexShare: 0.35,
  },
};

function pickColors(dark: boolean): string[] {
  return dark
    ? ['#2cc49b', '#71c9b0', '#b5e6d7', '#eff1f0']
    : ['#13a983', '#4fbf9f', '#88d4bf', '#2c2c2c'];
}

export interface ParticleCanvasRef {
  burst: (kind: ParticleKind, x: number, y: number) => void;
}

const ParticleCanvas = React.forwardRef<ParticleCanvasRef>((_props, ref) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const particlesRef = React.useRef<Particle[]>([]);
  const rafRef = React.useRef<number>(0);
  const darkRef = React.useRef(false);

  const stopIfEmpty = React.useCallback(() => {
    if (particlesRef.current.length === 0 && rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx && canvasRef.current)
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, []);

  const frame = React.useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const ps = particlesRef.current;
    for (let i = ps.length - 1; i >= 0; i--) {
      const p = ps[i];
      p.vx *= 0.985;
      p.vy = p.vy * 0.985 + p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      p.rot += p.rotV;
      if (p.life <= 0) {
        ps.splice(i, 1);
        continue;
      }
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.strokeStyle = p.color;
      if (p.hex) {
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        for (let k = 0; k < 6; k++) {
          const a = p.rot + (k * Math.PI) / 3;
          const rr = p.r * 1.9;
          const px = p.x + Math.cos(a) * rr;
          const py = p.y + Math.sin(a) * rr;
          if (k === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    if (ps.length > 0) {
      rafRef.current = requestAnimationFrame(frame);
    } else {
      rafRef.current = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const burst = React.useCallback(
    (kind: ParticleKind, x: number, y: number) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const spec = KIND_SPEC[kind];
      const colors = pickColors(darkRef.current);
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== window.innerWidth * dpr) {
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
      }
      const ctx = canvas.getContext('2d');
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (let i = 0; i < spec.count; i++) {
        const angle =
          kind === 'next' || kind === 'gate'
            ? Math.random() * Math.PI * 2
            : -Math.PI / 2 + (Math.random() - 0.5) * spec.spread;
        const speed = spec.speed * (0.45 + Math.random() * 0.8);
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + spec.lift,
          g: spec.gravity,
          r: 2.6 * (0.6 + Math.random() * 0.9),
          hex: Math.random() < spec.hexShare,
          rot: Math.random() * Math.PI * 2,
          rotV: (Math.random() - 0.5) * 0.08,
          life: spec.minLife + Math.random() * (spec.maxLife - spec.minLife),
          maxLife: spec.maxLife,
          color: colors[Math.random() < 0.04 ? 3 : Math.floor(Math.random() * 3)],
        });
      }
      if (!rafRef.current) rafRef.current = requestAnimationFrame(frame);
    },
    [frame],
  );

  React.useImperativeHandle(ref, () => ({ burst }), [burst]);

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    darkRef.current = mq.matches;
    const onChange = (e: MediaQueryListEvent) => {
      darkRef.current = e.matches;
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  React.useEffect(() => stopIfEmpty, [stopIfEmpty]);

  return <canvas ref={canvasRef} className="sv-particles" aria-hidden="true" />;
});

ParticleCanvas.displayName = 'ParticleCanvas';

export default ParticleCanvas;
