import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const expenses = await prisma.expense.findMany({
    include: { employee: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(expenses);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const expense = await prisma.expense.create({
      data: {
        employeeId: data.employeeId,
        category: data.category,
        amount: parseFloat(data.amount),
        description: data.description,
        date: new Date(data.date),
        receiptUrl: data.receiptUrl,
      },
    });
    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al registrar gasto" }, { status: 500 });
  }
}
