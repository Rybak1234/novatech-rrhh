import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const leave = await prisma.leaveRequest.update({
      where: { id: params.id },
      data: {
        status: data.status,
        approvedBy: data.approvedBy,
        approvedAt: data.status === "APROBADA" || data.status === "RECHAZADA" ? new Date() : undefined,
      },
    });
    return NextResponse.json(leave);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar solicitud" }, { status: 500 });
  }
}
