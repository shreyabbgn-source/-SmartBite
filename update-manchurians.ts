import { db } from "./src/db";
import { menuItems } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function updateManchurians() {
  console.log("Updating Veg Manchurian...");
  await db.update(menuItems)
    .set({ 
      description: "Delectable vegetable dumplings deep-fried and tossed in a signature spicy, tangy Manchurian sauce. Infused with ginger, garlic, and spring onions for an authentic Indo-Chinese flavor."
    })
    .where(eq(menuItems.id, 57));

  console.log("Updating Gobi Manchurian...");
  await db.update(menuItems)
    .set({ 
      description: "Crispy cauliflower florets stir-fried in a savory soy-based sauce with a hint of sweetness and heat. A classic crunchy starter that's a favorite across the campus."
    })
    .where(eq(menuItems.id, 58));
  
  console.log("Updates completed.");
}

updateManchurians().catch(console.error);
