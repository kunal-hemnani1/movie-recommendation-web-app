"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE, saveSession } from "@/lib/api";
import { GENRES } from "@/lib/genres";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/genres`).catch(() => undefined);
  }, []);

  function toggleGenre(id: number) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (selected.length === 0) return setError("Select at least one genre to personalize your recommendations.");
    setBusy(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, genre_ids: selected }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.detail || "Unable to create your account.");
      saveSession(body.access_token, body.user);
      router.push("/watchlist");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-12 text-white">
      <div className="mb-8 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Join CineVerse</p>
        <h1 className="text-3xl font-bold sm:text-4xl">Create your account</h1>
        <p className="mt-3 text-gray-400">Choose your favorite genres so we can tailor your movie experience.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7 rounded-2xl border border-gray-800 bg-gray-900/70 p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm text-gray-300">Name
            <input required minLength={2} maxLength={100} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-3 text-white outline-none focus:border-blue-500" placeholder="Your name" />
          </label>
          <label className="block text-sm text-gray-300">Email
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-3 text-white outline-none focus:border-blue-500" placeholder="you@example.com" />
          </label>
        </div>
        <label className="block text-sm text-gray-300">Password (at least 8 characters)
          <input required minLength={8} maxLength={128} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-3 text-white outline-none focus:border-blue-500" placeholder="Create a strong password" />
        </label>

        <section>
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="font-semibold">Choose your favorite genres</h2>
            <span className="text-sm text-gray-400">{selected.length} selected</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {GENRES.map((genre) => {
              const active = selected.includes(genre.id);
              return <button key={genre.id} type="button" onClick={() => toggleGenre(genre.id)} aria-pressed={active} className={`rounded-xl border px-3 py-3 text-sm transition ${active ? "border-blue-400 bg-blue-500/20 text-blue-200" : "border-gray-700 bg-gray-950 text-gray-300 hover:border-gray-500"}`}>
                {active ? "✓ " : "+ "}{genre.name}
              </button>;
            })}
          </div>
        </section>
        {error && <p role="alert" className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">{error}</p>}
        <button disabled={busy} className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60">{busy ? "Creating account…" : "Create account"}</button>
        <p className="text-center text-sm text-gray-400">Already have an account? <Link className="font-semibold text-blue-400 hover:text-blue-300" href="/login">Log in</Link></p>
      </form>
    </main>
  );
}
