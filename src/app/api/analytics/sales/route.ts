import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders } from '@/db/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const groupBy = searchParams.get('groupBy') || 'day';

    // Validate groupBy parameter
    if (!['day', 'week', 'month'].includes(groupBy)) {
      return NextResponse.json(
        {
          error: 'Invalid groupBy parameter. Must be one of: day, week, month',
          code: 'INVALID_GROUP_BY',
        },
        { status: 400 }
      );
    }

    // Validate date parameters if provided
    if (startDate && isNaN(Date.parse(startDate))) {
      return NextResponse.json(
        {
          error: 'Invalid startDate format. Must be a valid ISO date string',
          code: 'INVALID_START_DATE',
        },
        { status: 400 }
      );
    }

    if (endDate && isNaN(Date.parse(endDate))) {
      return NextResponse.json(
        {
          error: 'Invalid endDate format. Must be a valid ISO date string',
          code: 'INVALID_END_DATE',
        },
        { status: 400 }
      );
    }

    // Build query conditions
    const conditions = [eq(orders.status, 'completed')];

    if (startDate) {
      conditions.push(gte(orders.completedAt, new Date(startDate).toISOString()));
    }

    if (endDate) {
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      conditions.push(lte(orders.completedAt, endDateTime.toISOString()));
    }

    // Fetch completed orders with filters
    const completedOrders = await db
      .select()
      .from(orders)
      .where(and(...conditions));

    // Calculate summary statistics
    const totalOrders = completedOrders.length;
    const totalSales = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Calculate payment breakdown (fetch all orders regardless of status for payment breakdown)
    const paymentConditions = [];
    if (startDate) {
      paymentConditions.push(gte(orders.orderPlacedAt, new Date(startDate).toISOString()));
    }
    if (endDate) {
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      paymentConditions.push(lte(orders.orderPlacedAt, endDateTime.toISOString()));
    }

    const allOrders = paymentConditions.length > 0
      ? await db.select().from(orders).where(and(...paymentConditions))
      : await db.select().from(orders);

    const paymentBreakdown = {
      completed: 0,
      pending: 0,
      failed: 0,
      refunded: 0,
    };

    allOrders.forEach((order) => {
      const paymentStatus = order.paymentStatus.toLowerCase();
      if (paymentStatus === 'completed') {
        paymentBreakdown.completed += order.totalAmount;
      } else if (paymentStatus === 'pending') {
        paymentBreakdown.pending += order.totalAmount;
      } else if (paymentStatus === 'failed') {
        paymentBreakdown.failed += order.totalAmount;
      } else if (paymentStatus === 'refunded') {
        paymentBreakdown.refunded += order.totalAmount;
      }
    });

    // Generate timeline based on groupBy parameter
    const timeline: { date: string; sales: number; orders: number }[] = [];
    const timelineMap = new Map<string, { sales: number; orders: number }>();

    completedOrders.forEach((order) => {
      if (!order.completedAt) return;

      const orderDate = new Date(order.completedAt);
      let dateKey: string;

      if (groupBy === 'day') {
        dateKey = orderDate.toISOString().split('T')[0];
      } else if (groupBy === 'week') {
        const weekStart = new Date(orderDate);
        const day = weekStart.getDay();
        const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
        weekStart.setDate(diff);
        dateKey = weekStart.toISOString().split('T')[0];
      } else {
        dateKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}-01`;
      }

      if (!timelineMap.has(dateKey)) {
        timelineMap.set(dateKey, { sales: 0, orders: 0 });
      }

      const entry = timelineMap.get(dateKey)!;
      entry.sales += order.totalAmount;
      entry.orders += 1;
    });

    // Convert map to sorted array
    Array.from(timelineMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach(([date, data]) => {
        timeline.push({
          date,
          sales: Math.round(data.sales * 100) / 100,
          orders: data.orders,
        });
      });

    // Return analytics response
    return NextResponse.json(
      {
        summary: {
          totalSales: Math.round(totalSales * 100) / 100,
          totalOrders,
          averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        },
        paymentBreakdown: {
          completed: Math.round(paymentBreakdown.completed * 100) / 100,
          pending: Math.round(paymentBreakdown.pending * 100) / 100,
          failed: Math.round(paymentBreakdown.failed * 100) / 100,
          refunded: Math.round(paymentBreakdown.refunded * 100) / 100,
        },
        timeline,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    );
  }
}