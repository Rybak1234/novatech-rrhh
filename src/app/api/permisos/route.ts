import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const leaves = await prisma.leaveRequest.findMany({ include: { employee: true, leaveType: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(leaves);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const leave = await prisma.leaveRequest.create({
      data: {
        employeeId: data.employeeId,
        leaveTypeId: data.leaveTypeId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        totalDays: parseInt(data.totalDays),
        reason: data.reason,
      },
    });
    return NextResponse.json(leave, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear solicitud" }, { status: 500 });
  }
}
