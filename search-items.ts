
import { db } from './src/db/index';
import { menuItems } from './src/db/schema';
import { eq, or, like } from 'drizzle-orm';

async function main() {
  console.log('Searching for Chole with Kulcha and Mango Shake...');
  const items = await db.select().from(menuItems).where(
    or(
      like(menuItems.name, '%Chole%Kulcha%'),
      like(menuItems.name, '%Mango Shake%')
    )
  );
  
  console.log('Found items:', JSON.stringify(items, null, 2));
}

main().catch(console.error);
