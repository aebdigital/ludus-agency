"use client";

import type { ComponentType, ReactNode } from "react";
import { useState } from "react";
import { Pencil } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { updateStudent } from "@/lib/store";
import { computeAge } from "@/lib/utils";
import type { Student } from "@/lib/data";
import { cn } from "@/lib/utils";

export type EditField = {
  key: keyof Student;
  label: string;
  type?: "text" | "number" | "date" | "select" | "textarea" | "list";
  options?: readonly string[];
};

export function EditableCard({
  student,
  title,
  icon: Icon,
  fields,
  contentClassName,
  children,
}: {
  student: Student;
  title: string;
  icon?: ComponentType<{ className?: string }>;
  fields: EditField[];
  contentClassName?: string;
  children: ReactNode;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});

  const start = () => {
    const init: Record<string, string> = {};
    for (const f of fields) {
      const v = student[f.key];
      init[f.key as string] = Array.isArray(v)
        ? v.join(", ")
        : v == null
          ? ""
          : String(v);
    }
    setDraft(init);
    setEditing(true);
  };

  const save = () => {
    const patch: Record<string, unknown> = {};
    for (const f of fields) {
      const raw = draft[f.key as string] ?? "";
      if (f.type === "number") patch[f.key as string] = Number(raw) || 0;
      else if (f.type === "list")
        patch[f.key as string] = raw
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean);
      else patch[f.key as string] = raw;
    }
    if ("dateOfBirth" in patch) {
      patch.age = computeAge(String(patch.dateOfBirth));
    }
    updateStudent(student.id, patch as Partial<Student>);
    setEditing(false);
  };

  const update = (key: string, value: string) =>
    setDraft((d) => ({ ...d, [key]: value }));

  return (
    <Card className="group relative">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          {Icon && <Icon className="size-4 text-primary" />}
          {title}
        </CardTitle>
      </CardHeader>

      {!editing && (
        <button
          onClick={start}
          aria-label="Upraviť"
          className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-secondary hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
        >
          <Pencil className="size-3.5" />
        </button>
      )}

      <CardContent className={editing ? undefined : contentClassName}>
        {editing ? (
          <div className="space-y-3">
            {fields.map((f) => (
              <label key={String(f.key)} className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  {f.label}
                </span>
                {f.type === "select" ? (
                  <Select
                    value={draft[f.key as string] ?? ""}
                    onChange={(e) => update(f.key as string, e.target.value)}
                  >
                    {f.options?.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </Select>
                ) : f.type === "textarea" ? (
                  <textarea
                    value={draft[f.key as string] ?? ""}
                    onChange={(e) => update(f.key as string, e.target.value)}
                    rows={4}
                    className="w-full resize-y rounded-md border border-input bg-card px-3 py-2 text-sm leading-relaxed shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-focus"
                  />
                ) : (
                  <Input
                    type={
                      f.type === "number"
                        ? "number"
                        : f.type === "date"
                          ? "date"
                          : "text"
                    }
                    value={draft[f.key as string] ?? ""}
                    onChange={(e) => update(f.key as string, e.target.value)}
                  />
                )}
              </label>
            ))}
            <div className={cn("flex items-center gap-2 pt-1")}>
              <Button size="sm" onClick={save}>
                Uložiť
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                Zrušiť
              </Button>
            </div>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
