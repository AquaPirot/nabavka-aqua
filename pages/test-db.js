// pages/api/test-db.js
import prisma from '../../lib/prisma'

export default async function handler(req, res) {
  console.log('Starting database test...');
  
  try {
    // 1. Test konekcije
    await prisma.$connect();
    console.log('✓ Database connected');
    
    // 2. Provera admin tabele
    const adminCount = await prisma.admin.count();
    console.log('✓ Admin count:', adminCount);
    
    // 3. Provera da li postoji test admin
    const testAdmin = await prisma.admin.findUnique({
      where: { email: 'admin@trebovanje.rs' },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });
    console.log('✓ Test admin exists:', !!testAdmin);

    // 4. Provera ostalih tabela
    const stats = {
      admins: adminCount,
      restaurants: await prisma.restaurant.count(),
      items: await prisma.item.count(),
      orders: await prisma.order.count()
    };
    
    return res.status(200).json({
      status: 'success',
      message: 'Database check complete',
      stats,
      testAdmin: testAdmin || 'Not found'
    });
    
  } catch (error) {
    console.error('Database test failed:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
      errorName: error.name,
      code: error?.code
    });
  } finally {
    await prisma.$disconnect();
  }
}
