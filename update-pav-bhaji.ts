
import { db } from './src/db/index';
import { menuItems } from './src/db/schema';
import { eq, like } from 'drizzle-orm';

async function main() {
  console.log('Searching for Pav Bhaji...');
  const items = await db.select().from(menuItems).where(like(menuItems.name, '%Pav Bhaji%'));
  
  if (items.length === 0) {
    console.log('No item found with name Pav Bhaji');
    return;
  }

  console.log('Found items:', items);

  for (const item of items) {
    await db.update(menuItems)
      .set({
        imageUrl: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/afcbb218-2c8c-4be5-9ba5-b03880bd1f88/image-1768160829831.png?width=8000&height=8000&resize=contain',
        description: 'An iconic Mumbai street food favorite featuring a thick, spicy vegetable mash (bhaji) cooked with a special blend of spices and topped with a generous dollop of butter. Served with soft, butter-toasted bread rolls (pav), fresh onions, and a squeeze of lemon for the ultimate comfort food experience.'
      })
      .where(eq(menuItems.id, item.id));
    console.log(`Updated item ID: ${item.id}`);
  }
}

main().catch(console.error);
