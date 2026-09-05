import Builder from "@/components/builder/Builder";
import { OCCASIONS, OCCASION_LIST } from "@/lib/occasions";
import type { OccasionId } from "@/lib/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return OCCASION_LIST.map((o) => ({ occasion: o.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ occasion: string }> }): Promise<Metadata> {
  const { occasion } = await params;
  const o = OCCASIONS[occasion as OccasionId];
  return { title: o ? `Create a ${o.name} — Bloomly` : "Create — Bloomly" };
}

export default async function CreatePage({ params }: { params: Promise<{ occasion: string }> }) {
  const { occasion } = await params;
  const def = OCCASIONS[occasion as OccasionId];
  if (!def) notFound();
  return <Builder occasion={def} />;
}
