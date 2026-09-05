import { loadCreation } from "@/lib/load-creation";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const creation = await loadCreation(id);
  if (!creation) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(creation);
}
