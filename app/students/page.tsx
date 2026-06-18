"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  Users,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { StudentCard } from "@/components/shared/student-card";
import { StatusBadge } from "@/components/shared/badges";
import { AddStudentDialog } from "@/components/student/add-student-dialog";
import {
  students,
  PROGRAMS,
  STATUSES,
  EYE_COLORS,
  HAIR_COLORS,
} from "@/lib/data";
import { useStudents } from "@/lib/store";
import { cn } from "@/lib/utils";

const ages = students.map((s) => s.age);
const heights = students.map((s) => s.heightCm);
const AGE_MIN = Math.min(...ages);
const AGE_MAX = Math.max(...ages);
const H_MIN = Math.min(...heights);
const H_MAX = Math.max(...heights);

type Sort = "name" | "age" | "recent";

function pluralStudents(n: number) {
  if (n === 1) return "študent";
  if (n >= 2 && n <= 4) return "študenti";
  return "študentov";
}

const initial = {
  q: "",
  program: "all",
  status: "all",
  eye: "all",
  gender: "all",
  hair: "all",
  ageMin: "",
  ageMax: "",
  heightMin: "",
  heightMax: "",
  pending: false,
};

export default function StudentsPage() {
  const allStudents = useStudents();
  const [f, setF] = useState(initial);
  const [sort, setSort] = useState<Sort>("name");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const set = <K extends keyof typeof initial>(k: K, v: (typeof initial)[K]) =>
    setF((prev) => ({ ...prev, [k]: v }));

  const filtered = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    const result = allStudents.filter((s) => {
      if (q) {
        const hay = [
          s.firstName,
          s.lastName,
          s.preferredName ?? "",
          s.id,
          s.city,
          s.cohort,
          ...s.skills,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (f.program !== "all" && s.program !== f.program) return false;
      if (f.status !== "all" && s.status !== f.status) return false;
      if (f.eye !== "all" && s.eyeColor !== f.eye) return false;
      if (f.gender !== "all" && s.gender !== f.gender) return false;
      if (f.hair !== "all" && s.hairColor !== f.hair) return false;
      if (f.ageMin && s.age < Number(f.ageMin)) return false;
      if (f.ageMax && s.age > Number(f.ageMax)) return false;
      if (f.heightMin && s.heightCm < Number(f.heightMin)) return false;
      if (f.heightMax && s.heightCm > Number(f.heightMax)) return false;
      if (f.pending && !s.documents.some((d) => d.status !== "Podpísané"))
        return false;
      return true;
    });

    return result.sort((a, b) => {
      switch (sort) {
        case "age":
          return a.age - b.age;
        case "recent":
          return b.enrolledOn.localeCompare(a.enrolledOn);
        default:
          return a.lastName.localeCompare(b.lastName, "sk");
      }
    });
  }, [f, sort, allStudents]);

  const activeFilters = useMemo(() => {
    const chips: { key: keyof typeof initial; label: string }[] = [];
    if (f.program !== "all") chips.push({ key: "program", label: f.program });
    if (f.status !== "all") chips.push({ key: "status", label: f.status });
    if (f.eye !== "all") chips.push({ key: "eye", label: `Oči: ${f.eye}` });
    if (f.hair !== "all") chips.push({ key: "hair", label: `Vlasy: ${f.hair}` });
    if (f.gender !== "all") chips.push({ key: "gender", label: f.gender });
    if (f.ageMin || f.ageMax)
      chips.push({
        key: "ageMin",
        label: `Vek ${f.ageMin || AGE_MIN}–${f.ageMax || AGE_MAX}`,
      });
    if (f.heightMin || f.heightMax)
      chips.push({
        key: "heightMin",
        label: `Výška ${f.heightMin || H_MIN}–${f.heightMax || H_MAX} cm`,
      });
    if (f.pending) chips.push({ key: "pending", label: "Nevybavené dokumenty" });
    return chips;
  }, [f]);

  const clearChip = (key: keyof typeof initial) => {
    if (key === "ageMin") {
      setF((p) => ({ ...p, ageMin: "", ageMax: "" }));
    } else if (key === "heightMin") {
      setF((p) => ({ ...p, heightMin: "", heightMax: "" }));
    } else if (key === "pending") {
      set("pending", false);
    } else {
      set(key, "all" as never);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="Študenti"
        description="Prehliadajte, filtrujte a spravujte záznamy všetkých študentov štúdia."
      >
        <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
          <button
            onClick={() => setView("grid")}
            className={cn(
              "flex size-8 items-center justify-center rounded-md transition-colors",
              view === "grid"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="Zobrazenie v mriežke"
          >
            <LayoutGrid className="size-4" />
          </button>
          <button
            onClick={() => setView("table")}
            className={cn(
              "flex size-8 items-center justify-center rounded-md transition-colors",
              view === "table"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="Zobrazenie v tabuľke"
          >
            <List className="size-4" />
          </button>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setAddOpen(true)}>
          <Plus className="size-4" /> Nový študent
        </Button>
      </PageHeader>

      <AddStudentDialog open={addOpen} onClose={() => setAddOpen(false)} />

      {/* Panel filtrov */}
      <Card className="p-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={f.q}
                onChange={(e) => set("q", e.target.value)}
                placeholder="Hľadať podľa mena, ID, mesta alebo zručnosti…"
                className="pl-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex">
              <Select
                value={f.program}
                onChange={(e) => set("program", e.target.value)}
                className="lg:w-44"
              >
                <option value="all">Všetky programy</option>
                {PROGRAMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
              <Select
                value={f.status}
                onChange={(e) => set("status", e.target.value)}
                className="lg:w-36"
              >
                <option value="all">Všetky statusy</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
              <Select
                value={f.eye}
                onChange={(e) => set("eye", e.target.value)}
                className="lg:w-40"
              >
                <option value="all">Akákoľvek farba očí</option>
                {EYE_COLORS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
            <Button
              variant={showFilters ? "secondary" : "outline"}
              onClick={() => setShowFilters((v) => !v)}
              className="gap-1.5"
            >
              <SlidersHorizontal className="size-4" />
              Ďalšie filtre
              {activeFilters.length > 0 && (
                <span className="ml-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                  {activeFilters.length}
                </span>
              )}
            </Button>
          </div>

          {/* Rozšírené filtre */}
          {showFilters && (
            <div className="grid grid-cols-1 gap-4 rounded-lg border border-border bg-secondary/40 p-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Vek (rozsah)
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder={String(AGE_MIN)}
                    value={f.ageMin}
                    onChange={(e) => set("ageMin", e.target.value)}
                  />
                  <span className="text-muted-foreground">–</span>
                  <Input
                    type="number"
                    placeholder={String(AGE_MAX)}
                    value={f.ageMax}
                    onChange={(e) => set("ageMax", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Výška (cm)
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder={String(H_MIN)}
                    value={f.heightMin}
                    onChange={(e) => set("heightMin", e.target.value)}
                  />
                  <span className="text-muted-foreground">–</span>
                  <Input
                    type="number"
                    placeholder={String(H_MAX)}
                    value={f.heightMax}
                    onChange={(e) => set("heightMax", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Pohlavie
                </label>
                <Select
                  value={f.gender}
                  onChange={(e) => set("gender", e.target.value)}
                >
                  <option value="all">Akékoľvek</option>
                  <option value="Dievča">Dievča</option>
                  <option value="Chlapec">Chlapec</option>
                  <option value="Iné">Iné</option>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Farba vlasov
                </label>
                <Select
                  value={f.hair}
                  onChange={(e) => set("hair", e.target.value)}
                >
                  <option value="all">Akákoľvek</option>
                  {HAIR_COLORS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex items-end gap-4 sm:col-span-2 lg:col-span-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={f.pending}
                    onChange={(e) => set("pending", e.target.checked)}
                    className="size-4 accent-[var(--primary)]"
                  />
                  Má nevybavené dokumenty
                </label>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Lišta výsledkov */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">
            {filtered.length}{" "}
            <span className="text-muted-foreground">
              {pluralStudents(filtered.length)}
            </span>
          </span>
          {activeFilters.map((c) => (
            <button
              key={c.key + c.label}
              onClick={() => clearChip(c.key)}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 py-0.5 pl-2.5 pr-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/15"
            >
              {c.label}
              <X className="size-3" />
            </button>
          ))}
          {activeFilters.length > 0 && (
            <button
              onClick={() => setF(initial)}
              className="text-xs font-medium text-muted-foreground underline-offset-2 hover:underline"
            >
              Zrušiť všetko
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Zoradiť</span>
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="h-8 w-44 text-[13px]"
          >
            <option value="name">Priezvisko (A–Z)</option>
            <option value="age">Vek</option>
            <option value="recent">Najnovšie zapísaní</option>
          </Select>
        </div>
      </div>

      {/* Výsledky */}
      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
            <Users className="size-6" />
          </div>
          <div>
            <p className="font-medium">Žiadni študenti nevyhovujú filtrom</p>
            <p className="text-sm text-muted-foreground">
              Skúste rozšíriť hľadanie alebo zrušiť niektoré filtre.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setF(initial)}>
            Zrušiť všetky filtre
          </Button>
        </Card>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((s) => (
            <StudentCard key={s.id} student={s} />
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Študent</TableHead>
                <TableHead className="hidden lg:table-cell">Pedagóg</TableHead>
                <TableHead>Vek</TableHead>
                <TableHead className="hidden sm:table-cell">Výška</TableHead>
                <TableHead className="hidden sm:table-cell">Hmotnosť</TableHead>
                <TableHead className="hidden sm:table-cell">Oči</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-8" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id} className="cursor-pointer">
                  <TableCell>
                    <Link
                      href={`/students/${s.id}`}
                      className="flex items-center gap-3"
                    >
                      <Avatar
                        firstName={s.firstName}
                        lastName={s.lastName}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <div className="truncate font-medium">
                          {s.lastName} {s.firstName}
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                    {s.teacher}
                  </TableCell>
                  <TableCell className="tabular-nums">{s.age}</TableCell>
                  <TableCell className="hidden tabular-nums sm:table-cell">
                    {s.heightCm} cm
                  </TableCell>
                  <TableCell className="hidden tabular-nums sm:table-cell">
                    {s.weightKg} kg
                  </TableCell>
                  <TableCell className="hidden text-sm sm:table-cell">
                    {s.eyeColor}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={s.status} />
                  </TableCell>
                  <TableCell>
                    <Link href={`/students/${s.id}`}>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
