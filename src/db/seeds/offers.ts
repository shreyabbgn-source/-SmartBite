import { db } from '@/db';
import { offers } from '@/db/schema';

async function main() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const today = new Date();
    
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    
    const twoMonthsFromNow = new Date();
    twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);
    
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

    const sampleOffers = [
        {
            title: 'Student Special - 20% Off',
            description: 'Get 20% off on orders above ₹200 for all students',
            discountPercent: 20,
            discountAmount: null,
            minOrderAmount: 200,
            isActive: true,
            validFrom: oneWeekAgo.toISOString(),
            validUntil: oneMonthFromNow.toISOString(),
            createdAt: oneWeekAgo.toISOString(),
        },
        {
            title: 'Weekend Bonanza - Flat ₹50 Off',
            description: 'Flat ₹50 off on all orders above ₹300 during weekends',
            discountPercent: null,
            discountAmount: 50,
            minOrderAmount: 300,
            isActive: true,
            validFrom: today.toISOString(),
            validUntil: twoMonthsFromNow.toISOString(),
            createdAt: today.toISOString(),
        },
        {
            title: 'Loyalty Reward - 15% Off',
            description: 'Use your loyalty points and get 15% off on orders above ₹150',
            discountPercent: 15,
            discountAmount: null,
            minOrderAmount: 150,
            isActive: true,
            validFrom: twoWeeksAgo.toISOString(),
            validUntil: threeMonthsFromNow.toISOString(),
            createdAt: twoWeeksAgo.toISOString(),
        }
    ];

    await db.insert(offers).values(sampleOffers);
    
    console.log('✅ Offers seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});