import { cookies } from "next/headers";

export type SessionUser = {
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  tenantId?: string;
};

/**
 * Obtiene la sesión actual desde las cookies de forma segura en el servidor.
 */
export async function getSession(): Promise<SessionUser | null> {
  const sessionCookie = cookies().get("zync_session");
  if (!sessionCookie) return null;

  try {
    return JSON.parse(sessionCookie.value) as SessionUser;
  } catch (e) {
    return null;
  }
}
