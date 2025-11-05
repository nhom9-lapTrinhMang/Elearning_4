# Hướng dẫn cài đặt MySQL Database cho Vue 3 Blog App

## 🗄️ Cách 1: Sử dụng phpMyAdmin (Dễ nhất)

### Bước 1: Mở phpMyAdmin
- Truy cập `http://localhost/phpmyadmin` (nếu dùng XAMPP)
- Hoặc `http://localhost:8080/phpmyadmin` (nếu dùng WAMP)

### Bước 2: Tạo Database mới
1. Click vào tab **"Databases"**
2. Nhập tên database: `vue3_blog_app`
3. Chọn Collation: `utf8mb4_unicode_ci`
4. Click **"Create"**

### Bước 3: Import Schema
1. Click vào database `vue3_blog_app` vừa tạo
2. Click tab **"Import"**
3. Click **"Choose File"** và chọn file `database/schema.sql`
4. Đảm bảo Format là **"SQL"**
5. Click **"Go"** để import

## 🖥️ Cách 2: Sử dụng MySQL Command Line

### Bước 1: Mở Command Prompt/Terminal
```bash
# Windows (XAMPP)
cd C:\xampp\mysql\bin

# Windows (WAMP)
cd C:\wamp64\bin\mysql\mysql8.0.X\bin

# Mac (Homebrew)
mysql

# Linux
mysql
```

### Bước 2: Đăng nhập MySQL
```bash
mysql -u root -p
```
Nhập password MySQL (thường để trống với XAMPP)

### Bước 3: Tạo Database
```sql
CREATE DATABASE vue3_blog_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vue3_blog_app;
```

### Bước 4: Import Schema
```bash
# Thoát MySQL trước
exit;

# Import file schema
mysql -u root -p vue3_blog_app < "D:\laptrinhmang\structure-vue3-project-2025\database\schema.sql"
```

## 🔧 Cách 3: Sử dụng MySQL Workbench

### Bước 1: Mở MySQL Workbench
- Kết nối đến MySQL server local

### Bước 2: Tạo Schema mới
1. Right-click trong **"SCHEMAS"** panel
2. Chọn **"Create Schema..."**
3. Nhập tên: `vue3_blog_app`
4. Set Charset: `utf8mb4`
5. Set Collation: `utf8mb4_unicode_ci`
6. Click **"Apply"**

### Bước 3: Import SQL File
1. Click vào schema `vue3_blog_app`
2. Menu **"Server"** → **"Data Import"**
3. Chọn **"Import from Self-Contained File"**
4. Browse đến file `database/schema.sql`
5. Chọn **"Default Target Schema"**: `vue3_blog_app`
6. Click **"Start Import"**

## 📊 Cách 4: Sử dụng Navicat/HeidiSQL

### Với Navicat:
1. Tạo connection mới đến MySQL
2. Right-click → **"New Database"** → Tên: `vue3_blog_app`
3. Right-click database → **"Execute SQL File..."**
4. Chọn file `schema.sql` và execute

### Với HeidiSQL:
1. Connect đến MySQL server
2. Right-click → **"Create new"** → **"Database"**
3. Tên: `vue3_blog_app`, Collation: `utf8mb4_unicode_ci`
4. Menu **"File"** → **"Load SQL file..."**
5. Chọn `schema.sql` và chạy (F9)

## ⚙️ Cấu hình kết nối Database

Sau khi tạo database, cập nhật file `.env`:

```env
# Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=vue3_blog_app
DB_USERNAME=root
DB_PASSWORD=

# Hoặc nếu có password
DB_PASSWORD=your_mysql_password
```

## 🔍 Kiểm tra Database đã được tạo

### Qua phpMyAdmin:
- Vào database `vue3_blog_app`
- Kiểm tra có các bảng: `users`, `blogs`, `categories`, `tags`, etc.

### Qua Command Line:
```sql
mysql -u root -p
USE vue3_blog_app;
SHOW TABLES;
SELECT COUNT(*) FROM users;
```

Kết quả phải hiển thị danh sách các bảng và có 1 user admin mặc định.

## 🚀 Dữ liệu mẫu có sẵn

Schema đã bao gồm:
- ✅ **1 Admin user** (email: admin@example.com, password: admin123)
- ✅ **6 Categories** mặc định
- ✅ **12 Tags** phổ biến
- ✅ **3 Blog posts** mẫu
- ✅ **Cấu hình hệ thống** cơ bản

## ❗ Lưu ý quan trọng

1. **Backup trước khi import** nếu đã có data
2. **Đảm bảo MySQL đang chạy** trước khi import
3. **Kiểm tra quyền user** có thể tạo database
4. **File encoding** phải là UTF-8
5. **MySQL version** >= 5.7 để hỗ trợ JSON columns

## 🆘 Xử lý lỗi thường gặp

### Lỗi "Access denied":
```bash
# Đăng nhập với user có quyền
mysql -u root -p
```

### Lỗi "Database exists":
```sql
DROP DATABASE IF EXISTS vue3_blog_app;
CREATE DATABASE vue3_blog_app;
```

### Lỗi charset:
```sql
ALTER DATABASE vue3_blog_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

Chọn cách nào thuận tiện nhất cho bạn. Nếu gặp lỗi, hãy cho tôi biết cụ thể để hỗ trợ! 🚀