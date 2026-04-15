import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { HiOutlineBriefcase, HiOutlinePlus } from "react-icons/hi2";

export default async function CargosPage() {
  const positions = await prisma.position.findMany({
    include: { department: true, employees: { where: { isActive: true } } },
    orderBy: { title: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><HiOutlineBriefcase className="h-7 w-7 text-violet-600" /> Cargos</h1>
          <p className="text-muted-foreground">Gestión de cargos y posiciones</p>
        </div>
        <Button><HiOutlinePlus className="h-4 w-4 mr-2" /> Nuevo Cargo</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cargo</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Empleados</TableHead>
                <TableHead>Rango Salarial</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((pos) => (
                <TableRow key={pos.id}>
                  <TableCell className="font-medium">{pos.title}</TableCell>
                  <TableCell className="font-mono">{pos.code}</TableCell>
                  <TableCell>{pos.department?.name || "—"}</TableCell>
                  <TableCell>{pos.employees.length}</TableCell>
                  <TableCell>{pos.salaryMin && pos.salaryMax ? `${formatCurrency(pos.salaryMin)} - ${formatCurrency(pos.salaryMax)}` : "—"}</TableCell>
                  <TableCell><Badge variant={pos.isActive ? "success" : "secondary"}>{pos.isActive ? "Activo" : "Inactivo"}</Badge></TableCell>
                </TableRow>
              ))}
              {positions.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No hay cargos registrados</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
