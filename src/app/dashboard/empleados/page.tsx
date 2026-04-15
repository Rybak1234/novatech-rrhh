import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import { HiOutlineUserGroup, HiOutlinePlus, HiOutlineMagnifyingGlass, HiOutlinePencilSquare, HiOutlineEye, HiOutlineFunnel, HiOutlineArrowDownTray } from "react-icons/hi2";
import Link from "next/link";

export default async function EmpleadosPage({ searchParams }: { searchParams: { q?: string; dept?: string; status?: string } }) {
  const where: any = {};
  if (searchParams.q) {
    where.OR = [
      { firstName: { contains: searchParams.q, mode: "insensitive" } },
      { lastName: { contains: searchParams.q, mode: "insensitive" } },
      { email: { contains: searchParams.q, mode: "insensitive" } },
      { employeeCode: { contains: searchParams.q, mode: "insensitive" } },
    ];
  }
  if (searchParams.dept) where.departmentId = searchParams.dept;
  if (searchParams.status === "active") where.isActive = true;
  if (searchParams.status === "inactive") where.isActive = false;

  const [employees, departments, totalActive, totalInactive] = await Promise.all([
    prisma.employee.findMany({ where, include: { department: true, position: true }, orderBy: { createdAt: "desc" } }),
    prisma.department.findMany({ where: { isActive: true } }),
    prisma.employee.count({ where: { isActive: true } }),
    prisma.employee.count({ where: { isActive: false } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <HiOutlineUserGroup className="h-7 w-7 text-violet-600" />
            Empleados
          </h1>
          <p className="text-muted-foreground">Gestión del directorio de empleados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <HiOutlineArrowDownTray className="h-4 w-4 mr-2" /> Exportar CSV
          </Button>
          <Link href="/dashboard/empleados/nuevo">
            <Button><HiOutlinePlus className="h-4 w-4 mr-2" /> Nuevo Empleado</Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-violet-600">{totalActive + totalInactive}</p><p className="text-xs text-muted-foreground">Total</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">{totalActive}</p><p className="text-xs text-muted-foreground">Activos</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-red-600">{totalInactive}</p><p className="text-xs text-muted-foreground">Inactivos</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-blue-600">{departments.length}</p><p className="text-xs text-muted-foreground">Departamentos</p></CardContent></Card>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="p-4">
          <form className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input name="q" placeholder="Buscar por nombre, email, código..." className="pl-10" defaultValue={searchParams.q} />
            </div>
            <select name="dept" className="h-10 rounded-md border border-input bg-background px-3 text-sm" defaultValue={searchParams.dept}>
              <option value="">Todos los departamentos</option>
              {departments.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
            </select>
            <select name="status" className="h-10 rounded-md border border-input bg-background px-3 text-sm" defaultValue={searchParams.status}>
              <option value="">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
            <Button type="submit" variant="secondary"><HiOutlineFunnel className="h-4 w-4 mr-1" /> Filtrar</Button>
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
                <TableHead>Código</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Contrato</TableHead>
                <TableHead>Salario</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{getInitials(`${emp.firstName} ${emp.lastName}`)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{emp.firstName} {emp.lastName}</p>
                        <p className="text-xs text-muted-foreground">{emp.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{emp.employeeCode}</TableCell>
                  <TableCell>{emp.department?.name || "—"}</TableCell>
                  <TableCell>{emp.position?.title || "—"}</TableCell>
                  <TableCell><Badge variant="outline">{emp.contractType.replace("_", " ")}</Badge></TableCell>
                  <TableCell className="font-medium">{formatCurrency(emp.salary)}</TableCell>
                  <TableCell>
                    <Badge variant={emp.isActive ? "success" : "destructive"}>{emp.isActive ? "Activo" : "Inactivo"}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Link href={`/dashboard/empleados/${emp.id}`}>
                        <Button variant="ghost" size="icon"><HiOutlineEye className="h-4 w-4" /></Button>
                      </Link>
                      <Link href={`/dashboard/empleados/${emp.id}/editar`}>
                        <Button variant="ghost" size="icon"><HiOutlinePencilSquare className="h-4 w-4" /></Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {employees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    No se encontraron empleados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
