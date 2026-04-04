import { db } from "../src/db";
import { bookings, tenants } from "../src/db/schema";
import { desc } from "drizzle-orm";

async function main() {
  const result = await db.query.bookings.findMany({
    limit: 5,
    with: {
        tenant: true
    },
    orderBy: [desc(bookings.createdAt)]
  });

  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
