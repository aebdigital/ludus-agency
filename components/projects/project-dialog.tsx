"use client";

import { Star, Share2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { phaseVariant, type Project } from "@/lib/projects";
import { useProjects, useStudents, updateProject } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProjectDialog({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const students = useStudents();
  // Pre vlastné projekty čítaj živú verziu zo store (aby sa hlavná postava prejavila hneď).
  const live = useProjects().find((p) => p.id === project.id) ?? project;
  const mainId = live.mainStudentId;

  const cast = project.studentIds
    .map((id) => students.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const setMain = (sid: string) => {
    if (!project.custom) return;
    const newMain = mainId === sid ? undefined : sid;
    updateProject(project.id, {
      mainStudentId: newMain,
      phase: newMain ? "Vybratý" : "Konkurz",
    });
  };

  const shareCastInfo = async () => {
    const text = [
      `Projekt: ${project.title}`,
      `Termín: ${project.dates !== "—" ? project.dates : "—"}`,
      `Miesto: ${project.venue !== "—" ? project.venue : "—"}`,
      "",
      "Obsadení študenti:",
      ...cast.map((st, i) => {
        const dobStr = st.dateOfBirth
          ? st.dateOfBirth.split("-").reverse().join(".")
          : "—";
        return [
          `${i + 1}. ${st.lastName} ${st.firstName}`,
          `   - Vek: ${st.age} r. (${dobStr})`,
          `   - Výška: ${st.heightCm || "—"} cm, Hmotnosť: ${st.weightKg || "—"} kg`,
          `   - Kontakt: ${st.email || "—"} · ${st.phone || "—"}`,
          `   - Pedagóg: ${st.teacher || "—"}`,
          `   - Zručnosti: ${st.skills.join(", ") || "—"}`,
          `   - Jazyky: ${st.languages.join(", ") || "—"}`,
          ""
        ].join("\n");
      })
    ].join("\n");

    const title = `Obsadenie projektu: ${project.title}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text,
        });
      } catch (err) {
        console.error("Zdieľanie zlyhalo:", err);
      }
    } else {
      const mailtoUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text)}`;
      window.location.href = mailtoUrl;
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      title={project.title}
      description={[project.program, project.dates !== "—" ? project.dates : null]
        .filter(Boolean)
        .join(" · ")}
      footer={
        <div className="flex w-full items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Zavrieť
          </Button>
          <Button
            size="sm"
            className="gap-1.5"
            disabled={cast.length === 0}
            onClick={shareCastInfo}
          >
            <Share2 className="size-4" /> Zdieľať obsadenie
          </Button>
        </div>
      }
    >
      <div className="mb-3 flex items-center gap-2">
        <Badge variant={phaseVariant[project.phase]}>{project.phase}</Badge>
      </div>

      {cast.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-3 py-8 text-center text-sm text-muted-foreground">
          V tomto projekte zatiaľ nie sú obsadení študenti.
        </p>
      ) : (
        <div className="space-y-1.5">
          {cast.map((st) => {
            const isMain = mainId === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setMain(st.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-colors",
                  isMain
                    ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                    : "border-border hover:bg-secondary"
                )}
              >
                <Avatar firstName={st.firstName} lastName={st.lastName} size="md" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {st.lastName} {st.firstName}
                </span>
                {isMain ? (
                  <Badge variant="gold" className="gap-1">
                    <Star className="size-3 fill-current" /> Vybratý
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Označiť
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </Dialog>
  );
}
