import * as dotenv from 'dotenv';
dotenv.config();
import { db } from './src/db/index';
import { menuItems } from './src/db/schema';
import { like } from 'drizzle-orm';

async function main() {
  const results = await db.select().from(menuItems).where(like(menuItems.name, '%Spring Roll%'));
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
