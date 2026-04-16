-- ============================================================
-- MIGRACIÓN DE SEGURIDAD: Bucket privado + Storage RLS
-- ============================================================
-- Propósito: Resolver el warning "Public Bucket Allows Listing"
-- haciendo el bucket tenant-assets PRIVADO y controlando el
-- acceso mediante políticas de Storage:
--   - Nadie puede listar (enumeración bloqueada)
--   - Archivos existentes siguen accesibles (signed URLs)
--   - Solo el servidor (service_role) puede subir/borrar
-- ============================================================

-- 1. Hacer el bucket privado (elimina la URL /public/ y detiene el listing)
UPDATE storage.buckets
SET public = false
WHERE id = 'tenant-assets';

-- 2. Eliminar políticas anteriores demasiado permisivas (si existen)
DROP POLICY IF EXISTS "Allow public access" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;

-- 3. Política de LECTURA: Solo el service_role puede descargar directamente
--    (Los usuarios ven las imágenes mediante signed URLs generadas por el servidor)
CREATE POLICY "tenant_assets_select_service_role"
ON storage.objects FOR SELECT
TO service_role
USING (bucket_id = 'tenant-assets');

-- 4. Política de ESCRITURA: Solo el service_role puede subir archivos
--    (Los uploads van a través del API Route /api/upload-asset)
CREATE POLICY "tenant_assets_insert_service_role"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'tenant-assets');

-- 5. Política de ELIMINACIÓN: Solo el service_role puede borrar
CREATE POLICY "tenant_assets_delete_service_role"
ON storage.objects FOR DELETE
TO service_role
USING (bucket_id = 'tenant-assets');

-- 6. Política de ACTUALIZACIÓN: Solo el service_role puede actualizar metadatos
CREATE POLICY "tenant_assets_update_service_role"
ON storage.objects FOR UPDATE
TO service_role
USING (bucket_id = 'tenant-assets');

-- ============================================================
-- RESULTADO ESPERADO:
-- ✅ Warning "Public Bucket Allows Listing" → RESUELTO
-- ✅ Archivos accesibles mediante signed URLs (10 años de expiry)
-- ✅ Subida de archivos solo vía /api/upload-asset (sesión requerida)
-- ✅ La anon key NO puede listar, subir ni eliminar archivos
-- ============================================================
