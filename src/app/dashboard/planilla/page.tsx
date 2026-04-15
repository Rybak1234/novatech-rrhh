import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { HiOutlineBanknotes, HiOutlinePlus, HiOutlineCalculator, HiOutlineArrowDownTray, HiOutlineCheck } from "react-icons/hi2";

export default async function PlanillaPage({ searchParams }: { searchParams: { month?: string; year?: string } }) {
  const currentMonth = searchParams.month ? parseInt(searchParams.month) : new Date().getMonth() + 1;
  const currentYear = searchParams.year ? parseInt(searchParams.year) : new Date().getFullYear();

  const payrolls = await prisma.payroll.findMany({
    where: { month: currentMonth, year: currentYear },
    include: { employee: { include: { department: true, position: true } } },
    orderBy: { employee: { lastName: "asc" } },
  });

  const totals = payrolls.reduce((acc, p) => ({
    baseSalary: acc.baseSalary + p.baseSalary,
    overtime: acc.overtime + p.overtime,
    bonuses: acc.bonuses + p.bonuses,
    deductions: acc.deductions + p.deductions,
    tax: acc.tax + p.tax,
    afp: acc.afp + p.afp,
    healthIns: acc.healthIns + p.healthIns,
    netSalary: acc.netSalary + p.netSalary,
  }), { baseSalary: 0, overtime: 0, bonuses: 0, deductions: 0, tax: 0, afp: 0, healthIns: 0, netSalary: 0 });

  const statusColors: Record<string, "secondary" | "warning" | "success" | "default"> = {
    BORRADOR: "secondary", PROCESADO: "warning", APROBADO: "success", PAGADO: "default",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><HiOutlineBanknotes className="h-7 w-7 text-violet-600" /> Planilla de Sueldos</h1>
          <p className="text-muted-foreground">Periodo: {currentMonth}/{currentYear}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><HiOutlineCalculator className="h-4 w-4 mr-2" /> Generar Planilla</Button>
          <Button variant="outline"><HiOutlineArrowDownTray className="h-4 w-4 mr-2" /> Exportar PDF</Button>
          <Button><HiOutlineCheck className="h-4 w-4 mr-2" /> Aprobar Todo</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Salario Base Total</p><p className="text-xl font-bold text-violet-600">{formatCurrency(totals.baseSalary)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Horas Extra + Bonos</p><p className="text-xl font-bold text-green-600">{formatCurrency(totals.overtime + totals.bonuses)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Descuentos Totales</p><p className="text-xl font-bold text-red-600">{formatCurrency(totals.deductions + totals.tax + totals.afp + totals.healthIns)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Líquido Pagable</p><p className="text-xl font-bold text-emerald-600">{formatCurrency(totals.netSalary)}</p></CardContent></Card>
      </div>

      {/* Period Filter */}
      <Card>
        <CardContent className="p-4">
          <form className="flex gap-3 items-end">
            <div className="space-y-1">
              <label className="text-sm font-medium">Mes</label>
              <select name="month" defaultValue={currentMonth} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
                {Array.from({ length: 12 }, (_, i) => (<option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleDateString("es-BO", { month: "long" })}</option>))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Año</label>
              <select name="year" defaultValue={currentYear} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
                {[2023, 2024, 2025, 2026].map((y) => (<option key={y} value={y}>{y}</option>))}
              </select>
            </div>
            <Button type="submit" variant="secondary">Consultar</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Depto.</TableHead>
                <TableHead className="text-right">Base</TableHead>
                <TableHead className="text-right">H. Extra</TableHead>
                <TableHead className="text-right">Bonos</TableHead>
                <TableHead className="text-right">AFP</TableHead>
                <TableHead className="text-right">RC-IVA</TableHead>
                <TableHead className="text-right">Seg. Salud</TableHead>
                <TableHead className="text-right">Desc.</TableHead>
                <TableHead className="text-right font-bold">Líquido</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrolls.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.employee.firstName} {p.employee.lastName}</TableCell>
                  <TableCell className="text-sm">{p.employee.department?.name || "—"}</TableCell>
                  <TableCell className="text-right">{formatCurrency(p.baseSalary)}</TableCell>
                  <TableCell className="text-right text-green-600">{formatCurrency(p.overtime)}</TableCell>
                  <TableCell className="text-right text-green-600">{formatCurrency(p.bonuses)}</TableCell>
                  <TableCell className="text-right text-red-600">{formatCurrency(p.afp)}</TableCell>
                  <TableCell className="text-right text-red-600">{formatCurrency(p.tax)}</TableCell>
                  <TableCell className="text-right text-red-600">{formatCurrency(p.healthIns)}</TableCell>
                  <TableCell className="text-right text-red-600">{formatCurrency(p.deductions)}</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(p.netSalary)}</TableCell>
                  <TableCell><Badge variant={statusColors[p.status] as any}>{p.status}</Badge></TableCell>
                </TableRow>
              ))}
              {payrolls.length === 0 && <TableRow><TableCell colSpan={11} className="text-center py-12 text-muted-foreground">No hay planilla generada para este periodo</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
