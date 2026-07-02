"use client";

import { useState } from "react";
import { Star, Share2, UserPlus } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CandidateFinder } from "@/components/projects/candidate-finder";
import { CandidateShareDialog } from "@/components/projects/candidate-share-dialog";
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
  const [shareOpen, setShareOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [draftStudentIds, setDraftStudentIds] = useState<string[]>([]);
  // Pre vlastné projekty čítaj živú verziu zo store (aby sa hlavná postava prejavila hneď).
  const live = useProjects().find((p) => p.id === project.id) ?? project;
  const mainId = live.mainStudentId;

  const cast = live.studentIds
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

  const openEditCast = () => {
    setDraftStudentIds(live.studentIds);
    setEditOpen(true);
  };

  const toggleDraftStudent = (id: string) => {
    setDraftStudentIds((current) =>
      current.includes(id)
        ? current.filter((studentId) => studentId !== id)
        : [...current, id]
    );
  };

  const saveCast = () => {
    const nextStudentIds = draftStudentIds.filter(
      (id, index, all) => all.indexOf(id) === index
    );
    const mainStillAssigned = mainId ? nextStudentIds.includes(mainId) : true;
    updateProject(project.id, {
      studentIds: nextStudentIds,
      castFilled: nextStudentIds.length,
      ...(mainStillAssigned
        ? {}
        : { mainStudentId: undefined, phase: "Konkurz" as const }),
    });
    setEditOpen(false);
  };

  const closeAfterPdfOpen = () => {
    setShareOpen(false);
    setEditOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog
        open
        onClose={onClose}
        title={project.title}
        description={[project.program, project.dates !== "—" ? project.dates : null]
          .filter(Boolean)
          .join(" · ")}
        footer={
          <div className="flex w-full items-center justify-between gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Zavrieť
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={openEditCast}
              >
                <UserPlus className="size-4" /> Upraviť študentov
              </Button>
              <Button
                size="sm"
                className="gap-1.5"
                disabled={cast.length === 0}
                onClick={() => setShareOpen(true)}
              >
                <Share2 className="size-4" /> Zdieľať obsadenie
              </Button>
            </div>
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
      <CandidateShareDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        onPdfOpened={closeAfterPdfOpen}
        students={cast}
        title="Zdieľať obsadenie"
        heading={`Obsadenie — ${project.title}`}
        description={`${cast.length} študentov v obsadení · nastavenia platia pre všetkých`}
      />
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Upraviť študentov"
        description={`${draftStudentIds.length} vybraných pre projekt ${project.title}`}
        bodyClassName="max-h-[72vh]"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setEditOpen(false)}>
              Zrušiť
            </Button>
            <Button size="sm" onClick={saveCast}>
              Uložiť obsadenie ({draftStudentIds.length})
            </Button>
          </>
        }
      >
        <CandidateFinder
          students={students}
          selected={draftStudentIds}
          onToggle={toggleDraftStudent}
          showShareAction={false}
        />
      </Dialog>
    </>
  );
}
