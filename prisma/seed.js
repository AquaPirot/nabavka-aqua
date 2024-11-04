// prisma/seed.js
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Kreiraj admin nalog
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@trebovanje.rs',
      password: hashedPassword,
      name: 'Administrator'
    }
  })

  console.log('Created admin:', admin)

  // Kreiraj test restoran
  const testRestoran = await prisma.restaurant.create({
    data: {
      name: 'Test Restoran',
      code: 'TEST001',
      email: 'test@restoran.rs',
      password: await bcrypt.hash('test123', 10),
      address: 'Test Adresa 1',
      phone: '011/123-456',
      active: true
    }
  })

  console.log('Created test restaurant:', testRestoran)

  // Kreiraj nekoliko test artikala
  const testArtikli = await prisma.item.createMany({
    data: [
      { code: 'VODA001', name: 'Voda 0.5L' },
      { code: 'VODA002', name: 'Voda 1.5L' },
      { code: 'KAFA001', name: 'Kafa 100g' }
    ]
  })

  console.log('Created test items:', testArtikli)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
