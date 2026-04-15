import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const applicant = await prisma.applicant.create({
      data: {
        jobPostingId: data.jobPostingId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        resumeUrl: data.resumeUrl,
        coverLetter: data.coverLetter,
      },
    });
    return NextResponse.json(applicant, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al registrar postulante" }, { status: 500 });
  }
}
