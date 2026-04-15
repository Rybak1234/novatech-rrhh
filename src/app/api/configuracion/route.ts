import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.companySettings.findFirst();
  const branches = await prisma.branch.findMany({ orderBy: { name: "asc" } });
  const leaveTypes = await prisma.leaveType.findMany({ orderBy: { name: "asc" } });
  const logs = await prisma.activityLog.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ settings, branches, leaveTypes, logs });
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const existing = await prisma.companySettings.findFirst();
    let settings;
    if (existing) {
      settings = await prisma.companySettings.update({
        where: { id: existing.id },
        data: {
          companyName: data.companyName,
          taxId: data.taxId,
          address: data.address,
          phone: data.phone,
          email: data.email,
          logo: data.logo,
          workHoursStart: data.workHoursStart,
          workHoursEnd: data.workHoursEnd,
          currency: data.currency || "BOB",
        },
      });
    } else {
      settings = await prisma.companySettings.create({
        data: {
          companyName: data.companyName || "NovaTech Bolivia",
          taxId: data.taxId,
          address: data.address,
          phone: data.phone,
          email: data.email,
          workHoursStart: data.workHoursStart || "08:00",
          workHoursEnd: data.workHoursEnd || "18:00",
          currency: "BOB",
        },
      });
    }
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar configuración" }, { status: 500 });
  }
}
