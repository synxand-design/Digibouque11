"use client";

import { ALL_ASSETS } from "@/lib/catalog";
import { useEffect, useRef, useState } from "react";

export interface StageProps {
  onDone: () => void;
  accent: string;
  dark: boolean;
  flowerAssets: string[]; // asset ids used in the bouquet
  photos: string[];
  recipient?: string;
}

const Hint = ({ children, dark }: { children: React.ReactNode; dark: boolean }) => (
  <div className={`mt-6 rounded-full px-4 py-2 text-sm font-semibold anim-fade-in ${dark ? "bg-white/15 text-white" : "bg-white/80 text-[#3b2a35]"} backdrop-blur`} style={{ ["--delay" as string]: "0.6s" }}>
    {children}
  </div>
);

/* ---------------- Gift box: tap 3 times ---------------- */
export function GiftBox({ onDone, accent, dark }: StageProps) {
  const [taps, setTaps] = useState(0);
  const [shake, setShake] = useState(false);
  const opened = taps >= 3;
  useEffect(() => {
    if (opened) {
      const t = setTimeout(onDone, 1900);
      return () => clearTimeout(t);
    }
  }, [opened, onDone]);
  const tap = () => {
    if (opened) return;
    setTaps((t) => t + 1);
    setShake(true);
    setTimeout(() => setShake(false), 500);
    if (navigator.vibrate) navigator.vibrate(30);
  };
  return (
    <div className="flex flex-col items-center">
      <button type="button" onClick={tap} className={`relative perspective ${shake ? "anim-shake" : "anim-wobble"}`} style={{ width: 220, height: 240 }} aria-label="Gift box">
        {/* glow burst */}
        {opened && <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full anim-ring" style={{ background: `radial-gradient(circle, ${accent}66, transparent 70%)` }} />}
        {/* lid */}
        <div className="absolute left-1/2 top-[52px] -translate-x-1/2" style={{ width: 236, height: 52, animation: opened ? "lidOpen 1s cubic-bezier(.22,1,.36,1) forwards" : undefined, zIndex: 3 }}>
          <div className="h-full w-full rounded-lg" style={{ background: `linear-gradient(180deg, ${accent}, ${accent}cc)`, boxShadow: "0 10px 20px -8px rgba(0,0,0,0.35)" }} />
          <div className="absolute left-1/2 top-0 h-full w-10 -translate-x-1/2 bg-[#ffe6a3]" style={{ boxShadow: "inset 0 0 8px rgba(0,0,0,0.08)" }} />
          {/* bow */}
          <div className="absolute left-1/2 -top-9 -translate-x-1/2">
            <div className="relative h-10 w-24">
              <div className="absolute left-0 top-1 h-8 w-11 rounded-[50%] border-4 border-[#ffd97a] bg-[#ffe6a3]" style={{ transform: "rotate(-20deg)" }} />
              <div className="absolute right-0 top-1 h-8 w-11 rounded-[50%] border-4 border-[#ffd97a] bg-[#ffe6a3]" style={{ transform: "rotate(20deg)" }} />
              <div className="absolute left-1/2 top-3 h-5 w-5 -translate-x-1/2 rounded-full bg-[#ffcf5a]" />
            </div>
          </div>
        </div>
        {/* box body */}
        <div className="absolute left-1/2 top-[96px] -translate-x-1/2 overflow-hidden rounded-b-xl" style={{ width: 210, height: 140, background: `linear-gradient(180deg, ${accent}dd, ${accent})`, boxShadow: "0 30px 40px -20px rgba(0,0,0,0.45)" }}>
          <div className="absolute left-1/2 top-0 h-full w-10 -translate-x-1/2 bg-[#ffe6a3]/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/20" />
          {opened && (
            <div className="absolute inset-x-0 bottom-0 flex justify-center">
              {["🎉", "✨", "🎈", "💖", "🌸"].map((e, i) => (
                <span key={i} className="absolute text-2xl anim-float-up" style={{ left: `${15 + i * 17}%`, ["--dur" as string]: "2.4s", ["--delay" as string]: `${i * 0.15}s` }}>
                  {e}
                </span>
              ))}
            </div>
          )}
        </div>
        {!opened && (
          <div className="absolute inset-x-0 -bottom-2 flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`h-2.5 w-2.5 rounded-full transition ${i < taps ? "bg-white" : "bg-white/40"}`} />
            ))}
          </div>
        )}
      </button>
      <Hint dark={dark}>{opened ? "Opening… 🎁" : `Tap ${3 - taps} ${3 - taps === 1 ? "time" : "times"} to open your surprise`}</Hint>
    </div>
  );
}

/* ---------------- Cake & candle: swipe to blow ---------------- */
export function Candle({ onDone, dark }: StageProps) {
  const [out, setOut] = useState(false);
  const [lit, setLit] = useState(false);
  const start = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const t = setTimeout(() => setLit(true), 500);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (out) {
      const t = setTimeout(onDone, 2200);
      return () => clearTimeout(t);
    }
  }, [out, onDone]);
  const blow = () => {
    if (out) return;
    setOut(true);
    if (navigator.vibrate) navigator.vibrate([20, 40, 20]);
  };
  return (
    <div
      className="flex select-none flex-col items-center touch-none"
      onPointerDown={(e) => (start.current = { x: e.clientX, y: e.clientY })}
      onPointerMove={(e) => {
        if (!start.current) return;
        if (Math.hypot(e.clientX - start.current.x, e.clientY - start.current.y) > 55) {
          start.current = null;
          blow();
        }
      }}
      onPointerUp={() => (start.current = null)}
    >
      <div className="relative anim-pop" style={{ width: 240, height: 280 }}>
        {/* candle glow */}
        <div className={`absolute left-1/2 top-2 h-40 w-40 -translate-x-1/2 rounded-full transition-opacity duration-700 ${lit && !out ? "opacity-100 anim-glow" : "opacity-0"}`} style={{ background: "radial-gradient(circle,#ffd98a80 0%,transparent 65%)" }} />
        {/* flame */}
        <div className="absolute left-1/2 top-[38px] -translate-x-1/2">
          {lit && !out && (
            <svg width="26" height="40" viewBox="0 0 18 24" className="anim-flame">
              <path d="M9 0 C14 8 16 12 9 24 C2 12 4 8 9 0Z" fill="#ffb347" />
              <path d="M9 8 C11 12 12 14 9 20 C6 14 7 12 9 8Z" fill="#fff1b8" />
            </svg>
          )}
          {out && (
            <div className="relative h-10 w-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full bg-gray-300/70 anim-smoke" style={{ animationDelay: `${i * 0.25}s` }} />
              ))}
            </div>
          )}
        </div>
        {/* candle */}
        <div className="absolute left-1/2 top-[76px] h-16 w-5 -translate-x-1/2 rounded-sm" style={{ background: "repeating-linear-gradient(135deg,#fff 0 6px,#ffb3c6 6px 12px)" }} />
        {/* cake */}
        <div className="absolute left-1/2 top-[132px] -translate-x-1/2" style={{ width: 220 }}>
          <div className="h-8 w-full rounded-[50%] bg-[#fff0f4]" style={{ boxShadow: "inset 0 -6px 10px rgba(0,0,0,0.05)" }} />
          <div className="-mt-4 h-24 w-full rounded-b-[28px]" style={{ background: "linear-gradient(180deg,#f9c7d6 0%,#f5a9c0 45%,#8b5a3c 46%,#a86f4f 100%)" }}>
            <div className="flex justify-around pt-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-6 w-5 rounded-b-full bg-[#f9c7d6]" style={{ marginTop: i % 2 ? 4 : 0 }} />
              ))}
            </div>
          </div>
          <div className="mx-auto -mt-2 h-4 w-[240px] rounded-[50%] bg-white/80 shadow" />
        </div>
        {/* strawberries */}
        <div className="absolute left-[34px] top-[122px] text-xl">🍓</div>
        <div className="absolute right-[34px] top-[122px] text-xl">🍓</div>
      </div>
      <Hint dark={dark}>
        {out ? (
          "Your wish is on its way ✨"
        ) : (
          <span className="flex items-center gap-2">
            <span className="anim-swipe-hint inline-block">👉</span> Make a wish & swipe to blow the candle
          </span>
        )}
      </Hint>
    </div>
  );
}

/* ---------------- Envelope ---------------- */
export function Envelope({ onDone, accent, dark, recipient }: StageProps) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (open) {
      const t = setTimeout(onDone, 2300);
      return () => clearTimeout(t);
    }
  }, [open, onDone]);
  return (
    <div className="flex flex-col items-center">
      <button type="button" onClick={() => setOpen(true)} className={`relative perspective ${open ? "" : "anim-wobble"}`} style={{ width: 280, height: 200 }} aria-label="Open envelope">
        {/* letter */}
        <div className="absolute left-4 right-4 top-3 rounded-md bg-[#fffaf3] p-4 shadow-md" style={{ height: 170, zIndex: 1, animation: open ? "letterOut 1.4s cubic-bezier(.22,1,.36,1) 0.6s forwards" : undefined }}>
          <div className="font-hand text-2xl text-[#b0506b]">{recipient ? `Dear ${recipient},` : "Dear you,"}</div>
          <div className="mt-2 space-y-2">
            {[90, 75, 85, 60].map((w, i) => (
              <div key={i} className="h-2 rounded bg-[#e8d9d0]" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
        {/* body */}
        <div className="absolute inset-x-0 bottom-0 overflow-hidden rounded-b-xl" style={{ height: 150, zIndex: 2 }}>
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, #fdece9, #f6d5cf)` }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(115deg, #fff3ef 0%, #fff3ef 48%, transparent 49%), linear-gradient(-115deg, #fbe4de 0%, #fbe4de 48%, transparent 49%)" }} />
        </div>
        {/* flap */}
        <div className="envelope-flap absolute inset-x-0 top-[50px]" style={{ height: 100, zIndex: open ? 0 : 3, animation: open ? "flapOpen 0.9s ease forwards" : undefined }}>
          <div className="h-full w-full" style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)", background: "linear-gradient(180deg,#f9dcd6,#f3c8c0)" }} />
          <div className="absolute left-1/2 top-[52px] grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full text-white shadow-lg" style={{ background: accent }}>
            ♥
          </div>
        </div>
      </button>
      <Hint dark={dark}>{open ? "Unfolding your letter…" : "Tap the envelope to open"}</Hint>
    </div>
  );
}

/* ---------------- Heart gift ---------------- */
export function HeartGift({ onDone, accent, dark }: StageProps) {
  const [burst, setBurst] = useState(false);
  useEffect(() => {
    if (burst) {
      const t = setTimeout(onDone, 1800);
      return () => clearTimeout(t);
    }
  }, [burst, onDone]);
  return (
    <div className="flex flex-col items-center">
      <button type="button" onClick={() => setBurst(true)} className="relative" style={{ width: 220, height: 220 }} aria-label="Tap the heart">
        {burst &&
          Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="absolute left-1/2 top-1/2 text-2xl anim-float-up" style={{ ["--dur" as string]: "1.8s", ["--sway" as string]: `${(i - 7) * 26}px`, animationDelay: `${i * 0.05}s` }}>
              {i % 3 === 0 ? "💗" : i % 3 === 1 ? "🌸" : "💕"}
            </span>
          ))}
        <svg viewBox="0 0 24 24" className={`h-full w-full drop-shadow-2xl ${burst ? "anim-pop" : "anim-heart"}`}>
          <defs>
            <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff8fb1" />
              <stop offset="100%" stopColor={accent} />
            </linearGradient>
          </defs>
          <path d="M12 21s-7-4.5-9.5-9C.5 8 3 4 6.5 4c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3C21 4 23.5 8 21.5 12 19 16.5 12 21 12 21z" fill="url(#hg)" />
          <ellipse cx="8" cy="8" rx="2" ry="1.2" fill="#fff" opacity="0.5" transform="rotate(-30 8 8)" />
        </svg>
      </button>
      <Hint dark={dark}>{burst ? "Blooming for you…" : "Tap the heart ❤"}</Hint>
    </div>
  );
}

/* ---------------- Auto blooms (Mother's Day) ---------------- */
export function Blooms({ onDone, flowerAssets, dark }: StageProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 4200);
    return () => clearTimeout(t);
  }, [onDone]);
  const pool = flowerAssets.length ? flowerAssets : ["peony-blush", "rose-pink", "tulip-pink", "gerbera-pink"];
  const pos = [
    [50, 45, 0.5],
    [22, 30, 0.34],
    [78, 30, 0.34],
    [25, 68, 0.3],
    [75, 68, 0.3],
    [50, 15, 0.26],
  ];
  return (
    <div className="relative" style={{ width: "min(80vw,340px)", height: "min(80vw,340px)" }}>
      <div className="absolute inset-0 rounded-full anim-glow" style={{ background: "radial-gradient(circle,#fff6 0%,transparent 60%)" }} />
      {pos.map(([x, y, s], i) => (
        <div key={i} className="absolute anim-bloom" style={{ left: `${x}%`, top: `${y}%`, width: `${s * 100}%`, transform: "translate(-50%,-50%)", ["--delay" as string]: `${0.3 + i * 0.5}s` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ALL_ASSETS[pool[i % pool.length]]?.src} alt="" className="w-full item-shadow" />
        </div>
      ))}
      <div className={`absolute inset-x-0 -bottom-14 text-center font-hand text-3xl anim-fade-in ${dark ? "text-white" : "text-[#b0506b]"}`} style={{ ["--delay" as string]: "2.4s" }}>
        with all my love…
      </div>
    </div>
  );
}

/* ---------------- Elegant card (Father's Day) ---------------- */
export function FoldCard({ onDone, accent, dark, recipient }: StageProps) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (open) {
      const t = setTimeout(onDone, 1900);
      return () => clearTimeout(t);
    }
  }, [open, onDone]);
  return (
    <div className="flex flex-col items-center">
      <button type="button" onClick={() => setOpen(true)} className="perspective relative" style={{ width: 240, height: 320 }} aria-label="Open card">
        <div className="absolute inset-0 rounded-xl bg-[#fffaf1] p-6 text-left shadow-2xl">
          <div className="font-serif-display text-xl text-[#6b4a2b]">{recipient ? `For ${recipient}` : "For you"}</div>
          <div className="mt-3 space-y-2">
            {[80, 95, 70, 88, 60].map((w, i) => (
              <div key={i} className="h-1.5 rounded bg-[#e6d8c3]" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
        <div className="absolute inset-0 rounded-xl shadow-2xl" style={{ transformOrigin: "left center", transformStyle: "preserve-3d", transition: "transform 1.6s cubic-bezier(.22,1,.36,1)", transform: open ? "rotateY(-160deg)" : "rotateY(0deg)", background: `linear-gradient(160deg, ${accent} 0%, #2b1d14 100%)` }}>
          <div className="absolute inset-3 rounded-lg border border-[#e8c98a]/50" />
          <div className="absolute inset-0 grid place-items-center text-center text-[#f6dfae]">
            <div>
              <div className="text-4xl">🕰️</div>
              <div className="font-serif-display mt-2 text-lg tracking-[0.2em]">WITH LOVE</div>
            </div>
          </div>
        </div>
      </button>
      <Hint dark={dark}>{open ? "Opening…" : "Tap the card to open"}</Hint>
    </div>
  );
}

/* ---------------- Book (Teachers' Day) ---------------- */
export function Book({ onDone, dark, recipient }: StageProps) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (open) {
      const t = setTimeout(onDone, 2400);
      return () => clearTimeout(t);
    }
  }, [open, onDone]);
  return (
    <div className="flex flex-col items-center">
      <button type="button" onClick={() => setOpen(true)} className="perspective relative" style={{ width: 260, height: 300 }} aria-label="Open book">
        {/* pages */}
        <div className="absolute inset-0 rounded-r-xl bg-[#fffdf7] shadow-2xl" style={{ backgroundImage: "repeating-linear-gradient(180deg, transparent 0 22px, #e9e2d3 22px 23px)" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" style={{ width: 24 }} />
          <div className="p-7 pt-9 text-left">
            <div className="font-hand text-2xl text-[#2f6b5e]">{recipient ? `Dear ${recipient},` : "Dear Teacher,"}</div>
            <div className="font-hand mt-1 text-xl text-[#5f6a58]">Thank you for everything…</div>
          </div>
        </div>
        {[0, 1, 2].map((i) => (
          <div key={i} className="absolute inset-0 rounded-r-xl bg-[#fffdf7]" style={{ transformOrigin: "left center", transition: `transform 1.2s cubic-bezier(.22,1,.36,1) ${0.35 + i * 0.25}s`, transform: open ? "rotateY(-175deg)" : "rotateY(0deg)", boxShadow: "0 2px 4px rgba(0,0,0,0.08)" }} />
        ))}
        {/* cover */}
        <div className="absolute inset-0 rounded-r-xl" style={{ transformOrigin: "left center", transformStyle: "preserve-3d", transition: "transform 1.4s cubic-bezier(.22,1,.36,1)", transform: open ? "rotateY(-175deg)" : "rotateY(0deg)", background: "linear-gradient(160deg,#2f6b5e 0%,#1f4a40 100%)", boxShadow: "0 30px 40px -20px rgba(0,0,0,0.5)" }}>
          <div className="absolute inset-3 rounded-lg border-2 border-[#d9b45a]/70" />
          <div className="absolute inset-0 grid place-items-center text-center text-[#f3e3ad]">
            <div>
              <div className="text-4xl">📖</div>
              <div className="font-serif-display mt-2 text-base tracking-[0.15em]">WITH GRATITUDE</div>
            </div>
          </div>
        </div>
        <div className="absolute inset-y-0 left-0 w-4 rounded-l-md bg-[#1a3e36]" />
      </button>
      <Hint dark={dark}>{open ? "Turning the pages…" : "Tap the book to open"}</Hint>
    </div>
  );
}

/* ---------------- Polaroid stack (Friendship) ---------------- */
export function PolaroidStack({ onDone, photos, dark, accent }: StageProps) {
  const [fanned, setFanned] = useState(false);
  const cards = photos.length ? photos : [];
  return (
    <div className="flex flex-col items-center">
      <button type="button" onClick={() => setFanned(true)} className="relative" style={{ width: 260, height: 300 }} aria-label="Shuffle memories">
        {(cards.length ? cards : [null, null, null]).map((p, i, arr) => {
          const n = arr.length;
          const rot = fanned ? (i - (n - 1) / 2) * 22 : (i - 1) * 4;
          const dx = fanned ? (i - (n - 1) / 2) * 70 : 0;
          const dy = fanned ? Math.abs(i - (n - 1) / 2) * 16 : i * 3;
          return (
            <div key={i} className="polaroid absolute left-1/2 top-4 w-44" style={{ transform: `translateX(calc(-50% + ${dx}px)) translateY(${dy}px) rotate(${rot}deg)`, transition: `transform 1.1s cubic-bezier(.22,1,.36,1) ${i * 0.08}s`, zIndex: i }}>
              {p ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p} alt="" className="aspect-square w-full object-cover" />
              ) : (
                <div className="grid aspect-square w-full place-items-center text-4xl" style={{ background: `linear-gradient(135deg, ${accent}55, #ffe3ee)` }}>
                  {["🌈", "🤝", "💛"][i]}
                </div>
              )}
              <div className="font-hand mt-1 text-center text-lg text-[#5f4a57]">{["us ✨", "memories", "forever"][i % 3]}</div>
            </div>
          );
        })}
      </button>
      {fanned ? (
        <button type="button" onClick={onDone} className="btn-primary mt-8 rounded-full px-6 py-3 text-sm font-bold anim-fade-up" style={{ ["--delay" as string]: "0.8s" }}>
          Continue →
        </button>
      ) : (
        <Hint dark={dark}>Tap to shuffle the memories</Hint>
      )}
    </div>
  );
}

/* ---------------- Candles to light (Anniversary) ---------------- */
export function CandleRow({ onDone, dark }: StageProps) {
  const [lit, setLit] = useState(0);
  const total = 3;
  useEffect(() => {
    if (lit >= total) {
      const t = setTimeout(onDone, 1800);
      return () => clearTimeout(t);
    }
  }, [lit, onDone]);
  return (
    <div className="flex flex-col items-center">
      <button type="button" onClick={() => setLit((l) => Math.min(total, l + 1))} className="flex items-end gap-8" aria-label="Light candle">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="relative flex flex-col items-center">
            <div className={`absolute -top-16 h-32 w-32 rounded-full transition-opacity duration-1000 ${i < lit ? "opacity-100 anim-glow" : "opacity-0"}`} style={{ background: "radial-gradient(circle,#ffd98a80 0%,transparent 65%)" }} />
            <div className={`transition-opacity duration-700 ${i < lit ? "opacity-100" : "opacity-0"}`}>
              <svg width="22" height="34" viewBox="0 0 18 24" className="anim-flame">
                <path d="M9 0 C14 8 16 12 9 24 C2 12 4 8 9 0Z" fill="#ffb347" />
                <path d="M9 8 C11 12 12 14 9 20 C6 14 7 12 9 8Z" fill="#fff1b8" />
              </svg>
            </div>
            <div className="h-1.5 w-0.5 bg-[#333]" />
            <div className="rounded-sm" style={{ width: 28, height: 90 + (i === 1 ? 40 : 0), background: "linear-gradient(90deg,#efe2cc,#fff8ea 50%,#dccbb0)" }} />
            <div className="h-3 w-12 rounded-[50%] bg-[#c9a24c]" />
          </div>
        ))}
      </button>
      <Hint dark={dark}>{lit >= total ? "Beautiful ✨" : `Tap to light the candles (${lit}/${total})`}</Hint>
    </div>
  );
}

/* ---------------- Bud that blooms ---------------- */
export function Bud({ onDone, flowerAssets, dark }: StageProps) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const a = setTimeout(() => setPhase(1), 600);
    const b = setTimeout(() => setPhase(2), 2000);
    const c = setTimeout(onDone, 3800);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
      clearTimeout(c);
    };
  }, [onDone]);
  const hero = ALL_ASSETS[flowerAssets[0] || "rose-pink"];
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 240, height: 300 }}>
        <div className="absolute left-1/2 top-[140px] h-40 w-1.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#6c9d5f] to-[#3e6b37] transition-all duration-1000" style={{ transform: `translateX(-50%) scaleY(${phase > 0 ? 1 : 0})`, transformOrigin: "bottom" }} />
        <div className="absolute left-1/2 top-[150px] transition-all duration-700" style={{ transform: `translate(-50%,0) scale(${phase > 0 ? 1 : 0})` }}>
          <svg width="90" height="60" viewBox="0 0 90 60">
            <path d="M45 30 C20 30 10 50 5 58 C30 58 45 45 45 30Z" fill="#6c9d5f" />
            <path d="M45 30 C70 30 80 50 85 58 C60 58 45 45 45 30Z" fill="#7fb06f" />
          </svg>
        </div>
        <div className="absolute left-1/2 top-[40px] transition-all duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)]" style={{ width: 200, transform: `translate(-50%,0) scale(${phase === 0 ? 0 : phase === 1 ? 0.28 : 1}) rotate(${phase === 2 ? 0 : -40}deg)`, filter: phase < 2 ? "saturate(0.6) brightness(0.85)" : "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero.src} alt="" className="w-full item-shadow" />
        </div>
      </div>
      <Hint dark={dark}>{phase < 2 ? "Something is blooming…" : "🌸"}</Hint>
    </div>
  );
}

/* ---------------- Diyas to light (Diwali) ---------------- */
export function Diyas({ onDone, dark }: StageProps) {
  const total = 5;
  const [lit, setLit] = useState<boolean[]>(Array(total).fill(false));
  const count = lit.filter(Boolean).length;
  useEffect(() => {
    if (count === total) {
      const t = setTimeout(onDone, 2000);
      return () => clearTimeout(t);
    }
  }, [count, onDone]);
  const light = (i: number) => setLit((l) => l.map((v, j) => (j === i ? true : v)));
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap items-end justify-center gap-4 px-4">
        {lit.map((on, i) => (
          <button key={i} type="button" onClick={() => light(i)} className="relative flex flex-col items-center active:scale-95" style={{ marginTop: i % 2 ? 0 : 28 }} aria-label={`Light diya ${i + 1}`}>
            <div className={`absolute -top-10 h-28 w-28 rounded-full transition-opacity duration-1000 ${on ? "opacity-100 anim-glow" : "opacity-0"}`} style={{ background: "radial-gradient(circle,#ffc25a99 0%,transparent 65%)" }} />
            <div className={`relative transition-all duration-700 ${on ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
              <svg width="20" height="30" viewBox="0 0 18 24" className="anim-flame">
                <path d="M9 0 C14 8 16 12 9 24 C2 12 4 8 9 0Z" fill="#ffb347" />
                <path d="M9 8 C11 12 12 14 9 20 C6 14 7 12 9 8Z" fill="#fff1b8" />
              </svg>
            </div>
            <svg width="76" viewBox="0 0 60 26" className="relative -mt-1 drop-shadow-lg">
              <path d="M2 4 Q30 0 58 4 Q52 24 30 25 Q8 24 2 4Z" fill="#a8461a" />
              <path d="M6 5 Q30 2 54 5 Q48 12 30 13 Q12 12 6 5Z" fill="#e07a2f" />
              <ellipse cx="30" cy="6" rx="10" ry="2" fill="#ffd166" opacity={on ? 0.9 : 0.3} />
            </svg>
            {!on && <span className="absolute -bottom-1 h-3 w-3 rounded-full bg-white/70 anim-ring" />}
          </button>
        ))}
      </div>
      <Hint dark={dark}>{count === total ? "Shubh Deepavali ✨" : `Tap each diya to light it (${count}/${total})`}</Hint>
    </div>
  );
}
