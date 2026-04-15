import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { HiOutlineChartBar, HiOutlineArrowDownTray, HiOutlineUserGroup, HiOutlineBanknotes, HiOutlineBuildingOffice } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import ReportCharts from "@/components/report-charts";

async function getReportData() {
  const [employees, departments, genderStats, contractStats, payrollTotals] = await Promise.all([
    prisma.employee.findMany({ where: { isActive: true }, include: { department: true, position: true } }),
    prisma.department.findMany({ include: { employees: { where: { isActive: true } } } }),
    prisma.employee.groupBy({ by: ["gender"], where: { isActive: true }, _count: true }),
    prisma.employee.groupBy({ by: ["contractType"], where: { isActive: true }, _count: true }),
    prisma.employee.aggregate({ where: { isActive: true }, _sum: { salary: true }, _avg: { salary: true }, _min: { salary: true }, _max: { salary: true } }),
  ]);

  return { employees, departments, genderStats, contractStats, payrollTotals };
}

export default async function ReportesPage() {
  const data = await getReportData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><HiOutlineChartBar className="h-7 w-7 text-violet-600" /> Reportes y Analíticas</h1>
          <p className="text-muted-foreground">Estadísticas generales del capital humano</p>
        </div>
        <Button variant="outline"><HiOutlineArrowDownTray className="h-4 w-4 mr-2" /> Exportar Reporte</Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground flex items-center gap-1"><HiOutlineUserGroup className="h-3 w-3" /> Total Empleados</p><p className="text-2xl font-bold text-violet-600">{data.employees.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground flex items-center gap-1"><HiOutlineBanknotes className="h-3 w-3" /> Salario Promedio</p><p className="text-2xl font-bold text-blue-600">{formatCurrency(data.payrollTotals._avg.salary || 0)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Salario Mínimo</p><p className="text-2xl font-bold text-orange-600">{formatCurrency(data.payrollTotals._min.salary || 0)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Salario Máximo</p><p className="text-2xl font-bold text-green-600">{formatCurrency(data.payrollTotals._max.salary || 0)}</p></CardContent></Card>
      </div>

      {/* Report Data */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Distribución por Género</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.genderStats.map((g) => (
                <div key={g.gender || "NULL"} className="flex items-center justify-between">
                  <span className="text-sm">{g.gender || "No especificado"}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-600 rounded-full" style={{ width: `${(g._count / data.employees.length) * 100}%` }} />
                    </div>
                    <span className="text-sm font-medium">{g._count} ({((g._count / data.employees.length) * 100).toFixed(0)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Distribución por Tipo de Contrato</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.contractStats.map((c) => (
                <div key={c.contractType} className="flex items-center justify-between">
                  <span className="text-sm">{c.contractType.replace("_", " ")}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(c._count / data.employees.length) * 100}%` }} />
                    </div>
                    <span className="text-sm font-medium">{c._count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><HiOutlineBuildingOffice className="h-4 w-4" /> Empleados por Departamento</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.departments.map((dept) => (
                <div key={dept.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
                  <p className="text-2xl font-bold text-violet-600">{dept.employees.length}</p>
                  <p className="text-sm text-muted-foreground">{dept.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <ReportCharts />
    </div>
  );
}
