import { db } from '../src/db';
import { staff, branches, staffAssignments, tenants } from '../src/db/schema';
import { eq } from 'drizzle-orm';

async function fix() {
  console.log('🔍 Buscando staff y sucursales para reparar disponibilidad...');
  
  const allStaff = await db.select().from(staff);
  const allBranches = await db.select().from(branches);
  
  if (allStaff.length === 0 || allBranches.length === 0) {
    console.log('⚠️ No se encontró staff o sucursales. Abortando.');
    return;
  }

  for (const s of allStaff) {
    // Verificar si ya tiene asignaciones
    const existing = await db.query.staffAssignments.findFirst({
      where: eq(staffAssignments.staffId, s.id)
    });

    if (!existing) {
      console.log(`➕ Creando asignación para ${s.name}...`);
      await db.insert(staffAssignments).values({
        tenantId: s.tenantId,
        staffId: s.id,
        branchId: s.branchId, // Usamos la branchId que ya tiene el staff
        startTime: '08:00',
        endTime: '18:00',
        daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      });
    } else {
      console.log(`✅ ${s.name} ya tiene disponibilidad configurada.`);
    }
  }

  console.log('🚀 ¡Reparación completada!');
  process.exit(0);
}

fix().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
