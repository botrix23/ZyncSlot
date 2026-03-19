"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Mock login que simula la validación de credenciales y establece una cookie de sesión.
 */
import bcrypt from 'bcryptjs';

export async function loginAction(formData: FormData, locale: string) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 1. Buscar usuario en la base de datos (incluyendo join con tenant para ver status)
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    with: {
      tenant: true
    }
  });

  if (!user) {
    return { success: false, error: "Credenciales inválidas" };
  }

  // 2. Verificar que el Tenant no esté suspendido o expirado
  if (user.role === 'ADMIN' && user.tenant) {
    if (user.tenant.status === 'SUSPENDED') {
      return { success: false, error: "Tu cuenta de negocio está suspendida. Contacta a soporte." };
    }
    
    // Verificar expiración de Trial
    if (user.tenant.status === 'TRIAL' && user.tenant.subscriptionExpiresAt) {
      const now = new Date();
      if (now > user.tenant.subscriptionExpiresAt) {
        return { success: false, error: "Tu período de prueba ha expirado. Por favor, realiza el pago para continuar." };
      }
    }
  }

  // 3. Comparar contraseñas hashgeadas
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (isMatch) {
    // Establecer sesión
    cookies().set("zync_session", JSON.stringify({ 
      email: user.email, 
      role: user.role,
      tenantId: user.tenantId 
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return { success: true };
  }

  return { success: false, error: "Credenciales inválidas" };
}

import { db } from "@/db";
import { tenants, users } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Registro de nuevo negocio (Tenant) y su primer usuario Admin.
 */
export async function registerTenantAction(formData: FormData, locale: string) {
  const businessName = formData.get("businessName") as string;
  const adminName = formData.get("adminName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 0. Validaciones de Seguridad
  if (password.length < 8) {
    return { success: false, error: "La contraseña debe tener al menos 8 caracteres." };
  }
  if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
    return { success: false, error: "La contraseña debe incluir al menos una letra y un número." };
  }

  try {
    // 1. Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Crear el Tenant (Trial por defecto)
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + 14); // 14 días de prueba

    const [newTenant] = await db.insert(tenants).values({
      name: businessName,
      timezone: 'America/El_Salvador',
      status: 'TRIAL',
      subscriptionExpiresAt: expiration
    }).returning();

    // 3. Crear el Usuario Admin
    await db.insert(users).values({
      tenantId: newTenant.id,
      name: adminName,
      email: email,
      password: hashedPassword,
      role: 'ADMIN',
    });

    // 4. Establecer sesión
    cookies().set("zync_session", JSON.stringify({ 
      email, 
      role: 'ADMIN',
      tenantId: newTenant.id 
    }), {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Error al registrar el negocio. ¿El correo ya existe?" };
  }
}

/**
 * Logout: elimina la cookie y redirige.
 */
export async function logoutAction(locale: string) {
  cookies().delete("zync_session");
  redirect(`/${locale}/admin/login`);
}
