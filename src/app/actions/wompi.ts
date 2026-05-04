"use server";

import { db } from "@/db";
import { platformConfig } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth-session";
import { logAuditEvent } from "@/lib/audit";
import { verifyWompiCredentials } from "@/lib/wompi";

// ---------------------------------------------------------------------------
// Save Wompi credentials — super admin only, stored in platform_config
// ---------------------------------------------------------------------------
export async function saveWompiCredentialsAction(data: {
  wompiAppId: string;
  wompiApiSecret: string;
  wompiIsProduction: boolean;
}) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      return { success: false, error: "No autorizado" };
    }

    // Upsert the singleton row (id = 1)
    await db
      .insert(platformConfig)
      .values({
        id: 1,
        wompiAppId: data.wompiAppId.trim() || null,
        wompiApiSecret: data.wompiApiSecret.trim() || null,
        wompiIsProduction: data.wompiIsProduction,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: platformConfig.id,
        set: {
          wompiAppId: data.wompiAppId.trim() || null,
          wompiApiSecret: data.wompiApiSecret.trim() || null,
          wompiIsProduction: data.wompiIsProduction,
          updatedAt: new Date(),
        },
      });

    await logAuditEvent({
      action: "WOMPI_CREDENTIALS_UPDATED",
      userId: session.userId,
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
// Test Wompi credentials — calls GET /Cuenta (no DB write, anyone can test)
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
