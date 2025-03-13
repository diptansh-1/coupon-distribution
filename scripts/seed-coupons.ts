const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed coupons...');

  // Clean up existing data
  await prisma.couponClaim.deleteMany();
  await prisma.coupon.deleteMany();

  // Create sample coupons
  const coupons = [
    {
      code: 'WELCOME10',
      description: '10% off your first purchase',
      isActive: true,
    },
    {
      code: 'SUMMER20',
      description: '20% off summer items',
      isActive: true,
    },
    {
      code: 'FREESHIP',
      description: 'Free shipping on your order',
      isActive: true,
    },
    {
      code: 'WELCOME',
      description: 'Welcome discount for new users',
      isActive: true,
    },
    {
      code: 'SPRING25',
      description: '25% off spring collection',
      isActive: true,
    }
  ];

  for (const coupon of coupons) {
    await prisma.coupon.create({
      data: coupon,
    });
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error seeding coupons:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 