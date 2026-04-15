import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const where: any = {};
  if (date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    where.date = { gte: d, lt: next };
  }
  const attendances = await prisma.attendance.findMany({ where, include: { employee: { include: { department: true } } }, orderBy: { date: "desc" } });
  return NextResponse.json(attendances);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const attendance = await prisma.attendance.create({
      data: {
        employeeId: data.employeeId,
        date: new Date(data.date),
        checkIn: data.checkIn ? new Date(data.checkIn) : null,
        checkOut: data.checkOut ? new Date(data.checkOut) : null,
        status: data.status || "PRESENTE",
        hoursWorked: data.hoursWorked ? parseFloat(data.hoursWorked) : null,
        overtime: data.overtime ? parseFloat(data.overtime) : 0,
        notes: data.notes,
      },
    });
    return NextResponse.json(attendance, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") return NextResponse.json({ error: "Ya existe registro para esta fecha" }, { status: 400 });
    return NextResponse.json({ error: "Error al registrar asistencia" }, { status: 500 });
  }
}
