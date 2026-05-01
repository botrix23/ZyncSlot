"use server";

import { db } from "@/db";
import { tenants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth-session";
import { logAuditEvent } from "@/lib/audit";
import { verifyWompiCredentials } from "@/lib/wompi";

// ---------------------------------------------------------------------------
// Save Wompi credentials for a tenant
// ---------------------------------------------------------------------------
export async function saveWompiCredentialsAction(data: {
  tenantId: string;
  wompiAppId: string;
  wompiApiSecret: string;
  wompiIsProduction: boolean;
}) {
  try {
    const session = await getSession();
    if (!session?.tenantId || session.tenantId !== data.tenantId) {
      return { success: false, error: "No autorizado" };
    }

    await db
      .update(tenants)
      .set({
        wompiAppId: data.wompiAppId.trim() || null,
        wompiApiSecret: data.wompiApiSecret.trim() || null,
        wompiIsProduction: data.wompiIsProduction,
        updatedAt: new Date(),
      })
      .where(eq(tenants.id, data.tenantId));

    await logAuditEvent({
      action: "WOMPI_CREDENTIALS_UPDATED",
      userId: session.userId,
      tenantId: data.tenantId,
      details: { isProduction: data.wompiIsProduction },
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error saving Wompi credentials:", error);
    return { success: false, error: "Error al guardar las credenciales" };
  }
}

// ---------------------------------------------------------------------------
// Test Wompi credentials — calls GET /Cuenta
// ---------------------------------------------------------------------------
export async function testWompiCredentialsAction(data: {
  wompiAppId: string;
  wompiApiSecret: string;
  wompiIsProduction: boolean;
}) {
  try {
    const result = await verifyWompiCredentials({
      appId: data.wompiAppId.trim(),
      apiSecret: data.wompiApiSecret.trim(),
      isProduction: data.wompiIsProduction,
    });

    if (result.ok) {
      return {
        success: true,
        accountName: result.data.nombreComercial || result.data.nombreCuenta,
        email: result.data.emailLogin,
        businesses: result.data.aplicativos?.map((a) => ({
          id: a.idAplicativo,
          name: a.nombre,
          isProduction: a.estaProductivo,
        })) ?? [],
      };
    } else {
      return {
        success: false,
        error: "Credenciales inválidas. Verifica tu App ID y API Secret.",
      };
    }
  } catch {
    return {
      success: false,
      error: "No se pudo conectar con Wompi. Intenta de nuevo.",
    };
  }
}
