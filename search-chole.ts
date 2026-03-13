
import { db } from './src/db/index';
import { menuItems } from './src/db/schema';
import { or, like } from 'drizzle-orm';

async function main() {
  const items = await db.select().from(menuItems).where(
    or(
      like(menuItems.name, '%Chole%'),
      like(menuItems.name, '%Kulcha%')
    )
  );
  console.log('Found items:', JSON.stringify(items, null, 2));
}

main().catch(console.error);
