import * as dotenv from "dotenv";
dotenv.config();
import { db } from "./src/db/index";
import { menuItems } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function updateItems() {
  const updates = [
    {
      id: 59,
      name: "Veg Crispy",
      imageUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/afcbb218-2c8c-4be5-9ba5-b03880bd1f88/image-1767980293873.png?width=8000&height=8000&resize=contain",
      description: "A colorful medley of crispy-fried seasonal vegetables tossed in a spicy, tangy Indo-Chinese sauce, garnished with fresh spring onions and cilantro for a perfect crunch."
    },
    {
      id: 73,
      name: "Ragda Pattice",
      description: "Golden-brown potato patties served on a bed of savory white peas gravy (ragda), topped with zesty chutneys, chopped onions, and fresh coriander for an authentic street-food experience."
    }
  ];
  
  console.log("Updating menu items...");
  for (const item of updates) {
    const result = await db.update(menuItems)
      .set({ 
        imageUrl: item.imageUrl,
        description: item.description 
      })
      .where(eq(menuItems.id, item.id))
      .returning();
    
    console.log(`Updated ${item.name}:`, JSON.stringify(result, null, 2));
  }
}

updateItems().catch(console.error);
