import type { OccasionId } from "./types";

export type ParticleKind =
  | "balloons"
  | "confetti"
  | "bokeh"
  | "sparkles"
  | "petals"
  | "hearts"
  | "pages"
  | "paper"
  | "stars"
  | "polaroids"
  | "candles"
  | "diyas"
  | "rangoli"
  | "blooms"
  | "leaves"
  | "fireflies"
  | "rays"
  | "lights"
  | "watch"
  | "books"
  | "pen";

export interface BackgroundDef {
  id: string;
  name: string;
  css: string; // background css
  dark?: boolean; // whether foreground text should be light
  particles: { kind: ParticleKind; count?: number; color?: string }[];
}

export interface OccasionDef {
  id: OccasionId;
  name: string;
  short: string;
  emoji: string;
  tagline: string;
  accent: string; // primary color
  accentSoft: string;
  gradient: string; // for cards on landing
  textOnAccent: string;
  fontClass: "font-serif-display" | "font-rounded";
  defaultTitle: string;
  defaultMessage: string;
  backgrounds: BackgroundDef[];
  flow: string[]; // stage sequence for viewer
  interactionHint: string;
  flowerPool: string[];
  stickerPool: string[];
  wrapPool: string[];
  ribbonPool: string[];
}

const soft = (id: string, name: string, css: string, particles: BackgroundDef["particles"], dark = false): BackgroundDef => ({
  id,
  name,
  css,
  particles,
  dark,
});

export const OCCASIONS: Record<OccasionId, OccasionDef> = {
  bouquet: {
    id: "bouquet",
    name: "Digital Bouquet",
    short: "Bouquet",
    emoji: "💐",
    tagline: "A bouquet that blooms on their screen",
    accent: "#e2588a",
    accentSoft: "#ffe4ee",
    gradient: "linear-gradient(135deg,#ffd6e6 0%,#ffe9f2 50%,#e8f7ec 100%)",
    textOnAccent: "#fff",
    fontClass: "font-serif-display",
    defaultTitle: "A little bouquet for you",
    defaultMessage: "Because some feelings deserve flowers. Every petal here carries a wish for you — may your days be as bright and soft as these blooms.",
    backgrounds: [
      soft("bq-garden", "Garden Light", "linear-gradient(160deg,#fff4f7 0%,#ffe1ea 45%,#e5f3e8 100%)", [{ kind: "petals", count: 14 }, { kind: "bokeh", count: 10 }]),
      soft("bq-cream", "Soft Cream", "linear-gradient(180deg,#fffaf3 0%,#f8ecdd 100%)", [{ kind: "leaves", count: 10 }, { kind: "sparkles", count: 12 }]),
      soft("bq-sky", "Morning Sky", "linear-gradient(180deg,#e6f1ff 0%,#fbe9f3 100%)", [{ kind: "bokeh", count: 14 }, { kind: "petals", count: 8 }]),
      soft("bq-dusk", "Velvet Dusk", "linear-gradient(160deg,#2a1b3d 0%,#4a2d5e 50%,#7a4c7a 100%)", [{ kind: "fireflies", count: 20 }, { kind: "petals", count: 8, color: "#f7a8c9" }], true),
    ],
    flow: ["intro", "bud", "reveal", "message", "photos", "final"],
    interactionHint: "Watch it bloom",
    flowerPool: ["rose-pink", "peony-blush", "gerbera-pink", "rose-cream", "tulip-pink", "daisy-white", "cherry-blossom", "hydrangea-blue"],
    stickerPool: ["bow-pink", "butterfly-blue", "cat-bouquet"],
    wrapPool: ["kraft", "blush", "ivory", "sage"],
    ribbonPool: ["pink", "cream", "sage", "gold"],
  },
  "love-letter": {
    id: "love-letter",
    name: "Love Letter",
    short: "Love Letter",
    emoji: "💌",
    tagline: "Seal your heart in an envelope",
    accent: "#c0264b",
    accentSoft: "#ffe0e6",
    gradient: "linear-gradient(135deg,#ffc9d6 0%,#ffe0e8 50%,#fff0f3 100%)",
    textOnAccent: "#fff",
    fontClass: "font-serif-display",
    defaultTitle: "For the one who holds my heart",
    defaultMessage: "My dearest,\n\nSome words are too big for a text message, so I wrote you this instead. You are the calm in my chaos and the smile in my mornings. Every day with you feels like a page I never want to turn.\n\nForever yours.",
    backgrounds: [
      soft("ll-petals", "Falling Petals", "linear-gradient(170deg,#fff0f3 0%,#ffd9e2 55%,#f7c1cf 100%)", [{ kind: "petals", count: 18 }, { kind: "bokeh", count: 8 }]),
      soft("ll-blush", "Romantic Blush", "radial-gradient(circle at 50% 20%,#ffe4ea 0%,#f8b8c8 60%,#e88ea8 100%)", [{ kind: "hearts", count: 16 }, { kind: "rays", count: 1 }]),
      soft("ll-hearts", "Floating Hearts", "linear-gradient(180deg,#fff5f7 0%,#ffe3ea 100%)", [{ kind: "hearts", count: 22, color: "#ff8fb1" }, { kind: "sparkles", count: 8 }]),
      soft("ll-night", "Midnight Roses", "linear-gradient(160deg,#3b0d1f 0%,#6a1b3a 50%,#8f2d52 100%)", [{ kind: "petals", count: 14, color: "#ff7c9f" }, { kind: "fireflies", count: 12 }], true),
    ],
    flow: ["intro", "envelope", "letter", "reveal", "photos", "final"],
    interactionHint: "Tap the envelope",
    flowerPool: ["rose-red", "rose-pink", "peony-blush", "rose-cream", "carnation-coral", "babys-breath"],
    stickerPool: ["heart-red", "envelope-seal", "cat-rose", "teddy-heart"],
    wrapPool: ["blush", "ivory", "noir", "kraft"],
    ribbonPool: ["red", "pink", "burgundy", "cream"],
  },
  birthday: {
    id: "birthday",
    name: "Birthday Surprise",
    short: "Birthday",
    emoji: "🎂",
    tagline: "A gift box, a candle, a wish",
    accent: "#f26d9b",
    accentSoft: "#ffe6f0",
    gradient: "linear-gradient(135deg,#ffd1dc 0%,#fff1c9 50%,#d4f0ff 100%)",
    textOnAccent: "#fff",
    fontClass: "font-rounded",
    defaultTitle: "Happy Birthday!",
    defaultMessage: "Another year of you — and the world is luckier for it. May this year bring you cake, laughter, and everything your heart quietly wishes for. Make a wish!",
    backgrounds: [
      soft("bd-balloons", "Floating Balloons", "linear-gradient(180deg,#fff7fb 0%,#ffe4ef 50%,#e6f3ff 100%)", [{ kind: "balloons", count: 9 }, { kind: "confetti", count: 18 }]),
      soft("bd-confetti", "Confetti Party", "linear-gradient(160deg,#fff4d6 0%,#ffe1ec 50%,#e6e7ff 100%)", [{ kind: "confetti", count: 34 }, { kind: "bokeh", count: 8 }]),
      soft("bd-lights", "Dreamy Lights", "linear-gradient(180deg,#2b1e4a 0%,#4b2c6e 60%,#7b4b8f 100%)", [{ kind: "lights", count: 16 }, { kind: "balloons", count: 6 }, { kind: "sparkles", count: 14 }], true),
      soft("bd-pastel", "Pastel Party", "linear-gradient(135deg,#d9f4ff 0%,#ffe9f7 50%,#fff8d9 100%)", [{ kind: "balloons", count: 7 }, { kind: "stars", count: 14 }]),
    ],
    flow: ["intro", "gift", "candle", "reveal", "message", "photos", "final"],
    interactionHint: "Tap 3 times to open your surprise",
    flowerPool: ["gerbera-pink", "sunflower", "tulip-yellow", "rose-pink", "daisy-white", "ranunculus-orange", "hydrangea-blue", "tulip-pink"],
    stickerPool: ["balloons-pink", "gift-box", "corgi-party", "macarons", "cat-bow", "gold-stars"],
    wrapPool: ["blush", "sky", "ivory", "lavender"],
    ribbonPool: ["pink", "gold", "blue", "lilac"],
  },
  valentine: {
    id: "valentine",
    name: "Valentine / Girlfriend Day",
    short: "Valentine",
    emoji: "❤️",
    tagline: "Roses, hearts and a soft reveal",
    accent: "#d63b5e",
    accentSoft: "#ffe3ea",
    gradient: "linear-gradient(135deg,#ffb8c9 0%,#ffd6e0 50%,#ffeef2 100%)",
    textOnAccent: "#fff",
    fontClass: "font-serif-display",
    defaultTitle: "Happy Valentine's Day, my love",
    defaultMessage: "You are my favourite hello and my hardest goodbye. Here is a bouquet that will never wilt — just like the way I feel about you.",
    backgrounds: [
      soft("vd-hearts", "Soft Hearts", "linear-gradient(180deg,#fff2f5 0%,#ffd3dd 100%)", [{ kind: "hearts", count: 20 }, { kind: "bokeh", count: 8 }]),
      soft("vd-rose", "Rose Glow", "radial-gradient(circle at 50% 30%,#ffd9e1 0%,#f4a3b8 55%,#d6708f 100%)", [{ kind: "petals", count: 14 }, { kind: "sparkles", count: 10 }]),
      soft("vd-velvet", "Red Velvet", "linear-gradient(160deg,#4a0f1f 0%,#7d1b36 50%,#a3294b 100%)", [{ kind: "hearts", count: 14, color: "#ff8aa5" }, { kind: "fireflies", count: 14 }], true),
      soft("vd-blush", "Blush Bokeh", "linear-gradient(135deg,#ffe9ee 0%,#fbd0dc 50%,#f5c2cf 100%)", [{ kind: "bokeh", count: 18 }, { kind: "hearts", count: 8 }]),
    ],
    flow: ["intro", "heart", "reveal", "photos", "message", "final"],
    interactionHint: "Tap the heart",
    flowerPool: ["rose-red", "rose-pink", "peony-blush", "carnation-coral", "tulip-pink", "rose-cream"],
    stickerPool: ["heart-red", "teddy-heart", "cat-heart-paws", "bow-pink", "cats-cuddle"],
    wrapPool: ["blush", "noir", "ivory", "kraft"],
    ribbonPool: ["red", "pink", "burgundy", "cream"],
  },
  "mothers-day": {
    id: "mothers-day",
    name: "Mother's Day",
    short: "Mother's Day",
    emoji: "🌷",
    tagline: "Warm, blooming and full of love",
    accent: "#d9679a",
    accentSoft: "#ffe8f1",
    gradient: "linear-gradient(135deg,#ffe0ec 0%,#fff4e8 50%,#e9f6e9 100%)",
    textOnAccent: "#fff",
    fontClass: "font-serif-display",
    defaultTitle: "Happy Mother's Day, Maa",
    defaultMessage: "For every sleepless night, every packed lunch, every quiet sacrifice — thank you. You are the softest strength I know. I love you more than words could ever hold.",
    backgrounds: [
      soft("md-bloom", "Blooming Garden", "linear-gradient(180deg,#fff7f0 0%,#ffe3ec 60%,#f6d7e4 100%)", [{ kind: "blooms", count: 8 }, { kind: "petals", count: 12 }]),
      soft("md-pastel", "Warm Pastel", "linear-gradient(135deg,#fff1e6 0%,#ffe1ea 50%,#f3e6ff 100%)", [{ kind: "bokeh", count: 14 }, { kind: "petals", count: 8 }]),
      soft("md-glow", "Soft Glow", "radial-gradient(circle at 50% 25%,#fff7e6 0%,#ffe0d0 55%,#f7c9d3 100%)", [{ kind: "sparkles", count: 16 }, { kind: "rays", count: 1 }]),
      soft("md-lilac", "Lilac Dream", "linear-gradient(160deg,#f3e8ff 0%,#ffe4f0 100%)", [{ kind: "blooms", count: 6 }, { kind: "fireflies", count: 10, color: "#e8b4ff" }]),
    ],
    flow: ["intro", "blooms", "message", "photos", "reveal", "final"],
    interactionHint: "Watch the flowers bloom",
    flowerPool: ["peony-blush", "rose-pink", "carnation-coral", "tulip-pink", "lilac", "cherry-blossom", "gerbera-pink", "daisy-white"],
    stickerPool: ["bow-pink", "butterfly-blue", "heart-red", "cat-bouquet"],
    wrapPool: ["blush", "ivory", "lavender", "kraft"],
    ribbonPool: ["pink", "cream", "lilac", "gold"],
  },
  "fathers-day": {
    id: "fathers-day",
    name: "Father's Day",
    short: "Father's Day",
    emoji: "🕰️",
    tagline: "Elegant, warm and meaningful",
    accent: "#8a5a2b",
    accentSoft: "#f5e9db",
    gradient: "linear-gradient(135deg,#f3e3cf 0%,#e5cfae 50%,#cbb08a 100%)",
    textOnAccent: "#fff",
    fontClass: "font-serif-display",
    defaultTitle: "Happy Father's Day, Papa",
    defaultMessage: "You taught me how to stand tall, and then quietly stood behind me every time I did. Thank you for being my first hero and my forever guide.",
    backgrounds: [
      soft("fd-amber", "Warm Amber", "linear-gradient(160deg,#2b1d14 0%,#5a3b24 55%,#8a5f3b 100%)", [{ kind: "sparkles", count: 18, color: "#f2c97d" }, { kind: "rays", count: 1 }], true),
      soft("fd-classic", "Classic Lifestyle", "linear-gradient(180deg,#f8f1e7 0%,#e8d7c1 100%)", [{ kind: "watch", count: 3 }, { kind: "bokeh", count: 8, color: "#c89b63" }]),
      soft("fd-gold", "Golden Particles", "radial-gradient(circle at 50% 30%,#4a3524 0%,#2a1c12 70%)", [{ kind: "fireflies", count: 24, color: "#f4c86a" }], true),
      soft("fd-minimal", "Minimal Slate", "linear-gradient(160deg,#eef1f4 0%,#d8dee6 100%)", [{ kind: "bokeh", count: 8, color: "#9fb0c4" }, { kind: "sparkles", count: 6, color: "#b9c6d6" }]),
    ],
    flow: ["intro", "card", "message", "photos", "reveal", "final"],
    interactionHint: "Tap to open",
    flowerPool: ["sunflower", "rose-cream", "ranunculus-orange", "anemone-purple", "hydrangea-blue", "eucalyptus"],
    stickerPool: ["gold-stars", "gift-box", "puppy-crown"],
    wrapPool: ["kraft", "noir", "ivory", "gold"],
    ribbonPool: ["gold", "burgundy", "cream", "blue"],
  },
  "teachers-day": {
    id: "teachers-day",
    name: "Teachers' Day",
    short: "Teachers' Day",
    emoji: "📖",
    tagline: "A respectful, heartfelt thank you",
    accent: "#2f6b5e",
    accentSoft: "#e2f2ec",
    gradient: "linear-gradient(135deg,#dff1ea 0%,#fff6dc 50%,#fbe7d3 100%)",
    textOnAccent: "#fff",
    fontClass: "font-serif-display",
    defaultTitle: "Happy Teachers' Day",
    defaultMessage: "You didn't just teach lessons — you taught us how to think, how to try again, and how to believe in ourselves. Thank you for every patient explanation and every kind word.",
    backgrounds: [
      soft("td-books", "Open Books", "linear-gradient(180deg,#fdf8ee 0%,#f3e6cf 100%)", [{ kind: "books", count: 5 }, { kind: "pages", count: 10 }]),
      soft("td-paper", "Floating Paper", "linear-gradient(160deg,#f7f3ea 0%,#e9e2d2 100%)", [{ kind: "paper", count: 12 }, { kind: "sparkles", count: 8, color: "#c9a96a" }]),
      soft("td-notebook", "Pen & Notebook", "repeating-linear-gradient(180deg,#fffdf7 0px,#fffdf7 30px,#e9e4d8 31px), #fffdf7", [{ kind: "pen", count: 2 }, { kind: "paper", count: 6 }]),
      soft("td-classroom", "Warm Classroom", "linear-gradient(160deg,#2f3a2f 0%,#4d5a45 60%,#7a8262 100%)", [{ kind: "pages", count: 10 }, { kind: "fireflies", count: 12, color: "#f5e2a0" }], true),
    ],
    flow: ["intro", "book", "message", "reveal", "photos", "final"],
    interactionHint: "Tap the book to open",
    flowerPool: ["sunflower", "rose-cream", "daisy-white", "tulip-yellow", "anemone-purple", "gerbera-pink"],
    stickerPool: ["gold-stars", "butterfly-blue", "hedgehog-daisy"],
    wrapPool: ["kraft", "ivory", "sage", "gold"],
    ribbonPool: ["gold", "sage", "cream", "blue"],
  },
  friendship: {
    id: "friendship",
    name: "Friendship Day",
    short: "Friendship",
    emoji: "🌈",
    tagline: "Bright, playful and full of memories",
    accent: "#ff8a3d",
    accentSoft: "#fff0e4",
    gradient: "linear-gradient(135deg,#ffe4c7 0%,#ffd8e8 50%,#d5f0ff 100%)",
    textOnAccent: "#fff",
    fontClass: "font-rounded",
    defaultTitle: "Happy Friendship Day, bestie!",
    defaultMessage: "To the one who laughs at my worst jokes and shows up on my worst days — thank you for being my person. Here's to more memories, more snacks, more us.",
    backgrounds: [
      soft("fr-color", "Colourful Float", "linear-gradient(160deg,#fff6e0 0%,#ffe3ee 50%,#e0f4ff 100%)", [{ kind: "confetti", count: 26 }, { kind: "stars", count: 10 }]),
      soft("fr-polaroid", "Polaroid Memories", "linear-gradient(180deg,#fdf7ef 0%,#f7e6d6 100%)", [{ kind: "polaroids", count: 6 }, { kind: "sparkles", count: 10 }]),
      soft("fr-playful", "Playful Particles", "linear-gradient(135deg,#e6fff5 0%,#fff4d6 50%,#ffe1e6 100%)", [{ kind: "stars", count: 20 }, { kind: "bokeh", count: 8 }]),
      soft("fr-sunset", "Cheerful Sunset", "linear-gradient(180deg,#ffb07c 0%,#ff8fa3 55%,#c98bd9 100%)", [{ kind: "confetti", count: 16 }, { kind: "fireflies", count: 10, color: "#fff2b0" }], true),
    ],
    flow: ["intro", "polaroids", "reveal", "message", "final"],
    interactionHint: "Tap to shuffle memories",
    flowerPool: ["sunflower", "gerbera-pink", "tulip-yellow", "daisy-white", "ranunculus-orange", "cornflower-blue", "hydrangea-blue"],
    stickerPool: ["corgi-party", "cat-smile", "macarons", "duckling-bow", "panda-sunflower", "gold-stars"],
    wrapPool: ["sky", "blush", "ivory", "kraft"],
    ribbonPool: ["blue", "pink", "gold", "sage"],
  },
  anniversary: {
    id: "anniversary",
    name: "Anniversary",
    short: "Anniversary",
    emoji: "🕯️",
    tagline: "Golden lights and timeless love",
    accent: "#a8783a",
    accentSoft: "#fbefd8",
    gradient: "linear-gradient(135deg,#f9e6c8 0%,#f2d3b4 50%,#e6b8c0 100%)",
    textOnAccent: "#fff",
    fontClass: "font-serif-display",
    defaultTitle: "Happy Anniversary, my love",
    defaultMessage: "Another year of choosing each other — through the ordinary Tuesdays and the extraordinary moments. Thank you for building this life with me. Here's to forever.",
    backgrounds: [
      soft("an-candles", "Elegant Candles", "linear-gradient(180deg,#2a1a1f 0%,#4b2a33 60%,#6d3e48 100%)", [{ kind: "candles", count: 5 }, { kind: "fireflies", count: 14, color: "#f6d48a" }], true),
      soft("an-petals", "Floating Petals", "linear-gradient(160deg,#fff4ec 0%,#f7dfe0 100%)", [{ kind: "petals", count: 16, color: "#e9a3b4" }, { kind: "bokeh", count: 8 }]),
      soft("an-gold", "Golden Lights", "radial-gradient(circle at 50% 20%,#6b4a2b 0%,#3a2617 60%,#20140c 100%)", [{ kind: "lights", count: 18 }, { kind: "sparkles", count: 12, color: "#f4d58d" }], true),
      soft("an-bokeh", "Romantic Bokeh", "linear-gradient(160deg,#f8e7ee 0%,#efd3dd 50%,#e5c2ce 100%)", [{ kind: "bokeh", count: 20, color: "#e8a8bd" }, { kind: "hearts", count: 6 }]),
    ],
    flow: ["intro", "candles", "message", "photos", "reveal", "final"],
    interactionHint: "Tap to light the candles",
    flowerPool: ["rose-red", "rose-cream", "peony-blush", "ranunculus-orange", "anemone-purple", "rose-pink"],
    stickerPool: ["heart-red", "cats-cuddle", "bow-pink", "gold-stars"],
    wrapPool: ["ivory", "noir", "gold", "blush"],
    ribbonPool: ["gold", "burgundy", "cream", "red"],
  },
  "thank-you": {
    id: "thank-you",
    name: "Thank You Card",
    short: "Thank You",
    emoji: "🌻",
    tagline: "Gratitude, wrapped in flowers",
    accent: "#e09a2d",
    accentSoft: "#fff3dc",
    gradient: "linear-gradient(135deg,#fff1cf 0%,#ffe3c2 50%,#e9f3d9 100%)",
    textOnAccent: "#fff",
    fontClass: "font-rounded",
    defaultTitle: "Thank you, truly",
    defaultMessage: "Some people make the world softer just by being in it — you're one of them. Thank you for your kindness, your time, and your heart.",
    backgrounds: [
      soft("ty-sun", "Sunny Meadow", "linear-gradient(180deg,#fffbe8 0%,#fff0c9 60%,#e8f4d6 100%)", [{ kind: "petals", count: 10, color: "#ffd166" }, { kind: "sparkles", count: 12 }]),
      soft("ty-cream", "Warm Cream", "linear-gradient(160deg,#fff8ef 0%,#f6e6d2 100%)", [{ kind: "leaves", count: 10 }, { kind: "bokeh", count: 8 }]),
      soft("ty-mint", "Fresh Mint", "linear-gradient(160deg,#eafaf2 0%,#fff9e6 100%)", [{ kind: "leaves", count: 8 }, { kind: "stars", count: 10 }]),
      soft("ty-golden", "Golden Hour", "linear-gradient(160deg,#5a3d1f 0%,#8b5e2b 60%,#c58d45 100%)", [{ kind: "fireflies", count: 18, color: "#ffe29a" }, { kind: "petals", count: 6, color: "#ffd27a" }], true),
    ],
    flow: ["intro", "bud", "reveal", "message", "photos", "final"],
    interactionHint: "Watch it bloom",
    flowerPool: ["sunflower", "tulip-yellow", "daisy-white", "ranunculus-orange", "gerbera-pink", "rose-cream"],
    stickerPool: ["gold-stars", "butterfly-blue", "puppy-crown", "bunny-tulip"],
    wrapPool: ["kraft", "ivory", "sage", "gold"],
    ribbonPool: ["gold", "cream", "sage", "pink"],
  },
  surprise: {
    id: "surprise",
    name: "Surprise Card",
    short: "Surprise",
    emoji: "🎁",
    tagline: "Just because — a little joy",
    accent: "#7a5cff",
    accentSoft: "#ece7ff",
    gradient: "linear-gradient(135deg,#e5dcff 0%,#ffe0f2 50%,#dcf3ff 100%)",
    textOnAccent: "#fff",
    fontClass: "font-rounded",
    defaultTitle: "A little surprise for you",
    defaultMessage: "No occasion needed. I just wanted to remind you that you are loved, appreciated and thought of — today and every day.",
    backgrounds: [
      soft("sp-dream", "Dreamy Lilac", "linear-gradient(160deg,#f1ecff 0%,#ffe3f3 50%,#e3f4ff 100%)", [{ kind: "bokeh", count: 14 }, { kind: "stars", count: 12 }]),
      soft("sp-confetti", "Soft Confetti", "linear-gradient(180deg,#fff8fb 0%,#f3e8ff 100%)", [{ kind: "confetti", count: 22 }, { kind: "sparkles", count: 8 }]),
      soft("sp-mint", "Mint Cloud", "linear-gradient(160deg,#e4fbf3 0%,#eaf0ff 100%)", [{ kind: "bokeh", count: 12, color: "#b8e8d8" }, { kind: "hearts", count: 6, color: "#c9b6ff" }]),
      soft("sp-night", "Starry Night", "linear-gradient(180deg,#1b1c3a 0%,#33306a 60%,#5b4a8f 100%)", [{ kind: "stars", count: 26, color: "#fff2b0" }, { kind: "fireflies", count: 10 }], true),
    ],
    flow: ["intro", "gift", "reveal", "message", "photos", "final"],
    interactionHint: "Tap 3 times to open your surprise",
    flowerPool: ["anemone-purple", "lilac", "rose-pink", "hydrangea-blue", "peony-blush", "cornflower-blue", "daisy-white"],
    stickerPool: ["gift-box", "kitten-gift", "cat-teacup", "bow-pink", "butterfly-blue", "lamb-ribbon"],
    wrapPool: ["lavender", "blush", "sky", "ivory"],
    ribbonPool: ["lilac", "pink", "blue", "cream"],
  },
  diwali: {
    id: "diwali",
    name: "Diwali Special",
    short: "Diwali",
    emoji: "🪔",
    tagline: "Diyas, light and warm wishes",
    accent: "#d98a1f",
    accentSoft: "#fdf0d5",
    gradient: "linear-gradient(135deg,#3b1d0e 0%,#8a3f14 50%,#e0a33c 100%)",
    textOnAccent: "#fff",
    fontClass: "font-serif-display",
    defaultTitle: "Happy Diwali",
    defaultMessage: "May the light of every diya guide you toward joy, and may this Diwali fill your home with warmth, laughter and endless prosperity. Shubh Deepavali!",
    backgrounds: [
      soft("dw-diyas", "Floating Diyas", "linear-gradient(180deg,#1a0b08 0%,#4a1e0f 60%,#7a3a14 100%)", [{ kind: "diyas", count: 7 }, { kind: "fireflies", count: 20, color: "#ffcf6a" }], true),
      soft("dw-glow", "Golden Glow", "radial-gradient(circle at 50% 25%,#7a4b12 0%,#3d2208 60%,#1c1005 100%)", [{ kind: "lights", count: 16 }, { kind: "sparkles", count: 20, color: "#ffd98a" }], true),
      soft("dw-rangoli", "Rangoli Night", "linear-gradient(180deg,#2a0f2e 0%,#5a1f3f 60%,#8a3a2f 100%)", [{ kind: "rangoli", count: 1 }, { kind: "fireflies", count: 16, color: "#ffc857" }], true),
      soft("dw-royal", "Royal Maroon", "linear-gradient(160deg,#3d0a14 0%,#6b1424 50%,#8f2a2a 100%)", [{ kind: "diyas", count: 5 }, { kind: "sparkles", count: 24, color: "#ffd166" }], true),
    ],
    flow: ["intro", "diyas", "message", "photos", "reveal", "final"],
    interactionHint: "Tap each diya to light it",
    flowerPool: ["sunflower", "ranunculus-orange", "rose-red", "tulip-yellow", "carnation-coral", "plumeria", "hibiscus"],
    stickerPool: ["diya", "gold-stars", "butterfly-blue"],
    wrapPool: ["gold", "noir", "kraft", "ivory"],
    ribbonPool: ["gold", "red", "burgundy", "cream"],
  },
};

export const OCCASION_LIST = Object.values(OCCASIONS);

export function getOccasion(id: string | undefined | null) {
  return (id && OCCASIONS[id as OccasionId]) || OCCASIONS.bouquet;
}

export function getBackground(occasion: OccasionDef, id: string) {
  return occasion.backgrounds.find((b) => b.id === id) || occasion.backgrounds[0];
}
