import 'dotenv/config';
import { db } from './src/db';
import { menuItems } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const items = [
    {
      name: 'Paneer Chilli',
      category: 'Chinese Starter',
      price: 130,
      description: 'Cubes of tender paneer wok-tossed in a spicy and tangy Indo-Chinese sauce with crisp bell peppers, onions, and fresh green chillies.',
      imageUrl: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/afcbb218-2c8c-4be5-9ba5-b03880bd1f88/image-1767980140831.png?width=8000&height=8000&resize=contain',
      isAvailable: true,
      isVeg: true,
      preparationTime: 15,
    },
    {
      name: 'Spring Roll (4 pcs)',
      category: 'Chinese Starter',
      price: 70,
      description: 'Deliciously crispy golden-brown rolls filled with a savory mix of finely shredded seasonal vegetables and aromatic spices. Served with a tangy dipping sauce.',
      imageUrl: 'https://images.unsplash.com/photo-1544333346-64e4fe18204b?q=80&w=1000&auto=format&fit=crop',
        isAvailable: true,
        isVeg: true,
        preparationTime: 12,
      },
      {
        name: 'Paneer Biryani',
        category: 'Biryani',
        price: 130,
        description: 'Fragrant Basmati rice cooked with succulent paneer cubes, aromatic spices, and garden-fresh vegetables. A vegetarian delight.',
        imageUrl: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/afcbb218-2c8c-4be5-9ba5-b03880bd1f88/image-1767980320602.png?width=8000&height=8000&resize=contain',
        isAvailable: true,
        isVeg: true,
        preparationTime: 25,
      }
    ];

  console.log('🔄 Adding/Updating Spring Roll and Paneer Chilli...');

  for (const item of items) {
    const existing = await db.select().from(menuItems).where(eq(menuItems.name, item.name)).limit(1);

    if (existing.length > 0) {
      await db.update(menuItems)
        .set({
          category: item.category,
          price: item.price,
          description: item.description,
          imageUrl: item.imageUrl,
          isAvailable: item.isAvailable,
          isVeg: item.isVeg,
          preparationTime: item.preparationTime,
        })
        .where(eq(menuItems.name, item.name));
      console.log(`✅ Updated: ${item.name}`);
    } else {
      await db.insert(menuItems).values({
        ...item,
        createdAt: new Date().toISOString(),
      });
      console.log(`✅ Inserted: ${item.name}`);
    }
  }

  console.log('✨ Items updated successfully!');
}

main().catch((error) => {
  console.error('❌ Update failed:', error);
  process.exit(1);
});
