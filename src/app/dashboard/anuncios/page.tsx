import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { HiOutlineMegaphone, HiOutlinePlus } from "react-icons/hi2";

export default async function AnunciosPage() {
  const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: "desc" } });

  const priorityColors: Record<string, "secondary" | "default" | "warning" | "destructive"> = {
    BAJA: "secondary", NORMAL: "default", ALTA: "warning", URGENTE: "destructive",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><HiOutlineMegaphone className="h-7 w-7 text-violet-600" /> Anuncios</h1>
          <p className="text-muted-foreground">Comunicaciones internas de la empresa</p>
        </div>
        <Button><HiOutlinePlus className="h-4 w-4 mr-2" /> Nuevo Anuncio</Button>
      </div>

      <div className="grid gap-4">
        {announcements.map((ann) => (
          <Card key={ann.id} className={`${!ann.isActive ? "opacity-60" : ""}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{ann.title}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant={priorityColors[ann.priority]}>{ann.priority}</Badge>
                  {!ann.isActive && <Badge variant="secondary">Inactivo</Badge>}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{formatDate(ann.createdAt)} {ann.expiresAt && `· Expira: ${formatDate(ann.expiresAt)}`}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{ann.content}</p>
            </CardContent>
          </Card>
        ))}
        {announcements.length === 0 && (
          <Card><CardContent className="p-12 text-center text-muted-foreground">No hay anuncios publicados</CardContent></Card>
        )}
      </div>
    </div>
  );
}
