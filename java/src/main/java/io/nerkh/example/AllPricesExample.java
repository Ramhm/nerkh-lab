/*
 * nerkh.io
 * nerkh Development team
 * 2026-11-04
 */

package io.nerkh.example;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class AllPricesExample {

    // ---------------------------------------------------------------
    // تنظیمات — این بخش را تغییر دهید
    // ---------------------------------------------------------------
    private static final String BASE_URL = "https://api.nerkh.io"; // آدرس پایه API
    private static final String ENDPOINT = "/v2/prices/json/all";  // مسیر همه قیمت‌ها (V2 - JSON)
    private static final String API_TOKEN = "YOUR_TOKEN_HERE";     // توکن Bearer خود را اینجا قرار دهید
    // ---------------------------------------------------------------

    public static void main(String[] args) throws Exception {
        // ساخت درخواست GET همراه با توکن
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + ENDPOINT))
                .header("Accept", "application/json")
                .header("Authorization", "Bearer " + API_TOKEN)
                .GET()
                .build();

        // ارسال درخواست و دریافت پاسخ
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        // بررسی موفقیت پاسخ
        if (response.statusCode() != 200) {
            throw new RuntimeException("خطای HTTP: " + response.statusCode() + " - " + response.body());
        }

        // خواندن پاسخ JSON
        JsonObject root = JsonParser.parseString(response.body()).getAsJsonObject();
        JsonObject data = root.getAsJsonObject("data");
        JsonObject prices = data.has("prices") ? data.getAsJsonObject("prices") : data;

        // نمایش همه آیتم‌ها، گروه‌بندی‌شده
        String[][] groups = {
                {"gold", "طلا"},
                {"currency", "ارز"},
                {"crypto", "کریپتو"}
        };

        int total = 0;
        for (String[] group : groups) {
            if (!prices.has(group[0])) continue;

            JsonObject items = prices.getAsJsonObject(group[0]);
            System.out.println("\n=== " + group[1] + " (" + items.size() + " آیتم) ===");
            System.out.printf("%-20s %16s %10s  %s%n", "نماد", "قیمت", "تغییر ۲۴س", "به‌روزرسانی");

            for (var entry : items.entrySet()) {
                JsonObject item = entry.getValue().getAsJsonObject();
                String current = item.has("current") ? item.get("current").getAsString() : "-";
                String change = item.has("ch_24h_percent") ? item.get("ch_24h_percent").getAsString() : "-";
                String update = item.has("update") ? item.get("update").getAsString() : "-";

                System.out.printf("%-20s %16s %9s%%  %s%n", entry.getKey(), current, change, update);
                total++;
            }
        }

        System.out.printf("%nمجموع: %d آیتم%n", total);
    }
}
