import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Single user by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const user = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        phone: users.phone,
        loyaltyPoints: users.loyaltyPoints,
        createdAt: users.createdAt,
      })
        .from(users)
        .where(eq(users.id, parseInt(id)))
        .limit(1);

      if (user.length === 0) {
        return NextResponse.json({ 
          error: 'User not found',
          code: 'USER_NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(user[0], { status: 200 });
    }

    // List users with filters
    let query = db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      phone: users.phone,
      loyaltyPoints: users.loyaltyPoints,
      createdAt: users.createdAt,
    }).from(users);

    const conditions = [];

    // Role filter
    if (role) {
      conditions.push(eq(users.role, role));
    }

    // Search filter
    if (search) {
      conditions.push(
        or(
          like(users.name, `%${search}%`),
          like(users.email, `%${search}%`)
        )
      );
    }

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    // Apply sorting, pagination
    const results = await query
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message,
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();
    const { name, phone, loyaltyPoints, role } = body;

    // Reject email or password updates
    if ('email' in body) {
      return NextResponse.json({ 
        error: "Email cannot be updated through this endpoint",
        code: "EMAIL_UPDATE_NOT_ALLOWED" 
      }, { status: 400 });
    }

    if ('password' in body) {
      return NextResponse.json({ 
        error: "Password cannot be updated through this endpoint",
        code: "PASSWORD_UPDATE_NOT_ALLOWED" 
      }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.id, parseInt(id)))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND' 
      }, { status: 404 });
    }

    // Build update object with only provided fields
    const updates: any = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json({ 
          error: "Name must be a non-empty string",
          code: "INVALID_NAME" 
        }, { status: 400 });
      }
      updates.name = name.trim();
    }

    if (phone !== undefined) {
      if (phone !== null && typeof phone !== 'string') {
        return NextResponse.json({ 
          error: "Phone must be a string or null",
          code: "INVALID_PHONE" 
        }, { status: 400 });
      }
      updates.phone = phone ? phone.trim() : null;
    }

    if (loyaltyPoints !== undefined) {
      if (typeof loyaltyPoints !== 'number' || loyaltyPoints < 0) {
        return NextResponse.json({ 
          error: "Loyalty points must be a non-negative number",
          code: "INVALID_LOYALTY_POINTS" 
        }, { status: 400 });
      }
      updates.loyaltyPoints = loyaltyPoints;
    }

    if (role !== undefined) {
      const validRoles = ['student', 'staff', 'admin'];
      if (!validRoles.includes(role)) {
        return NextResponse.json({ 
          error: "Role must be one of: student, staff, admin",
          code: "INVALID_ROLE" 
        }, { status: 400 });
      }
      updates.role = role;
    }

    // Check if there are any updates
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ 
        error: "No valid fields provided for update",
        code: "NO_UPDATES" 
      }, { status: 400 });
    }

    // Perform update
    const updated = await db.update(users)
      .set(updates)
      .where(eq(users.id, parseInt(id)))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        phone: users.phone,
        loyaltyPoints: users.loyaltyPoints,
        createdAt: users.createdAt,
      });

    if (updated.length === 0) {
      return NextResponse.json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND' 
      }, { status: 404 });
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message,
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}