
import 'dotenv/config';
import { db } from './src/db/index';
import { menuItems } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const itemId = 75;
  const newImageUrl = 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/afcbb218-2c8c-4be5-9ba5-b03880bd1f88/image-1767979006882.png?width=8000&height=8000&resize=contain';
  const newDescription = "A quintessentially crisp and exhilarating street-side sensation. Ten delicate, golden-fried semolina spheres (puris), meticulously hand-cracked and brimming with a savory medley of spiced potatoes, tender chickpeas, and cooling boondi. Served alongside our signature duo of vibrant mint-coriander 'pani' and luscious tamarind chutney, creating an explosion of tangy, spicy, and sweet flavors in every bite.";

  console.log(`Updating Pani Puri (10 pcs) with ID: ${itemId}...`);

  await db.update(menuItems)
    .set({
      imageUrl: newImageUrl,
      description: newDescription
    })
    .where(eq(menuItems.id, itemId));

  console.log('Update successful!');
}

main().catch(console.error);
