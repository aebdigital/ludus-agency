"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/badges";
import { updateStudent } from "@/lib/store";
import { gradientFromSeed, initials } from "@/lib/utils";
import { STATUSES, type Student } from "@/lib/data";

export function ProfileCard({ student: s }: { student: Student }) {
  const { from, to } = gradientFromSeed(s.firstName + s.lastName);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    firstName: s.firstName,
    lastName: s.lastName,
    preferredName: s.preferredName ?? "",
    status: s.status as Student["status"],
  });

  const start = () => {
    setDraft({
      firstName: s.firstName,
      lastName: s.lastName,
      preferredName: s.preferredName ?? "",
      status: s.status,
    });
    setEditing(true);
  };

  const save = () => {
    updateStudent(s.id, {
      firstName: draft.firstName.trim() || s.firstName,
      lastName: draft.lastName.trim() || s.lastName,
      preferredName: draft.preferredName.trim() || undefined,
      status: draft.status,
    });
    setEditing(false);
  };

  return (
    <Card className="group relative overflow-hidden">
      <div
        className="relative aspect-square w-full"
        style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.28),transparent_60%)]" />
        <span className="absolute inset-0 flex items-center justify-center text-7xl font-semibold text-white">
          {initials(s.firstName, s.lastName)}
        </span>
      </div>

      {!editing && (
        <button
          onClick={start}
          aria-label="Upraviť"
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-md bg-card/90 text-muted-foreground opacity-0 shadow-sm transition-opacity hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
        >
          <Pencil className="size-4" />
        </button>
      )}

      <CardContent className="p-5">
        {editing ? (
          <div className="space-y-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Priezvisko
              </span>
              <Input
                value={draft.lastName}
                onChange={(e) => setDraft((d) => ({ ...d, lastName: e.target.value }))}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Meno
              </span>
              <Input
                value={draft.firstName}
                onChange={(e) => setDraft((d) => ({ ...d, firstName: e.target.value }))}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Prezývka
              </span>
              <Input
                value={draft.preferredName}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, preferredName: e.target.value }))
                }
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Status
              </span>
              <Select
                value={draft.status}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    status: e.target.value as Student["status"],
                  }))
                }
              >
                {STATUSES.map((st) => (
                  <option key={st}>{st}</option>
                ))}
              </Select>
            </label>
            <div className="flex items-center gap-2 pt-1">
              <Button size="sm" onClick={save}>
                Uložiť
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                Zrušiť
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl font-semibold leading-tight tracking-tight">
                {s.lastName} {s.firstName}
              </h1>
              {s.preferredName && (
                <span className="text-sm text-muted-foreground">
                  „{s.preferredName}“
                </span>
              )}
            </div>
            <StatusBadge status={s.status} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
