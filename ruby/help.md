# اجرای نمونه Ruby

این نمونه قیمت‌های طلا، ارز و کریپتو را از نسخه ۲ API دریافت و در کنسول نمایش می‌دهد. فقط از کتابخانه استاندارد استفاده می‌کند.

## پیش‌نیازها

- Ruby 2.6 یا جدیدتر

## مراحل اجرا

1. توکن خود را در فایل `main.rb` جایگزین کنید:

```ruby
API_TOKEN = ENV.fetch("NERKH_API_TOKEN", "YOUR_TOKEN_HERE")
```

یا بدون تغییر فایل، توکن را به‌صورت متغیر محیطی بدهید.

### لینوکس / مک

```bash
cd examples/ruby
NERKH_API_TOKEN="YOUR_TOKEN_HERE" ruby main.rb
```

### ویندوز (PowerShell)

```powershell
cd examples\ruby
$env:NERKH_API_TOKEN="YOUR_TOKEN_HERE"
ruby main.rb
```

### ویندوز (CMD)

```bat
cd examples\ruby
set NERKH_API_TOKEN=YOUR_TOKEN_HERE
ruby main.rb
```

## خروجی مورد انتظار

```text
=== طلا (22 آیتم) ===
نماد                          قیمت   تغییر ۲۴س  به‌روزرسانی
GOLD18K                  25972500      1.96%  1405-08-13 15:40:48
...

مجموع: 43 آیتم
```

## خطاهای رایج

- **HTTP 401**: توکن اشتباه یا نامعتبر است.
- **HTTP 403**: توکن غیرفعال (deactivated) شده است.
- **HTTP 460**: تعداد درخواست‌ها بیش از حد مجاز است (QuotaExceeded)؛ سهمیه را از `cp.nerkh.io` مدیریت کنید.
- **HTTP 404**: مسیر یا نسخه API اشتباه است.
- **ruby not found**: Ruby نصب نیست.
- **SSL_connect**: گواهی‌های سیستم یا تنظیمات پروکسی را بررسی کنید.
