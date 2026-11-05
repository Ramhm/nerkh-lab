# اجرای نمونه Node.js (بک‌اند)

این نمونه یک سرور Express است که توکن را سمت سرور نگه می‌دارد و داده‌های نسخه ۲ API را از مسیر `/prices` برمی‌گرداند.

## پیش‌نیازها

- Node.js 18 یا جدیدتر
- npm

## مراحل اجرا

1. توکن خود را در فایل `server.js` جایگزین کنید:

```javascript
API_TOKEN: process.env.NERKH_API_TOKEN || "YOUR_TOKEN_HERE"
```

یا بدون تغییر فایل، توکن را به‌صورت متغیر محیطی بدهید.

### لینوکس / مک

```bash
cd examples/nodejs
npm install
NERKH_API_TOKEN="YOUR_TOKEN_HERE" npm start
```

### ویندوز (PowerShell)

```powershell
cd examples\nodejs
npm install
$env:NERKH_API_TOKEN="YOUR_TOKEN_HERE"
npm start
```

### ویندوز (CMD)

```bat
cd examples\nodejs
npm install
set NERKH_API_TOKEN=YOUR_TOKEN_HERE
npm start
```

سپس در مرورگر یا با cURL:

```bash
curl http://localhost:3000/prices
```

## خروجی مورد انتظار

پاسخ JSON کامل API شامل گروه‌های `gold`، `currency` و `crypto` برگردانده می‌شود.

## خطاهای رایج

- **HTTP 401**: توکن اشتباه یا نامعتبر است.
- **HTTP 403**: توکن غیرفعال (deactivated) شده است.
- **HTTP 460**: تعداد درخواست‌ها بیش از حد مجاز است (QuotaExceeded)؛ سهمیه را از `cp.nerkh.io` مدیریت کنید.
- **EADDRINUSE**: پورت 3000 اشغال است؛ مقدار `PORT` را تغییر دهید.
- **node not found**: Node.js نصب نیست.
- **Cannot find package 'express'**: دستور `npm install` اجرا نشده است.
