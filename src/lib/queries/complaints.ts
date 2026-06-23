import "server-only";

import { prisma } from "@/lib/prisma";

export async function getComplaints(propertyId: string) {
  return prisma.complaint.findMany({
    where: { propertyId },
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      createdAt: true,
      resolvedAt: true,
      assignedTo: { select: { id: true, name: true } },
      tenant: { select: { fullName: true } },
      room: { select: { number: true } },
    },
  });
}

export async function getAssignableUsers() {
  return prisma.user.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, role: true },
  });
}

export type ComplaintListItem = Awaited<ReturnType<typeof getComplaints>>[number];
export type AssignableUser = Awaited<ReturnType<typeof getAssignableUsers>>[number];
