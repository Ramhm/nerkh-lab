/*
 * nerkh.io
 * nerkh Development team
 * 2026-11-04
 */

package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"sort"
	"time"
)

// ---------------------------------------------------------------
// تنظیمات — این بخش را تغییر دهید
// ---------------------------------------------------------------
var (
	baseURL  = "https://api.nerkh.io"                      // آدرس پایه API
	endpoint = "/v2/prices/json/all"                       // مسیر همه قیمت‌ها (V2 - JSON)
	apiToken = envOr("NERKH_API_TOKEN", "YOUR_TOKEN_HERE") // توکن Bearer
)

// ---------------------------------------------------------------

type Item struct {
	Current   string  `json:"current"`
	Change24h float64 `json:"ch_24h_percent"`
	Update    string  `json:"update"`
}

type Groups struct {
	Gold     map[string]Item `json:"gold"`
	Currency map[string]Item `json:"currency"`
	Crypto   map[string]Item `json:"crypto"`
}

type Data struct {
	Count  int     `json:"count"`
	Prices *Groups `json:"prices"`
	Groups
}

type Response struct {
	Data Data `json:"data"`
}

func main() {
	// ساخت درخواست GET همراه با توکن
	req, err := http.NewRequest(http.MethodGet, baseURL+endpoint, nil)
	if err != nil {
		fail("خطای ساخت درخواست: " + err.Error())
	}
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiToken)

	// ارسال درخواست و دریافت پاسخ
	client := &http.Client{Timeout: 20 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		fail("خطای اتصال: " + err.Error())
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fail("خطای خواندن پاسخ: " + err.Error())
	}

	if resp.StatusCode != http.StatusOK {
		fail(fmt.Sprintf("خطای HTTP: %d\n%s", resp.StatusCode, body))
	}

	// تبدیل پاسخ JSON به ساختار داده
	var result Response
	if err := json.Unmarshal(body, &result); err != nil {
		fail("پاسخ JSON نامعتبر است: " + err.Error())
	}

	groups := result.Data.Groups
	if result.Data.Prices != nil {
		groups = *result.Data.Prices
	}

	// نمایش همه آیتم‌ها، گروه‌بندی‌شده
	labels := []struct {
		Key   string
		Label string
		Items map[string]Item
	}{
		{"gold", "طلا", groups.Gold},
		{"currency", "ارز", groups.Currency},
		{"crypto", "کریپتو", groups.Crypto},
	}

	total := 0
	for _, group := range labels {
		if len(group.Items) == 0 {
			continue
		}

		symbols := make([]string, 0, len(group.Items))
		for symbol := range group.Items {
			symbols = append(symbols, symbol)
		}
		sort.Strings(symbols)

		fmt.Printf("\n=== %s (%d آیتم) ===\n", group.Label, len(symbols))
		fmt.Printf("%-20s %16s %10s  %s\n", "نماد", "قیمت", "تغییر ۲۴س", "به‌روزرسانی")

		for _, symbol := range symbols {
			item := group.Items[symbol]
			fmt.Printf("%-20s %16s %9.2f%%  %s\n", symbol, item.Current, item.Change24h, item.Update)
			total++
		}
	}

	fmt.Printf("\nمجموع: %d آیتم\n", total)
}

// خواندن متغیر محیطی با مقدار پیش‌فرض
func envOr(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func fail(message string) {
	fmt.Fprintln(os.Stderr, message)
	os.Exit(1)
}
