import { redirect } from "next/navigation";

// Esta ruta ya no existe para los tenants.
// La configuración de Wompi es exclusiva del super admin.
export default async function PaymentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/admin`);
}
