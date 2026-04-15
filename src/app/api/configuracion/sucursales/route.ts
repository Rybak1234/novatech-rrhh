import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const branch = await prisma.branch.create({
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        city: data.city,
        isMain: data.isMain || false,
      },
    });
    return NextResponse.json(branch, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear sucursal" }, { status: 500 });
  }
}
