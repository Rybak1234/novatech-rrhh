import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const employee = await prisma.employee.findUnique({
    where: { id: params.id },
    include: { department: true, position: true, emergencyContacts: true, skills: { include: { skill: true } } },
  });
  if (!employee) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(employee);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const employee = await prisma.employee.update({
      where: { id: params.id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        nationalId: data.nationalId,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        gender: data.gender,
        address: data.address,
        city: data.city,
        salary: data.salary ? parseFloat(data.salary) : undefined,
        contractType: data.contractType,
        departmentId: data.departmentId,
        positionId: data.positionId,
        isActive: data.isActive,
      },
    });
    return NextResponse.json(employee);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.employee.update({ where: { id: params.id }, data: { isActive: false, terminationDate: new Date() } });
  return NextResponse.json({ success: true });
}
