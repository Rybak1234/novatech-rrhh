import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const postings = await prisma.jobPosting.findMany({
    include: { applicants: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(postings);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const posting = await prisma.jobPosting.create({
      data: {
        title: data.title,
        departmentId: data.departmentId,
        description: data.description,
        requirements: data.requirements,
        salaryMin: data.salaryMin ? parseFloat(data.salaryMin) : null,
        salaryMax: data.salaryMax ? parseFloat(data.salaryMax) : null,
        closingDate: data.closingDate ? new Date(data.closingDate) : null,
      },
    });
    return NextResponse.json(posting, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear oferta" }, { status: 500 });
  }
}
