import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[100dvh] place-items-center bg-[#fff7fa] px-6 text-center text-[#3b2a35]">
      <div>
        <div className="text-6xl">🥀</div>
        <h1 className="font-serif-display mt-4 text-2xl font-semibold">This surprise could not be found</h1>
        <p className="mt-2 text-sm text-[#6d5563]">The link may be incomplete or the creation no longer exists.</p>
        <Link href="/" className="btn-primary mt-6 inline-block rounded-full px-6 py-3 text-sm font-bold">
          Create your own 💐
        </Link>
      </div>
    </main>
  );
}
