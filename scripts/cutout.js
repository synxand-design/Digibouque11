/* eslint-disable */
// Slices 3x3 sprite sheets into individual transparent PNG cutouts.
// White background is removed with an edge-connected flood fill so that
// white areas *inside* a flower/sticker are preserved.
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const sheets = {
  "flowers-a": ["rose-red", "gerbera-pink", "hibiscus", "hydrangea-blue", "daisy-white", "tulip-pink", "peony-blush", "sunflower", "anemone-purple"],
  "flowers-b": ["rose-pink", "rose-cream", "ranunculus-orange", "cornflower-blue", "lilac", "plumeria", "tulip-yellow", "carnation-coral", "cherry-blossom"],
  greenery: ["eucalyptus", "fern", "babys-breath", "olive-branch", "sage-leaves", "palm-leaf", "ruscus", "pampas", "monstera"],
  cats: ["cat-bouquet", "cat-suit", "cat-bow", "cat-heart-paws", "cat-smile", "cat-rose", "cat-teacup", "cat-heart-pillow", "cats-cuddle"],
  animals: ["puppy-crown", "bunny-tulip", "duckling-bow", "teddy-heart", "panda-sunflower", "corgi-party", "kitten-gift", "hedgehog-daisy", "lamb-ribbon"],
  decor: ["heart-red", "bow-pink", "gift-box", "envelope-seal", "balloons-pink", "diya", "butterfly-blue", "macarons", "gold-stars"],
};

const THRESH = 228; // min(r,g,b) above this counts as background when edge-connected
const OUT = path.join(__dirname, "..", "public", "assets");
fs.mkdirSync(OUT, { recursive: true });

async function processCell(buffer, outName) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const isBg = new Uint8Array(w * h);
  const visited = new Uint8Array(w * h);
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = y * w + x;
    if (visited[i]) return;
    visited[i] = 1;
    const p = i * 4;
    const m = Math.min(data[p], data[p + 1], data[p + 2]);
    if (m > THRESH) {
      isBg[i] = 1;
      stack.push(x, y);
    }
  };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (stack.length) {
    const y = stack.pop();
    const x = stack.pop();
    push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
  }
  // Build alpha: bg=0; near-bg pixels get soft alpha based on whiteness for feathering
  const out = Buffer.from(data);
  for (let i = 0; i < w * h; i++) {
    const p = i * 4;
    if (isBg[i]) { out[p + 3] = 0; continue; }
    const x = i % w, y = (i / w) | 0;
    let nearBg = false;
    for (let dy = -1; dy <= 1 && !nearBg; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < w && ny < h && isBg[ny * w + nx]) { nearBg = true; break; }
      }
    if (nearBg) {
      const m = Math.min(data[p], data[p + 1], data[p + 2]);
      const a = Math.max(0, Math.min(1, (255 - m) / (255 - 150)));
      out[p + 3] = Math.round(255 * Math.min(1, a + 0.15));
    }
  }
  let img = sharp(out, { raw: { width: w, height: h, channels: 4 } }).png();
  const trimmed = await img.trim({ threshold: 10 }).toBuffer().catch(() => null);
  const final = trimmed ? sharp(trimmed) : sharp(out, { raw: { width: w, height: h, channels: 4 } });
  await final.resize({ width: 420, height: 420, fit: "inside", withoutEnlargement: true }).png({ compressionLevel: 9 }).toFile(path.join(OUT, outName + ".png"));
}

(async () => {
  for (const [sheet, names] of Object.entries(sheets)) {
    const file = path.join(__dirname, "..", "public", "raw", sheet + ".png");
    if (!fs.existsSync(file)) { console.log("missing", file); continue; }
    const meta = await sharp(file).metadata();
    const cw = Math.floor(meta.width / 3), ch = Math.floor(meta.height / 3);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const name = names[r * 3 + c];
      const pad = Math.floor(cw * 0.02);
      const cell = await sharp(file).extract({ left: c * cw + pad, top: r * ch + pad, width: cw - pad * 2, height: ch - pad * 2 }).toBuffer();
      await processCell(cell, name);
      console.log("wrote", name);
    }
  }
})();
