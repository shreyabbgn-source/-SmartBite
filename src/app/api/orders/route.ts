import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, users } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

const VALID_STATUS = ['pending', 'in-progress', 'ready', 'completed', 'cancelled'];
const VALID_PAYMENT_STATUS = ['pending', 'completed', 'failed', 'refunded'];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Single order by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const order = await db
        .select()
        .from(orders)
        .where(eq(orders.id, parseInt(id)))
        .limit(1);

      if (order.length === 0) {
        return NextResponse.json(
          { error: 'Order not found', code: 'ORDER_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(order[0], { status: 200 });
    }

    // List with filters
    let query = db.select().from(orders);
    const conditions = [];

    if (userId) {
      if (isNaN(parseInt(userId))) {
        return NextResponse.json(
          { error: 'Valid user ID is required', code: 'INVALID_USER_ID' },
          { status: 400 }
        );
      }
      conditions.push(eq(orders.userId, parseInt(userId)));
    }

    if (status) {
      if (!VALID_STATUS.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status value', code: 'INVALID_STATUS' },
          { status: 400 }
        );
      }
      conditions.push(eq(orders.status, status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(orders.orderPlacedAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, items, totalAmount, paymentId, pickupTime, specialInstructions } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items must be a non-empty array', code: 'INVALID_ITEMS' },
        { status: 400 }
      );
    }

    if (items.length === 0) {
      return NextResponse.json(
        { error: 'Items array cannot be empty', code: 'EMPTY_ITEMS' },
        { status: 400 }
      );
    }

    // Validate items structure
    for (const item of items) {
      if (!item.menuItemId || !item.name || !item.price || !item.quantity) {
        return NextResponse.json(
          { error: 'Each item must have menuItemId, name, price, and quantity', code: 'INVALID_ITEM_STRUCTURE' },
          { status: 400 }
        );
      }
    }

    if (!totalAmount || typeof totalAmount !== 'number' || totalAmount <= 0) {
      return NextResponse.json(
        { error: 'Total amount must be a positive number', code: 'INVALID_TOTAL_AMOUNT' },
        { status: 400 }
      );
    }

    // Validate userId exists in users table
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 400 }
      );
    }

    // Generate unique orderId
    const timestamp = Date.now();
    const random = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD${timestamp}${random}`;

    const currentTimestamp = new Date().toISOString();

    // Create order
    const newOrder = await db
      .insert(orders)
      .values({
        orderId,
        userId,
        items: items as any,
        totalAmount,
        status: 'pending',
        paymentStatus: 'pending',
        paymentId: paymentId?.trim() || null,
        pickupTime: pickupTime || null,
        orderPlacedAt: currentTimestamp,
        completedAt: null,
        specialInstructions: specialInstructions?.trim() || null,
      })
      .returning();

    return NextResponse.json(newOrder[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, paymentStatus, paymentId, pickupTime, completedAt, specialInstructions } = body;

    // Validate status if provided
    if (status && !VALID_STATUS.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value', code: 'INVALID_STATUS' },
        { status: 400 }
      );
    }

    // Validate paymentStatus if provided
    if (paymentStatus && !VALID_PAYMENT_STATUS.includes(paymentStatus)) {
      return NextResponse.json(
        { error: 'Invalid payment status value', code: 'INVALID_PAYMENT_STATUS' },
        { status: 400 }
      );
    }

    // Check if order exists
    const existingOrder = await db
      .select()
      .from(orders)
      .where(eq(orders.id, parseInt(id)))
      .limit(1);

    if (existingOrder.length === 0) {
      return NextResponse.json(
        { error: 'Order not found', code: 'ORDER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Build update object
    const updates: any = {};

    if (status !== undefined) {
      updates.status = status;
      // Auto-set completedAt if status is completed
      if (status === 'completed') {
        updates.completedAt = new Date().toISOString();
      }
    }

    if (paymentStatus !== undefined) {
      updates.paymentStatus = paymentStatus;
    }

    if (paymentId !== undefined) {
      updates.paymentId = paymentId?.trim() || null;
    }

    if (pickupTime !== undefined) {
      updates.pickupTime = pickupTime || null;
    }

    if (completedAt !== undefined) {
      updates.completedAt = completedAt || null;
    }

    if (specialInstructions !== undefined) {
      updates.specialInstructions = specialInstructions?.trim() || null;
    }

    // Update order
    const updated = await db
      .update(orders)
      .set(updates)
      .where(eq(orders.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if order exists
    const existingOrder = await db
      .select()
      .from(orders)
      .where(eq(orders.id, parseInt(id)))
      .limit(1);

    if (existingOrder.length === 0) {
      return NextResponse.json(
        { error: 'Order not found', code: 'ORDER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete order
    const deleted = await db
      .delete(orders)
      .where(eq(orders.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Order deleted successfully',
        order: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}