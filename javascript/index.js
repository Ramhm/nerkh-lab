/*
 * nerkh.io
 * nerkh Development team
 * 2026-11-04
 */

// ---------------------------------------------------------------
// تنظیمات — این بخش را تغییر دهید
// ---------------------------------------------------------------
const CONFIG = {
  BASE_URL: "https://api.nerkh.io",   // آدرس پایه API
  ENDPOINT: "/v2/prices/json/all",    // مسیر همه قیمت‌ها (V2 - JSON)
  API_TOKEN: process.env.NERKH_API_TOKEN || "YOUR_TOKEN_HERE" // توکن Bearer
};
// ---------------------------------------------------------------

// نمایش همه آیتم‌ها، گروه‌بندی‌شده
const GROUPS = [
  ["gold", "طلا"],
  ["currency", "ارز"],
  ["crypto", "کریپتو"]
];

async function main() {
  // ارسال درخواست GET همراه با توکن
  const response = await fetch(CONFIG.BASE_URL + CONFIG.ENDPOINT, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + CONFIG.API_TOKEN
    }
  });

  // بررسی موفقیت پاسخ
  if (!response.ok) {
    throw new Error("خطای HTTP: " + response.status);
  }

  const body = await response.json();
  const data = body.data || {};
  const prices = data.prices || data;

  let total = 0;
  for (const [key, label] of GROUPS) {
    const items = prices[key];
    if (!items) continue;

    const symbols = Object.keys(items);
    console.log(`\n=== ${label} (${symbols.length} آیتم) ===`);
    console.log(
      "نماد".padEnd(20) + "قیمت".padStart(16) + "تغییر ۲۴س".padStart(14) + "  به‌روزرسانی"
    );

    for (const symbol of symbols) {
      const item = items[symbol];
      const current = String(item.current ?? "-");
      const change = Number(item.ch_24h_percent ?? 0);
      const update = item.update ?? "-";

      console.log(
        symbol.padEnd(20) + current.padStart(16) + (change.toFixed(2) + "%").padStart(14) + "  " + update
      );
      total++;
    }
  }

  console.log(`\nمجموع: ${total} آیتم`);
}

// اجرا و نمایش خطا در صورت شکست
main().catch((error) => {
  console.error("خطا:", error.message);
  process.exit(1);
});
