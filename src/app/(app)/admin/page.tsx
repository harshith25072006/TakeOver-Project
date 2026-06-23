import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AdminClient } from "@/components/admin/admin-client";
import { PageHeader } from "@/components/shell/page-header";
import { getSelectedPropertyId } from "@/lib/property";
import { getAdminPropertyConfig } from "@/lib/queries/admin";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminPage() {
  const [session, propertyId] = await Promise.all([auth(), getSelectedPropertyId()]);
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");
  if (!propertyId) redirect("/select-property");

  const config = await getAdminPropertyConfig(propertyId);
  return (
    <div className="space-y-5">
      <PageHeader
        title="Admin"
        description={`Configure ${config.name}'s floor templates, floors, rooms, and beds.`}
      />
      <AdminClient config={config} />
    </div>
  );
}

