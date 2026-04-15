import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const assets = await prisma.asset.findMany({
    include: { employee: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(assets);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const asset = await prisma.asset.create({
      data: {
        name: data.name,
        code: data.code,
        category: data.category,
        description: data.description,
        value: data.value ? parseFloat(data.value) : null,
        condition: data.condition || "BUENO",
        assignedTo: data.assignedTo || null,
      },
    });
    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al registrar activo" }, { status: 500 });
  }
}
