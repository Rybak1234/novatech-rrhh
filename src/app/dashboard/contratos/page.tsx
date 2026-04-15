import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { HiOutlineClipboardDocumentCheck, HiOutlinePlus } from "react-icons/hi2";

export default async function ContratosPage() {
  const contracts = await prisma.contract.findMany({
    include: { employee: true },
    orderBy: { startDate: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><HiOutlineClipboardDocumentCheck className="h-7 w-7 text-violet-600" /> Contratos</h1>
          <p className="text-muted-foreground">Gestión de contratos laborales</p>
        </div>
        <Button><HiOutlinePlus className="h-4 w-4 mr-2" /> Nuevo Contrato</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Inicio</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead>Salario</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Descripción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.employee.firstName} {c.employee.lastName}</TableCell>
                  <TableCell><Badge variant="outline">{c.type.replace("_", " ")}</Badge></TableCell>
                  <TableCell>{formatDate(c.startDate)}</TableCell>
                  <TableCell>{c.endDate ? formatDate(c.endDate) : "Indefinido"}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(c.salary)}</TableCell>
                  <TableCell><Badge variant={c.isActive ? "success" : "secondary"}>{c.isActive ? "Vigente" : "Finalizado"}</Badge></TableCell>
                  <TableCell className="max-w-[200px] truncate">{c.description || "—"}</TableCell>
                </TableRow>
              ))}
              {contracts.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No hay contratos</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
