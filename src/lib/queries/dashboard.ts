import "server-only";

import { prisma } from "@/lib/prisma";

/**
 * Summary counts for the dashboard cards. Only real, property-scoped counts —
 * no recent activity, financials or charts. When the property has no data these
 * are simply zero.
 */
export async function getDashboardData(propertyId: string) {
  const scope = { propertyId };
  const activeScope = { propertyId, status: "ACTIVE" as const };

  const [totalRooms, totalBeds, occupiedBeds, paidCount, pendingCount] =
    await Promise.all([
      prisma.room.count({ where: scope }),
      prisma.bed.count({ where: scope }),
      prisma.bed.count({ where: { ...scope, status: "OCCUPIED" } }),
      prisma.tenancy.count({ where: { ...activeScope, paymentStatus: "PAID" } }),
      prisma.tenancy.count({
        where: { ...activeScope, paymentStatus: { in: ["PENDING", "OVERDUE"] } },
      }),
    ]);

  return {
    totalRooms,
    totalBeds,
    occupiedBeds,
    availableBeds: totalBeds - occupiedBeds,
    paidCount,
    pendingCount,
  };
}

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;
