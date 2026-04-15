import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const departments = await prisma.department.findMany({
    include: { employees: { where: { isActive: true } }, positions: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(departments);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const dept = await prisma.department.create({
      data: { name: data.name, code: data.code, description: data.description, budget: data.budget ? parseFloat(data.budget) : null },
    });
    return NextResponse.json(dept, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") return NextResponse.json({ error: "Nombre o código duplicado" }, { status: 400 });
    return NextResponse.json({ error: "Error al crear departamento" }, { status: 500 });
  }
}
