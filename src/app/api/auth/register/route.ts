import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, phone } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { 
          error: 'Name is required and must be at least 2 characters',
          code: 'INVALID_NAME'
        },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { 
          error: 'Email is required',
          code: 'MISSING_EMAIL'
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim().toLowerCase())) {
      return NextResponse.json(
        { 
          error: 'Invalid email format',
          code: 'INVALID_EMAIL_FORMAT'
        },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { 
          error: 'Password is required and must be at least 6 characters',
          code: 'INVALID_PASSWORD'
        },
        { status: 400 }
      );
    }

    if (!role || !['student', 'staff', 'admin'].includes(role)) {
      return NextResponse.json(
        { 
          error: 'Role is required and must be one of: student, staff, admin',
          code: 'INVALID_ROLE'
        },
        { status: 400 }
      );
    }

    // Validate phone if provided
    if (phone !== undefined && phone !== null && typeof phone !== 'string') {
      return NextResponse.json(
        { 
          error: 'Phone must be a string',
          code: 'INVALID_PHONE'
        },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { 
          error: 'Email already registered',
          code: 'EMAIL_EXISTS'
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data
    const userData: any = {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role,
      loyaltyPoints: 0,
      createdAt: new Date().toISOString(),
    };

    // Add phone if provided
    if (phone) {
      userData.phone = phone.trim();
    }

    // Insert user into database
    const newUser = await db.insert(users)
      .values(userData)
      .returning();

    if (newUser.length === 0) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser[0];

    return NextResponse.json(
      { user: userWithoutPassword },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}