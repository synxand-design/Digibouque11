"use client";

import { ALL_ASSETS, RIBBONS, WRAPS } from "@/lib/catalog";
import type { PlacedItem } from "@/lib/types";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";

interface Props {
  items: PlacedItem[];
  wrap: string;
  ribbon: string;
  interactive?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  onChange?: (item: PlacedItem) => void;
  onDelete?: (id: string) => void;
  animate?: boolean; // staggered bloom (viewer)
  baseDelay?: number;
  showWrap?: boolean;
  className?: string;
}

function Wrap({ wrap, ribbon, layer, animate, baseDelay }: { wrap: string; ribbon: string; layer: "back" | "front"; animate?: boolean; baseDelay: number }) {
  const w = WRAPS.find((x) => x.id === wrap) || WRAPS[0];
  const r = RIBBONS.find((x) => x.id === ribbon) || RIBBONS[0];
  const gid = `wrap-${w.id}-${layer}`;
  return (
    <svg
      viewBox="0 0 100 133"
      preserveAspectRatio="none"
      className={`absolute inset-0 h-full w-full pointer-events-none ${animate ? "anim-fade-up" : ""}`}
      style={{ ["--delay" as string]: `${baseDelay}s` }}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={w.from} />
          <stop offset="100%" stopColor={w.to} />
        </linearGradient>
        <linearGradient id={`${gid}-shade`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(0,0,0,0.18)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.12)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
        </linearGradient>
        <filter id={`${gid}-sh`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.2" floodColor="rgba(50,20,30,0.35)" />
        </filter>
      </defs>
      {layer === "back" ? (
        <g filter={`url(#${gid}-sh)`}>
          <path d="M12 42 Q50 36 88 42 L59 116 L41 116 Z" fill={`url(#${gid})`} />
          <path d="M12 42 Q50 36 88 42 L59 116 L41 116 Z" fill={`url(#${gid}-shade)`} opacity="0.5" />
        </g>
      ) : (
        <g>
          <g filter={`url(#${gid}-sh)`}>
            <path d="M20 66 Q50 80 80 66 L58 116 L42 116 Z" fill={`url(#${gid})`} />
            <path d="M20 66 Q50 80 80 66 L58 116 L42 116 Z" fill={`url(#${gid}-shade)`} opacity="0.45" />
            <path d="M20 66 Q50 80 80 66 L74 70 Q50 84 26 70 Z" fill="rgba(255,255,255,0.28)" />
            <path d="M20 66 Q50 80 80 66" stroke={w.edge} strokeWidth="0.6" fill="none" opacity="0.6" />
          </g>
          {/* ribbon band */}
          <path d="M31 90 Q50 96 69 90 L68.2 95 Q50 101 31.8 95 Z" fill={r.color} />
          <path d="M31 90 Q50 96 69 90 L68.2 95 Q50 101 31.8 95 Z" fill="url(#ribbon-shade)" opacity="0.3" />
          {/* bow */}
          <g transform="translate(50 93)">
            <path d="M0 0 C-6 -9 -18 -8 -16 -1 C-15 5 -6 6 0 0Z" fill={r.color} stroke={r.dark} strokeWidth="0.5" />
            <path d="M0 0 C6 -9 18 -8 16 -1 C15 5 6 6 0 0Z" fill={r.color} stroke={r.dark} strokeWidth="0.5" />
            <path d="M0 0 C-4 -5 -12 -5 -11 -1 C-10 3 -4 3 0 0Z" fill={r.dark} opacity="0.35" />
            <path d="M0 0 C4 -5 12 -5 11 -1 C10 3 4 3 0 0Z" fill={r.dark} opacity="0.35" />
            <path d="M-1 1 L-7 16 L-3 14 L0 17 L3 14 L7 16 L1 1 Z" fill={r.color} stroke={r.dark} strokeWidth="0.4" />
            <ellipse cx="0" cy="0" rx="3" ry="2.6" fill={r.dark} />
            <ellipse cx="-0.6" cy="-0.6" rx="1.4" ry="1.1" fill="rgba(255,255,255,0.45)" />
          </g>
        </g>
      )}
    </svg>
  );
}

type Gesture =
  | { type: "drag"; id: string; startX: number; startY: number; itemX: number; itemY: number }
  | { type: "rotate"; id: string; cx: number; cy: number; startAngle: number; itemRot: number }
  | { type: "resize"; id: string; cx: number; cy: number; startDist: number; itemScale: number }
  | { type: "pinch"; id: string; startDist: number; startAngle: number; itemScale: number; itemRot: number; itemX: number; itemY: number; startCx: number; startCy: number };

export default function BouquetCanvas({
  items,
  wrap,
  ribbon,
  interactive = false,
  selectedId = null,
  onSelect,
  onChange,
  onDelete,
  animate = false,
  baseDelay = 0,
  showWrap = true,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<Gesture | null>(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const [, force] = useState(0);

  const getRect = () => ref.current?.getBoundingClientRect() || ({ left: 0, top: 0, width: 1, height: 1 } as DOMRect);
  const centerOf = (item: PlacedItem) => {
    const r = getRect();
    return { cx: r.left + (item.x / 100) * r.width, cy: r.top + (item.y / 100) * r.height };
  };

  const onPointerDown = (e: React.PointerEvent, item: PlacedItem, handle?: "rotate" | "resize") => {
    if (!interactive) return;
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    onSelect?.(item.id);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const { cx, cy } = centerOf(item);
    if (handle === "rotate") {
      gesture.current = { type: "rotate", id: item.id, cx, cy, startAngle: Math.atan2(e.clientY - cy, e.clientX - cx), itemRot: item.rotation };
    } else if (handle === "resize") {
      gesture.current = { type: "resize", id: item.id, cx, cy, startDist: Math.hypot(e.clientX - cx, e.clientY - cy), itemScale: item.scale };
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current = {
        type: "pinch",
        id: item.id,
        startDist: Math.hypot(b.x - a.x, b.y - a.y),
        startAngle: Math.atan2(b.y - a.y, b.x - a.x),
        itemScale: item.scale,
        itemRot: item.rotation,
        itemX: item.x,
        itemY: item.y,
        startCx: (a.x + b.x) / 2,
        startCy: (a.y + b.y) / 2,
      };
    } else {
      gesture.current = { type: "drag", id: item.id, startX: e.clientX, startY: e.clientY, itemX: item.x, itemY: item.y };
    }
  };

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      const g = gesture.current;
      if (!g || !pointers.current.has(e.pointerId)) return;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const item = itemsRef.current.find((i) => i.id === g.id);
      if (!item) return;
      const rect = getRect();
      e.preventDefault();
      if (g.type === "drag") {
        const nx = g.itemX + ((e.clientX - g.startX) / rect.width) * 100;
        const ny = g.itemY + ((e.clientY - g.startY) / rect.height) * 100;
        onChange?.({ ...item, x: Math.max(-10, Math.min(110, nx)), y: Math.max(-10, Math.min(110, ny)) });
      } else if (g.type === "rotate") {
        const ang = Math.atan2(e.clientY - g.cy, e.clientX - g.cx);
        onChange?.({ ...item, rotation: g.itemRot + ((ang - g.startAngle) * 180) / Math.PI });
      } else if (g.type === "resize") {
        const d = Math.hypot(e.clientX - g.cx, e.clientY - g.cy);
        onChange?.({ ...item, scale: Math.max(0.06, Math.min(1.2, g.itemScale * (d / Math.max(1, g.startDist)))) });
      } else if (g.type === "pinch" && pointers.current.size >= 2) {
        const [a, b] = [...pointers.current.values()];
        const dist = Math.hypot(b.x - a.x, b.y - a.y);
        const ang = Math.atan2(b.y - a.y, b.x - a.x);
        const cx = (a.x + b.x) / 2;
        const cy = (a.y + b.y) / 2;
        onChange?.({
          ...item,
          scale: Math.max(0.06, Math.min(1.2, g.itemScale * (dist / Math.max(1, g.startDist)))),
          rotation: g.itemRot + ((ang - g.startAngle) * 180) / Math.PI,
          x: g.itemX + ((cx - g.startCx) / rect.width) * 100,
          y: g.itemY + ((cy - g.startCy) / rect.height) * 100,
        });
      }
    },
    [onChange],
  );

  const onPointerUp = useCallback((e: PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) gesture.current = null;
    else if (gesture.current?.type === "pinch") {
      // fall back to drag with remaining pointer
      const [p] = [...pointers.current.values()];
      const item = itemsRef.current.find((i) => i.id === gesture.current!.id);
      if (item) gesture.current = { type: "drag", id: item.id, startX: p.x, startY: p.y, itemX: item.x, itemY: item.y };
    }
    force((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!interactive) return;
    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [interactive, onPointerMove, onPointerUp]);

  const sorted = [...items].sort((a, b) => a.z - b.z);
  const flowersFirst = animate ? [...sorted].sort((a, b) => (a.kind === "greenery" ? -1 : 0) - (b.kind === "greenery" ? -1 : 0)) : sorted;
  const delayOf = (id: string) => baseDelay + 0.4 + flowersFirst.findIndex((i) => i.id === id) * 0.16;

  return (
    <div
      ref={ref}
      className={`relative w-full select-none ${interactive ? "touch-none" : ""} ${className}`}
      style={{ aspectRatio: "3 / 4" }}
      onPointerDown={(e) => {
        if (!interactive) return;
        const g = gesture.current;
        // A second finger anywhere on the canvas joins the current gesture as a pinch.
        if (g && g.type === "drag" && pointers.current.size === 1) {
          const item = itemsRef.current.find((i) => i.id === g.id);
          if (!item) return;
          pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
          const [a, b] = [...pointers.current.values()];
          gesture.current = {
            type: "pinch",
            id: item.id,
            startDist: Math.hypot(b.x - a.x, b.y - a.y),
            startAngle: Math.atan2(b.y - a.y, b.x - a.x),
            itemScale: item.scale,
            itemRot: item.rotation,
            itemX: item.x,
            itemY: item.y,
            startCx: (a.x + b.x) / 2,
            startCy: (a.y + b.y) / 2,
          };
          return;
        }
        if (pointers.current.size === 0) onSelect?.(null);
      }}
    >
      {showWrap && <Wrap wrap={wrap} ribbon={ribbon} layer="back" animate={animate} baseDelay={baseDelay} />}
      {sorted.map((item) => {
        const asset = ALL_ASSETS[item.asset];
        if (!asset) return null;
        const selected = interactive && selectedId === item.id;
        const style: CSSProperties = {
          left: `${item.x}%`,
          top: `${item.y}%`,
          width: `${item.scale * 100}%`,
          transform: `translate(-50%,-50%) rotate(${item.rotation}deg)`,
          zIndex: item.kind === "sticker" ? 600 + item.z : 10 + item.z,
        };
        return (
          <div
            key={item.id}
            className={`absolute ${interactive ? "cursor-grab active:cursor-grabbing" : ""}`}
            style={style}
            onPointerDown={(e) => onPointerDown(e, item)}
          >
            <div
              className={`${animate ? "anim-bloom" : ""} ${selected ? "selection-ring" : ""}`}
              style={{ ["--delay" as string]: `${delayOf(item.id)}s` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.src}
                alt={asset.name}
                draggable={false}
                className={`block w-full h-auto pointer-events-none ${item.kind === "sticker" ? "sticker-shadow" : "item-shadow"}`}
                style={{ transform: item.flip ? "scaleX(-1)" : undefined }}
              />
            </div>
            {selected && (
              <>
                <button
                  type="button"
                  className="handle"
                  style={{ left: -17, top: -17 }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onDelete?.(item.id);
                  }}
                  aria-label="Delete"
                >
                  ✕
                </button>
                <button
                  type="button"
                  className="handle"
                  style={{ right: -17, top: -17 }}
                  onPointerDown={(e) => onPointerDown(e, item, "rotate")}
                  aria-label="Rotate"
                >
                  ↻
                </button>
                <button
                  type="button"
                  className="handle"
                  style={{ right: -17, bottom: -17 }}
                  onPointerDown={(e) => onPointerDown(e, item, "resize")}
                  aria-label="Resize"
                >
                  ⤡
                </button>
              </>
            )}
          </div>
        );
      })}
      {showWrap && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 500 }}>
          <Wrap wrap={wrap} ribbon={ribbon} layer="front" animate={animate} baseDelay={baseDelay + 0.2} />
        </div>
      )}
    </div>
  );
}
