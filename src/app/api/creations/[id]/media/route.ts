import { db } from "@/db";
import { creations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

function decodeDataUrl(dataUrl: string): { mime: string; bytes: Buffer } | null {
  const m = /^data:([^;,]+)(;base64)?,([\s\S]*)$/.exec(dataUrl);
  if (!m) return null;
  const mime = m[1] || "application/octet-stream";
  const bytes = m[2] ? Buffer.from(m[3], "base64") : Buffer.from(decodeURIComponent(m[3]), "utf8");
  return { mime, bytes };
}

/** Streams a stored photo or the music track for a creation. */
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const type = req.nextUrl.searchParams.get("type");
  const index = Number(req.nextUrl.searchParams.get("i") || 0);
  const rows = await db
    .select({ photos: creations.photos, music: creations.music })
    .from(creations)
    .where(eq(creations.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) return new Response("Not found", { status: 404 });

  let src: string | null = null;
  if (type === "music") src = row.music;
  else if (type === "photo") {
    const photos = Array.isArray(row.photos) ? (row.photos as string[]) : [];
    src = photos[index] || null;
  }
  if (!src) return new Response("Not found", { status: 404 });
  const decoded = decodeDataUrl(src);
  if (!decoded) return new Response("Bad media", { status: 500 });

  const body = new Uint8Array(decoded.bytes);
  const headers: Record<string, string> = {
    "Content-Type": decoded.mime,
    "Content-Length": String(body.byteLength),
    "Cache-Control": "public, max-age=31536000, immutable",
    "Accept-Ranges": "bytes",
  };

  // Basic range support so <audio> can seek/loop smoothly on mobile browsers.
  const range = req.headers.get("range");
  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    if (m) {
      const start = m[1] ? parseInt(m[1], 10) : 0;
      const end = m[2] ? Math.min(parseInt(m[2], 10), body.byteLength - 1) : body.byteLength - 1;
      if (start <= end && start < body.byteLength) {
        const chunk = body.slice(start, end + 1);
        return new Response(chunk, {
          status: 206,
          headers: { ...headers, "Content-Length": String(chunk.byteLength), "Content-Range": `bytes ${start}-${end}/${body.byteLength}` },
        });
      }
    }
  }
  return new Response(body, { headers });
}
