import { getSession } from "@/lib/auth-session";
import { db } from "@/db";
import { platformConfig } from "@/db/schema";
import { redirect } from "next/navigation";
import PaymentsClient from "./PaymentsClient";

export default async function SuperPaymentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();

  if (!session || session.role !== "SUPER_ADMIN") {
    redirect(`/${locale}/admin/login`);
  }

  // Fetch the singleton platform config row (id = 1)
  const config = await db
    .select()
    .from(platformConfig)
    .limit(1)
    .then((rows) => rows[0] ?? null);

  return (
    <PaymentsClient
      config={
        config ?? {
          wompiAppId: null,
          wompiApiSecret: null,
          wompiIsProduction: false,
        }
      }
    />
  );
}
