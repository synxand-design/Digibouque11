import { OCCASION_LIST } from "@/lib/occasions";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fff7fa] text-[#3b2a35]">
      {/* Nav */}
      <header className="sticky top-0 z-30 glass border-b border-pink-100/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-md">🌸</span>
            <span className="font-serif-display text-xl font-semibold tracking-tight">Bloomly</span>
          </Link>
          <Link href="#create" className="btn-primary rounded-full px-4 py-2 text-sm font-semibold sm:px-5">
            Start creating
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,#ffe1ec_0%,#fff7fa_60%)]" />
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-14 pt-10 sm:px-6 md:grid-cols-2 md:gap-12 md:pt-16">
          <div className="text-center md:text-left">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-rose-500 shadow-sm ring-1 ring-rose-100">
              ✨ Animated surprises, delivered by link
            </p>
            <h1 className="font-serif-display mt-5 text-[2.35rem] font-semibold leading-[1.08] sm:text-5xl md:text-6xl">
              Send a bouquet that <em className="text-rose-500">blooms</em> on their screen
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base text-[#6d5563] sm:text-lg md:mx-0">
              Build a realistic digital bouquet or occasion card, add your photos, a message and a song — then share a link that opens as a
              cinematic surprise.
            </p>
            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
              <Link href="#create" className="btn-primary w-full rounded-full px-7 py-3.5 text-center text-base font-semibold sm:w-auto">
                Create a surprise 💐
              </Link>
              <Link
                href="/create/birthday"
                className="w-full rounded-full bg-white px-7 py-3.5 text-center text-base font-semibold text-[#3b2a35] shadow-sm ring-1 ring-pink-100 transition hover:bg-pink-50 sm:w-auto"
              >
                Try a birthday card
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-[#8a6f80] md:justify-start">
              <span>🌹 Realistic flowers</span>
              <span>📸 Up to 3 photos</span>
              <span>🎵 Your own music</span>
              <span>📱 Made for phones</span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md md:max-w-none">
            <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-pink-200/60 via-rose-100/40 to-emerald-100/50 blur-2xl" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero.jpg"
              alt="A digital bouquet with polaroids and a love letter"
              className="aspect-square w-full rounded-[2rem] object-cover shadow-[0_30px_60px_-20px_rgba(190,60,110,0.45)] ring-4 ring-white"
            />
            <div className="absolute -bottom-4 left-4 rounded-2xl bg-white/90 px-4 py-2 text-sm shadow-lg backdrop-blur sm:left-6">
              <span className="font-hand text-lg text-rose-500">Tap to open your surprise ✨</span>
            </div>
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section id="create" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="text-center">
          <h2 className="font-serif-display text-3xl font-semibold sm:text-4xl">What are you celebrating?</h2>
          <p className="mt-2 text-[#6d5563]">Every occasion has its own theme, backgrounds and opening animation.</p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {OCCASION_LIST.map((o) => (
            <Link
              key={o.id}
              href={`/create/${o.id}`}
              className="group relative overflow-hidden rounded-3xl p-4 shadow-[0_10px_30px_-12px_rgba(80,30,60,0.25)] ring-1 ring-white/70 transition-transform duration-300 hover:-translate-y-1 active:scale-[0.98] sm:p-5"
              style={{ background: o.gradient }}
            >
              <div className="text-4xl drop-shadow-sm transition-transform duration-300 group-hover:scale-110 sm:text-5xl">{o.emoji}</div>
              <h3 className={`mt-3 text-base font-bold leading-tight sm:text-lg ${o.id === "diwali" || o.id === "fathers-day" ? "text-white" : "text-[#3b2a35]"}`}>
                {o.name}
              </h3>
              <p className={`mt-1 text-xs leading-snug sm:text-sm ${o.id === "diwali" || o.id === "fathers-day" ? "text-white/85" : "text-[#5f4a57]"}`}>{o.tagline}</p>
              <span
                className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold shadow-sm"
                style={{ color: o.accent }}
              >
                Create →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white/60 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-serif-display text-center text-3xl font-semibold sm:text-4xl">How it works</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { n: "1", t: "Design", d: "Drag realistic flowers, greenery and cute stickers. Pick a background, wrap and ribbon — or tap Surprise Me.", e: "🎨" },
              { n: "2", t: "Personalise", d: "Write a heartfelt message, add up to 3 photos and your favourite 30-second song.", e: "💌" },
              { n: "3", t: "Share the magic", d: "Get a unique link. When they open it, a cinematic, tap-to-reveal experience plays just for them.", e: "🔗" },
            ].map((s) => (
              <div key={s.n} className="rounded-3xl bg-white p-6 shadow-[0_10px_30px_-14px_rgba(80,30,60,0.25)] ring-1 ring-pink-50">
                <div className="text-3xl">{s.e}</div>
                <h3 className="mt-3 text-lg font-bold">
                  <span className="mr-2 text-rose-400">{s.n}.</span>
                  {s.t}
                </h3>
                <p className="mt-2 text-sm text-[#6d5563]">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-4 py-10 text-center text-xs text-[#8a6f80]">
        Made with 🌸 by Bloomly · Digital bouquets, letters & cards
      </footer>
    </main>
  );
}
