import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const expense = await prisma.expense.update({
      where: { id: params.id },
      data: {
        status: data.status,
        approvedBy: data.approvedBy,
      },
    });
    return NextResponse.json(expense);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar gasto" }, { status: 500 });
  }
}
