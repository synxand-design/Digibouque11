import Experience from "@/components/viewer/Experience";
import { loadCreation } from "@/lib/load-creation";
import { getOccasion } from "@/lib/occasions";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const c = await loadCreation(id, false, true).catch(() => null);
  if (!c) return { title: "Surprise not found — Bloomly" };
  const o = getOccasion(c.occasion);
  return {
    title: `${o.emoji} ${c.recipient ? `A surprise for ${c.recipient}` : c.title} — Bloomly`,
    description: `${c.sender ? `${c.sender} made` : "Someone made"} you a ${o.name.toLowerCase()}. Tap to open your surprise.`,
    openGraph: { title: c.title || o.name, description: "Tap to open your animated surprise 💐" },
  };
}

export default async function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let creation = null;
  try {
    creation = await loadCreation(id, true, true);
  } catch (e) {
    console.error("load failed", e);
  }
  if (!creation) notFound();
  return <Experience creation={creation} />;
}
