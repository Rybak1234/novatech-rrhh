import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  const where: any = {};
  if (month && year) {
    where.month = parseInt(month);
    where.year = parseInt(year);
  }

  const payrolls = await prisma.payroll.findMany({
    where,
    include: { employee: true, items: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(payrolls);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const employees = await prisma.employee.findMany({
      where: { isActive: true },
      include: { position: true },
    });

    const period = `${data.year}-${String(data.month).padStart(2, "0")}`;
    const payrolls = [];

    for (const emp of employees) {
      const baseSalary = emp.salary || 0;
      const afp = baseSalary * 0.1271;
      const healthIns = baseSalary * 0.10;
      const tax = Math.max((baseSalary - afp - 2000) * 0.13, 0);
      const deductions = afp + healthIns + tax;
      const netSalary = baseSalary - deductions;

      const payroll = await prisma.payroll.create({
        data: {
          employeeId: emp.id,
          period,
          month: data.month,
          year: data.year,
          baseSalary,
          overtime: 0,
          bonuses: 0,
          deductions,
          tax,
          afp,
          healthIns,
          netSalary,
          items: {
            create: [
              { concept: "Salario Base", type: "INGRESO", amount: baseSalary },
              { concept: "AFP", type: "DESCUENTO", amount: afp },
              { concept: "Seguro de Salud", type: "DESCUENTO", amount: healthIns },
              { concept: "RC-IVA", type: "DESCUENTO", amount: tax },
            ],
          },
        },
      });
      payrolls.push(payroll);
    }

    return NextResponse.json(payrolls, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al generar planilla" }, { status: 500 });
  }
}
