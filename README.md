<div align="center">

# TOEIC Master AI

🚀 **Nền tảng luyện thi TOEIC & Học Tiếng Anh tối ưu hóa bằng Công nghệ Toàn diện** 

</div>

---

## 📖 Giới thiệu (Project Overview)

**TOEIC Master AI** là một hệ thống ứng dụng tự học tiếng Anh và luyện thi TOEIC từ cơ bản đến nâng cao. Ứng dụng không chỉ cung cấp các bài thi thử với giao diện trực quan sát thực tế mà còn mang tới trải nghiệm học tập hiện đại thông qua Flashcards tối ưu hóa ghi nhớ và hệ thống Gamification thú vị giúp người học giữ vững động lực mỗi ngày.

Project bao gồm một Backend mạnh mẽ sử dụng **NestJS** và Frontend mượt mà xây dựng trên **Next.js 16**.

---

## ✨ Tính năng nổi bật (Key Features)

### 1. Hệ thống Bài thi TOIEC chuyên sâu 📝
- Hỗ trợ đa dạng loại đề: **Full Test** (200 câu), **Mini Test** và **Part Practice**.
- **Split-Screen Layout:** Trình bày chuẩn TOEIC đối với các **Question Groups** (Part 6, Part 7) - màn hình chia đôi với đoạn văn/hình ảnh bên trái cố định và các câu hỏi trắc nghiệm bên phải giúp thí sinh dễ dàng theo dõi không phải cuộn trang.
- **Tính điểm & Phân tích chuyên sâu:** Tự động tính điểm, hiển thị tỷ lệ đúng/sai, đo thời gian làm bài, lưu lịch sử, và **xem lại chi tiết** với chế độ bật/tắt đáp án ngay lập tức.

### 2. Thuật toán Học từ vựng thông minh (FSRS Flashcards) 🧠
- Sử dụng thuật toán **FSRS (Free Spaced Repetition Scheduler)** - thế hệ tiếp theo sau Anki - tự động tính toán thời điểm hoàn hảo nhất lập vòng lặp lại thẻ từ để chống quên.
- Quản lý thẻ từ theo trạng thái: **Đang học**, **Sắp xếp lịch học**, **Ôn tập**.

### 3. Gamification (Trò chơi hóa học tập) 🎮
- Xóa bỏ cảm giác chán nản với hệ thống theo dõi và thưởng điểm kinh nghiệm **(XP)** sau mỗi lần luyện tập.
- Nâng **Cấp độ (Levels)** và mở khóa những **Huy hiệu (Badges)** danh giá (First Blood, Vocabulary Master, Grammar Guru, Speed Reader, v.v).
- Giữ chuỗi **Streaks** học tập hàng ngày 🔥 và thi đua trên bảng **Leaderboard**.

### 4. Giao diện Quản trị viên (Admin Panel) 👑
- Dashboard theo dõi dữ liệu tổng quan.
- Chỉnh sửa đề test (thêm/xóa câu hỏi đơn lẻ hoặc nhóm đoạn văn đọc hiểu dễ dàng).
- Tạo và tổ chức Deck, Flashcards.

---

## 🛠️ Công nghệ (Tech Stack)

### Frontend (`/web-app`)
- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI Library:** React.js 18
- **Styling:** Tailwind CSS + Radix UI (shadcn/ui) + Lucide Icons
- **State Management:** Zustand, @tanstack/react-query
- **Data Viz:** Recharts (Hiển thị biểu đồ lịch sử điểm)

### Backend (`/api-server`)
- **Framework:** NestJS 10 (TypeScript)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens)
- **Khác:** ts-node-dev, bcryptjs, giải thuật tự code FSRS.

---

## 📂 Kiến trúc Dự án (Project Structure)

```text
toeic-master-ai/
├── api-server/             # Backend API (NestJS)
│   ├── prisma/             # Database Schema & Migrations, Seeders
│   └── src/
│       ├── auth/           # Module Đăng nhập & Authentication
│       ├── users/          # Module Quản lý người dùng
│       ├── tests/          # Module Quản lý đề thi (Parts, QuestionGroups, Questions)
│       ├── gamification/   # Logic tính XP, huy hiệu, Leaderboard
│       ├── flashcards/     # Module thẻ từ và thuật toán ghi nhớ FSRS
│       └── ...
└── web-app/                # Frontend Web Application (Next.js)
    ├── app/                # Từng page và route ứng dụng (App Router)
    │   ├── admin/          # Khu vực Admin Dashboard
    │   ├── tests/          # Khu vực người dùng làm test
    │   ├── flashcards/     # Khu vực học từ vựng
    │   └── ...
    ├── components/         # React Components dùng chung
    ├── lib/                # API Client, helpers, Stores (Zustand)
    └── types/              # Type definitions
```

---

## ⚙️ Hướng dẫn cài đặt (Installation & Setup)

### Yêu cầu bản thân (Prerequisites)
- [Node.js](https://nodejs.org/) (Version 18+)
- [PostgreSQL](https://www.postgresql.org/) (Chạy local hoặc sử dụng host miễn phí như Supabase/Neon)

### Bước 1: Khởi tạo Database (Backend)

```bash
cd api-server
npm install
```
1. Tạo file `.env` ở thư mục `api-server` theo mẫu `.env.example`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/toeictest?schema=public"
JWT_SECRET="YOUR_SUPER_SECRET_KEY"
PORT=3000
```
2. Đẩy cấu trúc Database lên PostgreSQL và nạp dữ liệu mẫy (Seed):
```bash
npx prisma db push
npm run seed        # Tạo Admin user, Test cơ bản, Badges và Flashcards mặc định
```

3. Khởi động Backend:
```bash
npm run start:dev
```
*API sẽ chạy tại địa chỉ: `http://localhost:3000`*

### Bước 2: Khởi chạy Frontend (Web App)

Mở 1 terminal mới và chạy:
```bash
cd web-app
npm install
```
1. Tạo file `.env.local`:
```env
NEXT_PUBLIC_API_URL="http://localhost:3000"
```
2. Khởi động Frontend:
```bash
npm run dev
```
*Truy cập Website tại địa chỉ: `http://localhost:3001`*

---

## 👤 Tài khoản Test mặc định
Khi chạy lệnh `npm run seed` ở Bước 1, hệ thống đã tự sinh tài khoản demo:
- **Admin:** `admin@example.com` | Password: `admin`
- **User thường:** Vui lòng bấm vào nút Đăng ký (Register) ở giao diện chính.

---

## 🤝 Góp ý & Báo lỗi (Contributing & Issues)
Đây là một dự án luyện thi TOEIC toàn diện dành cho nhu cầu học tập và giảng dạy.
Mọi PR hoặc issue đóng góp xin vui lòng tạo trực tiếp tại tab Issues/Pull Requests. Cảm ơn sự quan tâm của bạn! 🎉
