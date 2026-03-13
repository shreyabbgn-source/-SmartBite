import { db } from './index';
import { menuItems } from './schema';
import { eq, inArray, or } from 'drizzle-orm';

async function cleanupAndAdd() {
  console.log('cleaning up and adding items...');
  
  // Delete existing duplicates or old versions to keep it clean
  const namesToDelete = ['Hakka Noodles', 'Paneer Pakora', 'Onion Pakora'];
  await db.delete(menuItems).where(inArray(menuItems.name, namesToDelete));
  
  const items = [
    {
      name: 'Hakka Noodles',
      category: 'Chinese Noodles/Rice',
      price: 80,
      description: 'Stir-fried noodles with crisp vegetables and Hakka spices',
      imageUrl: 'https://images.unsplash.com/photo-1626808642824-21345398246e?q=80&w=1000&auto=format&fit=crop',
      isAvailable: true,
      isVeg: true,
      preparationTime: 15,
      createdAt: new Date().toISOString()
    },
    {
      name: 'Paneer Pakora',
      category: 'Special Snacks',
      price: 50,
      description: 'Crispy and soft cottage cheese fritters served with chutney',
      imageUrl: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/afcbb218-2c8c-4be5-9ba5-b03880bd1f88/image-1767976686137.png?width=8000&height=8000&resize=contain',
      isAvailable: true,
      isVeg: true,
      preparationTime: 12,
      createdAt: new Date().toISOString()
    },
    {
      name: 'Onion Pakora',
      category: 'Special Snacks',
      price: 30,
      description: 'Classic crispy onion fritters seasoned with Indian spices',
      imageUrl: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/afcbb218-2c8c-4be5-9ba5-b03880bd1f88/image-1767976711246.png?width=8000&height=8000&resize=contain',
      isAvailable: true,
      isVeg: true,
      preparationTime: 10,
      createdAt: new Date().toISOString()
    }
  ];

  for (const item of items) {
    try {
      await db.insert(menuItems).values(item);
      console.log(`✅ Added ${item.name}`);
    } catch (error) {
      console.error(`❌ Failed to add ${item.name}:`, error);
    }
  }
}

cleanupAndAdd();
