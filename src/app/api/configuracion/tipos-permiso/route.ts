import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const leaveType = await prisma.leaveType.create({
      data: {
        name: data.name,
        daysPerYear: parseInt(data.daysPerYear),
        isPaid: data.isPaid ?? true,
        description: data.description,
      },
    });
    return NextResponse.json(leaveType, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear tipo de permiso" }, { status: 500 });
  }
}
