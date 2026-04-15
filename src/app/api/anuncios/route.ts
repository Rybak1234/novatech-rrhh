import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(announcements);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const announcement = await prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        priority: data.priority || "NORMAL",
        authorId: data.authorId,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });
    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear anuncio" }, { status: 500 });
  }
}
