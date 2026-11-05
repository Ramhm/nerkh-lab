# تست API روی ویندوز

این راهنما نشان می‌دهد چطور در PowerShell یا CMD بررسی کنید API پاسخ درست می‌دهد و داده دارد.

## پیش‌نیازها

- ویندوز 10 یا جدیدتر (برای `curl.exe` داخلی) یا نصب `curl`
- PowerShell 5.1 یا جدیدتر برای خواندن JSON

## روش اصلی: PowerShell

### ۱. قرار دادن توکن

```powershell
$env:NERKH_API_TOKEN = "YOUR_TOKEN_HERE"
```

### ۲. تست اتصال و بررسی داده

```powershell
$url = "https://api.nerkh.io/v2/prices/json/all"

try {
    $response = Invoke-WebRequest -Uri $url `
        -Headers @{ Authorization = "Bearer $env:NERKH_API_TOKEN"; Accept = "application/json" } `
        -UseBasicParsing

    "HTTP: $($response.StatusCode)"

    $body = $response.Content | ConvertFrom-Json
    $prices = if ($body.data.prices) { $body.data.prices } else { $body.data }

    "count: $($body.data.count)"
    "gold: $($prices.gold.PSObject.Properties.Count)"
    "currency: $($prices.currency.PSObject.Properties.Count)"
    "crypto: $($prices.crypto.PSObject.Properties.Count)"

    $sample = $prices.gold.PSObject.Properties | Select-Object -First 1
    "sample: $($sample.Name) current=$($sample.Value.current) update=$($sample.Value.update)"
}
catch {
    "HTTP error: $($_.Exception.Response.StatusCode.value__)"
    $_.ErrorDetails.Message
}
```

خروجی درست چیزی شبیه این است:

```text
HTTP: 200
count: 43
gold: 22
currency: 9
crypto: 12
sample: GOLD18K current=25972500 update=1405-08-13 15:40:48
```

### ۳. بررسی شرطی داده

```powershell
$body = (Invoke-WebRequest -Uri "https://api.nerkh.io/v2/prices/json/all" `
    -Headers @{ Authorization = "Bearer $env:NERKH_API_TOKEN" } `
    -UseBasicParsing).Content | ConvertFrom-Json

$prices = if ($body.data.prices) { $body.data.prices } else { $body.data }

if ($body.data.count -gt 0 -and
    $prices.gold.PSObject.Properties.Count -gt 0 -and
    $prices.currency.PSObject.Properties.Count -gt 0 -and
    $prices.crypto.PSObject.Properties.Count -gt 0) {
    "OK: API is healthy and data exists"
} else {
    "ERROR: response has no data"
}
```

## روش جایگزین: CMD با curl.exe

```bat
set NERKH_API_TOKEN=YOUR_TOKEN_HERE
curl.exe -sS -D headers.txt -o nerkh.json ^
  -H "Authorization: Bearer %NERKH_API_TOKEN%" ^
  -H "Accept: application/json" ^
  "https://api.nerkh.io/v2/prices/json/all"
findstr /B "HTTP/" headers.txt
type nerkh.json
```

برای بررسی ساختار JSON در CMD، از PowerShell استفاده کنید:

```powershell
(Get-Content nerkh.json -Raw | ConvertFrom-Json).data.count
```

## نکته

- در Windows PowerShell، دستور `curl` به‌طور پیش‌فرض به `Invoke-WebRequest` اشاره می‌کند. برای استفاده از curl واقعی، `curl.exe` بنویسید.

## معنی خطاها

- **HTTP 200**: درخواست موفق و داده موجود است.
- **HTTP 401**: توکن اشتباه یا نامعتبر است.
- **HTTP 403**: توکن غیرفعال (deactivated) شده است.
- **HTTP 460**: تعداد درخواست‌ها بیش از حد مجاز است (QuotaExceeded)؛ سهمیه را از `cp.nerkh.io` مدیریت کنید.
- **HTTP 404**: مسیر یا نسخه API اشتباه است.
- **HTTP 500**: خطای داخلی سرور؛ بعداً دوباره تلاش کنید.
