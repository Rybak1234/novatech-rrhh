import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { HiOutlineBanknotes, HiOutlinePlus, HiOutlineCheck, HiOutlineXMark } from "react-icons/hi2";

export default async function GastosPage() {
  const expenses = await prisma.expense.findMany({
    include: { employee: true },
    orderBy: { createdAt: "desc" },
  });

  const totals = {
    total: expenses.reduce((sum, e) => sum + e.amount, 0),
    pending: expenses.filter((e) => e.status === "ENVIADO").reduce((sum, e) => sum + e.amount, 0),
    approved: expenses.filter((e) => e.status === "APROBADO" || e.status === "PAGADO").reduce((sum, e) => sum + e.amount, 0),
  };

  const statusColors: Record<string, "secondary" | "warning" | "success" | "destructive" | "default"> = {
    BORRADOR: "secondary", ENVIADO: "warning", APROBADO: "success", RECHAZADO: "destructive", PAGADO: "default",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><HiOutlineBanknotes className="h-7 w-7 text-violet-600" /> Reembolsos y Gastos</h1>
          <p className="text-muted-foreground">Gestión de gastos y reembolsos del personal</p>
        </div>
        <Button><HiOutlinePlus className="h-4 w-4 mr-2" /> Nuevo Gasto</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Gastos</p><p className="text-xl font-bold text-violet-600">{formatCurrency(totals.total)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Pendientes</p><p className="text-xl font-bold text-yellow-600">{formatCurrency(totals.pending)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Aprobados</p><p className="text-xl font-bold text-green-600">{formatCurrency(totals.approved)}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell className="font-medium">{exp.employee.firstName} {exp.employee.lastName}</TableCell>
                  <TableCell><Badge variant="outline">{exp.category}</Badge></TableCell>
                  <TableCell className="max-w-[200px] truncate">{exp.description || "—"}</TableCell>
                  <TableCell>{formatDate(exp.date)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(exp.amount)}</TableCell>
                  <TableCell><Badge variant={statusColors[exp.status]}>{exp.status}</Badge></TableCell>
                  <TableCell>
                    {exp.status === "ENVIADO" && (
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600"><HiOutlineCheck className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600"><HiOutlineXMark className="h-4 w-4" /></Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {expenses.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No hay gastos registrados</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
