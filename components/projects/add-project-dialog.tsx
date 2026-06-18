"use client";

import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import { Dialog, Field } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { PROGRAMS } from "@/lib/data";
import { type Project } from "@/lib/projects";
import { addProject, nextProjectId, useStudents } from "@/lib/store";
import { cn } from "@/lib/utils";

const empty = {
  title: "",
  program: "Herectvo",
  dates: "",
};

export function AddProjectDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const students = useStudents();
  const [f, setF] = useState(empty);
  const [picked, setPicked] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const set = <K extends keyof typeof empty>(k: K, v: string) =>
    setF((p) => ({ ...p, [k]: v }));

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return [...students]
      .sort((a, b) => a.lastName.localeCompare(b.lastName, "sk"))
      .filter(
        (s) =>
          !needle ||
          `${s.firstName} ${s.lastName} ${s.id}`.toLowerCase().includes(needle)
      );
  }, [students, q]);

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const valid = f.title.trim().length > 0;

  const submit = () => {
    if (!valid) return;
    const project: Project = {
      id: nextProjectId(),
      title: f.title.trim(),
      phase: "Konkurz",
      program: f.program,
      venue: "—",
      dates: f.dates.trim() || "—",
      director: "—",
      studentIds: picked,
      custom: true,
    };
    addProject(project);
    setF(empty);
    setPicked([]);
    setQ("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Nový projekt"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Zrušiť
          </Button>
          <Button size="sm" onClick={submit} disabled={!valid}>
            Vytvoriť projekt
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Názov *" className="sm:col-span-2">
          <Input value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="napr. Vianočná revue" />
        </Field>
        <Field label="Program">
          <Select value={f.program} onChange={(e) => set("program", e.target.value)}>
            {PROGRAMS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </Select>
        </Field>
        <Field label="Termín">
          <Input value={f.dates} onChange={(e) => set("dates", e.target.value)} placeholder="napr. 5. – 12. dec 2026" />
        </Field>
      </div>

      <div className="mt-4 border-t border-border pt-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Obsadenie študentov
          </p>
          <span className="text-xs text-muted-foreground">
            {picked.length} vybraných
          </span>
        </div>
        <div className="relative mb-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Hľadať študenta…" className="pl-9" />
        </div>
        <div className="max-h-52 space-y-1 overflow-y-auto rounded-lg border border-border p-1 scrollbar-thin">
          {filtered.map((s) => {
            const on = picked.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggle(s.id)}
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
                <Avatar firstName={s.firstName} lastName={s.lastName} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {s.lastName} {s.firstName}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {s.program}
                  </span>
                </span>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="px-2 py-3 text-center text-sm text-muted-foreground">
              Nikto nevyhovuje hľadaniu.
            </p>
          )}
        </div>
      </div>
    </Dialog>
  );
}
