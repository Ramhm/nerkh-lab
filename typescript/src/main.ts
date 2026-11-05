/*
 * nerkh.io
 * nerkh Development team
 * 2026-11-04
 */

// ---------------------------------------------------------------
// تنظیمات — این بخش را تغییر دهید
// ---------------------------------------------------------------
const CONFIG = {
  BASE_URL: "https://api.nerkh.io", // آدرس پایه API
  ENDPOINT: "/v2/prices/json/all",  // مسیر همه قیمت‌ها (V2 - JSON)
  API_TOKEN: "YOUR_TOKEN_HERE"      // توکن Bearer خود را اینجا قرار دهید
};
// ---------------------------------------------------------------

type PriceItem = {
  current?: string;
  ch_24h_percent?: number;
  update?: string;
};

type PriceGroup = Record<string, PriceItem>;
type Prices = Record<string, PriceGroup>;

const GROUPS: Array<[string, string]> = [
  ["gold", "طلا"],
  ["currency", "ارز"],
  ["crypto", "کریپتو"]
];

const statusEl = document.querySelector<HTMLParagraphElement>("#status")!;
const appEl = document.querySelector<HTMLDivElement>("#app")!;

// جداکننده هزارگان و ارقام فارسی برای قیمت
function formatPrice(value?: string): string {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString("fa-IR") : "-";
}

// نمایش درصد تغییر ۲۴ ساعته با علامت مثبت/منفی
function formatChange(value?: number): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "-";
  const text = value.toLocaleString("fa-IR", { maximumFractionDigits: 2 });
  return (value > 0 ? "+" : "") + text + "٪";
}

// نمایش همه آیتم‌ها، گروه‌بندی‌شده
function render(prices: Prices, count: number): void {
  statusEl.textContent = `دریافت ${count.toLocaleString("fa-IR")} آیتم با موفقیت`;
  statusEl.className = "";

  appEl.innerHTML = GROUPS.map(([key, label]) => {
    const group = prices[key];
    if (!group) return "";

    const items = Object.entries(group);
    const cards = items.map(([symbol, item]) => {
      const changeClass = (item.ch_24h_percent ?? 0) > 0 ? "up" : (item.ch_24h_percent ?? 0) < 0 ? "down" : "";
      return `
        <article class="item">
          <div class="row">
            <span class="symbol">${symbol}</span>
            <span class="change ${changeClass}">${formatChange(item.ch_24h_percent)}</span>
          </div>
          <div class="price">${formatPrice(item.current)}</div>
          <div class="meta">آخرین به‌روزرسانی: ${item.update ?? "-"}</div>
        </article>`;
    }).join("");

    return `
      <section class="group">
        <h2>${label} <span>(${items.length.toLocaleString("fa-IR")} آیتم)</span></h2>
        <div class="items">${cards}</div>
      </section>`;
  }).join("");
}

async function loadPrices(): Promise<void> {
  try {
    // ارسال درخواست GET همراه با توکن
    const response = await fetch(CONFIG.BASE_URL + CONFIG.ENDPOINT, {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + CONFIG.API_TOKEN
      }
    });

    if (!response.ok) {
      throw new Error("خطای HTTP: " + response.status);
    }

    const body = await response.json();
    const data = body.data ?? {};
    const prices: Prices = data.prices ?? data;
    const count = Number(data.count) || Object.values(prices)
      .filter((group) => group && typeof group === "object")
      .reduce((sum, group) => sum + Object.keys(group).length, 0);

    render(prices, count);
  } catch (error) {
    statusEl.textContent = "خطا: " + (error as Error).message;
    statusEl.className = "error";
    appEl.innerHTML = "";
  }
}

loadPrices();
