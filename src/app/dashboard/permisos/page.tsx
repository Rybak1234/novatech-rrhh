import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, getInitials } from "@/lib/utils";
import { HiOutlineCalendarDays, HiOutlinePlus, HiOutlineCheck, HiOutlineXMark } from "react-icons/hi2";

export default async function PermisosPage({ searchParams }: { searchParams: { status?: string } }) {
  const where: any = {};
  if (searchParams.status) where.status = searchParams.status;

  const [leaves, leaveTypes, stats] = await Promise.all([
    prisma.leaveRequest.findMany({ where, include: { employee: true, leaveType: true }, orderBy: { createdAt: "desc" } }),
    prisma.leaveType.findMany(),
    Promise.all([
      prisma.leaveRequest.count({ where: { status: "PENDIENTE" } }),
      prisma.leaveRequest.count({ where: { status: "APROBADA" } }),
      prisma.leaveRequest.count({ where: { status: "RECHAZADA" } }),
    ]),
  ]);

  const statusColors: Record<string, "warning" | "success" | "destructive" | "secondary"> = {
    PENDIENTE: "warning", APROBADA: "success", RECHAZADA: "destructive", CANCELADA: "secondary",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><HiOutlineCalendarDays className="h-7 w-7 text-violet-600" /> Permisos y Vacaciones</h1>
          <p className="text-muted-foreground">Gestión de solicitudes de permisos</p>
        </div>
        <Button><HiOutlinePlus className="h-4 w-4 mr-2" /> Nueva Solicitud</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-violet-600">{leaves.length}</p><p className="text-xs text-muted-foreground">Total</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-yellow-600">{stats[0]}</p><p className="text-xs text-muted-foreground">Pendientes</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">{stats[1]}</p><p className="text-xs text-muted-foreground">Aprobadas</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-red-600">{stats[2]}</p><p className="text-xs text-muted-foreground">Rechazadas</p></CardContent></Card>
      </div>

      {/* Leave Types */}
      <Card>
        <CardHeader><CardTitle className="text-base">Tipos de Permiso Configurados</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {leaveTypes.map((lt) => (
              <Badge key={lt.id} variant="outline" className="py-1 px-3">
                {lt.name} — {lt.daysPerYear} días/año {lt.isPaid ? "(Pagado)" : "(No pagado)"}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filter */}
      <Card>
        <CardContent className="p-4">
          <form className="flex gap-3">
            <select name="status" className="h-10 rounded-md border border-input bg-background px-3 text-sm" defaultValue={searchParams.status}>
              <option value="">Todos los estados</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="APROBADA">Aprobada</option>
              <option value="RECHAZADA">Rechazada</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
            <Button type="submit" variant="secondary">Filtrar</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Desde</TableHead>
                <TableHead>Hasta</TableHead>
                <TableHead>Días</TableHead>
                <TableHead>Razón</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaves.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">{getInitials(`${leave.employee.firstName} ${leave.employee.lastName}`)}</AvatarFallback></Avatar>
                      <span className="font-medium">{leave.employee.firstName} {leave.employee.lastName}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{leave.leaveType.name}</Badge></TableCell>
                  <TableCell>{formatDate(leave.startDate)}</TableCell>
                  <TableCell>{formatDate(leave.endDate)}</TableCell>
                  <TableCell className="font-medium">{leave.totalDays}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{leave.reason || "—"}</TableCell>
                  <TableCell><Badge variant={statusColors[leave.status]}>{leave.status}</Badge></TableCell>
                  <TableCell>
                    {leave.status === "PENDIENTE" && (
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600"><HiOutlineCheck className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600"><HiOutlineXMark className="h-4 w-4" /></Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {leaves.length === 0 && <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">No hay solicitudes de permisos</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
