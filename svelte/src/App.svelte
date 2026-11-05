<!--
  nerkh.io
  nerkh Development team
  2026-11-04
-->

<script>
  import { onMount } from "svelte";

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

  let groups = [];
  let status = "در حال دریافت داده...";
  let error = "";

  // جداکننده هزارگان و ارقام فارسی برای قیمت
  function formatPrice(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number.toLocaleString("fa-IR") : "-";
  }

  // نمایش درصد تغییر ۲۴ ساعته با علامت مثبت/منفی
  function formatChange(value) {
    if (typeof value !== "number" || !Number.isFinite(value)) return "-";
    const text = value.toLocaleString("fa-IR", { maximumFractionDigits: 2 });
    return (value > 0 ? "+" : "") + text + "٪";
  }

  onMount(async () => {
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

      groups = GROUPS.filter(([key]) => prices[key]).map(([key, label]) => ({
        key,
        label,
        items: Object.entries(prices[key]).map(([symbol, item]) => ({
          symbol,
          ...item
        }))
      }));

      const count = Number(data.count) || groups.reduce((sum, group) => sum + group.items.length, 0);
      status = `دریافت ${count.toLocaleString("fa-IR")} آیتم با موفقیت`;
    } catch (err) {
      status = "";
      error = "خطا: " + err.message;
    }
  });
</script>

<main>
  <h1>قیمت‌های Nerkh — نسخه ۲ (Svelte)</h1>
  {#if status}<p class="status">{status}</p>{/if}
  {#if error}<p class="status error">{error}</p>{/if}

  {#each groups as group (group.key)}
    <section class="group">
      <h2>
        {group.label}
        <span>({group.items.length.toLocaleString("fa-IR")} آیتم)</span>
      </h2>
      <div class="items">
        {#each group.items as item (item.symbol)}
          <article class="item">
            <div class="row">
              <span class="symbol">{item.symbol}</span>
              <span class="change {item.ch_24h_percent > 0 ? 'up' : item.ch_24h_percent < 0 ? 'down' : ''}">
                {formatChange(item.ch_24h_percent)}
              </span>
            </div>
            <div class="price">{formatPrice(item.current)}</div>
            <div class="meta">آخرین به‌روزرسانی: {item.update ?? "-"}</div>
          </article>
        {/each}
      </div>
    </section>
  {/each}
</main>

<style>
  :global(body) {
    font-family: Tahoma, sans-serif;
    margin: 24px;
    background: #f7f7f8;
    color: #222;
  }

  h1 { font-size: 20px; }

  .status { margin: 12px 0; font-weight: bold; }
  .error { color: #c62828; }

  .group { margin-top: 24px; }
  .group h2 { font-size: 17px; margin-bottom: 10px; }
  .group h2 span { font-size: 13px; color: #777; font-weight: normal; }

  .items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 10px;
  }

  .item {
    background: #fff;
    border: 1px solid #e3e3e6;
    border-radius: 8px;
    padding: 12px;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }

  .symbol { font-weight: bold; }
  .price { font-size: 18px; }
  .change { font-size: 13px; font-weight: bold; }
  .change.up { color: #2e7d32; }
  .change.down { color: #c62828; }
  .meta { font-size: 12px; color: #777; margin-top: 6px; }
</style>
