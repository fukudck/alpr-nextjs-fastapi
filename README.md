# 🚗 ALPR System - Next.js + FastAPI

[🔗 GitHub Repository](https://github.com/fukudck/alpr-nextjs-fastapi)

---

## 📋 Mục lục

- [📦 Cài đặt pnpm trên Windows](#-cài-đặt-pnpm-trên-windows)
- [🚀 Chạy dự án](#-chạy-dự-án)
- [⚙️ Thay đổi Port cho API](#️-thay-đổi-port-cho-api)
- [🌐 Link GitHub](#-link-github)

# 🚗 ALPR System - Next.js + FastAPI

[🔗 GitHub Repository](https://github.com/fukudck/alpr-nextjs-fastapi)

---

## 📋 Mục lục

- [📦 Cài đặt pnpm trên Windows](#-cài-đặt-pnpm-trên-windows)
- [🚀 Chạy dự án](#-chạy-dự-án)
- [⚙️ Thay đổi Port cho API](#️-thay-đổi-port-cho-api)
- [🌐 Link GitHub](#-link-github)

---

## 📦 Cài đặt pnpm trên Windows

> ⚠️ **Cảnh báo:**  
> Windows Defender đôi khi có thể chặn file thực thi.  
> 👉 Vì vậy, **khuyên dùng** cài đặt pnpm bằng **npm** hoặc **Corepack**.

### ✨ Cài đặt pnpm với PowerShell:

```powershell
Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
```

---

## 🚀 Chạy dự án

1. Mở **Terminal** tại thư mục dự án.
2. Cài đặt các gói phụ thuộc:

```bash
pnpm install
```

3. Khởi động database và chạy dự án:

```bash
pnpm dev
```

---

## ⚙️ Thay đổi Port cho API

Để thay đổi **port** trong API:

1. Mở file `api/conn.py`.
2. Tìm dòng:

```python
PORT = 12345
```

3. Chỉnh sửa giá trị, ví dụ:

```python
PORT = 3306
```

4. Lưu file và khởi động lại dự án:

```bash
pnpm dev
```

> ℹ️ **Lưu ý:** Hãy chắc chắn rằng port mới không bị chiếm bởi ứng dụng khác đang chạy.

---

## 🌐 Link GitHub

- [👉 Xem trên GitHub](https://github.com/fukudck/alpr-nextjs-fastapi)

---

> 💡 Được phát triển bởi [fukudck](https://github.com/fukudck)  
> Made with ❤️ using **Next.js** & **FastAPI**

---

## 📦 Cài đặt pnpm trên Windows

> ⚠️ **Cảnh báo:**  
> Windows Defender đôi khi có thể chặn file thực thi.  
> 👉 Vì vậy, **khuyên dùng** cài đặt pnpm bằng **npm** hoặc **Corepack**.

### ✨ Cài đặt pnpm với PowerShell:

```powershell
Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
### 
