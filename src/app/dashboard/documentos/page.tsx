import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { HiOutlineDocumentText, HiOutlinePlus, HiOutlineArrowDownTray, HiOutlineFolderOpen } from "react-icons/hi2";

export default async function DocumentosPage() {
  const documents = await prisma.document.findMany({
    include: { employee: true },
    orderBy: { createdAt: "desc" },
  });

  const categories = [...new Set(documents.map((d) => d.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><HiOutlineDocumentText className="h-7 w-7 text-violet-600" /> Documentos</h1>
          <p className="text-muted-foreground">Gestión documental del personal</p>
        </div>
        <Button><HiOutlinePlus className="h-4 w-4 mr-2" /> Subir Documento</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Badge key={cat} variant="outline" className="py-1 px-3">
            <HiOutlineFolderOpen className="h-3 w-3 mr-1" />
            {cat} ({documents.filter((d) => d.category === cat).length})
          </Badge>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Documento</TableHead>
                <TableHead>Empleado</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Vence</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <HiOutlineDocumentText className="h-5 w-5 text-violet-600" />
                      <span className="font-medium">{doc.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{doc.employee.firstName} {doc.employee.lastName}</TableCell>
                  <TableCell><Badge variant="outline">{doc.category}</Badge></TableCell>
                  <TableCell>{formatDate(doc.createdAt)}</TableCell>
                  <TableCell>
                    {doc.expiresAt ? (
                      <span className={new Date(doc.expiresAt) < new Date() ? "text-red-600 font-medium" : ""}>{formatDate(doc.expiresAt)}</span>
                    ) : "—"}
                  </TableCell>
                  <TableCell><Button variant="ghost" size="icon"><HiOutlineArrowDownTray className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
              {documents.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No hay documentos</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
