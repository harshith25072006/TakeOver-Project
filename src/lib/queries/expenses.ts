import "server-only";

import { format, startOfMonth, subMonths } from "date-fns";

import { prisma } from "@/lib/prisma";

export async function getExpenses(propertyId: string) {
  return prisma.expense.findMany({
    where: { propertyId },
    orderBy: { date: "desc" },
    select: {
      id: true,
      category: true,
      amount: true,
      date: true,
      vendor: true,
      notes: true,
      receiptKey: true,
    },
  });
}

export async function getExpenseStats(propertyId: string) {
  const now = new Date();
  const since = startOfMonth(subMonths(now, 5));

  const rows = await prisma.expense.findMany({
    where: { propertyId, date: { gte: since } },
    select: { amount: true, date: true, category: true },
  });

  const series = Array.from({ length: 6 }, (_, i) => {
    const m = subMonths(now, 5 - i);
    return { key: format(m, "yyyy-MM"), label: format(m, "MMM"), total: 0 };
  });
  const byKey = new Map(series.map((s) => [s.key, s]));

  const thisKey = format(now, "yyyy-MM");
  let thisMonthTotal = 0;
  let thisMonthCount = 0;
  const categoryTotals = new Map<string, number>();

  for (const row of rows) {
    const key = format(row.date, "yyyy-MM");
    const bucket = byKey.get(key);
    if (bucket) bucket.total += row.amount;
    if (key === thisKey) {
      thisMonthTotal += row.amount;
      thisMonthCount += 1;
      categoryTotals.set(row.category, (categoryTotals.get(row.category) ?? 0) + row.amount);
    }
  }

  const byCategory = [...categoryTotals.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  return {
    series: series.map(({ label, total }) => ({ label, total })),
    thisMonthTotal,
    thisMonthCount,
    byCategory,
  };
}

export type ExpenseListItem = Awaited<ReturnType<typeof getExpenses>>[number];
export type ExpenseStats = Awaited<ReturnType<typeof getExpenseStats>>;
