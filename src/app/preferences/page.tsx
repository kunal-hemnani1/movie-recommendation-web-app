"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch, getToken } from "@/lib/api";
import { GENRES } from "@/lib/genres";

export default function PreferencesPage() {
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) { window.location.href = "/login?next=%2Fpreferences"; return; }
    apiFetch("/api/preferences").then((genres: {id:number}[]) => setSelected(genres.map((g) => g.id)))
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load preferences."))
      .finally(() => setLoading(false));
  }, []);

  function toggle(id: number) { setSelected((current) => current.includes(id) ? current.filter((x) => x !== id) : [...current, id]); }

  async function save() {
    setMessage(""); setError("");
    if (selected.length === 0) { setError("Select at least one genre."); return; }
    setSaving(true);
    try { await apiFetch("/api/preferences", { method: "PUT", body: JSON.stringify({ genre_ids: selected }) }); setMessage("Your genre preferences have been saved."); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to save preferences."); }
    finally { setSaving(false); }
  }

  return <main className="mx-auto min-h-screen max-w-3xl px-4 py-12 text-white"><Link href="/watchlist" className="text-sm text-blue-400 hover:text-blue-300">← Back to watchlist</Link><h1 className="mt-5 text-3xl font-bold">Genre preferences</h1><p className="mt-2 text-gray-400">Choose genres to help personalize your movie recommendations.</p>
    {loading ? <p className="py-12 text-gray-400">Loading preferences…</p> : <><div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">{GENRES.map((genre) => { const active = selected.includes(genre.id); return <button key={genre.id} type="button" aria-pressed={active} onClick={() => toggle(genre.id)} className={`rounded-xl border px-3 py-3 text-sm transition ${active ? "border-blue-400 bg-blue-500/20 text-blue-200" : "border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-500"}`}>{active ? "✓ " : "+ "}{genre.name}</button>; })}</div><p className="mt-3 text-sm text-gray-400">{selected.length} selected</p><button disabled={saving} onClick={() => void save()} className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500 disabled:opacity-60">{saving ? "Saving…" : "Save preferences"}</button></>}
    {message && <p role="status" className="mt-4 text-green-400">{message}</p>}{error && <p role="alert" className="mt-4 text-red-300">{error}</p>}
  </main>;
}
