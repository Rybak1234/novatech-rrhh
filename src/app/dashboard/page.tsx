import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  HiOutlineUserGroup,
  HiOutlineBuildingOffice,
  HiOutlineClock,
  HiOutlineCalendarDays,
  HiOutlineBanknotes,
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineUserPlus,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";
import DashboardCharts from "@/components/dashboard-charts";

async function getStats() {
  const [employeeCount, departmentCount, pendingLeaves, activeJobs, recentEmployees, announcements] = await Promise.all([
    prisma.employee.count({ where: { isActive: true } }),
    prisma.department.count({ where: { isActive: true } }),
    prisma.leaveRequest.count({ where: { status: "PENDIENTE" } }),
    prisma.jobPosting.count({ where: { status: "ABIERTA" } }),
    prisma.employee.findMany({ where: { isActive: true }, orderBy: { hireDate: "desc" }, take: 5, include: { department: true, position: true } }),
    prisma.announcement.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" }, take: 3 }),
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const attendanceToday = await prisma.attendance.count({ where: { date: { gte: today } } });

  const totalPayroll = await prisma.employee.aggregate({ where: { isActive: true }, _sum: { salary: true } });

  return { employeeCount, departmentCount, pendingLeaves, activeJobs, recentEmployees, announcements, attendanceToday, totalPayroll: totalPayroll._sum.salary || 0 };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const statCards = [
    { title: "Total Empleados", value: stats.employeeCount, icon: HiOutlineUserGroup, color: "text-violet-600", bg: "bg-violet-50", change: "+3 este mes" },
    { title: "Departamentos", value: stats.departmentCount, icon: HiOutlineBuildingOffice, color: "text-blue-600", bg: "bg-blue-50", change: "Activos" },
    { title: "Asistencia Hoy", value: stats.attendanceToday, icon: HiOutlineClock, color: "text-green-600", bg: "bg-green-50", change: `de ${stats.employeeCount}` },
    { title: "Permisos Pendientes", value: stats.pendingLeaves, icon: HiOutlineCalendarDays, color: "text-orange-600", bg: "bg-orange-50", change: "Por aprobar" },
    { title: "Planilla Mensual", value: formatCurrency(stats.totalPayroll), icon: HiOutlineBanknotes, color: "text-emerald-600", bg: "bg-emerald-50", change: "Total bruto" },
    { title: "Vacantes Abiertas", value: stats.activeJobs, icon: HiOutlineUserPlus, color: "text-pink-600", bg: "bg-pink-50", change: "En proceso" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general del sistema de Recursos Humanos</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <div className={`h-12 w-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <DashboardCharts />

      {/* Recent Employees & Announcements */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <HiOutlineUserPlus className="h-5 w-5 text-violet-600" />
              Contrataciones Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentEmployees.map((emp) => (
                <div key={emp.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{emp.firstName} {emp.lastName}</p>
                    <p className="text-sm text-muted-foreground">{emp.position?.title || "Sin cargo"} - {emp.department?.name || "Sin depto."}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{formatDate(emp.hireDate)}</p>
                    <Badge variant="success" className="text-[10px]">Nuevo</Badge>
                  </div>
                </div>
              ))}
              {stats.recentEmployees.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No hay empleados registrados</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <HiOutlineDocumentText className="h-5 w-5 text-violet-600" />
              Anuncios Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.announcements.map((ann) => (
                <div key={ann.id} className="border-b pb-3 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">{ann.title}</p>
                    <Badge variant={ann.priority === "URGENTE" ? "destructive" : ann.priority === "ALTA" ? "warning" : "secondary"}>
                      {ann.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{ann.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatDate(ann.createdAt)}</p>
                </div>
              ))}
              {stats.announcements.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No hay anuncios</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
