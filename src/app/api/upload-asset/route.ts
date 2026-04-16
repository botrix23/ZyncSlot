import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Signed URL expiry: 10 años en segundos (prácticamente permanente)
const SIGNED_URL_EXPIRY_SECONDS = 10 * 365 * 24 * 60 * 60; // 315_360_000

const BUCKET = 'tenant-assets';

export async function POST(req: NextRequest) {
  // 1. Verificar sesión (solo admins autenticados pueden subir)
  const sessionCookie = cookies().get('zync_session');
  if (!sessionCookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let session: { tenantId?: string | null; role?: string };
  try {
    session = JSON.parse(sessionCookie.value);
  } catch {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }

  if (!session.role || !['ADMIN', 'SUPER_ADMIN'].includes(session.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 2. Extraer el archivo del FormData
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  const fileType = formData.get('type') as string | null; // 'logo' | 'cover'

  if (!file || !fileType) {
    return NextResponse.json({ error: 'Missing file or type' }, { status: 400 });
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
  }

  // Límite de 5MB
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
  }

  // 3. Determinar el nombre del archivo con el tenantId como namespace
  const tenantId = session.tenantId || 'super-admin';
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${tenantId}/${fileType}-${Date.now()}.${fileExt}`;

  // 4. Convertir File a Buffer para el upload
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 5. Subir con service_role (bypasea RLS y políticas de storage)
  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error('[upload-asset] Upload error:', uploadError);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }

  // 6. Generar signed URL de larga duración (bucket ahora es privado)
  const { data: signedData, error: signedError } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUrl(fileName, SIGNED_URL_EXPIRY_SECONDS);

  if (signedError || !signedData?.signedUrl) {
    console.error('[upload-asset] Signed URL error:', signedError);
    return NextResponse.json({ error: 'Failed to generate URL' }, { status: 500 });
  }

  return NextResponse.json({ url: signedData.signedUrl }, { status: 200 });
}
