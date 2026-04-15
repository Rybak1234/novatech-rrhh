import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const enrollment = await prisma.trainingEnrollment.create({
      data: {
        trainingId: data.trainingId,
        employeeId: data.employeeId,
      },
    });
    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al inscribir empleado" }, { status: 500 });
  }
}
