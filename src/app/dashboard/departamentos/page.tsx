import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { HiOutlineBuildingOffice, HiOutlinePlus, HiOutlinePencilSquare, HiOutlineUserGroup } from "react-icons/hi2";

export default async function DepartamentosPage() {
  const departments = await prisma.department.findMany({
    include: { employees: { where: { isActive: true } }, positions: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><HiOutlineBuildingOffice className="h-7 w-7 text-violet-600" /> Departamentos</h1>
          <p className="text-muted-foreground">Gestión de la estructura organizacional</p>
        </div>
        <Button><HiOutlinePlus className="h-4 w-4 mr-2" /> Nuevo Departamento</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept) => (
          <Card key={dept.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{dept.name}</CardTitle>
                <Badge variant={dept.isActive ? "success" : "secondary"}>{dept.isActive ? "Activo" : "Inactivo"}</Badge>
              </div>
              <p className="text-sm text-muted-foreground font-mono">{dept.code}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {dept.description && <p className="text-muted-foreground">{dept.description}</p>}
                <div className="flex justify-between"><span className="text-muted-foreground">Empleados</span><span className="font-medium flex items-center gap-1"><HiOutlineUserGroup className="h-4 w-4" /> {dept.employees.length}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Cargos</span><span className="font-medium">{dept.positions.length}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Presupuesto</span><span className="font-medium">{dept.budget ? formatCurrency(dept.budget) : "—"}</span></div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="w-full"><HiOutlinePencilSquare className="h-3 w-3 mr-1" /> Editar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {departments.length === 0 && (
          <Card className="col-span-full"><CardContent className="p-12 text-center text-muted-foreground">No hay departamentos registrados</CardContent></Card>
        )}
      </div>
    </div>
  );
}
