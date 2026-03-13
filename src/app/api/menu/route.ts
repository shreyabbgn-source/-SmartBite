import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { menuItems } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

const VALID_CATEGORIES = [
  "Hot Beverages",
  "Cold Beverages",
  "South Indian Snacks",
  "Maharashtrian Snacks",
  "Paratha",
  "Special Snacks",
  "Egg Dishes",
  "Maggie",
  "Sandwiches/Toast",
  "Rolls",
  "Chinese Starter",
  "Chinese Noodles/Rice",
  "Soups",
  "Special Dishes",
  "Punjabi Dishes",
  "Paneer Dishes",
  "Non-Veg Indian Dishes",
  "Rice",
  "Biryani",
  "Bhel/Chaat",
  "Sweet",
  "Thali"
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const isVegParam = searchParams.get('isVeg');
    const isAvailableParam = searchParams.get('isAvailable');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Single record by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const record = await db.select()
        .from(menuItems)
        .where(eq(menuItems.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json({ 
          error: 'Menu item not found',
          code: "NOT_FOUND" 
        }, { status: 404 });
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    // List with filters
    let query = db.select().from(menuItems);
    const conditions = [];

    // Category filter
    if (category) {
      conditions.push(eq(menuItems.category, category));
    }

    // isVeg filter
    if (isVegParam !== null) {
      const isVeg = isVegParam === 'true';
      conditions.push(eq(menuItems.isVeg, isVeg));
    }

    // isAvailable filter
    if (isAvailableParam !== null) {
      const isAvailable = isAvailableParam === 'true';
      conditions.push(eq(menuItems.isAvailable, isAvailable));
    }

    // Search filter
    if (search) {
      const searchCondition = or(
        like(menuItems.name, `%${search}%`),
        like(menuItems.description, `%${search}%`)
      );
      conditions.push(searchCondition);
    }

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply pagination and ordering
    const results = await query
      .orderBy(desc(menuItems.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, price, description, imageUrl, isAvailable, isVeg, preparationTime } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ 
        error: "Name is required and must be a non-empty string",
        code: "MISSING_NAME" 
      }, { status: 400 });
    }

    if (!category || typeof category !== 'string') {
      return NextResponse.json({ 
        error: "Category is required",
        code: "MISSING_CATEGORY" 
      }, { status: 400 });
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ 
        error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
        code: "INVALID_CATEGORY" 
      }, { status: 400 });
    }

    if (price === undefined || price === null) {
      return NextResponse.json({ 
        error: "Price is required",
        code: "MISSING_PRICE" 
      }, { status: 400 });
    }

    const priceNum = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(priceNum) || priceNum <= 0) {
      return NextResponse.json({ 
        error: "Price must be a positive number",
        code: "INVALID_PRICE" 
      }, { status: 400 });
    }

    // Validate optional fields
    if (preparationTime !== undefined && preparationTime !== null) {
      const prepTimeNum = typeof preparationTime === 'string' ? parseInt(preparationTime) : preparationTime;
      if (isNaN(prepTimeNum) || prepTimeNum < 0) {
        return NextResponse.json({ 
          error: "Preparation time must be a non-negative integer",
          code: "INVALID_PREPARATION_TIME" 
        }, { status: 400 });
      }
    }

    // Build insert data with defaults
    const insertData: any = {
      name: name.trim(),
      category: category.trim(),
      price: priceNum,
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
      isVeg: isVeg !== undefined ? Boolean(isVeg) : true,
      createdAt: new Date().toISOString()
    };

    if (description && typeof description === 'string') {
      insertData.description = description.trim();
    }

    if (imageUrl && typeof imageUrl === 'string') {
      insertData.imageUrl = imageUrl.trim();
    }

    if (preparationTime !== undefined && preparationTime !== null) {
      const prepTimeNum = typeof preparationTime === 'string' ? parseInt(preparationTime) : preparationTime;
      insertData.preparationTime = prepTimeNum;
    }

    // Insert into database
    const newMenuItem = await db.insert(menuItems)
      .values(insertData)
      .returning();

    return NextResponse.json(newMenuItem[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if record exists
    const existing = await db.select()
      .from(menuItems)
      .where(eq(menuItems.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Menu item not found',
        code: "NOT_FOUND" 
      }, { status: 404 });
    }

    const body = await request.json();
    const { name, category, price, description, imageUrl, isAvailable, isVeg, preparationTime } = body;

    const updates: any = {};

    // Validate and add fields to update
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json({ 
          error: "Name must be a non-empty string",
          code: "INVALID_NAME" 
        }, { status: 400 });
      }
      updates.name = name.trim();
    }

    if (category !== undefined) {
      if (typeof category !== 'string') {
        return NextResponse.json({ 
          error: "Category must be a string",
          code: "INVALID_CATEGORY" 
        }, { status: 400 });
      }
      if (!VALID_CATEGORIES.includes(category)) {
        return NextResponse.json({ 
          error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
          code: "INVALID_CATEGORY" 
        }, { status: 400 });
      }
      updates.category = category.trim();
    }

    if (price !== undefined) {
      const priceNum = typeof price === 'string' ? parseFloat(price) : price;
      if (isNaN(priceNum) || priceNum <= 0) {
        return NextResponse.json({ 
          error: "Price must be a positive number",
          code: "INVALID_PRICE" 
        }, { status: 400 });
      }
      updates.price = priceNum;
    }

    if (description !== undefined) {
      if (description === null || description === '') {
        updates.description = null;
      } else if (typeof description === 'string') {
        updates.description = description.trim();
      } else {
        return NextResponse.json({ 
          error: "Description must be a string",
          code: "INVALID_DESCRIPTION" 
        }, { status: 400 });
      }
    }

    if (imageUrl !== undefined) {
      if (imageUrl === null || imageUrl === '') {
        updates.imageUrl = null;
      } else if (typeof imageUrl === 'string') {
        updates.imageUrl = imageUrl.trim();
      } else {
        return NextResponse.json({ 
          error: "Image URL must be a string",
          code: "INVALID_IMAGE_URL" 
        }, { status: 400 });
      }
    }

    if (isAvailable !== undefined) {
      updates.isAvailable = Boolean(isAvailable);
    }

    if (isVeg !== undefined) {
      updates.isVeg = Boolean(isVeg);
    }

    if (preparationTime !== undefined) {
      if (preparationTime === null) {
        updates.preparationTime = null;
      } else {
        const prepTimeNum = typeof preparationTime === 'string' ? parseInt(preparationTime) : preparationTime;
        if (isNaN(prepTimeNum) || prepTimeNum < 0) {
          return NextResponse.json({ 
            error: "Preparation time must be a non-negative integer",
            code: "INVALID_PREPARATION_TIME" 
          }, { status: 400 });
        }
        updates.preparationTime = prepTimeNum;
      }
    }

    // If no fields to update
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(existing[0], { status: 200 });
    }

    // Update record
    const updated = await db.update(menuItems)
      .set(updates)
      .where(eq(menuItems.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if record exists
    const existing = await db.select()
      .from(menuItems)
      .where(eq(menuItems.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Menu item not found',
        code: "NOT_FOUND" 
      }, { status: 404 });
    }

    // Delete record
    const deleted = await db.delete(menuItems)
      .where(eq(menuItems.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Menu item deleted successfully',
      deletedItem: deleted[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}