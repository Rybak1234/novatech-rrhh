"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const salaryDistribution = [
  { range: "< 3,000", count: 5 },
  { range: "3,000-5,000", count: 15 },
  { range: "5,000-8,000", count: 25 },
  { range: "8,000-12,000", count: 18 },
  { range: "12,000-20,000", count: 10 },
  { range: "> 20,000", count: 5 },
];

const turnoverData = [
  { name: "Ene", ingresos: 3, salidas: 1 },
  { name: "Feb", ingresos: 5, salidas: 2 },
  { name: "Mar", ingresos: 2, salidas: 0 },
  { name: "Abr", ingresos: 4, salidas: 1 },
  { name: "May", ingresos: 6, salidas: 3 },
  { name: "Jun", ingresos: 3, salidas: 1 },
];

const ageDistribution = [
  { name: "18-25", value: 10, color: "#7c3aed" },
  { name: "26-35", value: 35, color: "#2563eb" },
  { name: "36-45", value: 25, color: "#059669" },
  { name: "46-55", value: 15, color: "#d97706" },
  { name: "55+", value: 5, color: "#dc2626" },
];

export default function ReportCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader><CardTitle className="text-base">Distribución Salarial (BOB)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salaryDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#7c3aed" name="Empleados" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Distribución por Edad</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={ageDistribution} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={(props: any) => `${props.name ?? ""}: ${((props.percent ?? 0) * 100).toFixed(0)}%`}>
                {ageDistribution.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader><CardTitle className="text-base">Tasa de Rotación Mensual</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={turnoverData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ingresos" fill="#059669" name="Ingresos" radius={[4, 4, 0, 0]} />
              <Bar dataKey="salidas" fill="#ef4444" name="Salidas" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
