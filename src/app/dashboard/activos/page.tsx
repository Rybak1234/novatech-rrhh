import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { HiOutlineCpuChip, HiOutlinePlus } from "react-icons/hi2";

export default async function ActivosPage() {
  const assets = await prisma.asset.findMany({
    include: { employee: true },
    orderBy: { createdAt: "desc" },
  });

  const conditionColors: Record<string, "success" | "warning" | "destructive"> = { BUENO: "success", REGULAR: "warning", MALO: "destructive" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><HiOutlineCpuChip className="h-7 w-7 text-violet-600" /> Activos de la Empresa</h1>
          <p className="text-muted-foreground">Control de equipos y activos asignados</p>
        </div>
        <Button><HiOutlinePlus className="h-4 w-4 mr-2" /> Nuevo Activo</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-violet-600">{assets.length}</p><p className="text-xs text-muted-foreground">Total Activos</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-blue-600">{assets.filter((a) => a.assignedTo).length}</p><p className="text-xs text-muted-foreground">Asignados</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">{assets.filter((a) => a.condition === "BUENO").length}</p><p className="text-xs text-muted-foreground">Buen Estado</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-emerald-600">{formatCurrency(assets.reduce((s, a) => s + (a.value || 0), 0))}</p><p className="text-xs text-muted-foreground">Valor Total</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activo</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Asignado a</TableHead>
                <TableHead>Condición</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell className="font-mono text-sm">{asset.code}</TableCell>
                  <TableCell><Badge variant="outline">{asset.category}</Badge></TableCell>
                  <TableCell>{asset.employee ? `${asset.employee.firstName} ${asset.employee.lastName}` : <span className="text-muted-foreground">Sin asignar</span>}</TableCell>
                  <TableCell><Badge variant={conditionColors[asset.condition]}>{asset.condition}</Badge></TableCell>
                  <TableCell className="text-right font-medium">{asset.value ? formatCurrency(asset.value) : "—"}</TableCell>
                </TableRow>
              ))}
              {assets.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No hay activos registrados</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
