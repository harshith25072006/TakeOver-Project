import "server-only";

import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

export const PROPERTY_COOKIE = "triya.property";

/** The currently selected property id from the cookie (no validation). */
export async function getSelectedPropertyId(): Promise<string | null> {
  const store = await cookies();
  return store.get(PROPERTY_COOKIE)?.value ?? null;
}

/** The selected, active property record, or null if none/invalid. */
export async function getActiveProperty() {
  const id = await getSelectedPropertyId();
  if (!id) return null;
  return prisma.property.findFirst({ where: { id, isActive: true } });
}

/** Like getActiveProperty but throws — for pages that are always inside a property. */
export async function requireActiveProperty() {
  const property = await getActiveProperty();
  if (!property) {
    throw new Error("No active property selected");
  }
  return property;
}

/** All active properties, for the switcher and selection screen. */
export async function listProperties() {
  return prisma.property.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true, city: true, hasBlocks: true },
  });
}
