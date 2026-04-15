import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const reviews = await prisma.performanceReview.findMany({
    include: { employee: true, reviewer: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const review = await prisma.performanceReview.create({
      data: {
        employeeId: data.employeeId,
        reviewerId: data.reviewerId,
        period: data.period,
        rating: parseInt(data.rating),
        strengths: data.strengths,
        improvements: data.improvements,
        comments: data.comments,
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear evaluación" }, { status: 500 });
  }
}
