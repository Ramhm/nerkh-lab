# اجرای نمونه Python

این نمونه قیمت‌های طلا، ارز و کریپتو را از نسخه ۲ API دریافت و در کنسول نمایش می‌دهد. فقط از کتابخانه استاندارد استفاده می‌کند.

## پیش‌نیازها

- Python 3.8 یا جدیدتر

## مراحل اجرا

1. توکن خود را در فایل `main.py` جایگزین کنید:

```python
API_TOKEN = os.getenv("NERKH_API_TOKEN", "YOUR_TOKEN_HERE")
```

یا بدون تغییر فایل، توکن را به‌صورت متغیر محیطی بدهید.

2. وارد پوشه پروژه شوید و اجرا کنید.

### لینوکس / مک

```bash
cd examples/python
NERKH_API_TOKEN="YOUR_TOKEN_HERE" python3 main.py
```

### ویندوز (PowerShell)

```powershell
cd examples\python
$env:NERKH_API_TOKEN="YOUR_TOKEN_HERE"
py main.py
```

### ویندوز (CMD)

```bat
cd examples\python
set NERKH_API_TOKEN=YOUR_TOKEN_HERE
py main.py
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
- **python not found**: Python نصب نیست؛ در ویندوز از `py` استفاده کنید.
- **SSL: CERTIFICATE_VERIFY_FAILED**: گواهی‌های سیستم یا تنظیمات پروکسی را بررسی کنید.
