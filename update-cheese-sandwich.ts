import { db } from './src/db/index';
import { menuItems } from './src/db/schema';
import { eq, like } from 'drizzle-orm';

async function main() {
  console.log('Searching for Cheese Sandwich...');
  const items = await db.select().from(menuItems).where(like(menuItems.name, '%Cheese Sandwich%'));
  
  if (items.length === 0) {
    console.log('No item found with name Cheese Sandwich');
    return;
  }

  console.log('Found items:', JSON.stringify(items, null, 2));

  for (const item of items) {
    await db.update(menuItems)
      .set({
        imageUrl: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/afcbb218-2c8c-4be5-9ba5-b03880bd1f88/image-1767980420052.png?width=8000&height=8000&resize=contain',
        description: 'A classic comfort food featuring golden-brown, perfectly grilled bread with a generous filling of gooey, melted cheese. Simple yet irresistibly delicious, every bite delivers a satisfying crunch and a rich, buttery flavor.'
      })
      .where(eq(menuItems.id, item.id));
    console.log(`Updated item ID: ${item.id}`);
  }
}

main().catch(console.error);
