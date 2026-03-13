import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcrypt';

async function main() {
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const studentPasswordHash = await bcrypt.hash('student123', 10);
    const staffPasswordHash = await bcrypt.hash('staff123', 10);
    const adminPasswordHash = await bcrypt.hash('admin123', 10);

    const sampleUsers = [
        {
            name: 'Admin User',
            email: 'admin@canteen.edu',
            password: adminPasswordHash,
            role: 'admin',
            phone: '9876543212',
            loyaltyPoints: 0,
            createdAt: threeMonthsAgo.toISOString(),
        },
        {
            name: 'Rahul Sharma',
            email: 'rahul.sharma@student.edu',
            password: studentPasswordHash,
            role: 'student',
            phone: '9876543210',
            loyaltyPoints: 150,
            createdAt: twoMonthsAgo.toISOString(),
        },
        {
            name: 'Priya Patel',
            email: 'priya.patel@staff.edu',
            password: staffPasswordHash,
            role: 'staff',
            phone: '9876543211',
            loyaltyPoints: 50,
            createdAt: oneMonthAgo.toISOString(),
        },
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});