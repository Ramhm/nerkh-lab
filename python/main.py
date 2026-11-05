#!/usr/bin/env python3
"""
nerkh.io
nerkh Development team
2026-11-04
"""

import json
import os
import sys
import urllib.error
import urllib.request

# ---------------------------------------------------------------
# تنظیمات — این بخش را تغییر دهید
# ---------------------------------------------------------------
BASE_URL = os.getenv("NERKH_API_BASE", "https://api.nerkh.io")  # آدرس پایه API
ENDPOINT = "/v2/prices/json/all"                                # مسیر همه قیمت‌ها (V2 - JSON)
API_TOKEN = os.getenv("NERKH_API_TOKEN", "YOUR_TOKEN_HERE")     # توکن Bearer
# ---------------------------------------------------------------

GROUPS = [
    ("gold", "طلا"),
    ("currency", "ارز"),
    ("crypto", "کریپتو"),
]


def main() -> int:
    # ارسال درخواست GET همراه با توکن
    request = urllib.request.Request(
        BASE_URL + ENDPOINT,
        headers={
            "Accept": "application/json",
            "Authorization": "Bearer " + API_TOKEN,
        },
    )

    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            body = response.read().decode("utf-8")
    except urllib.error.HTTPError as error:
        print(f"خطای HTTP: {error.code}", file=sys.stderr)
        print(error.read().decode("utf-8", "replace"), file=sys.stderr)
        return 1
    except Exception as error:  # خطای اتصال یا شبکه
        print(f"خطای اتصال: {error}", file=sys.stderr)
        return 1

    # تبدیل پاسخ JSON
    payload = json.loads(body).get("data") or {}
    prices = payload.get("prices") or payload

    # نمایش همه آیتم‌ها، گروه‌بندی‌شده
    total = 0
    for key, label in GROUPS:
        items = prices.get(key) or {}
        if not items:
            continue

        print(f"\n=== {label} ({len(items)} آیتم) ===")
        print(f"{'نماد':<20}{'قیمت':>16}{'تغییر ۲۴س':>14}  به‌روزرسانی")

        for symbol, item in items.items():
            current = item.get("current", "-")
            change = item.get("ch_24h_percent", 0)
            update = item.get("update", "-")
            print(f"{symbol:<20}{current:>16}{change:>13.2f}%  {update}")
            total += 1

    print(f"\nمجموع: {total} آیتم")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
