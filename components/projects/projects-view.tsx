"use client";

import { useMemo, useState } from "react";
import { CalendarDays, MapPin, Users, Clapperboard, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { PageHeader } from "@/components/shared/page-header";
import { AddProjectDialog } from "@/components/projects/add-project-dialog";
import { baseProjects, phaseVariant, type Project } from "@/lib/projects";
import { useProjects, useStudents } from "@/lib/store";
import { gradientFromSeed } from "@/lib/utils";

export function ProjectsView() {
  const custom = useProjects();
  const students = useStudents();
  const [open, setOpen] = useState(false);

  const projects = useMemo<Project[]>(
    () => [...custom, ...baseProjects],
    [custom]
  );

  const summary = useMemo(() => {
    const cast = new Set<string>();
    custom.forEach((p) => p.studentIds.forEach((id) => cast.add(id)));
    return {
      total: projects.length,
      casting: projects.filter((p) => p.phase === "Konkurz").length,
      students: cast.size,
    };
  }, [projects, custom]);

  const studentById = useMemo(() => {
    const map = new Map(students.map((s) => [s.id, s]));
    return map;
  }, [students]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="Projekty"
        description="Sledujte každý projekt od konkurzu až po posledné predstavenie."
      >
        <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
          <Plus className="size-4" /> Nový projekt
        </Button>
      </PageHeader>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Projekty spolu", value: summary.total },
          { label: "V konkurze", value: summary.casting },
          { label: "Obsadení študenti", value: summary.students },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="text-3xl font-semibold tracking-tight">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p) => {
          const { from, to } = gradientFromSeed(p.title);
          const pct =
            p.castTotal && p.castFilled
              ? Math.round((p.castFilled / p.castTotal) * 100)
              : 0;
          const cast = p.studentIds
            .map((id) => studentById.get(id))
            .filter(Boolean)
            .slice(0, 6);
          return (
            <Card
              key={p.id}
              className="group overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-pop"
            >
              <div
                className="relative flex h-28 items-end p-4"
                style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(255,255,255,0.25),transparent_55%)]" />
                <Clapperboard className="absolute right-4 top-4 size-6 text-white/70" />
                {p.custom && (
                  <Badge className="absolute left-4 top-4 border-transparent bg-white/85 text-foreground">
                    Nový
                  </Badge>
                )}
                <h3 className="relative text-lg font-semibold text-white drop-shadow-sm">
                  {p.title}
                </h3>
              </div>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <Badge variant={phaseVariant[p.phase]}>{p.phase}</Badge>
                  <span className="text-xs text-muted-foreground">{p.program}</span>
                </div>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <CalendarDays className="size-4" /> {p.dates}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="size-4" /> {p.venue}
                  </p>
                  <p className="flex items-center gap-2">
                    <Users className="size-4" /> Réžia: {p.director}
                  </p>
                </div>

                <div className="border-t border-border pt-3">
                  {p.custom ? (
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-muted-foreground">
                        Obsadenie
                      </span>
                      {cast.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {cast.map((s) => (
                              <Avatar
                                key={s!.id}
                                firstName={s!.firstName}
                                lastName={s!.lastName}
                                size="sm"
                                className="ring-2 ring-card"
                              />
                            ))}
                          </div>
                          <span className="text-xs font-medium tabular-nums">
                            {p.studentIds.length}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Zatiaľ neobsadené
                        </span>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Obsadenie</span>
                        <span className="font-semibold tabular-nums">
                          {p.castFilled}/{p.castTotal} úloh
                        </span>
                      </div>
                      <Progress
                        value={pct}
                        indicatorClassName={pct === 100 ? "bg-[var(--success)]" : ""}
                      />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AddProjectDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
