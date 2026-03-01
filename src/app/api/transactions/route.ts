import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { transactionSchema } from "@/lib/validations/transaction";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 20)));
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        orderBy: { date: "desc" },
        skip,
        take: limit,
      }),
      prisma.transaction.count(),
    ]);

    return NextResponse.json({ transactions, total, page, limit });
  } catch (error) {
    return NextResponse.json(
      { error: "Falha ao buscar transações", details: error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = transactionSchema.safeParse({
      ...body,
      date: body.date ? new Date(body.date) : undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        type: parsed.data.type,
        amount: parsed.data.amount,
        description: parsed.data.description,
        category: parsed.data.category,
        account: parsed.data.account,
        date: parsed.data.date ?? new Date(),
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Falha ao criar transação", details: error },
      { status: 500 }
    );
  }
}
