"use client";

import AnimatedBackground from "@/components/AnimatedBackground";
import BouquetCanvas from "@/components/BouquetCanvas";
import { getBackground, getOccasion } from "@/lib/occasions";
import type { SavedCreation } from "@/lib/types";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Blooms, Book, Bud, Candle, CandleRow, Diyas, Envelope, FoldCard, GiftBox, HeartGift, PolaroidStack, type StageProps } from "./interactions";

const INTERACTIONS: Record<string, (p: StageProps) => React.ReactElement> = {
  gift: GiftBox,
  candle: Candle,
  envelope: Envelope,
  heart: HeartGift,
  blooms: Blooms,
  card: FoldCard,
  book: Book,
  polaroids: PolaroidStack,
  candles: CandleRow,
  bud: Bud,
  diyas: Diyas,
};

export default function Experience({ creation }: { creation: SavedCreation }) {
  const occasion = getOccasion(creation.occasion);
  const bg = getBackground(occasion, creation.background);
  const dark = !!bg.dark;
  const flow = useMemo(() => occasion.flow.filter((s) => (s === "photos" ? creation.photos.length > 0 : true)), [occasion.flow, creation.photos.length]);
  const [idx, setIdx] = useState(0);
  const [started, setStarted] = useState(false);
  const [gate, setGate] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const stage = flow[idx] || "final";
  const flowerAssets = useMemo(() => creation.items.filter((i) => i.kind === "flower").map((i) => i.asset), [creation.items]);

  const next = useCallback(() => setIdx((i) => Math.min(flow.length - 1, i + 1)), [flow.length]);

  // Try to autoplay music; fall back to a "Tap to start" gate when blocked.
  useEffect(() => {
    if (!creation.music) {
      setStarted(true);
      return;
    }
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.9;
    a.play()
      .then(() => setStarted(true))
      .catch(() => setGate(true));
  }, [creation.music]);

  const startWithTap = () => {
    const a = audioRef.current;
    a?.play().catch(() => {});
    setGate(false);
    setStarted(true);
  };

  // Intro auto-advance
  useEffect(() => {
    if (!started || stage !== "intro") return;
    const t = setTimeout(next, 3000);
    return () => clearTimeout(t);
  }, [started, stage, next]);

  const toggleMute = () => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
  };

  const replay = () => setIdx(0);

  const textColor = dark ? "text-white" : "text-[#3b2a35]";
  const subColor = dark ? "text-white/75" : "text-[#6d5563]";
  const Interaction = INTERACTIONS[stage];

  return (
    <div className={`fixed inset-0 overflow-hidden ${occasion.fontClass === "font-serif-display" ? "" : "font-rounded"}`} style={{ ["--accent" as string]: occasion.accent }}>
      <AnimatedBackground bg={bg} />
      {creation.music && <audio ref={audioRef} src={creation.music} loop preload="auto" playsInline />}

      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between p-3" style={{ paddingTop: "max(env(safe-area-inset-top), 12px)" }}>
        <div className={`rounded-full px-3 py-1.5 text-xs font-bold backdrop-blur ${dark ? "bg-white/15 text-white" : "bg-white/70 text-[#3b2a35]"}`}>
          {occasion.emoji} {occasion.short}
        </div>
        <div className="flex items-center gap-2">
          {flow.map((s, i) => (
            <span key={s} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-5" : "w-1.5"} ${i <= idx ? (dark ? "bg-white" : "bg-[var(--accent)]") : dark ? "bg-white/30" : "bg-black/15"}`} />
          ))}
        </div>
        {creation.music ? (
          <button type="button" onClick={toggleMute} className={`grid h-9 w-9 place-items-center rounded-full text-sm backdrop-blur ${dark ? "bg-white/15 text-white" : "bg-white/70"}`} aria-label="Toggle music">
            {muted ? "🔇" : "🎵"}
          </button>
        ) : (
          <span className="w-9" />
        )}
      </div>

      {/* Start gate */}
      {gate && (
        <button type="button" onClick={startWithTap} className="absolute inset-0 z-50 grid place-items-center bg-black/35 backdrop-blur-md">
          <div className="anim-pop rounded-[2rem] bg-white/95 px-8 py-8 text-center shadow-2xl mx-6 max-w-sm">
            <div className="text-5xl anim-heart inline-block">{occasion.emoji}</div>
            <div className="font-serif-display mt-3 text-2xl font-semibold text-[#3b2a35]">{creation.recipient ? `For ${creation.recipient}` : "A surprise for you"}</div>
            <p className="mt-1 text-sm text-[#6d5563]">Turn your sound on for the full experience</p>
            <div className="btn-primary mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 anim-ring" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
              </span>
              Tap to start the surprise
            </div>
          </div>
        </button>
      )}

      {/* Stages */}
      {started && (
        <div className="absolute inset-0 z-10 flex flex-col overflow-y-auto" key={`${stage}-${idx}`} style={{ paddingTop: "max(env(safe-area-inset-top), 12px)" }}>
          {stage === "intro" && (
            <div className="m-auto px-8 text-center anim-fade-in">
              <div className="text-6xl anim-heart inline-block">{occasion.emoji}</div>
              <div className={`font-serif-display mt-4 text-3xl font-semibold anim-fade-up ${textColor}`} style={{ ["--delay" as string]: "0.4s" }}>
                {creation.recipient ? `For ${creation.recipient}` : "Someone made this for you"}
              </div>
              <div className={`mt-2 text-sm anim-fade-up ${subColor}`} style={{ ["--delay" as string]: "1s" }}>
                {creation.sender ? `from ${creation.sender} · with love` : "with love"}
              </div>
            </div>
          )}

          {Interaction && (
            <div className="m-auto px-4 py-20">
              <Interaction onDone={next} accent={occasion.accent} dark={dark} flowerAssets={flowerAssets} photos={creation.photos} recipient={creation.recipient} />
            </div>
          )}

          {stage === "letter" && <LetterStage creation={creation} onDone={next} />}

          {stage === "reveal" && (
            <div className="m-auto w-full max-w-[420px] px-6 py-16">
              <div className={`mb-3 text-center text-sm font-semibold anim-fade-in ${subColor}`}>{creation.recipient ? `A bouquet for ${creation.recipient}` : "Your bouquet"}</div>
              <BouquetCanvas items={creation.items} wrap={creation.wrap} ribbon={creation.ribbon} animate baseDelay={0.2} />
              <div className="mt-4 flex justify-center anim-fade-up" style={{ ["--delay" as string]: `${Math.min(6, 1.2 + creation.items.length * 0.16)}s` }}>
                <NextButton onClick={next} />
              </div>
            </div>
          )}

          {stage === "message" && <MessageStage creation={creation} dark={dark} onDone={next} />}

          {stage === "photos" && <PhotosStage photos={creation.photos} dark={dark} onDone={next} />}

          {stage === "final" && <FinalStage creation={creation} dark={dark} onReplay={replay} />}
        </div>
      )}
    </div>
  );
}

function NextButton({ onClick, label = "Continue →" }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClick} className="btn-primary rounded-full px-7 py-3 text-sm font-bold">
      {label}
    </button>
  );
}

function MessageBody({ message, className = "" }: { message: string; className?: string }) {
  const lines = message.split(/\n+/).filter(Boolean);
  return (
    <div className={`space-y-3 ${className}`}>
      {lines.map((l, i) => (
        <p key={i} className="anim-fade-up leading-relaxed whitespace-pre-wrap" style={{ ["--delay" as string]: `${0.5 + i * 0.7}s` }}>
          {l}
        </p>
      ))}
    </div>
  );
}

function MessageStage({ creation, dark, onDone }: { creation: SavedCreation; dark: boolean; onDone: () => void }) {
  const lines = creation.message.split(/\n+/).filter(Boolean).length;
  return (
    <div className="m-auto w-full max-w-md px-5 py-16">
      <div className="anim-pop rounded-[2rem] bg-white/92 p-6 text-[#3b2a35] shadow-[0_30px_60px_-20px_rgba(60,20,40,0.45)] backdrop-blur sm:p-8">
        {creation.recipient && <div className="font-hand text-2xl text-[var(--accent)]">Dear {creation.recipient},</div>}
        <h2 className="font-serif-display mt-1 text-2xl font-semibold leading-tight anim-fade-up" style={{ ["--delay" as string]: "0.2s" }}>
          {creation.title}
        </h2>
        <MessageBody message={creation.message} className="mt-4 text-[15px] text-[#4f3b47]" />
        {creation.sender && (
          <div className="font-hand mt-5 text-right text-2xl text-[var(--accent)] anim-fade-up" style={{ ["--delay" as string]: `${0.6 + lines * 0.7}s` }}>
            — {creation.sender}
          </div>
        )}
      </div>
      <div className="mt-5 flex justify-center anim-fade-up" style={{ ["--delay" as string]: `${Math.min(6, 0.8 + lines * 0.7)}s` }}>
        <NextButton onClick={onDone} />
      </div>
      <span className="sr-only">{dark ? "" : ""}</span>
    </div>
  );
}

function LetterStage({ creation, onDone }: { creation: SavedCreation; onDone: () => void }) {
  const lines = creation.message.split(/\n+/).filter(Boolean).length;
  return (
    <div className="m-auto w-full max-w-md px-5 py-16">
      <div className="anim-fade-up relative rounded-md bg-[#fffaf3] p-6 text-[#4a3540] shadow-[0_30px_60px_-20px_rgba(60,20,40,0.5)] sm:p-8" style={{ backgroundImage: "repeating-linear-gradient(180deg, transparent 0 27px, rgba(200,150,160,0.18) 27px 28px)" }}>
        <div className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-[-2deg] bg-[#ffd5df]/80" />
        <div className="font-hand text-3xl text-[#b0506b]">{creation.recipient ? `My dearest ${creation.recipient},` : "My dearest,"}</div>
        <h2 className="font-serif-display mt-2 text-xl font-semibold italic">{creation.title}</h2>
        <MessageBody message={creation.message} className="font-hand mt-3 text-[1.35rem] leading-7" />
        {creation.sender && (
          <div className="font-hand mt-6 text-right text-2xl text-[#b0506b] anim-fade-up" style={{ ["--delay" as string]: `${0.6 + lines * 0.7}s` }}>
            forever yours, {creation.sender} ♥
          </div>
        )}
      </div>
      <div className="mt-5 flex justify-center anim-fade-up" style={{ ["--delay" as string]: `${Math.min(6, 1 + lines * 0.7)}s` }}>
        <NextButton onClick={onDone} label="There's more 🌹" />
      </div>
    </div>
  );
}

function PhotosStage({ photos, dark, onDone }: { photos: string[]; dark: boolean; onDone: () => void }) {
  const rots = [-6, 4, -3];
  return (
    <div className="m-auto w-full max-w-md px-5 py-16">
      <div className={`mb-4 text-center font-serif-display text-2xl font-semibold anim-fade-in ${dark ? "text-white" : "text-[#3b2a35]"}`}>Our moments</div>
      <div className={`grid gap-4 ${photos.length === 1 ? "grid-cols-1 max-w-[280px] mx-auto" : "grid-cols-2"}`}>
        {photos.map((p, i) => (
          <div key={i} className={`polaroid anim-polaroid ${photos.length === 3 && i === 2 ? "col-span-2 mx-auto w-1/2" : ""}`} style={{ ["--r" as string]: `${rots[i % 3]}deg`, ["--delay" as string]: `${0.3 + i * 1.1}s` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p} alt={`Memory ${i + 1}`} className="aspect-square w-full object-cover" />
            <div className="font-hand mt-1 text-center text-lg text-[#5f4a57]">{["♥", "✨", "🌸"][i % 3]}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center anim-fade-up" style={{ ["--delay" as string]: `${0.8 + photos.length * 1.1}s` }}>
        <NextButton onClick={onDone} />
      </div>
    </div>
  );
}

function FinalStage({ creation, dark, onReplay }: { creation: SavedCreation; dark: boolean; onReplay: () => void }) {
  const rots = [-8, 6, -4];
  return (
    <div className="mx-auto w-full max-w-md px-5 pb-16 pt-14">
      <div className={`text-center anim-fade-in ${dark ? "text-white" : "text-[#3b2a35]"}`}>
        <div className="font-serif-display text-3xl font-semibold leading-tight">{creation.title}</div>
        {creation.sender && <div className={`mt-1 text-sm ${dark ? "text-white/75" : "text-[#6d5563]"}`}>from {creation.sender}</div>}
      </div>
      <div className="relative mx-auto mt-4 w-full max-w-[380px]">
        <BouquetCanvas items={creation.items} wrap={creation.wrap} ribbon={creation.ribbon} animate baseDelay={0} />
        {creation.photos.map((p, i) => (
          <div
            key={i}
            className="polaroid absolute w-24 anim-polaroid sm:w-28"
            style={{
              ["--r" as string]: `${rots[i]}deg`,
              ["--delay" as string]: `${1.5 + i * 0.6}s`,
              left: i === 0 ? "-4%" : i === 1 ? "auto" : "-2%",
              right: i === 1 ? "-4%" : "auto",
              top: i === 0 ? "6%" : i === 1 ? "12%" : "auto",
              bottom: i === 2 ? "6%" : "auto",
              zIndex: 700,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p} alt="" className="aspect-square w-full object-cover" />
          </div>
        ))}
      </div>
      <div className="anim-fade-up mt-4 rounded-[1.75rem] bg-white/90 p-5 text-[#3b2a35] shadow-xl backdrop-blur" style={{ ["--delay" as string]: "1.2s" }}>
        {creation.recipient && <div className="font-hand text-xl text-[var(--accent)]">Dear {creation.recipient},</div>}
        <p className="mt-1 whitespace-pre-wrap text-[15px] leading-relaxed text-[#4f3b47]">{creation.message}</p>
        {creation.sender && <div className="font-hand mt-3 text-right text-xl text-[var(--accent)]">— {creation.sender}</div>}
      </div>
      <div className="mt-5 flex flex-col items-center gap-2 anim-fade-up" style={{ ["--delay" as string]: "1.8s" }}>
        <button type="button" onClick={onReplay} className={`rounded-full px-6 py-3 text-sm font-bold backdrop-blur ${dark ? "bg-white/15 text-white" : "bg-white/80 text-[#3b2a35]"}`}>
          ↻ Replay the surprise
        </button>
        <Link href="/" className="btn-primary rounded-full px-6 py-3 text-sm font-bold">
          Create your own 💐
        </Link>
        <div className={`mt-2 text-[11px] ${dark ? "text-white/60" : "text-[#8a6f80]"}`}>Made with Bloomly</div>
      </div>
    </div>
  );
}
