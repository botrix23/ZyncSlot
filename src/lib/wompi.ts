/**
 * Wompi El Salvador — API client
 * Docs: https://docs.wompi.sv
 *
 * Each tenant brings their own Wompi credentials (App ID + API Secret).
 * These are stored per-tenant in the DB and injected here at call time.
 */

const WOMPI_BASE_URL = 'https://api.wompi.sv';

export interface WompiCredentials {
  appId: string;
  apiSecret: string;
  isProduction: boolean;
}

export interface WompiResponse<T = unknown> {
  ok: boolean;
  status: number;
  data: T;
}

// ---------------------------------------------------------------------------
// Core fetch helper — Basic Auth (appId:apiSecret → base64)
// ---------------------------------------------------------------------------
async function wompiRequest<T = unknown>(
  credentials: WompiCredentials,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  body?: Record<string, unknown>
): Promise<WompiResponse<T>> {
  const token = Buffer.from(
    `${credentials.appId}:${credentials.apiSecret}`
  ).toString('base64');

  const res = await fetch(`${WOMPI_BASE_URL}${endpoint}`, {
    method,
    headers: {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    // Avoid caching API responses
    cache: 'no-store',
  });

  let data: T;
  try {
    data = await res.json();
  } catch {
    data = {} as T;
  }

  return { ok: res.ok, status: res.status, data };
}

// ---------------------------------------------------------------------------
// Account
// ---------------------------------------------------------------------------

/** Verify credentials — returns account info on success. */
export async function verifyWompiCredentials(credentials: WompiCredentials) {
  return wompiRequest<{
    idCuenta: string;
    nombreCuenta: string;
    nombreComercial: string;
    emailLogin: string;
    aplicativos: Array<{
      idAplicativo: string;
      nombre: string;
      estaProductivo: boolean;
      numeroCuenta: string;
    }>;
  }>(credentials, 'GET', '/Cuenta');
}

// ---------------------------------------------------------------------------
// Recurring Payment Links (Suscripciones)
// ---------------------------------------------------------------------------

export interface RecurringLinkPayload {
  /** Day of the month (1–28) on which the charge runs */
  diaDePago: number;
  /** Subscription plan name shown to the customer */
  nombre: string;
  /** Monthly charge amount in USD */
  monto: number;
  /** Description of the product or service */
  descripcionProducto: string;
}

export interface RecurringLink {
  idEnlace: string;
  urlEnlaceLargo: string;
  urlEnlace: string;
  estaProductivo: boolean;
  urlQrCodeEnlace: string;
  nombre: string;
  monto: number;
  diaDePago: number;
  descripcionProducto: string;
}

/** Create a recurring payment link (subscription plan). */
export async function createRecurringLink(
  credentials: WompiCredentials,
  payload: RecurringLinkPayload
) {
  return wompiRequest<RecurringLink>(credentials, 'POST', '/EnlacePagoRecurrente', {
    ...payload,
    idAplicativo: credentials.appId,
  });
}

/** List all recurring links for this account. */
export async function listRecurringLinks(credentials: WompiCredentials) {
  return wompiRequest<RecurringLink[]>(credentials, 'GET', '/EnlacePagoRecurrente');
}

/** Get a single recurring link by ID. */
export async function getRecurringLink(credentials: WompiCredentials, id: string) {
  return wompiRequest<RecurringLink>(credentials, 'GET', `/EnlacePagoRecurrente/${id}`);
}

/** Deactivate (pause) a recurring link. */
export async function deactivateRecurringLink(credentials: WompiCredentials, id: string) {
  return wompiRequest(credentials, 'POST', `/EnlacePagoRecurrente/${id}`);
}

/** Get all subscribers of a recurring link. */
export async function getRecurringLinkSubscribers(
  credentials: WompiCredentials,
  id: string
) {
  return wompiRequest(credentials, 'GET', `/EnlacePagoRecurrente/${id}/suscrpciones`);
}

// ---------------------------------------------------------------------------
// One-time Payment Links
// ---------------------------------------------------------------------------

export interface PaymentLinkPayload {
  nombre: string;
  monto: number;
  descripcionProducto: string;
  cantidadMaxima?: number;
}

/** Create a one-time payment link. */
export async function createPaymentLink(
  credentials: WompiCredentials,
  payload: PaymentLinkPayload
) {
  return wompiRequest(credentials, 'POST', '/EnlacePago', {
    ...payload,
    idAplicativo: credentials.appId,
  });
}
