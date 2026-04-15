import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateEmployeeCode } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const dept = searchParams.get("dept");

  const where: any = {};
  if (q) {
    where.OR = [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }
  if (dept) where.departmentId = dept;

  const employees = await prisma.employee.findMany({
    where,
    include: { department: true, position: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(employees);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const count = await prisma.employee.count();
    const employeeCode = generateEmployeeCode(count + 1);

    const employee = await prisma.employee.create({
      data: {
        employeeCode,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || null,
        nationalId: data.nationalId || null,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        gender: data.gender || null,
        address: data.address || null,
        city: data.city || null,
        hireDate: data.hireDate ? new Date(data.hireDate) : new Date(),
        contractType: data.contractType || "INDEFINIDO",
        salary: parseFloat(data.salary) || 0,
        departmentId: data.departmentId || null,
        positionId: data.positionId || null,
      },
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "El email o CI ya está registrado" }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al crear empleado" }, { status: 500 });
  }
}
