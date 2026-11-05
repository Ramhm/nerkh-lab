# اجرای نمونه C++

این نمونه قیمت‌های طلا، ارز و کریپتو را از نسخه ۲ API دریافت و در کنسول نمایش می‌دهد.

## پیش‌نیازها

- کامپایلر C++17 (مثل g++، clang++ یا MSVC)
- CMake 3.16 یا جدیدتر
- کتابخانه توسعه cURL
- دسترسی اینترنت برای دریافت هدر nlohmann/json

### نصب پیش‌نیازها در لینوکس (اوبونتو/دبیان)

```bash
sudo apt update
sudo apt install build-essential cmake libcurl4-openssl-dev
```

### نصب پیش‌نیازها در مک

```bash
brew install cmake curl
```

### نصب پیش‌نیازها در ویندوز

- Visual Studio 2022 با workload «Desktop development with C++»
- CMake
- cURL را با vcpkg نصب کنید:

```powershell
vcpkg install curl
cmake -S . -B build -DCMAKE_TOOLCHAIN_FILE=C:\vcpkg\scripts\buildsystems\vcpkg.cmake
cmake --build build
.\build\nerkh_example.exe
```

## مراحل اجرا

1. توکن خود را در فایل `main.cpp` جایگزین کنید:

```cpp
const std::string API_TOKEN = "YOUR_TOKEN_HERE";
```

2. وارد پوشه پروژه شوید:

```bash
cd examples/cpp
```

3. پروژه را بسازید و اجرا کنید:

```bash
cmake -S . -B build
cmake --build build
./build/nerkh_example
```

## خروجی مورد انتظار

فهرست آیتم‌ها به‌صورت گروه‌بندی‌شده (طلا، ارز و کریپتو) همراه با قیمت، درصد تغییر ۲۴ ساعته و زمان به‌روزرسانی چاپ می‌شود.

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
- **Could NOT find CURL**: بسته توسعه cURL نصب نیست.
- **curl/curl.h: No such file**: هدرهای cURL نصب نیستند.
