# Hướng dẫn chạy Vue 3 Blog Project

## 📋 Yêu cầu hệ thống
- Node.js (v18 trở lên)
- npm hoặc yarn
- MySQL Server đang chạy

## 🚀 Các bước chạy project

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Cấu hình môi trường
```bash
# Copy file môi trường mẫu
cp .env.example .env

# Hoặc trên Windows
copy .env.example .env
```

### Bước 3: Cập nhật file .env
Mở file `.env` và cấu hình:
```env
VITE_APP_NAME="Vue 3 Blog"
VITE_API_BASE_URL="http://localhost:3000/api"
VITE_APP_URL="http://localhost:5173"

# Database (để backend sử dụng)
DB_DATABASE=vue3_blog_app
DB_USERNAME=root
DB_PASSWORD=
```

### Bước 4: Chạy development server
```bash
npm run dev
```

### Bước 5: Mở trình duyệt
Truy cập: http://localhost:5173

## 🔧 Các lệnh hữu ích

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview build
npm run preview

# Chạy tests
npm run test

# Lint code
npm run lint

# Format code
npm run format
```

## 🗄️ Database đã sẵn sàng

Database `vue3_blog_app` đã có:
- ✅ Tài khoản admin: admin@example.com / admin123
- ✅ Dữ liệu mẫu: categories, tags, blog posts
- ✅ Cấu trúc bảng hoàn chỉnh

## 📡 API Testing

Import Postman collection từ:
`postman/Vue3-Blog-API.postman_collection.json`

## 🎯 Tính năng có sẵn

- ✅ Authentication (Login/Register/Logout)
- ✅ Blog CRUD operations
- ✅ User profile management
- ✅ Admin panel
- ✅ Responsive design
- ✅ Search & filter
- ✅ File upload

## ❗ Lưu ý

1. Đảm bảo MySQL Server đang chạy
2. Port 5173 không bị sử dụng
3. Cần backend API để đầy đủ chức năng

## 🆘 Troubleshooting

### Lỗi không tìm thấy npm:
Cài đặt Node.js từ https://nodejs.org/

### Lỗi port đã sử dụng:
```bash
# Thay đổi port trong vite.config.js
npm run dev -- --port 3000
```

### Lỗi module not found:
```bash
rm -rf node_modules package-lock.json
npm install
```