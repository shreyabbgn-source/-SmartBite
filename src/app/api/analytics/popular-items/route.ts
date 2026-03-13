import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, menuItems } from '@/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const limitParam = searchParams.get('limit');
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    
    // Validate and set limit (default: 10, max: 50)
    const limit = limitParam 
      ? Math.min(Math.max(parseInt(limitParam), 1), 50) 
      : 10;
    
    if (limitParam && isNaN(parseInt(limitParam))) {
      return NextResponse.json({ 
        error: "Invalid limit parameter",
        code: "INVALID_LIMIT" 
      }, { status: 400 });
    }
    
    // Validate date parameters
    if (startDateParam && isNaN(Date.parse(startDateParam))) {
      return NextResponse.json({ 
        error: "Invalid startDate format. Use ISO date string (YYYY-MM-DD)",
        code: "INVALID_START_DATE" 
      }, { status: 400 });
    }
    
    if (endDateParam && isNaN(Date.parse(endDateParam))) {
      return NextResponse.json({ 
        error: "Invalid endDate format. Use ISO date string (YYYY-MM-DD)",
        code: "INVALID_END_DATE" 
      }, { status: 400 });
    }
    
    // Build query conditions
    const conditions = [eq(orders.status, 'completed')];
    
    if (startDateParam) {
      conditions.push(gte(orders.completedAt, startDateParam));
    }
    
    if (endDateParam) {
      // Add one day to include the entire end date
      const endDate = new Date(endDateParam);
      endDate.setDate(endDate.getDate() + 1);
      conditions.push(lte(orders.completedAt, endDate.toISOString()));
    }
    
    // Fetch completed orders with date filtering
    const completedOrders = await db
      .select()
      .from(orders)
      .where(conditions.length > 1 ? and(...conditions) : conditions[0]);
    
    if (completedOrders.length === 0) {
      return NextResponse.json([], { status: 200 });
    }
    
    // Parse items from each order and aggregate data
    interface ItemStats {
      menuItemId: number;
      totalOrders: number;
      totalQuantity: number;
      totalRevenue: number;
    }
    
    const itemStatsMap = new Map<number, ItemStats>();
    
    for (const order of completedOrders) {
      const items = order.items as Array<{
        menuItemId: number;
        name: string;
        price: number;
        quantity: number;
      }>;
      
      for (const item of items) {
        const existing = itemStatsMap.get(item.menuItemId);
        
        if (existing) {
          existing.totalOrders += 1;
          existing.totalQuantity += item.quantity;
          existing.totalRevenue += item.price * item.quantity;
        } else {
          itemStatsMap.set(item.menuItemId, {
            menuItemId: item.menuItemId,
            totalOrders: 1,
            totalQuantity: item.quantity,
            totalRevenue: item.price * item.quantity,
          });
        }
      }
    }
    
    // Convert map to array and sort by total quantity descending
    const sortedItems = Array.from(itemStatsMap.values())
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, limit);
    
    if (sortedItems.length === 0) {
      return NextResponse.json([], { status: 200 });
    }
    
    // Fetch menu item details for all items
    const menuItemIds = sortedItems.map(item => item.menuItemId);
    const menuItemDetails = await db
      .select()
      .from(menuItems)
      .where(
        menuItemIds.length === 1
          ? eq(menuItems.id, menuItemIds[0])
          : undefined
      );
    
    // If multiple IDs, fetch all and filter in memory
    const allMenuItems = menuItemIds.length > 1
      ? await db.select().from(menuItems)
      : menuItemDetails;
    
    const menuItemMap = new Map(
      allMenuItems.map(item => [item.id, item])
    );
    
    // Combine stats with menu item details
    const popularItems = sortedItems
      .map(stats => {
        const menuItem = menuItemMap.get(stats.menuItemId);
        
        if (!menuItem) {
          return null;
        }
        
        return {
          menuItemId: stats.menuItemId,
          name: menuItem.name,
          category: menuItem.category,
          totalOrders: stats.totalOrders,
          totalQuantity: stats.totalQuantity,
          totalRevenue: Math.round(stats.totalRevenue * 100) / 100, // Round to 2 decimal places
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
    
    return NextResponse.json(popularItems, { status: 200 });
    
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}