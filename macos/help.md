# تست API روی مک (macOS)

این راهنما نشان می‌دهد چطور در Terminal (zsh) بررسی کنید API پاسخ درست می‌دهد و داده دارد.

## پیش‌نیازها

- `curl` (به‌صورت پیش‌فرض در macOS موجود است)
- `jq` (اختیاری ولی پیشنهاد می‌شود)

نصب jq با Homebrew:

```bash
brew install jq
```

## ۱. قرار دادن توکن

```bash
export NERKH_API_TOKEN="YOUR_TOKEN_HERE"
```

## ۲. تست سریع اتصال

```bash
curl -sS -o /tmp/nerkh.json -w "HTTP %{http_code}\n" \
  -H "Authorization: Bearer $NERKH_API_TOKEN" \
  -H "Accept: application/json" \
  "https://api.nerkh.io/v2/prices/json/all"
```

خروجی درست:

```text
HTTP 200
```

## ۳. بررسی وجود داده

```bash
jq -e '(.data.prices // .data) as $p
  | ($p.gold | length) > 0
  and ($p.currency | length) > 0
  and ($p.crypto | length) > 0' /tmp/nerkh.json >/dev/null \
  && echo "OK: data exists" \
  || echo "ERROR: data missing"
```

نمایش تعداد آیتم‌ها:

```bash
jq -r '(.data.prices // .data) as $p
  | "count=\(.data.count) gold=\($p.gold | length) currency=\($p.currency | length) crypto=\($p.crypto | length)"' \
  /tmp/nerkh.json
```

نمایش یک نمونه:

```bash
jq -r '(.data.prices // .data).gold | to_entries[0]
  | "sample: \(.key) current=\(.value.current) update=\(.value.update)"' \
  /tmp/nerkh.json
```

## ۴. اسکریپت یکجا

```bash
export NERKH_API_TOKEN="YOUR_TOKEN_HERE"
URL="https://api.nerkh.io/v2/prices/json/all"

HTTP_CODE=$(curl -sS -o /tmp/nerkh.json -w "%{http_code}" \
  -H "Authorization: Bearer $NERKH_API_TOKEN" "$URL")

echo "HTTP: $HTTP_CODE"

if [ "$HTTP_CODE" != "200" ]; then
  echo "پاسخ خطا:"
  cat /tmp/nerkh.json
  exit 1
fi

if jq -e '(.data.prices // .data) as $p
  | ($p.gold | length) > 0
  and ($p.currency | length) > 0
  and ($p.crypto | length) > 0' /tmp/nerkh.json >/dev/null; then
  echo "OK: API is healthy and data exists"
else
  echo "ERROR: response has no data"
  exit 1
fi
```

## اگر jq نداشتید

با Python 3 جایگزین کنید:

```bash
python3 - <<'PY'
import json

with open("/tmp/nerkh.json", encoding="utf-8") as file:
    data = json.load(file)["data"]

prices = data.get("prices", data)
print("count:", data.get("count"))
for key in ("gold", "currency", "crypto"):
    print(key, len(prices.get(key, {})))
PY
```

## معنی خطاها

- **HTTP 200**: درخواست موفق و داده موجود است.
- **HTTP 401**: توکن اشتباه یا نامعتبر است.
- **HTTP 403**: توکن غیرفعال (deactivated) شده است.
- **HTTP 460**: تعداد درخواست‌ها بیش از حد مجاز است (QuotaExceeded)؛ سهمیه را از `cp.nerkh.io` مدیریت کنید.
- **HTTP 404**: مسیر یا نسخه API اشتباه است.
- **HTTP 500**: خطای داخلی سرور؛ بعداً دوباره تلاش کنید.
