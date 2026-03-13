import { db } from '@/db';
import { orders } from '@/db/schema';

async function main() {
    const now = new Date();
    
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000);
    const fifteenMinsAgo = new Date(now.getTime() - 15 * 60 * 1000);

    const sampleOrders = [
        {
            orderId: `ORD${Date.now().toString().slice(-8)}001`,
            userId: 1,
            items: [
                { menuItemId: 5, name: 'Masala Dosa', price: 40, quantity: 2 },
                { menuItemId: 10, name: 'Cold Coffee', price: 35, quantity: 1 }
            ],
            totalAmount: 115,
            status: 'completed',
            paymentStatus: 'completed',
            paymentId: `pay_${Math.random().toString(36).substring(2, 15)}`,
            pickupTime: new Date(fiveDaysAgo.getTime() + 2 * 60 * 60 * 1000).toISOString(),
            orderPlacedAt: fiveDaysAgo.toISOString(),
            completedAt: new Date(fiveDaysAgo.getTime() + 2 * 60 * 60 * 1000).toISOString(),
            specialInstructions: 'Extra chutney please',
        },
        {
            orderId: `ORD${Date.now().toString().slice(-8)}002`,
            userId: 1,
            items: [
                { menuItemId: 20, name: 'Veg Sandwich', price: 35, quantity: 1 },
                { menuItemId: 15, name: 'Tea', price: 10, quantity: 2 }
            ],
            totalAmount: 55,
            status: 'completed',
            paymentStatus: 'completed',
            paymentId: `pay_${Math.random().toString(36).substring(2, 15)}`,
            pickupTime: new Date(threeDaysAgo.getTime() + 30 * 60 * 1000).toISOString(),
            orderPlacedAt: threeDaysAgo.toISOString(),
            completedAt: new Date(threeDaysAgo.getTime() + 30 * 60 * 1000).toISOString(),
            specialInstructions: null,
        },
        {
            orderId: `ORD${Date.now().toString().slice(-8)}003`,
            userId: 2,
            items: [
                { menuItemId: 50, name: 'Paneer Butter Masala', price: 120, quantity: 1 },
                { menuItemId: 45, name: 'Jeera Rice', price: 50, quantity: 1 }
            ],
            totalAmount: 170,
            status: 'ready',
            paymentStatus: 'completed',
            paymentId: `pay_${Math.random().toString(36).substring(2, 15)}`,
            pickupTime: new Date(twoHoursAgo.getTime() + 45 * 60 * 1000).toISOString(),
            orderPlacedAt: twoHoursAgo.toISOString(),
            completedAt: null,
            specialInstructions: 'Less spicy',
        },
        {
            orderId: `ORD${Date.now().toString().slice(-8)}004`,
            userId: 1,
            items: [
                { menuItemId: 60, name: 'Veg Biryani', price: 100, quantity: 1 },
                { menuItemId: 70, name: 'Gulab Jamun', price: 30, quantity: 2 }
            ],
            totalAmount: 160,
            status: 'in-progress',
            paymentStatus: 'completed',
            paymentId: `pay_${Math.random().toString(36).substring(2, 15)}`,
            pickupTime: new Date(oneHourAgo.getTime() + 1 * 60 * 60 * 1000).toISOString(),
            orderPlacedAt: oneHourAgo.toISOString(),
            completedAt: null,
            specialInstructions: null,
        },
        {
            orderId: `ORD${Date.now().toString().slice(-8)}005`,
            userId: 2,
            items: [
                { menuItemId: 35, name: 'Hakka Noodles', price: 75, quantity: 2 },
                { menuItemId: 40, name: 'Manchow Soup', price: 55, quantity: 1 }
            ],
            totalAmount: 205,
            status: 'pending',
            paymentStatus: 'completed',
            paymentId: `pay_${Math.random().toString(36).substring(2, 15)}`,
            pickupTime: new Date(fifteenMinsAgo.getTime() + 30 * 60 * 1000).toISOString(),
            orderPlacedAt: fifteenMinsAgo.toISOString(),
            completedAt: null,
            specialInstructions: 'Pack separately',
        },
    ];

    await db.insert(orders).values(sampleOrders);
    
    console.log('✅ Orders seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});