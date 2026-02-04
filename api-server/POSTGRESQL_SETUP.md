# PostgreSQL Setup Guide

## Cài Đặt PostgreSQL

### Windows

**Cách 1: PostgreSQL Official (Khuyến nghị)**
1. Tải PostgreSQL từ: https://www.postgresql.org/download/windows/
2. Chạy installer, chọn:
   - Port: `5432` (mặc định)
   - Password: `postgres` (hoặc tự chọn)
3. Cài đặt pgAdmin 4 (đi kèm)

**Cách 2: Docker (Nhanh hơn)**
```bash
docker run --name toeic-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
```

### macOS
```bash
brew install postgresql@16
brew services start postgresql@16
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

---

## Tạo Database

### Sử dụng psql (Command Line)
```bash
# Kết nối vào PostgreSQL
psql -U postgres

# Tạo database
CREATE DATABASE toeic_master;

# Thoát
\q
```

### Sử dụng pgAdmin 4 (GUI)
1. Mở pgAdmin 4
2. Right-click "Databases" → Create → Database
3. Name: `toeic_master`
4. Click Save

---

## Cấu Hình Connection String

File `.env` đã được cập nhật:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/toeic_master?schema=public"
```

**Nếu dùng password khác**, sửa lại:
```
postgresql://postgres:YOUR_PASSWORD@localhost:5432/toeic_master?schema=public
```

---

## Chạy Migration

```bash
cd d:/Workspace/Minh/Test/WebEng/api-server

# 1. Generate Prisma Client với types mới
npx prisma generate

# 2. Tạo migration đầu tiên
npx prisma migrate dev --name init_postgresql

# 3. Seed dữ liệu mẫu
npx prisma db seed
```

---

## Kiểm Tra Kết Nối

```bash
# Xem database với Prisma Studio
npx prisma studio
```

Trình duyệt sẽ mở http://localhost:5555 để xem dữ liệu.

---

## Lợi Ích PostgreSQL vs SQLite

✅ **Hỗ trợ Json native** - Không cần JSON.stringify/parse  
✅ **Enum types** - Type-safe cho UserRole, TestType, CardState  
✅ **Production-ready** - Dễ deploy lên Supabase, Railway, Render  
✅ **Better performance** - Cho concurrent users  
✅ **Full-text search** - Tìm kiếm từ vựng nhanh hơn  

---

## Troubleshooting

### Lỗi: "Connection refused"
```bash
# Kiểm tra PostgreSQL đang chạy
# Windows
Get-Service postgresql*

# macOS/Linux
brew services list
# hoặc
sudo systemctl status postgresql
```

### Lỗi: "Database does not exist"
```bash
# Tạo lại database
psql -U postgres -c "CREATE DATABASE toeic_master;"
```

### Lỗi: "Password authentication failed"
Sửa password trong `.env` cho đúng với password PostgreSQL của bạn.

---

## Deploy Production

### Supabase (Miễn phí)
1. Tạo project tại https://supabase.com
2. Copy connection string từ Settings → Database
3. Update `.env`:
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### Railway (Miễn phí $5/month credit)
1. Tạo project tại https://railway.app
2. Add PostgreSQL service
3. Copy DATABASE_URL từ Variables tab
