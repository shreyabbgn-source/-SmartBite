import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { offers } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const isActive = searchParams.get('isActive');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Single offer by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const offer = await db.select()
        .from(offers)
        .where(eq(offers.id, parseInt(id)))
        .limit(1);

      if (offer.length === 0) {
        return NextResponse.json({ 
          error: 'Offer not found',
          code: 'NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(offer[0], { status: 200 });
    }

    // List offers with optional filters
    let query = db.select().from(offers);

    // Filter by isActive if provided
    if (isActive !== null) {
      const isActiveBoolean = isActive === 'true';
      query = query.where(eq(offers.isActive, isActiveBoolean));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });

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
    const { 
      title, 
      description, 
      discountPercent, 
      discountAmount, 
      minOrderAmount, 
      isActive, 
      validFrom, 
      validUntil 
    } = body;

    // Required field validations
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json({ 
        error: "Title is required and must be a non-empty string",
        code: "MISSING_TITLE" 
      }, { status: 400 });
    }

    if (!validFrom) {
      return NextResponse.json({ 
        error: "validFrom is required",
        code: "MISSING_VALID_FROM" 
      }, { status: 400 });
    }

    if (!validUntil) {
      return NextResponse.json({ 
        error: "validUntil is required",
        code: "MISSING_VALID_UNTIL" 
      }, { status: 400 });
    }

    // Validate that either discountPercent OR discountAmount is provided, not both
    const hasDiscountPercent = discountPercent !== undefined && discountPercent !== null;
    const hasDiscountAmount = discountAmount !== undefined && discountAmount !== null;

    if (!hasDiscountPercent && !hasDiscountAmount) {
      return NextResponse.json({ 
        error: "Either discountPercent or discountAmount must be provided",
        code: "MISSING_DISCOUNT" 
      }, { status: 400 });
    }

    if (hasDiscountPercent && hasDiscountAmount) {
      return NextResponse.json({ 
        error: "Cannot provide both discountPercent and discountAmount",
        code: "BOTH_DISCOUNTS_PROVIDED" 
      }, { status: 400 });
    }

    // Validate discountPercent range
    if (hasDiscountPercent) {
      if (typeof discountPercent !== 'number' || discountPercent < 0 || discountPercent > 100) {
        return NextResponse.json({ 
          error: "discountPercent must be a number between 0 and 100",
          code: "INVALID_DISCOUNT_PERCENT" 
        }, { status: 400 });
      }
    }

    // Validate discountAmount is positive
    if (hasDiscountAmount) {
      if (typeof discountAmount !== 'number' || discountAmount <= 0) {
        return NextResponse.json({ 
          error: "discountAmount must be a positive number",
          code: "INVALID_DISCOUNT_AMOUNT" 
        }, { status: 400 });
      }
    }

    // Validate dates
    const validFromDate = new Date(validFrom);
    const validUntilDate = new Date(validUntil);

    if (isNaN(validFromDate.getTime())) {
      return NextResponse.json({ 
        error: "validFrom must be a valid date",
        code: "INVALID_VALID_FROM" 
      }, { status: 400 });
    }

    if (isNaN(validUntilDate.getTime())) {
      return NextResponse.json({ 
        error: "validUntil must be a valid date",
        code: "INVALID_VALID_UNTIL" 
      }, { status: 400 });
    }

    if (validFromDate >= validUntilDate) {
      return NextResponse.json({ 
        error: "validFrom must be before validUntil",
        code: "INVALID_DATE_RANGE" 
      }, { status: 400 });
    }

    // Prepare insert data
    const insertData: any = {
      title: title.trim(),
      description: description ? description.trim() : null,
      discountPercent: hasDiscountPercent ? discountPercent : null,
      discountAmount: hasDiscountAmount ? discountAmount : null,
      minOrderAmount: minOrderAmount !== undefined ? minOrderAmount : 0,
      isActive: isActive !== undefined ? isActive : true,
      validFrom: validFromDate.toISOString(),
      validUntil: validUntilDate.toISOString(),
      createdAt: new Date().toISOString(),
    };

    const newOffer = await db.insert(offers)
      .values(insertData)
      .returning();

    return NextResponse.json(newOffer[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
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

    // Check if offer exists
    const existingOffer = await db.select()
      .from(offers)
      .where(eq(offers.id, parseInt(id)))
      .limit(1);

    if (existingOffer.length === 0) {
      return NextResponse.json({ 
        error: 'Offer not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { 
      title, 
      description, 
      discountPercent, 
      discountAmount, 
      minOrderAmount, 
      isActive, 
      validFrom, 
      validUntil 
    } = body;

    // Prepare update data
    const updateData: any = {};

    // Validate and add fields to update
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return NextResponse.json({ 
          error: "Title must be a non-empty string",
          code: "INVALID_TITLE" 
        }, { status: 400 });
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      updateData.description = description ? description.trim() : null;
    }

    // Validate discount updates
    const hasDiscountPercent = discountPercent !== undefined;
    const hasDiscountAmount = discountAmount !== undefined;

    if (hasDiscountPercent && hasDiscountAmount) {
      return NextResponse.json({ 
        error: "Cannot provide both discountPercent and discountAmount",
        code: "BOTH_DISCOUNTS_PROVIDED" 
      }, { status: 400 });
    }

    if (hasDiscountPercent) {
      if (discountPercent !== null) {
        if (typeof discountPercent !== 'number' || discountPercent < 0 || discountPercent > 100) {
          return NextResponse.json({ 
            error: "discountPercent must be a number between 0 and 100",
            code: "INVALID_DISCOUNT_PERCENT" 
          }, { status: 400 });
        }
      }
      updateData.discountPercent = discountPercent;
      updateData.discountAmount = null;
    }

    if (hasDiscountAmount) {
      if (discountAmount !== null) {
        if (typeof discountAmount !== 'number' || discountAmount <= 0) {
          return NextResponse.json({ 
            error: "discountAmount must be a positive number",
            code: "INVALID_DISCOUNT_AMOUNT" 
          }, { status: 400 });
        }
      }
      updateData.discountAmount = discountAmount;
      updateData.discountPercent = null;
    }

    if (minOrderAmount !== undefined) {
      updateData.minOrderAmount = minOrderAmount;
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    // Validate date updates
    if (validFrom !== undefined || validUntil !== undefined) {
      const currentValidFrom = validFrom || existingOffer[0].validFrom;
      const currentValidUntil = validUntil || existingOffer[0].validUntil;

      const validFromDate = new Date(currentValidFrom);
      const validUntilDate = new Date(currentValidUntil);

      if (isNaN(validFromDate.getTime())) {
        return NextResponse.json({ 
          error: "validFrom must be a valid date",
          code: "INVALID_VALID_FROM" 
        }, { status: 400 });
      }

      if (isNaN(validUntilDate.getTime())) {
        return NextResponse.json({ 
          error: "validUntil must be a valid date",
          code: "INVALID_VALID_UNTIL" 
        }, { status: 400 });
      }

      if (validFromDate >= validUntilDate) {
        return NextResponse.json({ 
          error: "validFrom must be before validUntil",
          code: "INVALID_DATE_RANGE" 
        }, { status: 400 });
      }

      if (validFrom !== undefined) {
        updateData.validFrom = validFromDate.toISOString();
      }

      if (validUntil !== undefined) {
        updateData.validUntil = validUntilDate.toISOString();
      }
    }

    // If no fields to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(existingOffer[0], { status: 200 });
    }

    const updated = await db.update(offers)
      .set(updateData)
      .where(eq(offers.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}