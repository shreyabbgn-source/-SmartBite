import { db } from "./src/db";
import { menuItems } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function updateItems() {
  const MANCHURIAN_IMAGE = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/afcbb218-2c8c-4be5-9ba5-b03880bd1f88/image-1767980253401.png?width=8000&height=8000&resize=contain";

  console.log("Updating Veg Manchurian...");
  await db.update(menuItems)
    .set({ 
      imageUrl: MANCHURIAN_IMAGE,
      description: "Crispy vegetable dumplings tossed in a savory, tangy Manchurian sauce with ginger, garlic, and green chillies. A perfect Indo-Chinese starter."
    })
    .where(eq(menuItems.id, 57))
    .run();

  console.log("Updating Gobi Manchurian...");
  await db.update(menuItems)
    .set({ 
      imageUrl: MANCHURIAN_IMAGE,
      description: "Fresh cauliflower florets deep-fried to perfection and tossed in a spicy, aromatic Manchurian gravy. Garnish with spring onions for that authentic crunch."
    })
    .where(eq(menuItems.id, 58))
    .run();

  console.log("Verifying Paneer Biryani...");
  // It already exists with an image, but let's ensure the description is great.
  await db.update(menuItems)
    .set({
      description: "Fragrant long-grain basmati rice cooked with succulent cubes of paneer, aromatic spices, and caramelized onions. Served with refreshing raita."
    })
    .where(eq(menuItems.id, 97))
    .run();

  console.log("All items updated successfully!");
}

updateItems().catch(console.error);
