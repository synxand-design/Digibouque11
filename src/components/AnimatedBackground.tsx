"use client";

import type { BackgroundDef, ParticleKind } from "@/lib/occasions";
import { CSSProperties, useMemo } from "react";

// Deterministic pseudo-random so server and client render identical markup.
function seeded(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

interface P {
  left: number;
  top: number;
  size: number;
  dur: number;
  delay: number;
  sway: number;
  hue: number;
  spin: number;
}

function makeParticles(kind: ParticleKind, count: number, seedBase: number): P[] {
  const r = seeded(seedBase + kind.length * 17);
  return Array.from({ length: count }, () => ({
    left: r() * 100,
    top: r() * 100,
    size: 0.5 + r(),
    dur: 8 + r() * 14,
    delay: -r() * 20,
    sway: (r() - 0.5) * 120,
    hue: r() * 360,
    spin: 180 + r() * 540,
  }));
}

const PASTELS = ["#ff9ec4", "#ffd166", "#8ecae6", "#c8b6ff", "#95d5b2", "#ffadad", "#fdffb6"];

function Layer({ kind, count, color, dim }: { kind: ParticleKind; count: number; color?: string; dim: boolean }) {
  const ps = useMemo(() => makeParticles(kind, count, count * 31 + kind.charCodeAt(0)), [kind, count]);
  const style = (p: P, extra?: CSSProperties): CSSProperties => ({
    left: `${p.left}%`,
    top: `${p.top}%`,
    ["--dur" as string]: `${p.dur}s`,
    ["--delay" as string]: `${p.delay}s`,
    ["--sway" as string]: `${p.sway}px`,
    ["--spin" as string]: `${p.spin}deg`,
    ["--dx" as string]: `${p.sway / 4}px`,
    ["--dy" as string]: `${-10 - p.size * 12}px`,
    ...extra,
  });
  const alpha = dim ? 0.5 : 0.85;

  switch (kind) {
    case "balloons":
      return (
        <>
          {ps.map((p, i) => (
            <div key={i} className="absolute anim-float-up" style={style(p, { top: "auto" })}>
              <svg width={26 + p.size * 36} viewBox="0 0 60 90" style={{ opacity: alpha }}>
                <defs>
                  <radialGradient id={`bg${i}`} cx="35%" cy="30%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                    <stop offset="35%" stopColor={PASTELS[i % PASTELS.length]} />
                    <stop offset="100%" stopColor={PASTELS[i % PASTELS.length]} stopOpacity="0.85" />
                  </radialGradient>
                </defs>
                <ellipse cx="30" cy="30" rx="26" ry="32" fill={`url(#bg${i})`} />
                <path d="M30 62 l-4 6 h8 z" fill={PASTELS[i % PASTELS.length]} />
                <path d="M30 68 q-6 10 2 22" stroke="#999" strokeWidth="1" fill="none" opacity="0.6" />
              </svg>
            </div>
          ))}
        </>
      );
    case "confetti":
      return (
        <>
          {ps.map((p, i) => (
            <div
              key={i}
              className="absolute anim-fall"
              style={style(p, {
                top: "auto",
                width: 6 + p.size * 6,
                height: 10 + p.size * 8,
                background: PASTELS[i % PASTELS.length],
                borderRadius: i % 3 === 0 ? "50%" : 2,
                opacity: alpha,
              })}
            />
          ))}
        </>
      );
    case "bokeh":
    case "lights":
      return (
        <>
          {ps.map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full anim-glow"
              style={style(p, {
                width: 30 + p.size * (kind === "lights" ? 40 : 90),
                height: 30 + p.size * (kind === "lights" ? 40 : 90),
                background: `radial-gradient(circle, ${color || (kind === "lights" ? "#ffe6a3" : "#ffffff")} 0%, transparent 70%)`,
                opacity: kind === "lights" ? 0.8 : 0.5,
                filter: "blur(2px)",
              })}
            />
          ))}
        </>
      );
    case "sparkles":
    case "stars":
      return (
        <>
          {ps.map((p, i) => (
            <svg
              key={i}
              className="absolute anim-twinkle"
              style={style(p, { width: 8 + p.size * 14, height: 8 + p.size * 14 })}
              viewBox="0 0 24 24"
            >
              <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" fill={color || "#ffd88a"} opacity={0.9} />
            </svg>
          ))}
        </>
      );
    case "fireflies":
      return (
        <>
          {ps.map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full anim-drift"
              style={style(p, {
                width: 4 + p.size * 6,
                height: 4 + p.size * 6,
                background: color || "#ffe28a",
                boxShadow: `0 0 ${10 + p.size * 14}px ${color || "#ffe28a"}`,
                opacity: 0.85,
              })}
            />
          ))}
        </>
      );
    case "petals":
      return (
        <>
          {ps.map((p, i) => (
            <svg
              key={i}
              className="absolute anim-fall"
              style={style(p, { top: "auto", width: 14 + p.size * 16, opacity: alpha })}
              viewBox="0 0 30 30"
            >
              <path
                d="M15 2 C26 4 30 16 15 29 C0 16 4 4 15 2Z"
                fill={color || (i % 2 ? "#ffb3c6" : "#ff8fab")}
                opacity="0.9"
              />
            </svg>
          ))}
        </>
      );
    case "hearts":
      return (
        <>
          {ps.map((p, i) => (
            <svg
              key={i}
              className="absolute anim-float-up"
              style={style(p, { top: "auto", width: 12 + p.size * 18, opacity: 0.75 })}
              viewBox="0 0 24 24"
            >
              <path
                d="M12 21s-7-4.5-9.5-9C.5 8 3 4 6.5 4c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3C21 4 23.5 8 21.5 12 19 16.5 12 21 12 21z"
                fill={color || (i % 2 ? "#ff6b8b" : "#ffa3b8")}
              />
            </svg>
          ))}
        </>
      );
    case "leaves":
      return (
        <>
          {ps.map((p, i) => (
            <svg
              key={i}
              className="absolute anim-fall"
              style={style(p, { top: "auto", width: 14 + p.size * 16, opacity: 0.7 })}
              viewBox="0 0 30 30"
            >
              <path d="M3 27 C3 10 15 3 27 3 C27 18 18 27 3 27Z" fill={color || "#9cc59a"} />
              <path d="M5 25 L25 5" stroke="#6f9d6c" strokeWidth="1" />
            </svg>
          ))}
        </>
      );
    case "pages":
    case "paper":
      return (
        <>
          {ps.map((p, i) => (
            <div
              key={i}
              className="absolute anim-fall"
              style={style(p, {
                top: "auto",
                width: 18 + p.size * 20,
                height: 24 + p.size * 26,
                background: "linear-gradient(180deg,#fffdf7,#f1e9d6)",
                boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
                opacity: 0.8,
                borderRadius: 2,
                backgroundImage:
                  "repeating-linear-gradient(180deg, transparent 0 6px, rgba(120,100,70,0.25) 6px 7px)",
              })}
            />
          ))}
        </>
      );
    case "books":
      return (
        <>
          {ps.map((p, i) => (
            <svg
              key={i}
              className="absolute anim-drift"
              style={style(p, { width: 50 + p.size * 50, opacity: 0.35, top: `${10 + (i * 17) % 80}%` })}
              viewBox="0 0 100 70"
            >
              <path d="M5 15 Q30 5 50 15 L50 65 Q30 55 5 65Z" fill="#f3e6c8" stroke="#b79a63" strokeWidth="2" />
              <path d="M95 15 Q70 5 50 15 L50 65 Q70 55 95 65Z" fill="#fbf3dd" stroke="#b79a63" strokeWidth="2" />
              <path d="M15 28 h25 M15 38 h25 M60 28 h25 M60 38 h25" stroke="#b79a63" strokeWidth="1.5" />
            </svg>
          ))}
        </>
      );
    case "pen":
      return (
        <>
          {ps.map((p, i) => (
            <svg
              key={i}
              className="absolute anim-drift"
              style={style(p, { width: 90, opacity: 0.35, transform: "rotate(-35deg)", top: `${20 + i * 50}%`, left: `${10 + i * 60}%` })}
              viewBox="0 0 120 20"
            >
              <rect x="10" y="6" width="90" height="8" rx="4" fill="#2f6b5e" />
              <path d="M100 6 L118 10 L100 14Z" fill="#d9b45a" />
              <rect x="0" y="7" width="12" height="6" rx="3" fill="#d9b45a" />
            </svg>
          ))}
        </>
      );
    case "watch":
      return (
        <>
          {ps.map((p, i) => (
            <svg
              key={i}
              className="absolute anim-drift"
              style={style(p, { width: 70 + p.size * 60, opacity: 0.22, top: `${15 + i * 30}%`, left: `${(i * 40 + 10) % 90}%` })}
              viewBox="0 0 100 100"
            >
              <circle cx="50" cy="50" r="38" fill="none" stroke="#8a5a2b" strokeWidth="5" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="#8a5a2b" strokeWidth="1.5" />
              <path d="M50 50 L50 28 M50 50 L66 58" stroke="#8a5a2b" strokeWidth="3" strokeLinecap="round" />
              <rect x="42" y="2" width="16" height="12" rx="2" fill="#8a5a2b" />
              <rect x="42" y="86" width="16" height="12" rx="2" fill="#8a5a2b" />
            </svg>
          ))}
        </>
      );
    case "polaroids":
      return (
        <>
          {ps.map((p, i) => (
            <div
              key={i}
              className="absolute polaroid anim-drift"
              style={style(p, {
                width: 50 + p.size * 40,
                opacity: 0.6,
                transform: `rotate(${(p.sway / 6).toFixed(0)}deg)`,
                padding: "5px 5px 16px",
              })}
            >
              <div
                style={{
                  aspectRatio: "1",
                  background: `linear-gradient(135deg, ${PASTELS[i % PASTELS.length]}, ${PASTELS[(i + 3) % PASTELS.length]})`,
                }}
              />
            </div>
          ))}
        </>
      );
    case "candles":
      return (
        <>
          {ps.map((p, i) => (
            <div
              key={i}
              className="absolute flex flex-col items-center"
              style={{ left: `${8 + (i * 84) / Math.max(1, count - 1)}%`, bottom: 0, opacity: 0.7 }}
            >
              <div
                className="rounded-full anim-glow"
                style={{ width: 60, height: 60, background: "radial-gradient(circle,#ffd98a 0%,transparent 70%)", marginBottom: -30 }}
              />
              <svg width="18" height={14 + p.size * 10} viewBox="0 0 18 24" className="anim-flame">
                <path d="M9 0 C14 8 16 12 9 24 C2 12 4 8 9 0Z" fill="#ffb347" />
                <path d="M9 8 C11 12 12 14 9 20 C6 14 7 12 9 8Z" fill="#fff1b8" />
              </svg>
              <div style={{ width: 16 + p.size * 8, height: 40 + p.size * 60, background: "linear-gradient(90deg,#f6ead3,#fff8ea,#e7d7bd)", borderRadius: 3 }} />
            </div>
          ))}
        </>
      );
    case "diyas":
      return (
        <>
          {ps.map((p, i) => (
            <div key={i} className="absolute anim-drift" style={style(p, { top: `${55 + (i * 13) % 40}%`, opacity: 0.85 })}>
              <div className="relative flex flex-col items-center">
                <div
                  className="absolute rounded-full anim-glow"
                  style={{ width: 70, height: 70, top: -30, background: "radial-gradient(circle,#ffc25a 0%,transparent 70%)" }}
                />
                <svg width="14" height="22" viewBox="0 0 18 24" className="anim-flame relative">
                  <path d="M9 0 C14 8 16 12 9 24 C2 12 4 8 9 0Z" fill="#ffb347" />
                  <path d="M9 8 C11 12 12 14 9 20 C6 14 7 12 9 8Z" fill="#fff1b8" />
                </svg>
                <svg width={36 + p.size * 20} viewBox="0 0 60 26" className="relative -mt-1">
                  <path d="M2 4 Q30 0 58 4 Q52 24 30 25 Q8 24 2 4Z" fill="#b5541c" />
                  <path d="M6 5 Q30 2 54 5 Q48 12 30 13 Q12 12 6 5Z" fill="#e07a2f" />
                </svg>
              </div>
            </div>
          ))}
        </>
      );
    case "blooms":
      return (
        <>
          {ps.map((p, i) => (
            <svg
              key={i}
              className="absolute anim-drift"
              style={style(p, { width: 40 + p.size * 60, opacity: 0.35 })}
              viewBox="0 0 100 100"
            >
              {[0, 60, 120, 180, 240, 300].map((a) => (
                <ellipse key={a} cx="50" cy="28" rx="14" ry="24" fill={color || PASTELS[i % PASTELS.length]} transform={`rotate(${a} 50 50)`} />
              ))}
              <circle cx="50" cy="50" r="10" fill="#ffe08a" />
            </svg>
          ))}
        </>
      );
    case "rangoli":
      return (
        <div className="absolute left-1/2 top-[68%] -translate-x-1/2 -translate-y-1/2 anim-spin-slow" style={{ width: "min(120vw,620px)", opacity: 0.22 }}>
          <svg viewBox="0 0 200 200" className="w-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <g key={i} transform={`rotate(${i * 30} 100 100)`}>
                <path d="M100 10 C112 40 112 60 100 80 C88 60 88 40 100 10Z" fill="#ffb347" />
                <circle cx="100" cy="30" r="4" fill="#ff5e7e" />
                <path d="M100 82 C120 84 130 96 128 110 C114 106 104 96 100 82Z" fill="#ffd166" />
              </g>
            ))}
            <circle cx="100" cy="100" r="16" fill="#ff8fa3" />
            <circle cx="100" cy="100" r="8" fill="#fff1b8" />
          </svg>
        </div>
      );
    case "rays":
      return (
        <div
          className="absolute inset-0 anim-glow"
          style={{ background: "radial-gradient(ellipse at 50% 15%, rgba(255,255,255,0.55) 0%, transparent 55%)" }}
        />
      );
    default:
      return null;
  }
}

export default function AnimatedBackground({
  bg,
  className = "",
  dim = false,
}: {
  bg: BackgroundDef;
  className?: string;
  dim?: boolean;
}) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} style={{ background: bg.css }} aria-hidden>
      {bg.particles.map((l, i) => (
        <Layer key={`${bg.id}-${i}`} kind={l.kind} count={dim ? Math.ceil((l.count || 10) / 2) : l.count || 10} color={l.color} dim={dim} />
      ))}
    </div>
  );
}
