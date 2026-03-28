import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgresql://zyncslot_user:zyncslot_password@localhost:5432/zyncslot_db';

// En desarrollo, Next.js borra el caché e inicializa nuevas conexiones a cada rato.
// Esto agota rápidamente el pool de PostgreSQL. Usamos globalThis para evitarlo.
const globalForDb = globalThis as unknown as {
  client: postgres.Sql | undefined;
};

const client = globalForDb.client ?? postgres(connectionString, { max: 10 });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.client = client;
}

// Exportamos la instancia de la base de datos
export const db = drizzle(client, { schema });
