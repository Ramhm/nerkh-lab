/*
 * nerkh.io
 * nerkh Development team
 * 2026-11-04
 */

import express from "express";

// ---------------------------------------------------------------
// تنظیمات — این بخش را تغییر دهید
// ---------------------------------------------------------------
const CONFIG = {
  PORT: Number(process.env.PORT || 3000),            // پورت سرور
  BASE_URL: "https://api.nerkh.io",                  // آدرس پایه API
  ENDPOINT: "/v2/prices/json/all",                   // مسیر همه قیمت‌ها (V2 - JSON)
  API_TOKEN: process.env.NERKH_API_TOKEN || "YOUR_TOKEN_HERE" // توکن Bearer
};
// ---------------------------------------------------------------

const app = express();

// دریافت قیمت‌ها از API و برگرداندن آن‌ها به کلاینت
app.get("/prices", async (req, res) => {
  try {
    const response = await fetch(CONFIG.BASE_URL + CONFIG.ENDPOINT, {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + CONFIG.API_TOKEN
      }
    });

    const body = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Nerkh API error",
        status: response.status,
        body
      });
    }

    res.type("application/json").send(body);
  } catch (error) {
    res.status(502).json({
      error: "Connection failed",
      message: error.message
    });
  }
});

// راهنمای کوتاه در ریشه سرور
app.get("/", (req, res) => {
  res.json({
    message: "Nerkh backend example",
    prices: `http://localhost:${CONFIG.PORT}/prices`
  });
});

app.listen(CONFIG.PORT, () => {
  console.log(`Server running: http://localhost:${CONFIG.PORT}/prices`);
});
