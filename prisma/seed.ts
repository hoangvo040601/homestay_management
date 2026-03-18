import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

// const prisma = new PrismaClient();
import prisma from '../src/config/db'

async function main() {
  console.log('🌱 Bắt đầu seed users...');

  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const hashedStaffPassword = await bcrypt.hash('staff123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@homestay.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@homestay.com',
      password: hashedAdminPassword,
      role: Role.ADMIN,
      phone: '0901234567',
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: 'staff@homestay.com' },
    update: {},
    create: {
      name: 'Nhân viên A',
      email: 'staff@homestay.com',
      password: hashedStaffPassword,
      role: Role.STAFF,
      phone: '0907654321',
    },
  });

  console.log('✅ Seed hoàn tất!');
  console.log('');
  console.log('📋 Tài khoản đăng nhập:');
  console.log(`   Admin → email: ${admin.email} | password: admin123`);
  console.log(`   Staff → email: ${staff.email} | password: staff123`);
}

main()
  .catch((e) => {
    console.error('❌ Seed thất bại:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });