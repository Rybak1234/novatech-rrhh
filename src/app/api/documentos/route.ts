import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const documents = await prisma.document.findMany({
    include: { employee: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(documents);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const document = await prisma.document.create({
      data: {
        employeeId: data.employeeId,
        title: data.title,
        category: data.category,
        fileUrl: data.fileUrl,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al subir documento" }, { status: 500 });
  }
}
