import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate, getInitials, calculateAge } from "@/lib/utils";
import {
  HiOutlineUser, HiOutlineEnvelope, HiOutlinePhone, HiOutlineMapPin,
  HiOutlineCalendarDays, HiOutlineBriefcase, HiOutlineBanknotes,
  HiOutlineDocumentText, HiOutlineAcademicCap, HiOutlinePencilSquare,
  HiOutlineArrowLeft, HiOutlineIdentification, HiOutlineStar,
  HiOutlineExclamationTriangle, HiOutlineShieldCheck,
} from "react-icons/hi2";
import Link from "next/link";

export default async function EmpleadoDetailPage({ params }: { params: { id: string } }) {
  const employee = await prisma.employee.findUnique({
    where: { id: params.id },
    include: {
      department: true, position: true, manager: true,
      emergencyContacts: true, skills: { include: { skill: true } },
      contracts: { orderBy: { startDate: "desc" } },
      documents: { orderBy: { createdAt: "desc" } },
      leaveRequests: { include: { leaveType: true }, orderBy: { createdAt: "desc" }, take: 10 },
      performanceReviews: { orderBy: { createdAt: "desc" }, take: 5 },
      salaryHistory: { orderBy: { effectiveDate: "desc" } },
      trainings: { include: { training: true }, orderBy: { createdAt: "desc" } },
      assets: true,
    },
  });
  if (!employee) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/empleados"><Button variant="ghost" size="icon"><HiOutlineArrowLeft className="h-5 w-5" /></Button></Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{employee.firstName} {employee.lastName}</h1>
          <p className="text-muted-foreground">{employee.position?.title || "Sin cargo"} — {employee.department?.name || "Sin departamento"}</p>
        </div>
        <Link href={`/dashboard/empleados/${employee.id}/editar`}>
          <Button><HiOutlinePencilSquare className="h-4 w-4 mr-2" /> Editar</Button>
        </Link>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl bg-violet-100 text-violet-700">{getInitials(`${employee.firstName} ${employee.lastName}`)}</AvatarFallback>
            </Avatar>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
              <div><p className="text-xs text-muted-foreground">Código</p><p className="font-mono font-medium">{employee.employeeCode}</p></div>
              <div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium text-sm">{employee.email}</p></div>
              <div><p className="text-xs text-muted-foreground">Teléfono</p><p className="font-medium">{employee.phone || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground">Estado</p><Badge variant={employee.isActive ? "success" : "destructive"}>{employee.isActive ? "Activo" : "Inactivo"}</Badge></div>
              <div><p className="text-xs text-muted-foreground">Fecha Ingreso</p><p className="font-medium">{formatDate(employee.hireDate)}</p></div>
              <div><p className="text-xs text-muted-foreground">Contrato</p><Badge variant="outline">{employee.contractType.replace("_", " ")}</Badge></div>
              <div><p className="text-xs text-muted-foreground">Salario</p><p className="font-bold text-violet-600">{formatCurrency(employee.salary)}</p></div>
              <div><p className="text-xs text-muted-foreground">Edad</p><p className="font-medium">{employee.birthDate ? `${calculateAge(employee.birthDate)} años` : "—"}</p></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="info">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="info">Info Personal</TabsTrigger>
          <TabsTrigger value="contracts">Contratos</TabsTrigger>
          <TabsTrigger value="leaves">Permisos</TabsTrigger>
          <TabsTrigger value="performance">Desempeño</TabsTrigger>
          <TabsTrigger value="training">Capacitación</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="assets">Activos</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><HiOutlineIdentification className="h-4 w-4" /> Datos Personales</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">CI/NIT</span><span className="font-medium">{employee.nationalId || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Género</span><span className="font-medium">{employee.gender || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Dirección</span><span className="font-medium">{employee.address || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Ciudad</span><span className="font-medium">{employee.city || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Supervisor</span><span className="font-medium">{employee.manager ? `${employee.manager.firstName} ${employee.manager.lastName}` : "—"}</span></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><HiOutlineExclamationTriangle className="h-4 w-4" /> Contactos de Emergencia</CardTitle></CardHeader>
              <CardContent>
                {employee.emergencyContacts.map((c) => (
                  <div key={c.id} className="border-b pb-2 mb-2 last:border-0 text-sm">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-muted-foreground">{c.relationship} — {c.phone}</p>
                  </div>
                ))}
                {employee.emergencyContacts.length === 0 && <p className="text-sm text-muted-foreground">Sin contactos de emergencia</p>}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><HiOutlineStar className="h-4 w-4" /> Habilidades</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {employee.skills.map((s) => (
                    <div key={s.id} className="space-y-1">
                      <div className="flex justify-between text-sm"><span>{s.skill.name}</span><span className="text-muted-foreground">Nv.{s.level}</span></div>
                      <Progress value={s.level * 20} className="h-2" />
                    </div>
                  ))}
                  {employee.skills.length === 0 && <p className="text-sm text-muted-foreground col-span-4">Sin habilidades registradas</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contracts">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Tipo</TableHead><TableHead>Inicio</TableHead><TableHead>Fin</TableHead><TableHead>Salario</TableHead><TableHead>Estado</TableHead></TableRow></TableHeader>
                <TableBody>
                  {employee.contracts.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>{c.type.replace("_", " ")}</TableCell>
                      <TableCell>{formatDate(c.startDate)}</TableCell>
                      <TableCell>{c.endDate ? formatDate(c.endDate) : "Indefinido"}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(c.salary)}</TableCell>
                      <TableCell><Badge variant={c.isActive ? "success" : "secondary"}>{c.isActive ? "Vigente" : "Finalizado"}</Badge></TableCell>
                    </TableRow>
                  ))}
                  {employee.contracts.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Sin contratos</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaves">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Tipo</TableHead><TableHead>Desde</TableHead><TableHead>Hasta</TableHead><TableHead>Días</TableHead><TableHead>Estado</TableHead><TableHead>Razón</TableHead></TableRow></TableHeader>
                <TableBody>
                  {employee.leaveRequests.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell>{l.leaveType.name}</TableCell>
                      <TableCell>{formatDate(l.startDate)}</TableCell>
                      <TableCell>{formatDate(l.endDate)}</TableCell>
                      <TableCell>{l.totalDays}</TableCell>
                      <TableCell><Badge variant={l.status === "APROBADA" ? "success" : l.status === "RECHAZADA" ? "destructive" : l.status === "PENDIENTE" ? "warning" : "secondary"}>{l.status}</Badge></TableCell>
                      <TableCell className="max-w-[200px] truncate">{l.reason || "—"}</TableCell>
                    </TableRow>
                  ))}
                  {employee.leaveRequests.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Sin solicitudes</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <div className="space-y-4">
            {employee.performanceReviews.map((r) => (
              <Card key={r.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{r.period}</Badge>
                    <div className="flex gap-1">{Array.from({ length: 5 }).map((_, i) => (<HiOutlineStar key={i} className={`h-5 w-5 ${i < r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />))}</div>
                  </div>
                  {r.strengths && <p className="text-sm"><span className="font-medium text-green-600">Fortalezas:</span> {r.strengths}</p>}
                  {r.improvements && <p className="text-sm mt-1"><span className="font-medium text-orange-600">Mejoras:</span> {r.improvements}</p>}
                  {r.comments && <p className="text-sm mt-1 text-muted-foreground">{r.comments}</p>}
                </CardContent>
              </Card>
            ))}
            {employee.performanceReviews.length === 0 && <Card><CardContent className="p-8 text-center text-muted-foreground">Sin evaluaciones de desempeño</CardContent></Card>}
          </div>
        </TabsContent>

        <TabsContent value="training">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Capacitación</TableHead><TableHead>Estado</TableHead><TableHead>Puntuación</TableHead><TableHead>Certificado</TableHead></TableRow></TableHeader>
                <TableBody>
                  {employee.trainings.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell><p className="font-medium">{t.training.title}</p><p className="text-xs text-muted-foreground">{t.training.instructor}</p></TableCell>
                      <TableCell><Badge variant={t.status === "COMPLETADO" ? "success" : t.status === "EN_CURSO" ? "warning" : "secondary"}>{t.status}</Badge></TableCell>
                      <TableCell>{t.score ? `${t.score}/100` : "—"}</TableCell>
                      <TableCell>{t.certificate ? <Badge variant="success">Sí</Badge> : "—"}</TableCell>
                    </TableRow>
                  ))}
                  {employee.trainings.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Sin capacitaciones</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Documento</TableHead><TableHead>Categoría</TableHead><TableHead>Fecha</TableHead><TableHead>Vence</TableHead></TableRow></TableHeader>
                <TableBody>
                  {employee.documents.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.title}</TableCell>
                      <TableCell><Badge variant="outline">{d.category}</Badge></TableCell>
                      <TableCell>{formatDate(d.createdAt)}</TableCell>
                      <TableCell>{d.expiresAt ? formatDate(d.expiresAt) : "—"}</TableCell>
                    </TableRow>
                  ))}
                  {employee.documents.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Sin documentos</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Activo</TableHead><TableHead>Código</TableHead><TableHead>Categoría</TableHead><TableHead>Condición</TableHead><TableHead>Valor</TableHead></TableRow></TableHeader>
                <TableBody>
                  {employee.assets.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.name}</TableCell>
                      <TableCell className="font-mono">{a.code}</TableCell>
                      <TableCell>{a.category}</TableCell>
                      <TableCell><Badge variant={a.condition === "BUENO" ? "success" : a.condition === "REGULAR" ? "warning" : "destructive"}>{a.condition}</Badge></TableCell>
                      <TableCell>{a.value ? formatCurrency(a.value) : "—"}</TableCell>
                    </TableRow>
                  ))}
                  {employee.assets.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Sin activos asignados</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
