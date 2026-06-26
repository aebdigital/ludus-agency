"use client";

import { useState } from "react";
import { Dialog, Field } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PROGRAMS } from "@/lib/data";
import { type Project } from "@/lib/projects";
import { addProject, nextProjectId, useStudents } from "@/lib/store";
import { CandidateFinder } from "@/components/projects/candidate-finder";

const empty = {
  title: "",
  program: "Reklama",
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
  const set = <K extends keyof typeof empty>(k: K, v: string) =>
    setF((p) => ({ ...p, [k]: v }));

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
            Vytvoriť projekt{picked.length > 0 ? ` (${picked.length})` : ""}
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
        <CandidateFinder students={students} selected={picked} onToggle={toggle} />
      </div>
    </Dialog>
  );
}
