import { ALL_ASSETS, GREENERY } from "./catalog";
import type { OccasionDef } from "./occasions";
import type { PlacedItem } from "./types";

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

let counter = 0;
export const uid = () => `${Date.now().toString(36)}${(counter++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/**
 * Builds a dome-shaped bouquet: greenery fanned out behind, a ring of flowers,
 * a hero flower in the middle, small fillers, and one or two stickers.
 */
export function generateSurprise(occasion: OccasionDef): {
  items: PlacedItem[];
  background: string;
  wrap: string;
  ribbon: string;
} {
  const items: PlacedItem[] = [];
  let z = 1;
  const cx = 50;
  const cy = 46; // dome center

  // Greenery fan (behind)
  const greens = shuffle(GREENERY.filter((g) => g.id !== "monstera")).slice(0, 4);
  const greenAngles = [-70, -35, 0, 35, 70, -55, 55];
  shuffle(greenAngles)
    .slice(0, 5)
    .forEach((ang, i) => {
      const g = greens[i % greens.length];
      const rad = (ang * Math.PI) / 180;
      const r = rand(14, 20);
      items.push({
        id: uid(),
        asset: g.id,
        kind: "greenery",
        x: cx + Math.sin(rad) * r * 1.35,
        y: cy - Math.cos(rad) * r * 1.05,
        scale: g.base * rand(1.05, 1.35),
        rotation: ang + rand(-8, 8),
        z: z++,
        flip: ang > 0,
      });
    });

  // Outer ring of flowers
  const pool = shuffle(occasion.flowerPool.filter((f) => ALL_ASSETS[f]?.kind === "flower"));
  const ringCount = 6;
  for (let i = 0; i < ringCount; i++) {
    const asset = ALL_ASSETS[pool[i % pool.length]];
    const ang = -90 + (i / (ringCount - 1)) * 180 - 90 + 90; // -90..90 spread top half
    const rad = ((ang - 90) * Math.PI) / 180;
    const r = 15;
    items.push({
      id: uid(),
      asset: asset.id,
      kind: "flower",
      x: cx + Math.cos(rad) * r * 1.4 + rand(-2, 2),
      y: cy + Math.sin(rad) * r * 0.9 + rand(-2, 2) + 8,
      scale: asset.base * rand(0.85, 1.05),
      rotation: rand(-25, 25),
      z: z++,
    });
  }

  // Inner cluster
  const inner = [
    [-9, 4],
    [9, 5],
    [0, -6],
  ];
  inner.forEach(([dx, dy], i) => {
    const asset = ALL_ASSETS[pool[(i + 2) % pool.length]];
    items.push({
      id: uid(),
      asset: asset.id,
      kind: "flower",
      x: cx + dx + rand(-1.5, 1.5),
      y: cy + dy + rand(-1.5, 1.5),
      scale: asset.base * rand(1.0, 1.15),
      rotation: rand(-20, 20),
      z: z++,
    });
  });

  // Hero flower
  const hero = ALL_ASSETS[pool[0]];
  items.push({
    id: uid(),
    asset: hero.id,
    kind: "flower",
    x: cx,
    y: cy + 4,
    scale: hero.base * 1.25,
    rotation: rand(-10, 10),
    z: z++,
  });

  // Fillers
  const filler = pick(["babys-breath", "cherry-blossom", "lilac", "cornflower-blue"]);
  [
    [-18, -8],
    [18, -6],
  ].forEach(([dx, dy]) => {
    const asset = ALL_ASSETS[filler];
    items.push({
      id: uid(),
      asset: asset.id,
      kind: asset.kind,
      x: cx + dx,
      y: cy + dy,
      scale: asset.base * 0.8,
      rotation: dx < 0 ? -30 : 30,
      z: z++,
      flip: dx > 0,
    });
  });

  // One or two stickers tucked at side
  const stickers = shuffle(occasion.stickerPool).slice(0, Math.random() > 0.5 ? 2 : 1);
  stickers.forEach((sid, i) => {
    const asset = ALL_ASSETS[sid];
    if (!asset) return;
    items.push({
      id: uid(),
      asset: asset.id,
      kind: "sticker",
      x: i === 0 ? 20 : 80,
      y: i === 0 ? 72 : 28,
      scale: asset.base * 0.9,
      rotation: i === 0 ? -8 : 8,
      z: z++,
    });
  });

  return {
    items,
    background: pick(occasion.backgrounds).id,
    wrap: pick(occasion.wrapPool),
    ribbon: pick(occasion.ribbonPool),
  };
}
