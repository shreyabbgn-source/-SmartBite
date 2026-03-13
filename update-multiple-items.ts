
import { db } from './src/db/index';
import { menuItems } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('Updating Chole with Kulcha...');
  await db.update(menuItems)
    .set({
      imageUrl: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/afcbb218-2c8c-4be5-9ba5-b03880bd1f88/image-1768147832560.png?width=8000&height=8000&resize=contain',
      description: "A classic Punjabi delight featuring spicy, tangy chickpeas (chole) slow-cooked with aromatic spices, served with soft, fluffy, and buttered kulchas. A hearty and satisfying meal that's a campus favorite."
    })
    .where(eq(menuItems.id, 128));
  console.log('Updated Chole with Kulcha.');

  console.log('Updating Mango Shake...');
  await db.update(menuItems)
    .set({
      imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?q=80&w=800',
      description: "Experience the pure bliss of summer with our thick and creamy Mango Shake. Made with luscious, ripe mangoes and chilled milk, it's a refreshing tropical treat that's both satisfying and delicious."
    })
    .where(eq(menuItems.id, 9));
  console.log('Updated Mango Shake.');
}

main().catch(console.error);
