import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, formatDateTime, getInitials } from "@/lib/utils";
import { HiOutlineClock, HiOutlinePlus, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineArrowDownTray } from "react-icons/hi2";

export default async function AsistenciaPage({ searchParams }: { searchParams: { date?: string } }) {
  const targetDate = searchParams.date ? new Date(searchParams.date) : new Date();
  targetDate.setHours(0, 0, 0, 0);
  const nextDay = new Date(targetDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const [attendances, totalEmployees] = await Promise.all([
    prisma.attendance.findMany({
      where: { date: { gte: targetDate, lt: nextDay } },
      include: { employee: { include: { department: true } } },
      orderBy: { checkIn: "asc" },
    }),
    prisma.employee.count({ where: { isActive: true } }),
  ]);

  const present = attendances.filter((a) => a.status === "PRESENTE").length;
  const late = attendances.filter((a) => a.status === "TARDANZA").length;
  const absent = attendances.filter((a) => a.status === "AUSENTE").length;

  const statusColors: Record<string, string> = { PRESENTE: "success", AUSENTE: "destructive", TARDANZA: "warning", PERMISO: "secondary", VACACION: "default", FERIADO: "outline" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><HiOutlineClock className="h-7 w-7 text-violet-600" /> Asistencia</h1>
          <p className="text-muted-foreground">Control de asistencia diaria</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><HiOutlineArrowDownTray className="h-4 w-4 mr-2" /> Exportar</Button>
          <Button><HiOutlinePlus className="h-4 w-4 mr-2" /> Registrar Asistencia</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-violet-600">{totalEmployees}</p><p className="text-xs text-muted-foreground">Total</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">{present}</p><p className="text-xs text-muted-foreground">Presentes</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-yellow-600">{late}</p><p className="text-xs text-muted-foreground">Tardanzas</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-red-600">{absent}</p><p className="text-xs text-muted-foreground">Ausentes</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-blue-600">{totalEmployees - attendances.length}</p><p className="text-xs text-muted-foreground">Sin registro</p></CardContent></Card>
      </div>

      {/* Date Filter */}
      <Card>
        <CardContent className="p-4">
          <form className="flex gap-3 items-end">
            <div className="space-y-1">
              <label className="text-sm font-medium">Fecha</label>
              <input type="date" name="date" defaultValue={targetDate.toISOString().split("T")[0]} className="h-10 rounded-md border border-input bg-background px-3 text-sm" />
            </div>
            <Button type="submit" variant="secondary">Consultar</Button>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Entrada</TableHead>
                <TableHead>Salida</TableHead>
                <TableHead>Horas</TableHead>
                <TableHead>Horas Extra</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Notas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendances.map((att) => (
                <TableRow key={att.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">{getInitials(`${att.employee.firstName} ${att.employee.lastName}`)}</AvatarFallback></Avatar>
                      <span className="font-medium">{att.employee.firstName} {att.employee.lastName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{att.employee.department?.name || "—"}</TableCell>
                  <TableCell>{att.checkIn ? new Date(att.checkIn).toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" }) : "—"}</TableCell>
                  <TableCell>{att.checkOut ? new Date(att.checkOut).toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" }) : "—"}</TableCell>
                  <TableCell>{att.hoursWorked ? `${att.hoursWorked.toFixed(1)}h` : "—"}</TableCell>
                  <TableCell>{att.overtime ? `${att.overtime.toFixed(1)}h` : "—"}</TableCell>
                  <TableCell><Badge variant={statusColors[att.status] as any}>{att.status}</Badge></TableCell>
                  <TableCell className="max-w-[150px] truncate">{att.notes || "—"}</TableCell>
                </TableRow>
              ))}
              {attendances.length === 0 && <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">No hay registros de asistencia para esta fecha</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
