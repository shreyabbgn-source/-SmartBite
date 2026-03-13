
import { db } from './src/db/index';
import { menuItems } from './src/db/schema';
import { eq, like } from 'drizzle-orm';

async function main() {
  console.log('Searching for Plain Rice...');
  const items = await db.select().from(menuItems).where(like(menuItems.name, '%Plain Rice%'));
  
  if (items.length === 0) {
    console.log('No item found with name Plain Rice');
    return;
  }

  console.log('Found items:', items);

  for (const item of items) {
    await db.update(menuItems)
      .set({
        imageUrl: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/afcbb218-2c8c-4be5-9ba5-b03880bd1f88/image-1767978403282.png?width=8000&height=8000&resize=contain',
        description: 'Perfectly steamed, long-grain basmati rice, light and fluffy with each grain distinct. A versatile and classic accompaniment that pairs beautifully with any curry, dal, or side dish for a wholesome and satisfying meal.'
      })
      .where(eq(menuItems.id, item.id));
    console.log(`Updated item ID: ${item.id}`);
  }
}

main().catch(console.error);
