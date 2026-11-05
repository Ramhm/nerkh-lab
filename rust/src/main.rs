/*
 * nerkh.io
 * nerkh Development team
 * 2026-11-04
 */

use serde_json::Value;
use std::time::Duration;

// ---------------------------------------------------------------
// تنظیمات — این بخش را تغییر دهید
// ---------------------------------------------------------------
const BASE_URL: &str = "https://api.nerkh.io"; // آدرس پایه API
const ENDPOINT: &str = "/v2/prices/json/all"; // مسیر همه قیمت‌ها (V2 - JSON)
const API_TOKEN: &str = "YOUR_TOKEN_HERE"; // توکن Bearer خود را اینجا قرار دهید
// ---------------------------------------------------------------

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // ساخت کلاینت و ارسال درخواست GET همراه با توکن
    let client = reqwest::blocking::Client::builder()
        .timeout(Duration::from_secs(20))
        .build()?;

    let response = client
        .get(format!("{}{}", BASE_URL, ENDPOINT))
        .header("Accept", "application/json")
        .bearer_auth(API_TOKEN)
        .send()?;

    // بررسی موفقیت پاسخ
    let status = response.status();
    let body = response.text()?;
    if !status.is_success() {
        return Err(format!("خطای HTTP: {}\n{}", status, body).into());
    }

    // تبدیل پاسخ JSON
    let root: Value = serde_json::from_str(&body)?;
    let data = &root["data"];
    let prices = if data.get("prices").is_some_and(Value::is_object) {
        &data["prices"]
    } else {
        data
    };

    // نمایش همه آیتم‌ها، گروه‌بندی‌شده
    let groups = [
        ("gold", "طلا"),
        ("currency", "ارز"),
        ("crypto", "کریپتو"),
    ];

    let mut total = 0;
    for (key, label) in groups {
        let Some(items) = prices.get(key).and_then(Value::as_object) else {
            continue;
        };

        println!("\n=== {} ({} آیتم) ===", label, items.len());
        println!(
            "{:<20} {:>16} {:>10}  {}",
            "نماد", "قیمت", "تغییر ۲۴س", "به‌روزرسانی"
        );

        for (symbol, item) in items {
            let current = item.get("current").and_then(Value::as_str).unwrap_or("-");
            let change = item
                .get("ch_24h_percent")
                .and_then(Value::as_f64)
                .unwrap_or(0.0);
            let update = item.get("update").and_then(Value::as_str).unwrap_or("-");

            println!(
                "{:<20} {:>16} {:>9.2}%  {}",
                symbol, current, change, update
            );
            total += 1;
        }
    }

    println!("\nمجموع: {} آیتم", total);
    Ok(())
}
