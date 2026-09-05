import { db } from "@/db";
import { creations } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { OCCASIONS } from "./occasions";
import type { CreationData, OccasionId, SavedCreation } from "./types";

export async function loadCreation(id: string, countView = false, mediaAsUrls = false): Promise<SavedCreation | null> {
  if (!id || id.length > 40) return null;
  const rows = await db.select().from(creations).where(eq(creations.id, id)).limit(1);
  const row = rows[0];
  if (!row) return null;
  if (countView) {
    // fire-and-forget view counter
    db.update(creations)
      .set({ views: sql`${creations.views} + 1` })
      .where(eq(creations.id, id))
      .catch(() => {});
  }
  const data = (row.data || {}) as Partial<CreationData>;
  const occasion = (OCCASIONS[row.occasion as OccasionId] ? row.occasion : "bouquet") as OccasionId;
  return {
    id: row.id,
    occasion,
    title: row.title,
    recipient: row.recipient,
    sender: row.sender,
    message: row.message,
    background: data.background || OCCASIONS[occasion].backgrounds[0].id,
    wrap: data.wrap || "kraft",
    ribbon: data.ribbon || "pink",
    items: Array.isArray(data.items) ? data.items : [],
    photos: Array.isArray(row.photos)
      ? mediaAsUrls
        ? (row.photos as string[]).map((_, i) => `/api/creations/${row.id}/media?type=photo&i=${i}`)
        : (row.photos as string[])
      : [],
    music: row.music ? (mediaAsUrls ? `/api/creations/${row.id}/media?type=music` : row.music) : null,
    musicName: row.musicName,
    createdAt: row.createdAt.toISOString(),
  };
}
