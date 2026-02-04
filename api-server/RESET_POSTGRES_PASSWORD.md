# Reset PostgreSQL Password trên Windows

## Cách 1: Sử dụng pgAdmin 4 (Đơn giản nhất)

1. **Mở pgAdmin 4**
   - Start Menu → pgAdmin 4
   - Hoặc tìm kiếm "pgAdmin"

2. **Kết nối vào PostgreSQL**
   - Click vào "Servers" → "PostgreSQL 17"
   - Nhập password hiện tại (nếu biết)
   - Nếu không nhớ, dùng Cách 2 bên dưới

3. **Đổi password**
   - Right-click "Login/Group Roles" → "postgres"
   - Chọn "Properties"
   - Tab "Definition"
   - Nhập password mới: `postgres`
   - Click "Save"

4. **Tạo database**
   - Right-click "Databases" → "Create" → "Database"
   - Name: `toeic_master`
   - Click "Save"

---

## Cách 2: Reset Password qua Command Line (Nếu quên password)

### Bước 1: Cho phép trust authentication tạm thời

```powershell
# Mở PowerShell as Administrator
# Backup file cấu hình
Copy-Item "C:\Program Files\PostgreSQL\17\data\pg_hba.conf" "C:\Program Files\PostgreSQL\17\data\pg_hba.conf.backup"

# Chỉnh sửa pg_hba.conf
notepad "C:\Program Files\PostgreSQL\17\data\pg_hba.conf"
```

**Trong Notepad, tìm dòng:**
```
host    all             all             127.0.0.1/32            scram-sha-256
```

**Sửa thành:**
```
host    all             all             127.0.0.1/32            trust
```

Lưu file (Ctrl+S) và đóng Notepad.

### Bước 2: Restart PostgreSQL service

```powershell
# Stop service
Stop-Service postgresql-x64-17

# Start service
Start-Service postgresql-x64-17

# Chờ 3 giây
Start-Sleep -Seconds 3
```

### Bước 3: Đổi password

```powershell
# Kết nối không cần password
& 'C:\Program Files\PostgreSQL\17\bin\psql.exe' -U postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"
```

### Bước 4: Tạo database

```powershell
& 'C:\Program Files\PostgreSQL\17\bin\psql.exe' -U postgres -c "CREATE DATABASE toeic_master;"
```

### Bước 5: Khôi phục pg_hba.conf

```powershell
# Restore file backup
Copy-Item "C:\Program Files\PostgreSQL\17\data\pg_hba.conf.backup" "C:\Program Files\PostgreSQL\17\data\pg_hba.conf" -Force

# Restart lại
Restart-Service postgresql-x64-17
```

---

## Cách 3: Thay đổi trực tiếp trong Services (Nhanh nhất)

Nếu anh/chị nhớ password cũ:

```powershell
# Chạy lệnh này (nhập password cũ khi được hỏi)
$env:PGPASSWORD='[PASSWORD_CU]'
& 'C:\Program Files\PostgreSQL\17\bin\psql.exe' -U postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"
& 'C:\Program Files\PostgreSQL\17\bin\psql.exe' -U postgres -c "CREATE DATABASE toeic_master;"
```

---

## Sau khi reset xong

Chạy các lệnh sau:

```bash
cd d:/Workspace/Minh/Test/WebEng/api-server
npx prisma db push
npx prisma db seed
```

Xong! Database đã sẵn sàng.

---

## Nếu vẫn gặp lỗi

Báo em lỗi cụ thể, em sẽ hỗ trợ debug tiếp ạ!
