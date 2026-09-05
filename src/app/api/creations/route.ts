import { db } from "@/db";
import { creations } from "@/db/schema";
import { OCCASIONS } from "@/lib/occasions";
import type { CreationData, OccasionId, PlacedItem } from "@/lib/types";
import { randomBytes } from "crypto";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const ALPHABET = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function shortId(len = 10) {
  const bytes = randomBytes(len);
  let out = "";
  for (let i = 0; i < len; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out;
}

const MAX_PHOTO = 2_500_000; // ~2.5MB data URL each (client compresses far below this)
const MAX_MUSIC = 9_000_000; // ~9MB data URL

function sanitizeItems(items: unknown): PlacedItem[] {
  if (!Array.isArray(items)) return [];
  return items
    .filter((i) => i && typeof i === "object" && typeof (i as PlacedItem).asset === "string")
    .slice(0, 80)
    .map((raw, idx) => {
      const i = raw as PlacedItem;
      return {
        id: String(i.id || idx),
        asset: String(i.asset).replace(/[^a-z0-9-]/gi, ""),
        kind: i.kind === "greenery" || i.kind === "sticker" ? i.kind : "flower",
        x: Number.isFinite(i.x) ? Number(i.x) : 50,
        y: Number.isFinite(i.y) ? Number(i.y) : 50,
        scale: Math.max(0.04, Math.min(1.5, Number(i.scale) || 0.3)),
        rotation: Number.isFinite(i.rotation) ? Number(i.rotation) : 0,
        z: Number.isFinite(i.z) ? Number(i.z) : idx,
        flip: !!i.flip,
      };
    });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<CreationData>;
    const occasion = (body.occasion && OCCASIONS[body.occasion as OccasionId] ? body.occasion : "bouquet") as OccasionId;
    const photos = Array.isArray(body.photos)
      ? body.photos.filter((p) => typeof p === "string" && p.startsWith("data:image/") && p.length <= MAX_PHOTO).slice(0, 3)
      : [];
    let music: string | null = null;
    if (typeof body.music === "string" && body.music.startsWith("data:audio/")) {
      if (body.music.length > MAX_MUSIC) {
        return Response.json({ error: "Music file is too large. Please use a shorter MP3 (under ~6MB)." }, { status: 413 });
      }
      music = body.music;
    }

    const data = {
      background: String(body.background || OCCASIONS[occasion].backgrounds[0].id).slice(0, 40),
      wrap: String(body.wrap || "kraft").slice(0, 20),
      ribbon: String(body.ribbon || "pink").slice(0, 20),
      items: sanitizeItems(body.items),
    };

    // Generate a unique id, retrying on the (astronomically rare) collision.
    let id = shortId();
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        await db.insert(creations).values({
          id,
          occasion,
          title: String(body.title || "").slice(0, 120),
          recipient: String(body.recipient || "").slice(0, 80),
          sender: String(body.sender || "").slice(0, 80),
          message: String(body.message || "").slice(0, 4000),
          data,
          photos,
          music,
          musicName: body.musicName ? String(body.musicName).slice(0, 120) : null,
        });
        return Response.json({ id });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (!/duplicate key/i.test(msg)) throw err;
        id = shortId();
      }
    }
    return Response.json({ error: "Could not allocate id" }, { status: 500 });
  } catch (err) {
    console.error("create failed", err);
    return Response.json({ error: "Failed to save creation" }, { status: 500 });
  }
}
