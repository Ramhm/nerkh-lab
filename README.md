# 🪙 Nerkh API Examples

نمونه‌کدهای کوتاه و آماده برای اتصال به **Nerkh API** و دریافت قیمت طلا، ارز و رمزارز از **نسخه ۲**.

## ✨ این ریپو برای چیست؟

- 🚀 شروع سریع کار با Nerkh API
- 🧩 الگو گرفتن برای پروژه‌های واقعی
- 🌍 اجرا و تست روی لینوکس، ویندوز و مک
- 📚 نمونه‌کد در زبان‌ها و فریم‌ورک‌های مختلف

## 🔗 مشخصات API

| مورد | مقدار |
|---|---|
| Base URL | `https://api.nerkh.io` |
| Endpoint | `GET /v2/prices/json/all` |
| احراز هویت | `Authorization: Bearer YOUR_TOKEN` |
| مستندات کامل | [`openapi.yaml`](./openapi.yaml) |

پاسخ شامل گروه‌های `gold`، `currency` و `crypto` است و برای هر آیتم قیمت فعلی، تغییر ۲۴ ساعته، محدوده قیمت و زمان به‌روزرسانی را برمی‌گرداند.

## 📁 ساختار ریپو

### 🖥️ بک‌اند

| دایرکتوری | زبان | توضیح |
|---|---|---|
| 🐍 [`python/`](./python) | Python | دریافت و چاپ همه قیمت‌ها با کتابخانه استاندارد |
| 💎 [`ruby/`](./ruby) | Ruby | دریافت و چاپ قیمت‌ها با `net/http` |
| 🟢 [`nodejs/`](./nodejs) | Node.js + Express | سرور واسط برای نگه‌داشتن توکن سمت سرور |
| ☕ [`java/`](./java) | Java | نمونه Maven با `HttpClient` |
| 🐘 [`php/`](./php) | PHP | نمونه CLI با cURL |
| 🟣 [`dotnet/`](./dotnet) | .NET | کنسول C# با `System.Text.Json` |
| 🐹 [`go/`](./go) | Go | نمونه CLI با `net/http` |
| 🦀 [`rust/`](./rust) | Rust | نمونه CLI با `reqwest` |
| ➕ [`cpp/`](./cpp) | C++ | نمونه CMake با libcurl و nlohmann/json |
| 🧙 [`delphi/`](./delphi) | Delphi | کنسول با `System.Net.HttpClient` |

### 🎨 فرانت‌اند

| دایرکتوری | فناوری | توضیح |
|---|---|---|
| 🌐 [`html/`](./html) | HTML + JavaScript | صفحه ساده بدون build |
| 🔷 [`typescript/`](./typescript) | TypeScript + Vite | نسخه تایپ‌شده نمونه HTML |
| ⚛️ [`react/`](./react) | React + Vite | نمایش کارت‌های قیمت |
| 💚 [`vue/`](./vue) | Vue + Vite | نمایش کارت‌های قیمت |
| 🔥 [`svelte/`](./svelte) | Svelte + Vite | نمایش کارت‌های قیمت |

### 🧪 راهنمای تست API

| دایرکتوری | سیستم‌عامل | توضیح |
|---|---|---|
| 🐧 [`linux/`](./linux) | Linux | تست با `curl` و `jq` در Shell |
| 🪟 [`windows/`](./windows) | Windows | تست با PowerShell و `curl.exe` |
| 🍎 [`macos/`](./macos) | macOS | تست با `curl` و `jq` در Terminal |

## ⚡ شروع سریع

```bash
export NERKH_API_TOKEN="YOUR_TOKEN_HERE"

curl -sS -H "Authorization: Bearer $NERKH_API_TOKEN" \
  "https://api.nerkh.io/v2/prices/json/all"
```

## 🔑 تنظیم توکن

- توکن را در بالای کد هر نمونه، در `API_TOKEN` قرار دهید.
- در نمونه‌های خط فرمان می‌توانید از متغیر محیطی `NERKH_API_TOKEN` استفاده کنید.
- ❗ هیچ‌وقت توکن واقعی را در ریپو commit نکنید.

## ⚠️ نکته امنیتی فرانت‌اند

نمونه‌های فرانت‌اند توکن را در مرورگر استفاده می‌کنند و فقط برای یادگیری مناسب‌اند. در پروژه واقعی از یک بک‌اند واسط مثل نمونه [`nodejs/`](./nodejs) استفاده کنید تا توکن افشا نشود.

## 🚨 خطاهای رایج

| کد | معنی |
|---|---|
| `401` | توکن اشتباه یا نامعتبر است |
| `403` | توکن غیرفعال (deactivated) شده است |
| `460` | تعداد درخواست‌ها بیش از حد مجاز است (QuotaExceeded) |
| `404` | مسیر یا نسخه API اشتباه است |
| `500` | خطای داخلی سرور؛ دوباره تلاش کنید |

## 📖 راهنمای هر نمونه

هر دایرکتوری یک فایل `help.md` دارد که شامل پیش‌نیازها، تنظیم توکن و دستور اجرا برای لینوکس، ویندوز و مک است.

## Website / Documentation
🌐 Official Website: [https://nerkh.io](https://nerkh.io)

📚 Official Documentation: [https://docs.nerkh.io](https://docs.nerkh.io)