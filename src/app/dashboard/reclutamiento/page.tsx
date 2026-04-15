import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { HiOutlineUserPlus, HiOutlinePlus, HiOutlineEye, HiOutlineBriefcase } from "react-icons/hi2";

export default async function ReclutamientoPage() {
  const [jobs, applicantStats] = await Promise.all([
    prisma.jobPosting.findMany({ include: { applicants: true }, orderBy: { createdAt: "desc" } }),
    prisma.applicant.groupBy({ by: ["status"], _count: true }),
  ]);

  const statusColors: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
    ABIERTA: "success", EN_PROCESO: "warning", CERRADA: "secondary", CANCELADA: "destructive",
  };

  const applicantStatusColors: Record<string, "default" | "secondary" | "warning" | "success" | "destructive"> = {
    RECIBIDO: "secondary", EN_REVISION: "warning", ENTREVISTA: "default", PRUEBA_TECNICA: "warning", SELECCIONADO: "success", RECHAZADO: "destructive", CONTRATADO: "success",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><HiOutlineUserPlus className="h-7 w-7 text-violet-600" /> Reclutamiento</h1>
          <p className="text-muted-foreground">Gestión de vacantes y candidatos</p>
        </div>
        <Button><HiOutlinePlus className="h-4 w-4 mr-2" /> Nueva Vacante</Button>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-violet-600">{jobs.filter((j) => j.status === "ABIERTA").length}</p><p className="text-xs text-muted-foreground">Vacantes Abiertas</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-blue-600">{jobs.reduce((sum, j) => sum + j.applicants.length, 0)}</p><p className="text-xs text-muted-foreground">Total Postulantes</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-yellow-600">{applicantStats.find((s) => s.status === "ENTREVISTA")?._count || 0}</p><p className="text-xs text-muted-foreground">En Entrevista</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">{applicantStats.find((s) => s.status === "CONTRATADO")?._count || 0}</p><p className="text-xs text-muted-foreground">Contratados</p></CardContent></Card>
      </div>

      {/* Job Postings */}
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2"><HiOutlineBriefcase className="h-5 w-5 text-violet-600" /> {job.title}</CardTitle>
                <Badge variant={statusColors[job.status]}>{job.status.replace("_", " ")}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{job.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div><span className="text-muted-foreground">Ubicación:</span> <span className="font-medium">{job.location || "La Paz"}</span></div>
                <div><span className="text-muted-foreground">Salario:</span> <span className="font-medium">{job.salaryMin && job.salaryMax ? `${formatCurrency(job.salaryMin)} - ${formatCurrency(job.salaryMax)}` : "A convenir"}</span></div>
                <div><span className="text-muted-foreground">Postulantes:</span> <span className="font-bold text-violet-600">{job.applicants.length}</span></div>
                <div><span className="text-muted-foreground">Cierre:</span> <span className="font-medium">{job.closingDate ? formatDate(job.closingDate) : "Sin fecha"}</span></div>
              </div>

              {/* Applicant Pipeline Mini */}
              <div className="flex gap-1">
                {["RECIBIDO", "EN_REVISION", "ENTREVISTA", "SELECCIONADO", "CONTRATADO"].map((status) => {
                  const count = job.applicants.filter((a) => a.status === status).length;
                  return (
                    <div key={status} className="flex-1 text-center">
                      <div className={`h-2 rounded-full ${count > 0 ? "bg-violet-600" : "bg-gray-200"}`} />
                      <p className="text-[10px] text-muted-foreground mt-1">{count}</p>
                    </div>
                  );
                })}
              </div>

              <Button variant="outline" size="sm" className="mt-3 w-full"><HiOutlineEye className="h-3 w-3 mr-1" /> Ver Detalle</Button>
            </CardContent>
          </Card>
        ))}
        {jobs.length === 0 && (
          <Card className="col-span-full"><CardContent className="p-12 text-center text-muted-foreground">No hay vacantes publicadas</CardContent></Card>
        )}
      </div>
    </div>
  );
}
