"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HiOutlineArrowLeft, HiOutlineUserPlus } from "react-icons/hi2";
import { toast } from "sonner";
import Link from "next/link";

export default function NuevoEmpleadoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const res = await fetch("/api/empleados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast.success("Empleado registrado exitosamente");
      router.push("/dashboard/empleados");
      router.refresh();
    } else {
      const err = await res.json();
      toast.error(err.error || "Error al registrar empleado");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/empleados"><Button variant="ghost" size="icon"><HiOutlineArrowLeft className="h-5 w-5" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><HiOutlineUserPlus className="h-7 w-7 text-violet-600" /> Nuevo Empleado</h1>
          <p className="text-muted-foreground">Complete el formulario para registrar un nuevo empleado</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Información Personal</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="firstName">Nombre *</Label><Input id="firstName" name="firstName" required /></div>
            <div className="space-y-2"><Label htmlFor="lastName">Apellido *</Label><Input id="lastName" name="lastName" required /></div>
            <div className="space-y-2"><Label htmlFor="email">Correo Electrónico *</Label><Input id="email" name="email" type="email" required /></div>
            <div className="space-y-2"><Label htmlFor="phone">Teléfono</Label><Input id="phone" name="phone" /></div>
            <div className="space-y-2"><Label htmlFor="nationalId">CI/NIT</Label><Input id="nationalId" name="nationalId" /></div>
            <div className="space-y-2"><Label htmlFor="birthDate">Fecha de Nacimiento</Label><Input id="birthDate" name="birthDate" type="date" /></div>
            <div className="space-y-2">
              <Label>Género</Label>
              <Select name="gender"><SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger><SelectContent><SelectItem value="MASCULINO">Masculino</SelectItem><SelectItem value="FEMENINO">Femenino</SelectItem><SelectItem value="OTRO">Otro</SelectItem></SelectContent></Select>
            </div>
            <div className="space-y-2"><Label htmlFor="address">Dirección</Label><Input id="address" name="address" /></div>
            <div className="space-y-2"><Label htmlFor="city">Ciudad</Label><Input id="city" name="city" defaultValue="La Paz" /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Información Laboral</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="hireDate">Fecha de Ingreso *</Label><Input id="hireDate" name="hireDate" type="date" required defaultValue={new Date().toISOString().split("T")[0]} /></div>
            <div className="space-y-2">
              <Label>Tipo de Contrato</Label>
              <Select name="contractType" defaultValue="INDEFINIDO"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="INDEFINIDO">Indefinido</SelectItem><SelectItem value="PLAZO_FIJO">Plazo Fijo</SelectItem><SelectItem value="EVENTUAL">Eventual</SelectItem><SelectItem value="CONSULTORIA">Consultoría</SelectItem><SelectItem value="PASANTIA">Pasantía</SelectItem></SelectContent></Select>
            </div>
            <div className="space-y-2"><Label htmlFor="salary">Salario (BOB) *</Label><Input id="salary" name="salary" type="number" step="0.01" required /></div>
            <div className="space-y-2"><Label htmlFor="departmentId">Departamento</Label><Input id="departmentId" name="departmentId" placeholder="ID del departamento" /></div>
            <div className="space-y-2"><Label htmlFor="positionId">Cargo</Label><Input id="positionId" name="positionId" placeholder="ID del cargo" /></div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/dashboard/empleados"><Button variant="outline" type="button">Cancelar</Button></Link>
          <Button type="submit" disabled={loading}>{loading ? "Guardando..." : "Registrar Empleado"}</Button>
        </div>
      </form>
    </div>
  );
}
