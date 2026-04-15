"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HiOutlineChartBar, HiOutlineUserGroup } from "react-icons/hi2";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area,
} from "recharts";

const attendanceData = [
  { day: "Lun", presentes: 85, ausentes: 5, tardanzas: 10 },
  { day: "Mar", presentes: 90, ausentes: 3, tardanzas: 7 },
  { day: "Mié", presentes: 88, ausentes: 4, tardanzas: 8 },
  { day: "Jue", presentes: 92, ausentes: 2, tardanzas: 6 },
  { day: "Vie", presentes: 80, ausentes: 8, tardanzas: 12 },
];

const departmentData = [
  { name: "Tecnología", empleados: 25, color: "#7c3aed" },
  { name: "Ventas", empleados: 18, color: "#2563eb" },
  { name: "RRHH", empleados: 8, color: "#059669" },
  { name: "Marketing", empleados: 12, color: "#d97706" },
  { name: "Finanzas", empleados: 10, color: "#dc2626" },
  { name: "Operaciones", empleados: 15, color: "#0891b2" },
];

const hiringTrend = [
  { month: "Ene", contrataciones: 3, salidas: 1 },
  { month: "Feb", contrataciones: 5, salidas: 2 },
  { month: "Mar", contrataciones: 2, salidas: 1 },
  { month: "Abr", contrataciones: 4, salidas: 0 },
  { month: "May", contrataciones: 6, salidas: 3 },
  { month: "Jun", contrataciones: 3, salidas: 1 },
];

const payrollTrend = [
  { month: "Ene", total: 285000, bonos: 12000 },
  { month: "Feb", total: 290000, bonos: 8000 },
  { month: "Mar", total: 295000, bonos: 15000 },
  { month: "Abr", total: 310000, bonos: 10000 },
  { month: "May", total: 315000, bonos: 18000 },
  { month: "Jun", total: 320000, bonos: 14000 },
];

const COLORS = ["#7c3aed", "#2563eb", "#059669", "#d97706", "#dc2626", "#0891b2"];

export default function DashboardCharts() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Attendance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <HiOutlineChartBar className="h-5 w-5 text-violet-600" />
            Asistencia Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="presentes" fill="#7c3aed" name="Presentes" radius={[4, 4, 0, 0]} />
              <Bar dataKey="tardanzas" fill="#f59e0b" name="Tardanzas" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ausentes" fill="#ef4444" name="Ausentes" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Department Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <HiOutlineUserGroup className="h-5 w-5 text-violet-600" />
            Distribución por Departamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={departmentData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="empleados" label={(props: any) => `${props.name ?? ""} ${((props.percent ?? 0) * 100).toFixed(0)}%`}>
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Hiring Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tendencia Contrataciones vs Salidas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hiringTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="contrataciones" stroke="#7c3aed" strokeWidth={2} name="Contrataciones" />
              <Line type="monotone" dataKey="salidas" stroke="#ef4444" strokeWidth={2} name="Salidas" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Payroll Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Evolución Planilla (BOB)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={payrollTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: any) => `Bs. ${Number(value).toLocaleString()}`} />
              <Legend />
              <Area type="monotone" dataKey="total" stackId="1" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.3} name="Total Planilla" />
              <Area type="monotone" dataKey="bonos" stackId="2" stroke="#059669" fill="#059669" fillOpacity={0.3} name="Bonos" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
