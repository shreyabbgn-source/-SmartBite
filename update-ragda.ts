import { db } from "./src/db";
import { menuItems } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function updateRagdaPattice() {
  const imageUrl = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/afcbb218-2c8c-4be5-9ba5-b03880bd1f88/image-1767980488083.png?width=8000&height=8000&resize=contain";
  
  console.log("Updating Ragda Pattice...");
  const result = await db.update(menuItems)
    .set({ imageUrl: imageUrl })
    .where(eq(menuItems.id, 73))
    .returning();
  
  console.log("Updated item:", JSON.stringify(result, null, 2));
}

updateRagdaPattice().catch(console.error);
