"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { API_BASE, saveSession } from "@/lib/api";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.detail || "Login failed.");
      saveSession(body.access_token, body.user);
      const next = searchParams.get("next");
      router.push(next && next.startsWith("/") && !next.startsWith("//") ? next : "/watchlist");
    } catch (err) { setError(err instanceof Error ? err.message : "Something went wrong."); }
    finally { setBusy(false); }
  }

  return <main className="mx-auto flex min-h-screen max-w-md items-center px-4 py-12 text-white">
    <form onSubmit={handleSubmit} className="w-full space-y-6 rounded-2xl border border-gray-800 bg-gray-900/70 p-7">
      <div><p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Welcome back</p><h1 className="text-3xl font-bold">Log in</h1><p className="mt-2 text-gray-400">Continue discovering movies you love.</p></div>
      <label className="block text-sm text-gray-300">Email<input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-3 text-white outline-none focus:border-blue-500" /></label>
      <label className="block text-sm text-gray-300">Password<input required type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-3 text-white outline-none focus:border-blue-500" /></label>
      {error && <p role="alert" className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">{error}</p>}
      <button disabled={busy} className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold hover:bg-blue-500 disabled:opacity-60">{busy ? "Logging in…" : "Log in"}</button>
      <p className="text-center text-sm text-gray-400">New here? <Link href="/signup" className="font-semibold text-blue-400">Create an account</Link></p>
    </form>
  </main>;
}

export default function LoginPage() {
  return <Suspense fallback={<main className="p-12 text-center text-gray-400">Loading…</main>}><LoginForm /></Suspense>;
}
