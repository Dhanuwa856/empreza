"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Copy, ImagePlus, Lock, Save, Trash2, Trophy, Upload } from "lucide-react";
import { INITIAL_TEAMS, GALLERY_ITEMS, mergeGalleryItems } from "../page";
import { readSiteState, supabase, SUPABASE_SETUP_SQL, writeSiteState } from "../../lib/supabase";

const DEFAULT_STATE = {
  teams: INITIAL_TEAMS,
  gallery: GALLERY_ITEMS,
  settings: {
    mainLogo: "/empreza-logo.png",
    footerSocialLinks: "Instagram: @empreza2026\nFacebook: EMPREZA 2026",
    developerNames: "ITUM Development Team",
  },
};

const tabs = [
  ["scores", "1. Scores & medals"],
  ["teams", "2. Teams & logos"],
  ["events", "3. Sports & rules"],
  ["gallery", "4. Gallery"],
  ["design", "5. Branding & footer"],
  ["supabase", "6. Supabase setup"],
];

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState("scores");
  const [state, setState] = useState(DEFAULT_STATE);
  const [saved, setSaved] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const local = localStorage.getItem("empreza_2026_state");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        setState({ ...DEFAULT_STATE, ...parsed, gallery: mergeGalleryItems(parsed.gallery) });
      } catch { setError("Saved local data could not be loaded."); }
    }
    readSiteState().then((remote) => {
      if (remote?.state) {
        setState({
          ...DEFAULT_STATE,
          ...remote.state,
          gallery: mergeGalleryItems(remote.state.gallery),
        });
      }
    }).catch(() => setError("Supabase is not configured; using local preview storage."));
  }, []);

  const updateTeam = (id, patch) => setState((current) => ({
    ...current,
    teams: current.teams.map((team) => team.id === id ? { ...team, ...patch } : team),
  }));

  const save = async () => {
    localStorage.setItem("empreza_2026_state", JSON.stringify(state));
    localStorage.setItem("empreza_2026_teams", JSON.stringify(state.teams));
    if (supabase) {
      try { await writeSiteState(state); } catch { setError("Supabase save failed. Local changes were kept."); return; }
    }
    setSaved("Saved successfully");
    setTimeout(() => setSaved(""), 2500);
  };

  const uploadLogo = async (teamId, file) => {
    if (!file || !supabase) {
      setError("Add Supabase credentials to upload files to empreza-media.");
      return;
    }
    const path = `teams/${teamId}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("empreza-media").upload(path, file, { upsert: true });
    if (uploadError) { setError(uploadError.message); return; }
    const { data } = supabase.storage.from("empreza-media").getPublicUrl(path);
    updateTeam(teamId, { logo: data.publicUrl });
  };

  const uploadGalleryImage = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Gallery images must be smaller than 5 MB.");
      return;
    }

    let imageUrl;
    if (supabase) {
      const path = `gallery/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
      const { error: uploadError } = await supabase.storage
        .from("empreza-media")
        .upload(path, file, { upsert: true });
      if (uploadError) {
        setError(uploadError.message);
        return;
      }
      const { data } = supabase.storage.from("empreza-media").getPublicUrl(path);
      imageUrl = data.publicUrl;
    } else {
      imageUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Could not read the selected image."));
        reader.readAsDataURL(file);
      }).catch((uploadError) => {
        setError(uploadError.message);
        return null;
      });
      if (!imageUrl) return;
    }

    setState((current) => ({
      ...current,
      gallery: [
        {
          title: file.name.replace(/\.[^/.]+$/, ""),
          category: "Gallery",
          image: imageUrl,
        },
        ...current.gallery,
      ],
    }));
    setSaved("Image added - save changes");
  };

  const updateGalleryItem = (index, patch) => {
    setState((current) => ({
      ...current,
      gallery: current.gallery.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item),
    }));
  };

  const removeGalleryItem = (index) => {
    setState((current) => ({
      ...current,
      gallery: current.gallery.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const events = useMemo(() => state.teams.flatMap((team) => team.events.map((event, index) => ({ team, event, index }))), [state.teams]);

  if (!unlocked) return (
    <main className="flex min-h-screen items-center justify-center bg-[#0C0C0C] px-4 text-white">
      <form onSubmit={(event) => { event.preventDefault(); if (password === "empreza2026") setUnlocked(true); else setError("Invalid password."); }} className="w-full max-w-md rounded-2xl border border-[#E7B736]/40 bg-[#151515] p-8 text-center">
        <Lock className="mx-auto h-10 w-10 text-[#E7B736]" />
        <h1 className="font-plak mt-4 text-3xl font-bold uppercase">Secret Admin Route</h1>
        <p className="mt-2 text-sm text-zinc-400">Manage EMPREZA content, scores, sports and media.</p>
        <input autoFocus type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-6 w-full rounded-lg border border-white/15 bg-black px-4 py-3 text-white outline-none focus:border-[#E7B736]" />
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        <button className="mt-4 w-full rounded-lg bg-[#E7B736] py-3 font-bold uppercase tracking-wider text-black">Unlock dashboard</button>
        <a href="/" className="mt-5 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to public site</a>
      </form>
    </main>
  );

  return (
    <main className="min-h-screen bg-[#0C0C0C] text-white">
      <header className="border-b border-[#E7B736]/25 bg-[#121212] px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3"><Trophy className="text-[#E7B736]" /><div><h1 className="font-plak text-2xl font-bold">EMPREZA ADMIN</h1><p className="text-xs text-zinc-400">All changes are saved to Supabase when configured.</p></div></div>
          <a href="/" className="text-sm text-zinc-400 hover:text-white">View site</a>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">{tabs.map(([id, label]) => <button key={id} onClick={() => setTab(id)} className={`rounded-lg px-3 py-2 text-xs font-bold uppercase ${tab === id ? "bg-[#E7B736] text-black" : "bg-white/5 text-zinc-300"}`}>{label}</button>)}</div>
        {error && <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
        <section className="mt-6 space-y-4">
          {tab === "scores" && state.teams.map((team) => <div key={team.id} className="grid gap-3 rounded-xl border border-white/10 bg-[#151515] p-4 md:grid-cols-[1fr_140px_120px_120px] md:items-center"><div className="font-bold">{team.name}<span className="ml-2 text-xs text-zinc-500">{team.short}</span></div><label className="text-xs text-zinc-400">Points<input type="number" value={team.score} onChange={(e) => updateTeam(team.id, { score: Math.max(0, Number(e.target.value)) })} className="mt-1 w-full rounded bg-black p-2 text-white" /></label><label className="text-xs text-zinc-400">Wins<input type="number" value={team.wins} onChange={(e) => updateTeam(team.id, { wins: Math.max(0, Number(e.target.value)) })} className="mt-1 w-full rounded bg-black p-2 text-white" /></label><div className="text-right text-[#E7B736]">{team.score} PTS</div></div>)}
          {tab === "teams" && state.teams.map((team) => <div key={team.id} className="grid gap-4 rounded-xl border border-white/10 bg-[#151515] p-4 md:grid-cols-[1fr_120px_1fr_80px] md:items-center"><input value={team.name} onChange={(e) => updateTeam(team.id, { name: e.target.value })} className="rounded bg-black p-2 font-bold text-white" /><div className="flex items-center gap-2"><input type="color" value={team.color} onChange={(e) => updateTeam(team.id, { color: e.target.value })} className="h-10 w-12 rounded bg-transparent" /><input value={team.color} onChange={(e) => updateTeam(team.id, { color: e.target.value })} className="w-24 rounded bg-black p-2 text-xs text-white" /></div><label className="flex items-center gap-2 rounded border border-dashed border-white/20 p-3 text-xs text-zinc-400"><ImagePlus className="h-4 w-4" />{typeof team.logo === "string" && (team.logo.startsWith("http") || team.logo.startsWith("/")) ? "Replace logo" : "Upload PNG logo"}<input type="file" accept="image/png,image/webp" onChange={(e) => uploadLogo(team.id, e.target.files?.[0])} className="hidden" /></label>{typeof team.logo === "string" && (team.logo.startsWith("http") || team.logo.startsWith("/")) ? <img src={team.logo} alt={`${team.name} logo`} className="h-14 w-14 rounded-xl border border-white/15 bg-black/50 object-contain p-1" /> : <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/15 bg-black/50 text-3xl">{team.logo}</span>}</div>)}
          {tab === "events" && events.map(({ team, event, index }) => <div key={`${team.id}-${index}`} className="rounded-xl border border-white/10 bg-[#151515] p-4"><p className="mb-3 text-xs font-bold uppercase text-[#E7B736]">{team.name} • Event {index + 1}</p><div className="grid gap-3 md:grid-cols-2"><input value={event.name} onChange={(e) => { const events = [...team.events]; events[index] = { ...event, name: e.target.value }; updateTeam(team.id, { events }); }} className="rounded bg-black p-2 text-white" /><input value={event.time} onChange={(e) => { const events = [...team.events]; events[index] = { ...event, time: e.target.value }; updateTeam(team.id, { events }); }} className="rounded bg-black p-2 text-white" /><input value={event.venue} onChange={(e) => { const events = [...team.events]; events[index] = { ...event, venue: e.target.value }; updateTeam(team.id, { events }); }} className="rounded bg-black p-2 text-white" /><select value={event.status} onChange={(e) => { const events = [...team.events]; events[index] = { ...event, status: e.target.value }; updateTeam(team.id, { events }); }} className="rounded bg-black p-2 text-white"><option>LIVE</option><option>UPCOMING</option><option>COMPLETED</option></select><textarea value={event.rules.join("\n")} onChange={(e) => { const events = [...team.events]; events[index] = { ...event, rules: e.target.value.split("\n") }; updateTeam(team.id, { events }); }} className="min-h-24 rounded bg-black p-2 text-white md:col-span-2" placeholder="One rule per line" /></div></div>)}
          {tab === "gallery" && <div className="space-y-4"><label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#E7B736]/50 bg-[#151515] p-6 text-sm font-bold text-[#E7B736] hover:bg-[#E7B736]/10"><Upload className="h-5 w-5" /> Upload gallery image<input type="file" accept="image/*" onChange={(e) => uploadGalleryImage(e.target.files?.[0])} className="hidden" /></label><p className="text-xs text-zinc-500">Images must be smaller than 5 MB. Edit the title and category, then click Save changes.</p>{state.gallery.map((item, index) => <div key={`${item.image}-${index}`} className="grid gap-4 rounded-xl border border-white/10 bg-[#151515] p-4 md:grid-cols-[140px_1fr_auto] md:items-center"><img src={item.image} alt={item.title} className="h-24 w-full rounded-lg bg-black object-cover md:w-32" /><div className="grid gap-2"><input value={item.title} onChange={(e) => updateGalleryItem(index, { title: e.target.value })} className="rounded bg-black p-2 font-bold text-white" placeholder="Image title" /><input value={item.category} onChange={(e) => updateGalleryItem(index, { category: e.target.value })} className="rounded bg-black p-2 text-sm text-white" placeholder="Category" /></div><button type="button" onClick={() => removeGalleryItem(index)} className="rounded-lg p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-400" aria-label={`Remove ${item.title}`}><Trash2 className="h-5 w-5" /></button></div>)}</div>}
          {tab === "design" && <div className="space-y-4 rounded-xl border border-white/10 bg-[#151515] p-4"><label className="block text-xs text-zinc-400">Main EMPREZA PNG logo URL<input value={state.settings.mainLogo} onChange={(e) => setState({ ...state, settings: { ...state.settings, mainLogo: e.target.value } })} className="mt-1 w-full rounded bg-black p-2 text-white" /></label><img src={state.settings.mainLogo || "/empreza-logo.png"} alt="Current EMPREZA logo" className="h-36 w-36 rounded-xl bg-black object-contain p-2" /><label className="block text-xs text-zinc-400">ITUM social links<textarea value={state.settings.footerSocialLinks} onChange={(e) => setState({ ...state, settings: { ...state, footerSocialLinks: e.target.value } })} className="mt-1 min-h-24 w-full rounded bg-black p-2 text-white" /></label><label className="block text-xs text-zinc-400">Developer names<input value={state.settings.developerNames} onChange={(e) => setState({ ...state, settings: { ...state.settings, developerNames: e.target.value } })} className="mt-1 w-full rounded bg-black p-2 text-white" /></label><p className="text-xs text-zinc-500">Click any gallery image on the public site to open the interactive viewer.</p></div>}
          {tab === "supabase" && <div className="rounded-xl border border-white/10 bg-[#151515] p-4"><p className="mb-3 text-sm text-zinc-300">Run this once in the Supabase SQL Editor. It creates the state table and the <strong className="text-[#E7B736]">empreza-media</strong> bucket policies.</p><pre className="max-h-[28rem] overflow-auto rounded-lg bg-black p-4 text-xs text-emerald-300">{SUPABASE_SETUP_SQL}</pre><button onClick={() => { navigator.clipboard.writeText(SUPABASE_SETUP_SQL); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="mt-4 flex items-center gap-2 rounded-lg bg-[#E7B736] px-4 py-2 text-xs font-bold text-black">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy SQL"}</button></div>}
        </section>
        <button onClick={save} className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-[#FF6B00] px-5 py-3 font-bold text-black shadow-xl"><Save className="h-4 w-4" /> {saved || "Save changes"}</button>
      </div>
    </main>
  );
}
