"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Check,
  SlidersHorizontal,
  FileDown,
  Mail,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  EYE_COLORS,
  HAIR_COLORS,
  PROGRAMS,
  STATUSES,
  type Student,
} from "@/lib/data";
import { printCandidatesPdf, shareCandidates } from "@/lib/export";
import { cn } from "@/lib/utils";

const emptyFilters = {
  gender: "all",
  program: "all",
  status: "all",
  ageMin: "",
  ageMax: "",
  heightMin: "",
  heightMax: "",
  eye: "all",
  hair: "all",
  skill: "",
  language: "",
};

export function CandidateFinder({
  students,
  selected,
  onToggle,
}: {
  students: Student[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [f, setF] = useState(emptyFilters);
  const set = <K extends keyof typeof emptyFilters>(k: K, v: string) =>
    setF((p) => ({ ...p, [k]: v }));

  const activeCount = useMemo(
    () =>
      Object.entries(f).filter(
        ([k, v]) => v !== "" && v !== "all" && v !== (emptyFilters as Record<string, string>)[k]
      ).length,
    [f]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const skill = f.skill.trim().toLowerCase();
    const lang = f.language.trim().toLowerCase();
    return students
      .filter((s) => {
        if (
          needle &&
          !`${s.firstName} ${s.lastName} ${s.id}`.toLowerCase().includes(needle)
        )
          return false;
        if (f.gender !== "all" && s.gender !== f.gender) return false;
        if (f.program !== "all" && s.program !== f.program) return false;
        if (f.status !== "all" && s.status !== f.status) return false;
        if (f.ageMin && s.age < Number(f.ageMin)) return false;
        if (f.ageMax && s.age > Number(f.ageMax)) return false;
        if (f.heightMin && s.heightCm < Number(f.heightMin)) return false;
        if (f.heightMax && s.heightCm > Number(f.heightMax)) return false;
        if (f.eye !== "all" && s.eyeColor !== f.eye) return false;
        if (f.hair !== "all" && s.hairColor !== f.hair) return false;
        if (skill && !s.skills.some((x) => x.toLowerCase().includes(skill)))
          return false;
        if (lang && !s.languages.some((x) => x.toLowerCase().includes(lang)))
          return false;
        return true;
      })
      .sort((a, b) => a.lastName.localeCompare(b.lastName, "sk"));
  }, [students, q, f]);

  const selectedStudents = useMemo(
    () => students.filter((s) => selected.includes(s.id)),
    [students, selected]
  );

  const selectAll = () =>
    filtered.forEach((s) => {
      if (!selected.includes(s.id)) onToggle(s.id);
    });
  const clearSelection = () => selected.forEach((id) => onToggle(id));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Vyhľadať uchádzačov
        </p>
        <span className="text-xs text-muted-foreground">
          {filtered.length} výsledkov · {selected.length} vybraných
        </span>
      </div>

      {/* search + filter toggle */}
      <div className="mb-2 flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Meno alebo ID…"
            className="pl-9"
          />
        </div>
        <Button
          type="button"
          variant={showFilters ? "default" : "outline"}
          size="default"
          className="gap-1.5"
          onClick={() => setShowFilters((v) => !v)}
        >
          <SlidersHorizontal className="size-4" />
          Filtre
          {activeCount > 0 && (
            <span className="ml-0.5 rounded-full bg-primary-foreground/20 px-1.5 text-xs">
              {activeCount}
            </span>
          )}
        </Button>
      </div>

      {/* filters */}
      {showFilters && (
        <div className="mb-3 grid grid-cols-2 gap-2 rounded-lg border border-border bg-secondary/40 p-3 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-muted-foreground">Pohlavie</span>
            <Select value={f.gender} onChange={(e) => set("gender", e.target.value)}>
              <option value="all">Všetky</option>
              <option>Dievča</option>
              <option>Chlapec</option>
              <option>Iné</option>
            </Select>
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-muted-foreground">Program</span>
            <Select value={f.program} onChange={(e) => set("program", e.target.value)}>
              <option value="all">Všetky</option>
              {PROGRAMS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Select>
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-muted-foreground">Stav</span>
            <Select value={f.status} onChange={(e) => set("status", e.target.value)}>
              <option value="all">Všetky</option>
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-muted-foreground">Vek (od – do)</span>
            <div className="flex gap-1.5">
              <Input type="number" value={f.ageMin} onChange={(e) => set("ageMin", e.target.value)} placeholder="od" />
              <Input type="number" value={f.ageMax} onChange={(e) => set("ageMax", e.target.value)} placeholder="do" />
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-muted-foreground">Výška cm (od – do)</span>
            <div className="flex gap-1.5">
              <Input type="number" value={f.heightMin} onChange={(e) => set("heightMin", e.target.value)} placeholder="od" />
              <Input type="number" value={f.heightMax} onChange={(e) => set("heightMax", e.target.value)} placeholder="do" />
            </div>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium text-muted-foreground">Oči</span>
              <Select value={f.eye} onChange={(e) => set("eye", e.target.value)}>
                <option value="all">Všetky</option>
                {EYE_COLORS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium text-muted-foreground">Vlasy</span>
              <Select value={f.hair} onChange={(e) => set("hair", e.target.value)}>
                <option value="all">Všetky</option>
                {HAIR_COLORS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-muted-foreground">Zručnosť</span>
            <Input value={f.skill} onChange={(e) => set("skill", e.target.value)} placeholder="napr. tanec" />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-muted-foreground">Jazyk</span>
            <Input value={f.language} onChange={(e) => set("language", e.target.value)} placeholder="napr. Angličtina" />
          </label>
          <div className="flex items-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                setF(emptyFilters);
                setQ("");
              }}
            >
              <X className="size-4" /> Vyčistiť
            </Button>
          </div>
        </div>
      )}

      {/* actions toolbar */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={selectAll} disabled={filtered.length === 0}>
          Označiť výsledky
        </Button>
        {selected.length > 0 && (
          <Button type="button" variant="ghost" size="sm" onClick={clearSelection}>
            Zrušiť výber
          </Button>
        )}
        <div className="ml-auto flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={selected.length === 0}
            onClick={() => printCandidatesPdf(selectedStudents)}
          >
            <FileDown className="size-4" /> Export PDF
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={selected.length === 0}
            onClick={() => shareCandidates(selectedStudents)}
          >
            <Mail className="size-4" /> E-mail
          </Button>
        </div>
      </div>

      {/* results */}
      <div className="max-h-64 space-y-1 overflow-y-auto rounded-lg border border-border p-1 scrollbar-thin">
        {filtered.map((s) => {
          const on = selected.includes(s.id);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onToggle(s.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors",
                on ? "bg-primary/10" : "hover:bg-secondary"
              )}
            >
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-[6px] border",
                  on ? "border-transparent bg-primary text-primary-foreground" : "border-border"
                )}
              >
                {on && <Check className="size-3.5" strokeWidth={3} />}
              </span>
              {s.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.photoUrl}
                  alt=""
                  className="size-8 shrink-0 rounded-full object-cover ring-2 ring-white/70"
                />
              ) : (
                <Avatar firstName={s.firstName} lastName={s.lastName} size="sm" />
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                  {s.lastName} {s.firstName}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {s.age} r. · {s.heightCm || "—"} cm · {s.gender}
                  {s.skills.length > 0 ? ` · ${s.skills.slice(0, 2).join(", ")}` : ""}
                </span>
              </span>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="px-2 py-3 text-center text-sm text-muted-foreground">
            Nikto nevyhovuje filtrom.
          </p>
        )}
      </div>
    </div>
  );
}
