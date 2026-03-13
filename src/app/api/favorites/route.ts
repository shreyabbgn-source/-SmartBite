import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { favorites, users, menuItems } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    // Single favorite by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const favorite = await db.select()
        .from(favorites)
        .where(eq(favorites.id, parseInt(id)))
        .limit(1);

      if (favorite.length === 0) {
        return NextResponse.json({ 
          error: 'Favorite not found',
          code: "NOT_FOUND" 
        }, { status: 404 });
      }

      return NextResponse.json(favorite[0], { status: 200 });
    }

    // All favorites for a user
    if (userId) {
      if (isNaN(parseInt(userId))) {
        return NextResponse.json({ 
          error: "Valid user ID is required",
          code: "INVALID_USER_ID" 
        }, { status: 400 });
      }

      const userFavorites = await db.select()
        .from(favorites)
        .where(eq(favorites.userId, parseInt(userId)));

      return NextResponse.json(userFavorites, { status: 200 });
    }

    // Return all favorites if no filters provided
    const allFavorites = await db.select().from(favorites);
    return NextResponse.json(allFavorites, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, menuItemId } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json({ 
        error: "userId is required",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    if (!menuItemId) {
      return NextResponse.json({ 
        error: "menuItemId is required",
        code: "MISSING_MENU_ITEM_ID" 
      }, { status: 400 });
    }

    // Validate userId and menuItemId are valid integers
    if (isNaN(parseInt(userId))) {
      return NextResponse.json({ 
        error: "Valid userId is required",
        code: "INVALID_USER_ID" 
      }, { status: 400 });
    }

    if (isNaN(parseInt(menuItemId))) {
      return NextResponse.json({ 
        error: "Valid menuItemId is required",
        code: "INVALID_MENU_ITEM_ID" 
      }, { status: 400 });
    }

    // Validate userId exists in users table
    const userExists = await db.select()
      .from(users)
      .where(eq(users.id, parseInt(userId)))
      .limit(1);

    if (userExists.length === 0) {
      return NextResponse.json({ 
        error: "User not found",
        code: "USER_NOT_FOUND" 
      }, { status: 400 });
    }

    // Validate menuItemId exists in menuItems table
    const menuItemExists = await db.select()
      .from(menuItems)
      .where(eq(menuItems.id, parseInt(menuItemId)))
      .limit(1);

    if (menuItemExists.length === 0) {
      return NextResponse.json({ 
        error: "Menu item not found",
        code: "MENU_ITEM_NOT_FOUND" 
      }, { status: 400 });
    }

    // Check if favorite already exists
    const existingFavorite = await db.select()
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, parseInt(userId)),
          eq(favorites.menuItemId, parseInt(menuItemId))
        )
      )
      .limit(1);

    if (existingFavorite.length > 0) {
      return NextResponse.json({ 
        error: "Already in favorites",
        code: "ALREADY_EXISTS" 
      }, { status: 400 });
    }

    // Create new favorite
    const newFavorite = await db.insert(favorites)
      .values({
        userId: parseInt(userId),
        menuItemId: parseInt(menuItemId),
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newFavorite[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if favorite exists
    const existingFavorite = await db.select()
      .from(favorites)
      .where(eq(favorites.id, parseInt(id)))
      .limit(1);

    if (existingFavorite.length === 0) {
      return NextResponse.json({ 
        error: 'Favorite not found',
        code: "NOT_FOUND" 
      }, { status: 404 });
    }

    // Delete favorite
    const deleted = await db.delete(favorites)
      .where(eq(favorites.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Favorite deleted successfully',
      favorite: deleted[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}