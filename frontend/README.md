# Quiz Management Frontend

Ứng dụng React để test Backend API của hệ thống Quiz Management.

## 🚀 Tính năng

- ✅ Quản lý Quiz (CRUD)
- ✅ Quản lý Questions (CRUD)
- ✅ Thêm questions vào quiz
- ✅ Xem chi tiết quiz với danh sách questions
- ✅ Giao diện thân thiện, dễ sử dụng

## 📋 Yêu cầu

- Node.js >= 14
- Backend server đang chạy trên `http://localhost:4000`

## 🔧 Cài đặt

1. Di chuyển vào thư mục frontend:
```bash
cd frontend
```

2. Cài đặt dependencies:
```bash
npm install
```

## ▶️ Chạy ứng dụng

### Development mode
```bash
npm run dev
```

Ứng dụng sẽ chạy tại: **http://localhost:3000**

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## 📚 Cách sử dụng

### Bước 1: Chạy Backend
Đảm bảo backend server đang chạy:
```bash
cd ..
npm run dev
```

### Bước 2: Chạy Frontend
Mở terminal mới và chạy:
```bash
cd frontend
npm run dev
```

### Bước 3: Test API

1. **Tạo Questions trước:**
   - Vào trang "Questions"
   - Click "Add New Question"
   - Nhập câu hỏi, các options và chọn đáp án đúng
   - Click "Create Question"

2. **Tạo Quiz:**
   - Vào trang "Quizzes"
   - Click "Add New Quiz"
   - Nhập title, description
   - Có thể chọn questions ngay lúc tạo (optional)
   - Click "Create Quiz"

3. **Thêm Questions vào Quiz:**
   - Trong trang "Quizzes", click "View Details" của quiz
   - Scroll xuống phần "Add Questions to Quiz"
   - Click "Add to Quiz" cho mỗi question muốn thêm

4. **Edit/Delete:**
   - Mỗi item đều có nút Edit và Delete
   - Edit: Cập nhật thông tin
   - Delete: Xóa (có confirm)

## 🌐 API Endpoints được test

### Quiz Endpoints
- `GET /quizzes/getAllQuiz` - Lấy tất cả quizzes
- `POST /quizzes/create` - Tạo quiz mới
- `GET /quizzes/:quizId` - Lấy quiz theo ID
- `GET /quizzes/:quizId/populate` - Lấy quiz với questions
- `PUT /quizzes/update/:quizId` - Cập nhật quiz
- `DELETE /quizzes/delete/:quizId` - Xóa quiz
- `POST /quizzes/:quizId/question` - Thêm 1 question vào quiz
- `POST /quizzes/:quizId/questions` - Thêm nhiều questions vào quiz

### Question Endpoints
- `GET /question/getAllQuestion` - Lấy tất cả questions
- `POST /question/create` - Tạo question mới
- `GET /question/:questionId` - Lấy question theo ID
- `PUT /question/:questionId` - Cập nhật question
- `DELETE /question/:questionId` - Xóa question

## 🛠️ Tech Stack

- **React** 18.2
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **CSS** - Styling

## 📁 Cấu trúc thư mục

```
frontend/
├── src/
│   ├── api/
│   │   └── api.js              # API service layer
│   ├── components/
│   │   ├── QuizManagement.jsx  # Quiz CRUD component
│   │   └── QuestionManagement.jsx # Question CRUD component
│   ├── App.jsx                  # Main app với routing
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── index.html
├── vite.config.js
└── package.json
```

## 🔄 Proxy Configuration

Frontend được cấu hình proxy trong `vite.config.js`:
- Tất cả requests tới `/api/*` sẽ được forward tới `http://localhost:4000`
- Ví dụ: `/api/quizzes/getAllQuiz` → `http://localhost:4000/quizzes/getAllQuiz`

## 🐛 Troubleshooting

### Lỗi: Cannot connect to backend
- Kiểm tra backend có đang chạy không
- Kiểm tra port backend (mặc định 4000)
- Kiểm tra CORS đã được enable ở backend

### Lỗi: npm install failed
- Xóa thư mục `node_modules` và `package-lock.json`
- Chạy lại `npm install`

### Lỗi: Port 3000 already in use
- Thay đổi port trong `vite.config.js`
- Hoặc kill process đang dùng port 3000

## 📝 Notes

- Backend phải chạy trước khi chạy frontend
- Tất cả thay đổi sẽ được hot-reload tự động
- Mở Console (F12) để xem network requests và errors
