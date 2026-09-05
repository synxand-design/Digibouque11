"use client";

import AnimatedBackground from "@/components/AnimatedBackground";
import BouquetCanvas from "@/components/BouquetCanvas";
import { ALL_ASSETS, Asset, FLOWERS, GREENERY, RIBBONS, STICKERS, WRAPS } from "@/lib/catalog";
import { getBackground, OccasionDef } from "@/lib/occasions";
import { generateSurprise, uid } from "@/lib/surprise";
import type { CreationData, PlacedItem } from "@/lib/types";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Tab = "flowers" | "greenery" | "stickers" | "style" | "photos" | "music" | "message";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "flowers", label: "Flowers", icon: "🌹" },
  { id: "greenery", label: "Greenery", icon: "🌿" },
  { id: "stickers", label: "Stickers", icon: "🐱" },
  { id: "style", label: "Background", icon: "🎨" },
  { id: "photos", label: "Photos", icon: "📸" },
  { id: "music", label: "Music", icon: "🎵" },
  { id: "message", label: "Message", icon: "💌" },
];

const MAX_PHOTOS = 3;
const MAX_MUSIC_BYTES = 6 * 1024 * 1024;

async function compressImage(file: File): Promise<string> {
  const dataUrl: string = await new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = rej;
    r.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = dataUrl;
  });
  const max = 1100;
  const ratio = Math.min(1, max / Math.max(img.width, img.height));
  const c = document.createElement("canvas");
  c.width = Math.round(img.width * ratio);
  c.height = Math.round(img.height * ratio);
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.82);
}

export default function Builder({ occasion }: { occasion: OccasionDef }) {
  // Start empty on the server (deterministic markup), then compose a starter
  // arrangement on the client to avoid hydration mismatches from randomness.
  const [data, setData] = useState<CreationData>(() => ({
    occasion: occasion.id,
    title: occasion.defaultTitle,
    recipient: "",
    sender: "",
    message: occasion.defaultMessage,
    background: occasion.backgrounds[0].id,
    wrap: occasion.wrapPool[0],
    ribbon: occasion.ribbonPool[0],
    items: [],
    photos: [],
    music: null,
    musicName: null,
  }));
  useEffect(() => {
    const s = generateSurprise(occasion);
    setData((d) => (d.items.length ? d : { ...d, items: s.items, wrap: s.wrap, ribbon: s.ribbon }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("flowers");
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const photoInput = useRef<HTMLInputElement>(null);
  const musicInput = useRef<HTMLInputElement>(null);

  const bg = getBackground(occasion, data.background);
  const selected = data.items.find((i) => i.id === selectedId) || null;
  const maxZ = useMemo(() => data.items.reduce((m, i) => Math.max(m, i.z), 0), [data.items]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const update = (patch: Partial<CreationData>) => setData((d) => ({ ...d, ...patch }));

  const addAsset = (asset: Asset) => {
    const item: PlacedItem = {
      id: uid(),
      asset: asset.id,
      kind: asset.kind,
      x: 50 + (Math.random() - 0.5) * 30,
      y: (asset.kind === "sticker" ? 60 : 45) + (Math.random() - 0.5) * 20,
      scale: asset.base,
      rotation: (Math.random() - 0.5) * 30,
      z: maxZ + 1,
    };
    setData((d) => ({ ...d, items: [...d.items, item] }));
    setSelectedId(item.id);
  };

  const changeItem = useCallback((item: PlacedItem) => {
    setData((d) => ({ ...d, items: d.items.map((i) => (i.id === item.id ? item : i)) }));
  }, []);

  const deleteItem = (id: string) => {
    setData((d) => ({ ...d, items: d.items.filter((i) => i.id !== id) }));
    setSelectedId(null);
  };

  const modifySelected = (fn: (i: PlacedItem) => PlacedItem) => selected && changeItem(fn(selected));

  const duplicateSelected = () => {
    if (!selected) return;
    const copy = { ...selected, id: uid(), x: selected.x + 6, y: selected.y + 6, z: maxZ + 1 };
    setData((d) => ({ ...d, items: [...d.items, copy] }));
    setSelectedId(copy.id);
  };

  const surprise = () => {
    const s = generateSurprise(occasion);
    update({ items: s.items, background: s.background, wrap: s.wrap, ribbon: s.ribbon });
    setSelectedId(null);
    setToast("✨ Surprise arrangement created!");
  };

  const onPhotos = async (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files).filter((f) => /image\/(jpeg|jpg|png)/i.test(f.type) || /\.(jpe?g|png)$/i.test(f.name));
    if (!list.length) return setToast("Please choose JPG or PNG images");
    const room = MAX_PHOTOS - data.photos.length;
    if (room <= 0) return setToast(`Maximum ${MAX_PHOTOS} photos`);
    const out: string[] = [];
    for (const f of list.slice(0, room)) {
      try {
        out.push(await compressImage(f));
      } catch {
        setToast("Could not read one of the images");
      }
    }
    setData((d) => ({ ...d, photos: [...d.photos, ...out].slice(0, MAX_PHOTOS) }));
    if (photoInput.current) photoInput.current.value = "";
  };

  const onMusic = (files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    if (!(/audio\/(mpeg|mp3)/i.test(f.type) || /\.mp3$/i.test(f.name))) return setToast("Please choose an MP3 file");
    if (f.size > MAX_MUSIC_BYTES) return setToast("MP3 must be under 6MB — try a 30–40 second clip");
    const r = new FileReader();
    r.onload = () => {
      let url = String(r.result);
      if (!url.startsWith("data:audio/")) url = url.replace(/^data:[^;]*;/, "data:audio/mpeg;");
      update({ music: url, musicName: f.name });
    };
    r.readAsDataURL(f);
    if (musicInput.current) musicInput.current.value = "";
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/creations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save");
      setSavedId(json.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const shareUrl = savedId && typeof window !== "undefined" ? `${window.location.origin}/s/${savedId}` : "";
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setToast("Long-press the link to copy");
    }
  };
  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: data.title, text: `I made something special for you 💐`, url: shareUrl });
      } catch {
        /* cancelled */
      }
    } else copyLink();
  };

  const chip = (a: Asset) => (
    <button
      key={a.id}
      type="button"
      onClick={() => addAsset(a)}
      className="group flex flex-col items-center gap-1.5 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-pink-100 transition active:scale-95 hover:shadow-md"
    >
      <div className="grid h-[72px] w-full place-items-center rounded-xl bg-gradient-to-br from-pink-50 to-emerald-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={a.src} alt={a.name} className="max-h-16 max-w-[85%] object-contain drop-shadow-md transition group-hover:scale-110" loading="lazy" />
      </div>
      <span className="line-clamp-1 text-[11px] font-semibold text-[#5f4a57]">{a.name}</span>
    </button>
  );

  return (
    <div className="min-h-[100dvh] bg-[#fff7fa] text-[#3b2a35]" style={{ ["--accent" as string]: occasion.accent, ["--accent-soft" as string]: occasion.accentSoft }}>
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-pink-100/70">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-2.5 sm:px-6">
          <Link href="/" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white shadow-sm ring-1 ring-pink-100" aria-label="Back">
            ←
          </Link>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold leading-tight sm:text-base">
              {occasion.emoji} {occasion.name}
            </div>
            <div className="truncate text-[11px] text-[#8a6f80]">Tap items to move · pinch to resize & rotate</div>
          </div>
          <button type="button" onClick={surprise} className="hidden shrink-0 rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm ring-1 ring-pink-100 transition active:scale-95 md:block">
            ✨ Surprise Me
          </button>
          <button type="button" onClick={save} disabled={saving} className="btn-primary hidden shrink-0 rounded-full px-5 py-2 text-sm font-bold disabled:opacity-60 md:block">
            {saving ? "Saving…" : "Generate share link 🔗"}
          </button>
          <div className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#8a6f80] shadow-sm ring-1 ring-pink-100 md:hidden">{data.items.length} items</div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-3 pb-28 pt-3 sm:px-6 md:grid md:grid-cols-[minmax(0,420px)_1fr] md:gap-6 md:pb-10 md:pt-6">
        {/* Canvas */}
        <div className="md:sticky md:top-20 md:self-start">
          <div className="mx-auto" style={{ width: "min(100%, calc(56svh * 0.75))" }}>
            <div className="relative overflow-hidden rounded-[1.75rem] shadow-[0_20px_50px_-20px_rgba(120,40,80,0.45)] ring-4 ring-white">
              <AnimatedBackground bg={bg} dim />
              <BouquetCanvas
                items={data.items}
                wrap={data.wrap}
                ribbon={data.ribbon}
                interactive
                selectedId={selectedId}
                onSelect={setSelectedId}
                onChange={changeItem}
                onDelete={deleteItem}
              />
              {data.items.length === 0 && (
                <div className="pointer-events-none absolute inset-0 grid place-items-center">
                  <div className="rounded-2xl bg-white/80 px-4 py-3 text-center text-sm font-semibold text-[#8a6f80] backdrop-blur">
                    Add flowers below to start 🌷
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Selected item toolbar */}
          <div className={`mx-auto mt-3 flex items-center justify-center gap-1.5 transition-opacity ${selected ? "opacity-100" : "pointer-events-none opacity-0"}`}>
            {[
              { l: "−", t: "Smaller", f: () => modifySelected((i) => ({ ...i, scale: Math.max(0.06, i.scale * 0.9) })) },
              { l: "+", t: "Bigger", f: () => modifySelected((i) => ({ ...i, scale: Math.min(1.2, i.scale * 1.1) })) },
              { l: "↺", t: "Rotate left", f: () => modifySelected((i) => ({ ...i, rotation: i.rotation - 15 })) },
              { l: "↻", t: "Rotate right", f: () => modifySelected((i) => ({ ...i, rotation: i.rotation + 15 })) },
              { l: "⇋", t: "Flip", f: () => modifySelected((i) => ({ ...i, flip: !i.flip })) },
              { l: "⬆", t: "Bring front", f: () => modifySelected((i) => ({ ...i, z: maxZ + 1 })) },
              { l: "⬇", t: "Send back", f: () => modifySelected((i) => ({ ...i, z: Math.min(...data.items.map((x) => x.z)) - 1 })) },
              { l: "⧉", t: "Duplicate", f: duplicateSelected },
              { l: "🗑", t: "Delete", f: () => selected && deleteItem(selected.id) },
            ].map((b) => (
              <button key={b.t} type="button" title={b.t} aria-label={b.t} onClick={b.f} className="grid h-10 w-10 place-items-center rounded-full bg-white text-base shadow-sm ring-1 ring-pink-100 transition active:scale-90">
                {b.l}
              </button>
            ))}
          </div>
        </div>

        {/* Panel */}
        <div className="mt-4 md:mt-0">
          <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 pb-2 sm:mx-0 sm:px-0 md:flex-wrap">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold transition ${
                  tab === t.id ? "btn-primary" : "bg-white text-[#5f4a57] shadow-sm ring-1 ring-pink-100"
                }`}
              >
                <span>{t.icon}</span>
                {t.label}
                {t.id === "photos" && data.photos.length > 0 && <span className="rounded-full bg-white/40 px-1.5 text-[10px]">{data.photos.length}</span>}
                {t.id === "music" && data.music && <span>✓</span>}
              </button>
            ))}
          </div>

          <div className="mt-3 rounded-3xl bg-white/70 p-3 shadow-[0_10px_30px_-16px_rgba(120,40,80,0.35)] ring-1 ring-pink-100 sm:p-4">
            {tab === "flowers" && (
              <>
                <PanelTitle title="Realistic flowers" sub="Tap to add. Add as many as you like." />
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">{FLOWERS.map(chip)}</div>
              </>
            )}
            {tab === "greenery" && (
              <>
                <PanelTitle title="Greenery & fillers" sub="Eucalyptus, fern, baby's breath and more." />
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">{GREENERY.map(chip)}</div>
              </>
            )}
            {tab === "stickers" && (
              <>
                <PanelTitle title="Cute stickers" sub="Drag, pinch to resize and rotate at any angle." />
                {(["cat", "animal", "decor"] as const).map((g) => (
                  <div key={g} className="mb-4">
                    <div className="mb-2 text-xs font-bold uppercase tracking-wider text-[#8a6f80]">{g === "cat" ? "🐱 Cats" : g === "animal" ? "🐰 Cute animals" : "🎀 Romantic & decor"}</div>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">{STICKERS.filter((s) => s.group === g).map(chip)}</div>
                  </div>
                ))}
              </>
            )}
            {tab === "style" && (
              <>
                <PanelTitle title="Background" sub="Each occasion has 4 living backgrounds." />
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {occasion.backgrounds.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => update({ background: b.id })}
                      className={`relative h-24 overflow-hidden rounded-2xl ring-2 transition active:scale-95 ${data.background === b.id ? "ring-[var(--accent)]" : "ring-transparent"}`}
                    >
                      <AnimatedBackground bg={b} dim />
                      <span className={`absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-[11px] font-bold ${b.dark ? "bg-black/40 text-white" : "bg-white/80 text-[#3b2a35]"}`}>{b.name}</span>
                      {data.background === b.id && <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-white text-xs shadow">✓</span>}
                    </button>
                  ))}
                </div>
                <PanelTitle title="Wrapping paper" className="mt-5" />
                <div className="flex flex-wrap gap-2">
                  {WRAPS.map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      title={w.name}
                      onClick={() => update({ wrap: w.id })}
                      className={`h-11 w-11 rounded-full ring-2 ring-offset-2 transition active:scale-90 ${data.wrap === w.id ? "ring-[var(--accent)]" : "ring-transparent"}`}
                      style={{ background: `linear-gradient(135deg, ${w.from}, ${w.to})` }}
                    />
                  ))}
                </div>
                <PanelTitle title="Ribbon" className="mt-5" />
                <div className="flex flex-wrap gap-2">
                  {RIBBONS.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      title={r.name}
                      onClick={() => update({ ribbon: r.id })}
                      className={`h-11 w-11 rounded-full ring-2 ring-offset-2 transition active:scale-90 ${data.ribbon === r.id ? "ring-[var(--accent)]" : "ring-transparent"}`}
                      style={{ background: `linear-gradient(135deg, ${r.color}, ${r.dark})` }}
                    />
                  ))}
                </div>
                <div className="mt-5 flex gap-2">
                  <button type="button" onClick={() => { update({ items: [] }); setSelectedId(null); }} className="rounded-full bg-white px-4 py-2 text-xs font-bold text-rose-500 shadow-sm ring-1 ring-rose-100">
                    Clear canvas
                  </button>
                </div>
              </>
            )}
            {tab === "photos" && (
              <>
                <PanelTitle title="Your photos" sub="Up to 3 photos (JPG / PNG). They appear with soft polaroid animations." />
                <input ref={photoInput} type="file" accept="image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png" multiple className="hidden" onChange={(e) => onPhotos(e.target.files)} />
                <div className="grid grid-cols-3 gap-2">
                  {data.photos.map((p, i) => (
                    <div key={i} className="polaroid relative" style={{ ["--r" as string]: `${(i - 1) * 3}deg` }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p} alt={`Photo ${i + 1}`} className="aspect-square w-full object-cover" />
                      <button type="button" onClick={() => update({ photos: data.photos.filter((_, j) => j !== i) })} className="absolute -right-2 -top-2 grid h-8 w-8 place-items-center rounded-full bg-white text-rose-500 shadow ring-1 ring-rose-100" aria-label="Remove photo">
                        ✕
                      </button>
                    </div>
                  ))}
                  {data.photos.length < MAX_PHOTOS && (
                    <button type="button" onClick={() => photoInput.current?.click()} className="grid aspect-[4/5] place-items-center rounded-2xl border-2 border-dashed border-pink-200 bg-white text-center text-xs font-bold text-[#8a6f80] transition active:scale-95">
                      <div>
                        <div className="text-2xl">＋</div>
                        Add photo
                      </div>
                    </button>
                  )}
                </div>
                <button type="button" onClick={() => photoInput.current?.click()} className="btn-primary mt-4 w-full rounded-2xl py-3.5 text-sm font-bold">
                  📸 Choose from gallery
                </button>
              </>
            )}
            {tab === "music" && (
              <>
                <PanelTitle title="Background music" sub="One MP3, ideally 30–40 seconds. It loops while they enjoy the surprise." />
                <input ref={musicInput} type="file" accept="audio/mpeg,audio/mp3,.mp3" className="hidden" onChange={(e) => onMusic(e.target.files)} />
                {data.music ? (
                  <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-pink-100">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="truncate text-sm font-bold">🎵 {data.musicName || "Your song"}</div>
                      <button type="button" onClick={() => update({ music: null, musicName: null })} className="rounded-full px-3 py-1 text-xs font-bold text-rose-500 ring-1 ring-rose-100">
                        Remove
                      </button>
                    </div>
                    <audio src={data.music} controls loop className="w-full" preload="metadata" />
                  </div>
                ) : (
                  <button type="button" onClick={() => musicInput.current?.click()} className="grid w-full place-items-center rounded-2xl border-2 border-dashed border-pink-200 bg-white py-8 text-sm font-bold text-[#8a6f80] transition active:scale-[0.98]">
                    <div className="text-3xl">🎶</div>
                    Upload MP3
                  </button>
                )}
              </>
            )}
            {tab === "message" && (
              <div className="space-y-3">
                <PanelTitle title="Your message" sub="Revealed with a gentle animation inside the experience." />
                <Field label="Title">
                  <input value={data.title} onChange={(e) => update({ title: e.target.value })} maxLength={120} className="input" placeholder={occasion.defaultTitle} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="To">
                    <input value={data.recipient} onChange={(e) => update({ recipient: e.target.value })} maxLength={80} className="input" placeholder="Their name" />
                  </Field>
                  <Field label="From">
                    <input value={data.sender} onChange={(e) => update({ sender: e.target.value })} maxLength={80} className="input" placeholder="Your name" />
                  </Field>
                </div>
                <Field label={`Message (${data.message.length}/1200)`}>
                  <textarea value={data.message} onChange={(e) => update({ message: e.target.value.slice(0, 1200) })} rows={7} className="input resize-y" placeholder="Write from the heart…" />
                </Field>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile bottom action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 glass border-t border-pink-100/70 px-3 pt-2 safe-bottom md:hidden">
        <div className="mx-auto flex max-w-md gap-2">
          <button type="button" onClick={surprise} className="flex-1 rounded-2xl bg-white py-3 text-sm font-bold shadow-sm ring-1 ring-pink-100 active:scale-95">
            ✨ Surprise Me
          </button>
          <button type="button" onClick={save} disabled={saving} className="btn-primary flex-[1.4] rounded-2xl py-3 text-sm font-bold disabled:opacity-60">
            {saving ? "Wrapping it up…" : "Generate share link 🔗"}
          </button>
        </div>
      </div>

      {toast && <div className="fixed left-1/2 top-16 z-50 -translate-x-1/2 rounded-full bg-[#3b2a35] px-4 py-2 text-sm font-semibold text-white shadow-lg anim-pop">{toast}</div>}

      {/* Share modal */}
      {(savedId || error) && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/40 p-0 backdrop-blur-sm sm:place-items-center sm:p-4" onClick={() => { setSavedId(null); setError(null); }}>
          <div className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl anim-fade-up sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            {error ? (
              <>
                <div className="text-3xl">😢</div>
                <h3 className="mt-2 text-lg font-bold">Couldn&apos;t save</h3>
                <p className="mt-1 text-sm text-[#6d5563]">{error}</p>
                <button type="button" onClick={() => setError(null)} className="btn-primary mt-4 w-full rounded-2xl py-3 text-sm font-bold">
                  Try again
                </button>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="text-4xl anim-heart inline-block">💝</div>
                  <h3 className="font-serif-display mt-2 text-2xl font-semibold">Your surprise is ready!</h3>
                  <p className="mt-1 text-sm text-[#6d5563]">Send this link to someone special. It opens as a full animated experience.</p>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-2xl bg-pink-50 p-2 pl-3 ring-1 ring-pink-100">
                  <input readOnly value={shareUrl} className="min-w-0 flex-1 bg-transparent text-xs font-semibold text-[#3b2a35] outline-none" onFocus={(e) => e.target.select()} />
                  <button type="button" onClick={copyLink} className="btn-primary shrink-0 rounded-xl px-3 py-2 text-xs font-bold">
                    {copied ? "Copied ✓" : "Copy"}
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <a href={`https://wa.me/?text=${encodeURIComponent(`I made something special for you 💐 ${shareUrl}`)}`} target="_blank" rel="noreferrer" className="rounded-2xl bg-[#25D366] py-3 text-center text-sm font-bold text-white">
                    WhatsApp
                  </a>
                  <button type="button" onClick={nativeShare} className="rounded-2xl bg-[#3b2a35] py-3 text-sm font-bold text-white">
                    Share…
                  </button>
                </div>
                <Link href={`/s/${savedId}`} target="_blank" className="mt-2 block rounded-2xl bg-white py-3 text-center text-sm font-bold text-[var(--accent)] ring-1 ring-pink-100">
                  Preview the experience →
                </Link>
                <button type="button" onClick={() => setSavedId(null)} className="mt-2 w-full py-2 text-xs font-semibold text-[#8a6f80]">
                  Keep editing
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

function PanelTitle({ title, sub, className = "" }: { title: string; sub?: string; className?: string }) {
  return (
    <div className={`mb-3 ${className}`}>
      <div className="text-sm font-bold">{title}</div>
      {sub && <div className="text-xs text-[#8a6f80]">{sub}</div>}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-[#8a6f80]">{label}</span>
      {children}
    </label>
  );
}
