import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const contracts = await prisma.contract.findMany({
    include: { employee: true },
    orderBy: { startDate: "desc" },
  });
  return NextResponse.json(contracts);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const contract = await prisma.contract.create({
      data: {
        employeeId: data.employeeId,
        type: data.type,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        salary: parseFloat(data.salary),
        description: data.description,
      },
    });
    return NextResponse.json(contract, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear contrato" }, { status: 500 });
  }
}
