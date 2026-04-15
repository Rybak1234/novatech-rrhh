import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const positions = await prisma.position.findMany({ include: { department: true }, orderBy: { title: "asc" } });
  return NextResponse.json(positions);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const position = await prisma.position.create({
      data: { title: data.title, code: data.code, description: data.description, salaryMin: data.salaryMin ? parseFloat(data.salaryMin) : null, salaryMax: data.salaryMax ? parseFloat(data.salaryMax) : null, departmentId: data.departmentId },
    });
    return NextResponse.json(position, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") return NextResponse.json({ error: "Código duplicado" }, { status: 400 });
    return NextResponse.json({ error: "Error al crear cargo" }, { status: 500 });
  }
}
