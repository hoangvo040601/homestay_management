# Homestay Management API

## Tech Stack
- Node.js + Express + TypeScript
- MySQL + Prisma ORM
- JWT Authentication
- Docker

## Yêu cầu
- Node.js >= 18
- Docker Desktop

## Cài đặt

### 1. Clone repo
git clone https://github.com/YOUR_USERNAME/homestay-management.git
cd homestay-management

### 2. Cài dependencies
npm install

### 3. Cấu hình môi trường
cp .env.example .env
# Chỉnh sửa .env theo môi trường của bạn

### 4. Khởi động MySQL
npm run docker:up

### 5. Chạy migration
npm run prisma:migrate

### 6. Seed dữ liệu mẫu
npm run prisma:seed

### 7. Khởi động server
npm run dev

## API Documentation
Swagger UI: http://localhost:3000/api/docs

## Tài khoản mặc định
| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@homestay.com     | admin456  |
| Staff | staff@homestay.com     | staff123  |

## Scripts
| Script                  | Mô tả                    |
|-------------------------|--------------------------|
| npm run dev             | Chạy development server  |
| npm run build           | Build production         |
| npm run docker:up       | Khởi động MySQL          |
| npm run docker:down     | Dừng MySQL               |
| npm run prisma:migrate  | Chạy migration           |
| npm run prisma:seed     | Seed dữ liệu mẫu         |
| npm run prisma:studio   | Mở Prisma Studio         |