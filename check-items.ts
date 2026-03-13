import { db } from "./src/db";
import { menuItems } from "./src/db/schema";
import { eq, like, or } from "drizzle-orm";

async function checkItems() {
  console.log("Checking for items...");
  const items = await db.select().from(menuItems).where(
    or(
      like(menuItems.name, "%Manchurian%"),
      like(menuItems.name, "%Biryani%")
    )
  ).all();
  
  console.log("Found items:");
  items.forEach(item => {
    console.log(`ID: ${item.id}, Name: ${item.name}, Category: ${item.category}, Image: ${item.imageUrl}`);
  });
}

checkItems().catch(console.error);
