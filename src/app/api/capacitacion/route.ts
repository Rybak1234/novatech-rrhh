import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const trainings = await prisma.training.findMany({
    include: { enrollments: { include: { employee: true } } },
    orderBy: { startDate: "desc" },
  });
  return NextResponse.json(trainings);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const training = await prisma.training.create({
      data: {
        title: data.title,
        description: data.description,
        instructor: data.instructor,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        maxCapacity: data.maxCapacity ? parseInt(data.maxCapacity) : null,
        isOnline: data.isOnline || false,
        location: data.location,
      },
    });
    return NextResponse.json(training, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear capacitación" }, { status: 500 });
  }
}
