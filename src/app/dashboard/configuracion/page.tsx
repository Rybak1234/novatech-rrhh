import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  HiOutlineCog6Tooth, HiOutlineBuildingOffice, HiOutlineBell,
  HiOutlinePaintBrush, HiOutlineShieldCheck, HiOutlineGlobeAlt,
} from "react-icons/hi2";

export default async function ConfiguracionPage() {
  const [settings, branches, leaveTypes, activityLogs] = await Promise.all([
    prisma.companySettings.findFirst(),
    prisma.branch.findMany({ orderBy: { name: "asc" } }),
    prisma.leaveType.findMany(),
    prisma.activityLog.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: 20 }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><HiOutlineCog6Tooth className="h-7 w-7 text-violet-600" /> Configuración</h1>
        <p className="text-muted-foreground">Configuración general del sistema</p>
      </div>

      <Tabs defaultValue="company">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="company">Empresa</TabsTrigger>
          <TabsTrigger value="branches">Sucursales</TabsTrigger>
          <TabsTrigger value="leaves">Tipos Permiso</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="audit">Auditoría</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><HiOutlineBuildingOffice className="h-5 w-5" /> Datos de la Empresa</CardTitle></CardHeader>
            <CardContent>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Nombre de la Empresa</Label><Input defaultValue={settings?.companyName || "NovaTech Bolivia"} /></div>
                <div className="space-y-2"><Label>NIT</Label><Input defaultValue={settings?.taxId || ""} /></div>
                <div className="space-y-2"><Label>Email</Label><Input defaultValue={settings?.email || ""} type="email" /></div>
                <div className="space-y-2"><Label>Teléfono</Label><Input defaultValue={settings?.phone || ""} /></div>
                <div className="space-y-2"><Label>Sitio Web</Label><Input defaultValue={settings?.website || ""} /></div>
                <div className="space-y-2"><Label>Dirección</Label><Input defaultValue={settings?.address || ""} /></div>
                <div className="space-y-2"><Label>Moneda</Label><Input defaultValue={settings?.currency || "BOB"} /></div>
                <div className="space-y-2"><Label>Zona Horaria</Label><Input defaultValue={settings?.timezone || "America/La_Paz"} /></div>
                <div className="space-y-2"><Label>Hora Entrada</Label><Input defaultValue={settings?.workHoursStart || "08:00"} type="time" /></div>
                <div className="space-y-2"><Label>Hora Salida</Label><Input defaultValue={settings?.workHoursEnd || "18:00"} type="time" /></div>
                <div className="md:col-span-2 flex justify-end"><Button type="button">Guardar Cambios</Button></div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branches">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Sucursales</CardTitle>
              <Button size="sm">Agregar Sucursal</Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead>Ciudad</TableHead><TableHead>Dirección</TableHead><TableHead>Teléfono</TableHead><TableHead>Principal</TableHead><TableHead>Estado</TableHead></TableRow></TableHeader>
                <TableBody>
                  {branches.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.name}</TableCell>
                      <TableCell>{b.city || "—"}</TableCell>
                      <TableCell>{b.address || "—"}</TableCell>
                      <TableCell>{b.phone || "—"}</TableCell>
                      <TableCell>{b.isMain ? <Badge variant="success">Principal</Badge> : "—"}</TableCell>
                      <TableCell><Badge variant={b.isActive ? "success" : "secondary"}>{b.isActive ? "Activa" : "Inactiva"}</Badge></TableCell>
                    </TableRow>
                  ))}
                  {branches.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No hay sucursales</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaves">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Tipos de Permisos</CardTitle>
              <Button size="sm">Agregar Tipo</Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Tipo</TableHead><TableHead>Días/Año</TableHead><TableHead>Pagado</TableHead><TableHead>Descripción</TableHead></TableRow></TableHeader>
                <TableBody>
                  {leaveTypes.map((lt) => (
                    <TableRow key={lt.id}>
                      <TableCell className="font-medium">{lt.name}</TableCell>
                      <TableCell>{lt.daysPerYear}</TableCell>
                      <TableCell>{lt.isPaid ? <Badge variant="success">Sí</Badge> : <Badge variant="secondary">No</Badge>}</TableCell>
                      <TableCell>{lt.description || "—"}</TableCell>
                    </TableRow>
                  ))}
                  {leaveTypes.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No hay tipos de permisos configurados</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><HiOutlineBell className="h-5 w-5" /> Preferencias de Notificación</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                "Nuevas solicitudes de permiso", "Cumpleaños de empleados", "Vencimiento de contratos",
                "Vencimiento de documentos", "Nuevas postulaciones", "Evaluaciones pendientes",
                "Aprobación de gastos", "Aniversarios laborales",
              ].map((item) => (
                <div key={item} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <span className="text-sm">{item}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-violet-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><HiOutlineShieldCheck className="h-5 w-5" /> Registro de Auditoría</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Usuario</TableHead><TableHead>Acción</TableHead><TableHead>Entidad</TableHead><TableHead>Detalles</TableHead><TableHead>Fecha</TableHead></TableRow></TableHeader>
                <TableBody>
                  {activityLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.user.name}</TableCell>
                      <TableCell><Badge variant="outline">{log.action}</Badge></TableCell>
                      <TableCell>{log.entity}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{log.details || "—"}</TableCell>
                      <TableCell className="text-sm">{new Date(log.createdAt).toLocaleString("es-BO")}</TableCell>
                    </TableRow>
                  ))}
                  {activityLogs.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No hay registros de auditoría</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
