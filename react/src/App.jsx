/*
 * nerkh.io
 * nerkh Development team
 * 2026-11-04
 */

import { useEffect, useState } from "react";

// ---------------------------------------------------------------
// تنظیمات — این بخش را تغییر دهید
// ---------------------------------------------------------------
const CONFIG = {
  BASE_URL: "https://api.nerkh.io", // آدرس پایه API
  ENDPOINT: "/v2/prices/json/all",  // مسیر همه قیمت‌ها (V2 - JSON)
  API_TOKEN: "YOUR_TOKEN_HERE"      // توکن Bearer خود را اینجا قرار دهید
};
// ---------------------------------------------------------------

const GROUPS = [
  ["gold", "طلا"],
  ["currency", "ارز"],
  ["crypto", "کریپتو"]
];

function formatPrice(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString("fa-IR") : "-";
}

function formatChange(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "-";
  const text = value.toLocaleString("fa-IR", { maximumFractionDigits: 2 });
  return (value > 0 ? "+" : "") + text + "٪";
}

export default function App() {
  const [groups, setGroups] = useState([]);
  const [status, setStatus] = useState("در حال دریافت داده...");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPrices() {
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
        const prices = data.prices ?? data;

        const result = GROUPS.filter(([key]) => prices[key]).map(([key, label]) => ({
          key,
          label,
          items: Object.entries(prices[key]).map(([symbol, item]) => ({
            symbol,
            ...item
          }))
        }));

        if (cancelled) return;

        const count = Number(data.count) || result.reduce((sum, group) => sum + group.items.length, 0);
        setGroups(result);
        setStatus(`دریافت ${count.toLocaleString("fa-IR")} آیتم با موفقیت`);
        setError("");
      } catch (err) {
        if (cancelled) return;
        setStatus("");
        setError("خطا: " + err.message);
      }
    }

    loadPrices();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main>
      <h1>قیمت‌های Nerkh — نسخه ۲ (React)</h1>
      {status && <p className="status">{status}</p>}
      {error && <p className="status error">{error}</p>}

      {groups.map((group) => (
        <section className="group" key={group.key}>
          <h2>
            {group.label} <span>({group.items.length.toLocaleString("fa-IR")} آیتم)</span>
          </h2>
          <div className="items">
            {group.items.map((item) => {
              const change = Number(item.ch_24h_percent) || 0;
              const changeClass = change > 0 ? "up" : change < 0 ? "down" : "";
              return (
                <article className="item" key={item.symbol}>
                  <div className="row">
                    <span className="symbol">{item.symbol}</span>
                    <span className={`change ${changeClass}`}>
                      {formatChange(item.ch_24h_percent)}
                    </span>
                  </div>
                  <div className="price">{formatPrice(item.current)}</div>
                  <div className="meta">آخرین به‌روزرسانی: {item.update ?? "-"}</div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
