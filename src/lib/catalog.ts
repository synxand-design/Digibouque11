import type { ItemKind } from "./types";

export interface Asset {
  id: string;
  name: string;
  kind: ItemKind;
  group: "flower" | "greenery" | "cat" | "animal" | "decor";
  src: string;
  base: number; // default width as fraction of canvas width
  tags?: string[];
}

const a = (
  id: string,
  name: string,
  kind: ItemKind,
  group: Asset["group"],
  base = 0.3,
  tags: string[] = [],
): Asset => ({ id, name, kind, group, src: `/assets/${id}.png`, base, tags });

export const FLOWERS: Asset[] = [
  a("rose-red", "Red Rose", "flower", "flower", 0.3, ["love", "romantic", "classic"]),
  a("rose-pink", "Pink Rose", "flower", "flower", 0.3, ["soft", "romantic"]),
  a("rose-cream", "Cream Rose", "flower", "flower", 0.3, ["elegant", "white"]),
  a("gerbera-pink", "Pink Gerbera", "flower", "flower", 0.32, ["cheerful"]),
  a("hibiscus", "Hibiscus", "flower", "flower", 0.32, ["tropical", "red"]),
  a("hydrangea-blue", "Blue Hydrangea", "flower", "flower", 0.32, ["blue"]),
  a("daisy-white", "White Daisy", "flower", "flower", 0.28, ["white", "fresh"]),
  a("tulip-pink", "Pink Tulip", "flower", "flower", 0.28, ["spring"]),
  a("tulip-yellow", "Yellow Tulip", "flower", "flower", 0.22, ["spring", "yellow"]),
  a("peony-blush", "Blush Peony", "flower", "flower", 0.32, ["soft", "romantic"]),
  a("sunflower", "Sunflower", "flower", "flower", 0.32, ["yellow", "cheerful"]),
  a("anemone-purple", "Purple Anemone", "flower", "flower", 0.28, ["purple"]),
  a("ranunculus-orange", "Orange Ranunculus", "flower", "flower", 0.28, ["warm"]),
  a("cornflower-blue", "Blue Cornflower", "flower", "flower", 0.26, ["blue"]),
  a("lilac", "Lilac", "flower", "flower", 0.26, ["purple", "filler"]),
  a("plumeria", "Plumeria", "flower", "flower", 0.28, ["tropical"]),
  a("carnation-coral", "Coral Carnation", "flower", "flower", 0.28, ["warm"]),
  a("cherry-blossom", "Cherry Blossom", "flower", "flower", 0.3, ["filler", "soft"]),
];

export const GREENERY: Asset[] = [
  a("eucalyptus", "Eucalyptus", "greenery", "greenery", 0.16),
  a("fern", "Fern", "greenery", "greenery", 0.22),
  a("babys-breath", "Baby's Breath", "greenery", "greenery", 0.26),
  a("olive-branch", "Olive Branch", "greenery", "greenery", 0.18),
  a("sage-leaves", "Soft Sage Leaves", "greenery", "greenery", 0.24),
  a("palm-leaf", "Long Palm Leaf", "greenery", "greenery", 0.2),
  a("ruscus", "Ruscus Foliage", "greenery", "greenery", 0.22),
  a("pampas", "Pampas Grass", "greenery", "greenery", 0.16),
  a("monstera", "Monstera Leaf", "greenery", "greenery", 0.24),
];

export const STICKERS: Asset[] = [
  a("cat-bouquet", "Kitten with Bouquet", "sticker", "cat", 0.26),
  a("cat-suit", "Gentleman Cat", "sticker", "cat", 0.28),
  a("cat-bow", "Kitten with Bow", "sticker", "cat", 0.22),
  a("cat-heart-paws", "Heart Paws", "sticker", "cat", 0.24),
  a("cat-smile", "Smiling Cat", "sticker", "cat", 0.26),
  a("cat-rose", "Cat with Rose", "sticker", "cat", 0.24),
  a("cat-teacup", "Teacup Kitten", "sticker", "cat", 0.26),
  a("cat-heart-pillow", "Cuddle Heart", "sticker", "cat", 0.26),
  a("cats-cuddle", "Cuddling Kittens", "sticker", "cat", 0.28),
  a("puppy-crown", "Flower Crown Puppy", "sticker", "animal", 0.26),
  a("bunny-tulip", "Bunny with Tulip", "sticker", "animal", 0.22),
  a("duckling-bow", "Duckling", "sticker", "animal", 0.2),
  a("teddy-heart", "Teddy with Heart", "sticker", "animal", 0.26),
  a("panda-sunflower", "Panda", "sticker", "animal", 0.26),
  a("corgi-party", "Party Corgi", "sticker", "animal", 0.24),
  a("kitten-gift", "Kitten in Gift", "sticker", "animal", 0.26),
  a("hedgehog-daisy", "Hedgehog", "sticker", "animal", 0.22),
  a("lamb-ribbon", "Little Lamb", "sticker", "animal", 0.24),
  a("heart-red", "Glossy Heart", "sticker", "decor", 0.18),
  a("bow-pink", "Satin Bow", "sticker", "decor", 0.22),
  a("gift-box", "Gift Box", "sticker", "decor", 0.2),
  a("envelope-seal", "Sealed Letter", "sticker", "decor", 0.22),
  a("balloons-pink", "Balloons", "sticker", "decor", 0.22),
  a("diya", "Diya Lamp", "sticker", "decor", 0.2),
  a("butterfly-blue", "Butterfly", "sticker", "decor", 0.16),
  a("macarons", "Macarons", "sticker", "decor", 0.16),
  a("gold-stars", "Gold Sparkles", "sticker", "decor", 0.2),
];

export const ALL_ASSETS: Record<string, Asset> = Object.fromEntries(
  [...FLOWERS, ...GREENERY, ...STICKERS].map((x) => [x.id, x]),
);

export interface WrapOption {
  id: string;
  name: string;
  from: string;
  to: string;
  edge: string;
}
export const WRAPS: WrapOption[] = [
  { id: "kraft", name: "Kraft Paper", from: "#d9b48a", to: "#b98a5a", edge: "#a67848" },
  { id: "blush", name: "Blush Pink", from: "#ffd6e2", to: "#f6a9c0", edge: "#e98fb0" },
  { id: "ivory", name: "Ivory", from: "#fffaf2", to: "#efe3cf", edge: "#dccbb0" },
  { id: "sage", name: "Sage", from: "#d6e5d2", to: "#a9c4a4", edge: "#8fae8a" },
  { id: "lavender", name: "Lavender", from: "#e8dcf7", to: "#c8b2ea", edge: "#b19bd9" },
  { id: "noir", name: "Elegant Black", from: "#4a4a55", to: "#1f1f27", edge: "#111" },
  { id: "gold", name: "Royal Gold", from: "#f7e2a8", to: "#d6ad4f", edge: "#b98d2f" },
  { id: "sky", name: "Sky Blue", from: "#dcecff", to: "#a9c9f5", edge: "#8db3e8" },
];

export interface RibbonOption {
  id: string;
  name: string;
  color: string;
  dark: string;
}
export const RIBBONS: RibbonOption[] = [
  { id: "pink", name: "Pink Satin", color: "#f48fb1", dark: "#d86a95" },
  { id: "red", name: "Classic Red", color: "#d7263d", dark: "#a4162a" },
  { id: "gold", name: "Gold", color: "#e6c26a", dark: "#bf9a3c" },
  { id: "cream", name: "Cream", color: "#f6efe2", dark: "#d9ccb3" },
  { id: "blue", name: "Dusty Blue", color: "#8fb2dc", dark: "#6b90bd" },
  { id: "sage", name: "Sage", color: "#9fbf9a", dark: "#7c9f78" },
  { id: "burgundy", name: "Burgundy", color: "#7b1e3a", dark: "#54122a" },
  { id: "lilac", name: "Lilac", color: "#c3a6e6", dark: "#a184cc" },
];
