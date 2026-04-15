import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import { HiOutlineAcademicCap, HiOutlinePlus, HiOutlineCalendarDays, HiOutlineMapPin, HiOutlineComputerDesktop } from "react-icons/hi2";

export default async function CapacitacionPage() {
  const [trainings, enrollmentStats] = await Promise.all([
    prisma.training.findMany({
      include: { enrollments: { include: { employee: true } } },
      orderBy: { startDate: "desc" },
    }),
    prisma.trainingEnrollment.groupBy({ by: ["status"], _count: true }),
  ]);

  const completedCount = enrollmentStats.find((s) => s.status === "COMPLETADO")?._count || 0;
  const inProgressCount = enrollmentStats.find((s) => s.status === "EN_CURSO")?._count || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><HiOutlineAcademicCap className="h-7 w-7 text-violet-600" /> Capacitación</h1>
          <p className="text-muted-foreground">Programas de formación y desarrollo</p>
        </div>
        <Button><HiOutlinePlus className="h-4 w-4 mr-2" /> Nuevo Programa</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-violet-600">{trainings.length}</p><p className="text-xs text-muted-foreground">Programas</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-blue-600">{inProgressCount}</p><p className="text-xs text-muted-foreground">En Curso</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">{completedCount}</p><p className="text-xs text-muted-foreground">Completados</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-yellow-600">{trainings.reduce((sum, t) => sum + t.enrollments.length, 0)}</p><p className="text-xs text-muted-foreground">Inscripciones</p></CardContent></Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {trainings.map((training) => {
          const completed = training.enrollments.filter((e) => e.status === "COMPLETADO").length;
          const total = training.enrollments.length;
          const progress = total > 0 ? (completed / total) * 100 : 0;

          return (
            <Card key={training.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{training.title}</CardTitle>
                  {training.isOnline ? <Badge variant="outline"><HiOutlineComputerDesktop className="h-3 w-3 mr-1" /> Online</Badge> : <Badge variant="outline"><HiOutlineMapPin className="h-3 w-3 mr-1" /> Presencial</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                {training.description && <p className="text-sm text-muted-foreground mb-3">{training.description}</p>}
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div><span className="text-muted-foreground">Instructor:</span> <span className="font-medium">{training.instructor || "—"}</span></div>
                  <div><span className="text-muted-foreground">Ubicación:</span> <span className="font-medium">{training.location || "—"}</span></div>
                  <div className="flex items-center gap-1"><HiOutlineCalendarDays className="h-3 w-3 text-muted-foreground" /><span className="text-muted-foreground">{formatDate(training.startDate)}</span></div>
                  <div><span className="text-muted-foreground">Cupo:</span> <span className="font-medium">{total}/{training.maxCapacity || "∞"}</span></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs"><span>Progreso</span><span>{completed}/{total} completados</span></div>
                  <Progress value={progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
        {trainings.length === 0 && <Card className="col-span-full"><CardContent className="p-12 text-center text-muted-foreground">No hay programas de capacitación</CardContent></Card>}
      </div>
    </div>
  );
}
