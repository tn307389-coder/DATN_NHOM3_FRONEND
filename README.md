# DriveHub - Frontend (Quản lý trung tâm đào tạo lái xe)

Giao diện web của hệ thống DriveHub, xây dựng bằng **Vue 3 (Composition API) + Vite + Bootstrap 5**.

## Yêu cầu

- Node.js >= 18
- Backend DriveHub đang chạy tại `http://localhost:8081` (xem README backend)

## Cài đặt và chạy

```bash
npm install
npm run dev
```

Truy cập `http://localhost:5173`.

## Biến môi trường

Tạo file `.env` (đã có sẵn `.env` cho chạy local; xem `.env.example`):

| Biến | Mô tả |
|---|---|
| `VITE_API_BASE_URL` | Base URL API backend (mặc định `http://localhost:8081/api`) |
| `VITE_WS_URL` | URL WebSocket chat (mặc định `http://localhost:8081`) |
| `VITE_GOOGLE_CLIENT_ID` | Client ID Google OAuth cho đăng nhập Google |

## Scripts

| Lệnh | Mô tả |
|---|---|
| `npm run dev` | Chạy dev server |
| `npm run build` | Build production (đầu ra `dist/`) |
| `npm run preview` | Preview bản build |
| `npm test` | Chạy kiểm thử (Vitest) |

## Cấu trúc thư mục

```
├── components/          # Component dùng chung (SimpleTablePage, layout, site...)
├── views/               # Trang (45 views: Dashboard, DiemDanh, BangDiem...)
├── services/            # Tầng gọi API
│   ├── api.js           # Axios instance + interceptor (tự động refresh token)
│   ├── crudService.js   # Hàm CRUD generic
│   ├── taiKhoanService.js
│   ├── permissions.js   # Phân quyền theo vai trò
│   ├── validation.js    # Validate biểu mẫu
│   └── chatbot.js       # WebSocket chatbot
├── router/index.js      # Định tuyến + guard (kiểm tra đăng nhập/phân quyền)
├── composables/         # Logic tái sử dụng (toast, websocket...)
└── __tests__/           # Test (Vitest + Vue Test Utils)
```

## Tính năng chính

- Đăng nhập bằng mật khẩu / Google, tự động **refresh token** khi token hết hạn.
- 4 vai trò: **Admin**, **Nhân viên**, **Giáo viên**, **Học viên** — menu và thao tác hiển thị theo quyền.
- Quản lý: khóa học, lớp học, lịch học, lịch thi, điểm danh (theo buổi, ghi đè), bảng điểm thường xuyên, thi sát hạch, kết quả thi, phòng/ca, xe & bảo trì, phân công, tin tức, thông báo.
- Đăng ký khóa học công khai (OTP qua email), tra cứu hồ sơ, thanh toán QR, upload & duyệt ảnh đại diện.
- Dashboard thống kê, nhật ký hệ thống, chatbot tư vấn (WebSocket).

## Tài khoản demo

| Vai trò | Tên đăng nhập | Mật khẩu |
|---|---|---|
| Admin | `admin` | `admin123` |
| Nhân viên | (tạo qua trang quản trị) | - |
| Giáo viên | (tạo qua trang quản trị) | - |
| Học viên | (đăng ký hoặc tạo qua trang quản trị) | - |

> Mật khẩu mặc định do Admin đặt khi tạo tài khoản; tài khoản cá nhân có thể đổi mật khẩu tại mục hồ sơ.

## Kiểm thử

```bash
npm test
```

## Lưu ý

- Vite dev server bind cả IPv4 và IPv6 (`host: "::"`); khi gọi API từ địa chỉ `[::1]` cần backend CORS cho phép `http://[::1]:5173` (đã cấu hình sẵn).
- Cần backend chạy trước khi dùng các chức năng liên quan dữ liệu.
