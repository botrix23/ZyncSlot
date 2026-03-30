import { db } from './index';
import { tenants, branches, staff, services, products, bookings, users, staffAssignments } from './schema';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Inicializando Seed de Datos Falsos en la BD...');

  // Leer credenciales desde variables de entorno (definidas en .env.local)
  const adminName     = process.env.SEED_ADMIN_NAME     || 'Admin Demo';
  const adminEmail    = process.env.SEED_ADMIN_EMAIL    || 'admin@demo.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  const superName     = process.env.SEED_SUPER_NAME     || 'Super Admin Demo';
  const superEmail    = process.env.SEED_SUPER_EMAIL    || 'super@demo.com';
  const superPassword = process.env.SEED_SUPER_PASSWORD || 'admin123';

  if (!process.env.SEED_ADMIN_EMAIL) {
    console.warn('⚠️  SEED_ADMIN_EMAIL no definido en .env.local — usando valores demo');
  }
  
  try {
    const adminHashed = await bcrypt.hash(adminPassword, 10);
    const superHashed = await bcrypt.hash(superPassword, 10);

    // 0. Limpiar BD previa
    console.log('🧹 Limpiando base de datos anterior...');
    await db.delete(bookings);
    await db.delete(users);
    await db.delete(products);
    await db.delete(services);
    await db.delete(staff);
    await db.delete(branches);
    await db.delete(tenants);

    // 1. Crear un Tenant Base (SaaS Client)
    const [tenant] = await db.insert(tenants).values({
      name: 'ZyncSalón Spa',
      slug: 'zyncsalon-spa',
      whatsappNumber: '50370000000',  // Número WA de demo (editable en Settings)
      timezone: 'America/El_Salvador',
      status: 'ACTIVE',
    }).returning();
    
    console.log('✅ Tenant creado:', tenant.name);

    // 1.5 Crear Usuario Admin para el Tenant
    await db.insert(users).values({
      tenantId: tenant.id,
      name: adminName,
      email: adminEmail,
      password: adminHashed,
      role: 'ADMIN',
    });

    // 1.6 Crear Super Admin (Sin Tenant)
    await db.insert(users).values({
      name: superName,
      email: superEmail,
      password: superHashed,
      role: 'SUPER_ADMIN',
    });

    console.log('✅ Usuarios administrativos creados');


    // 2. Crear una Sucursal Principal para este Tenant
    const [branchMain] = await db.insert(branches).values({
      tenantId: tenant.id,
      name: 'Surcursal Zona Rosa',
      businessHours: JSON.stringify({ open: '08:00', close: '18:00' }),
    }).returning();

    console.log('✅ Sucursal creada:', branchMain.name);

    // 3. Crear Equipo de Staff en la Sucursal
    const newStaff = await db.insert(staff).values([
      { tenantId: tenant.id, branchId: branchMain.id, name: 'Ana Gomez', email: 'ana@zyncspa.com' },
      { tenantId: tenant.id, branchId: branchMain.id, name: 'Carlos Ruiz', email: 'carlos@zyncspa.com' },
    ]).returning();

    console.log(`✅ ${newStaff.length} miembros del staff creados`);

    // 4. Crear Servicios Ofrecidos por el Tenant
    const newServices = await db.insert(services).values([
      { 
        tenantId: tenant.id, 
        name: 'Corte y Lavado Spa Premium', 
        durationMinutes: 45, 
        price: '20.00', 
        includes: [
          "Lavado de cabello profundo con shampoo orgánico", 
          "Masaje estimulante del cuero cabelludo (10 min)", 
          "Corte de cabello personalizado según visagismo", 
          "Secado y peinado con secadora y cepillo", 
          "Aplicación de cera premium o pomada para el acabado",
          "Bebida de cortesía (café, té o agua)"
        ], 
        excludes: [
          "Tratamientos anticaída o para la caspa",
          "Afeitado de barba profunda con navaja libre",
          "Coloración o matizado del cabello"
        ] 
      },
      { 
        tenantId: tenant.id, 
        name: 'Matizado y Decoloración Olaplex', 
        durationMinutes: 120, 
        price: '75.00', 
        includes: [
          "Consulta inicial detallada de tono y estado del cabello", 
          "Aplicación de producto protector de hebra",
          "Decoloración global profesional (hasta nivel 9)", 
          "Matizado frío/Ice o cálido/Warm a elección", 
          "Ampolla hidratante post-coloración",
          "Secado e hidratación profunda incluida"
        ], 
        excludes: [
          "Corte de puntas o rediseño de corte", 
          "No apto si hay tratamientos previos de queratina fresca o alisados brasileños",
          "Extensiones de cabello",
          "Retoque a las 3 semanas (costo aparte)"
        ] 
      },
      { 
        tenantId: tenant.id, 
        name: 'Manicura Acrílica Luxury', 
        durationMinutes: 60, 
        price: '25.00', 
        includes: [
          "Limpieza profunda y remoción de cutícula con torno", 
          "Aplicación de tips y acrílico (largo corto a medio)", 
          "Limado asimétrico y sellado perfecto",
          "Esmaltado en gel color liso (1 o 2 tonos base)", 
          "Masaje relajante de manos con crema de almendras",
          "Aceite de cutícula finalizador al aroma de mango"
        ], 
        excludes: [
          "Retiro de acrílico o sistema de otro salón (se cobra $5 extra)", 
          "Diseños 3D, encapsulados o pedrería Swarovski",
          "Extensión extra larga de los tips",
          "Efectos especiales tipo espejo, aurora o velvet"
        ] 
      },
    ]).returning();

    console.log(`✅ ${newServices.length} servicios registrados`);

    // 4.5 Asignar staff a la sucursal (Indispensable para disponibilidad)
    await db.insert(staffAssignments).values(
      newStaff.map(s => ({
        tenantId: tenant.id,
        staffId: s.id,
        branchId: branchMain.id,
        startTime: '08:00',
        endTime: '18:00',
        daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      }))
    );
    console.log('✅ Disponibilidad de staff configurada');

    // 5. Crear Productos Físicos en Venta
    await db.insert(products).values([
      { tenantId: tenant.id, name: 'Shampoo Protección Color', price: '25.00', stock: 50 },
      { tenantId: tenant.id, name: 'Cera Moldeadora Matte', price: '12.50', stock: 35 },
    ]);

    console.log('✅ Productos registrados');

    // 6. Crear un par de reservas de prueba para hoy
    const testDate = new Date();
    testDate.setMinutes(0, 0, 0); // Limpiar a la hora exacta
    
    // Reserva 1: Hoy a las 11:00 AM (Ana Gomez)
    const start1 = new Date(testDate);
    start1.setHours(11);
    const end1 = new Date(start1);
    end1.setMinutes(45);

    // Reserva 2: Hoy a las 02:00 PM (Carlos Ruiz)
    const start2 = new Date(testDate);
    start2.setHours(14);
    const end2 = new Date(start2);
    end2.setMinutes(60);

    await db.insert(bookings).values([
      {
        tenantId: tenant.id,
        branchId: branchMain.id,
        staffId: newStaff[0].id, // Ana
        serviceId: newServices[0].id,
        customerName: 'Cliente Prueba Bloqueo',
        startTime: start1,
        endTime: end1,
        status: 'CONFIRMED'
      },
      {
        tenantId: tenant.id,
        branchId: branchMain.id,
        staffId: newStaff[1].id, // Carlos
        serviceId: newServices[2].id,
        customerName: 'Cliente Ocupado Tarde',
        startTime: start2,
        endTime: end2,
        status: 'CONFIRMED'
      }
    ]);

    console.log('✅ Reservas de prueba creadas');

    console.log('🚀 ¡Seed completado con éxito! Tienes información lista para el UI.');
  } catch (error) {
    console.error('❌ Hubo un error poblaciondo la base de datos:', error);
  } finally {
    process.exit(0);
  }
}

main();
