"use client";

import { useState } from "react";
import { Dialog, Field } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  PROGRAMS,
  STATUSES,
  EYE_COLORS,
  HAIR_COLORS,
  TEACHERS,
  type Student,
} from "@/lib/data";
import { addStudent, nextStudentId } from "@/lib/store";
import { computeAge } from "@/lib/utils";

const empty = {
  firstName: "",
  lastName: "",
  gender: "Dievča",
  dateOfBirth: "",
  program: "Reklama",
  teacher: TEACHERS[0],
  status: "Aktívny",
  heightCm: "",
  weightKg: "",
  eyeColor: "Hnedá",
  hairColor: "Hnedá",
  guardianName: "",
  guardianPhone: "",
  guardianEmail: "",
};

export function AddStudentDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [f, setF] = useState(empty);
  const set = <K extends keyof typeof empty>(k: K, v: string) =>
    setF((p) => ({ ...p, [k]: v }));

  const valid = f.firstName.trim() && f.lastName.trim();

  const submit = () => {
    if (!valid) return;
    const dob = f.dateOfBirth || "2010-01-01";
    const student: Student = {
      id: nextStudentId(),
      firstName: f.firstName.trim(),
      lastName: f.lastName.trim(),
      pronouns: f.gender === "Dievča" ? "ona" : f.gender === "Chlapec" ? "on" : "oni",
      gender: f.gender as Student["gender"],
      dateOfBirth: dob,
      age: computeAge(dob),
      city: "—",
      status: f.status as Student["status"],
      program: f.program as Student["program"],
      cohort: "—",
      teacher: f.teacher,
      enrolledOn: new Date().toISOString().slice(0, 10),
      heightCm: Number(f.heightCm) || 0,
      weightKg: Number(f.weightKg) || 0,
      eyeColor: f.eyeColor as Student["eyeColor"],
      hairColor: f.hairColor as Student["hairColor"],
      shoeEu: 40,
      clothingSize: "M",
      skills: [],
      languages: ["Slovenčina"],
      castingReadiness: 0,
      guardianName: f.guardianName.trim() || "—",
      guardianRelation: "Rodič",
      guardianPhone: f.guardianPhone.trim(),
      guardianEmail: f.guardianEmail.trim(),
      emergencyContact: "",
      bio: "",
      tutorNote: "",
      documents: [],
      media: [],
    };
    addStudent(student);
    setF(empty);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Nový študent"
      description="Vyplňte základné údaje. Záznam sa uloží do prehliadača (localStorage)."
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Zrušiť
          </Button>
          <Button size="sm" onClick={submit} disabled={!valid}>
            Pridať študenta
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Meno *">
          <Input value={f.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="napr. Eliška" />
        </Field>
        <Field label="Priezvisko *">
          <Input value={f.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="napr. Krátka" />
        </Field>

        <Field label="Pohlavie">
          <Select value={f.gender} onChange={(e) => set("gender", e.target.value)}>
            <option>Dievča</option>
            <option>Chlapec</option>
          </Select>
        </Field>
        <Field label="Dátum narodenia">
          <Input type="date" value={f.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} />
        </Field>

        <Field label="Program">
          <Select value={f.program} onChange={(e) => set("program", e.target.value)}>
            {PROGRAMS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </Select>
        </Field>
        <Field label="Status">
          <Select value={f.status} onChange={(e) => set("status", e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </Field>

        <Field label="Pedagóg" className="sm:col-span-2">
          <Select value={f.teacher} onChange={(e) => set("teacher", e.target.value)}>
            {TEACHERS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </Field>

        <Field label="Výška (cm)">
          <Input type="number" value={f.heightCm} onChange={(e) => set("heightCm", e.target.value)} placeholder="napr. 165" />
        </Field>
        <Field label="Hmotnosť (kg)">
          <Input type="number" value={f.weightKg} onChange={(e) => set("weightKg", e.target.value)} placeholder="napr. 55" />
        </Field>

        <Field label="Farba očí">
          <Select value={f.eyeColor} onChange={(e) => set("eyeColor", e.target.value)}>
            {EYE_COLORS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </Field>
        <Field label="Farba vlasov">
          <Select value={f.hairColor} onChange={(e) => set("hairColor", e.target.value)}>
            {HAIR_COLORS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </Field>

        <div className="sm:col-span-2 mt-1 border-t border-border pt-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Rodič (nepovinné)
          </p>
        </div>
        <Field label="Meno rodiča">
          <Input value={f.guardianName} onChange={(e) => set("guardianName", e.target.value)} />
        </Field>
        <Field label="Telefón">
          <Input value={f.guardianPhone} onChange={(e) => set("guardianPhone", e.target.value)} placeholder="+421 …" />
        </Field>
        <Field label="E-mail" className="sm:col-span-2">
          <Input type="email" value={f.guardianEmail} onChange={(e) => set("guardianEmail", e.target.value)} />
        </Field>
      </div>
    </Dialog>
  );
}
