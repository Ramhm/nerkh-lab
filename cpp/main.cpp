/*
 * nerkh.io
 * nerkh Development team
 * 2026-11-04
 */

#include <curl/curl.h>
#include <nlohmann/json.hpp>

#include <iomanip>
#include <iostream>
#include <string>
#include <vector>

using json = nlohmann::json;

// ---------------------------------------------------------------
// تنظیمات — این بخش را تغییر دهید
// ---------------------------------------------------------------
const std::string BASE_URL = "https://api.nerkh.io";  // آدرس پایه API
const std::string ENDPOINT = "/v2/prices/json/all";   // مسیر همه قیمت‌ها (V2 - JSON)
const std::string API_TOKEN = "YOUR_TOKEN_HERE";      // توکن Bearer خود را اینجا قرار دهید
// ---------------------------------------------------------------

// جمع‌آوری پاسخ در یک رشته
static size_t writeCallback(char* data, size_t size, size_t count, void* userdata) {
    auto* buffer = static_cast<std::string*>(userdata);
    buffer->append(data, size * count);
    return size * count;
}

int main() {
    curl_global_init(CURL_GLOBAL_DEFAULT);
    CURL* curl = curl_easy_init();
    if (!curl) {
        std::cerr << "خطا: curl init failed\n";
        return 1;
    }

    std::string body;
    struct curl_slist* headers = nullptr;
    headers = curl_slist_append(headers, ("Authorization: Bearer " + API_TOKEN).c_str());
    headers = curl_slist_append(headers, "Accept: application/json");

    // ارسال درخواست GET همراه با توکن
    curl_easy_setopt(curl, CURLOPT_URL, (BASE_URL + ENDPOINT).c_str());
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, writeCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &body);
    curl_easy_setopt(curl, CURLOPT_TIMEOUT, 20L);

    CURLcode result = curl_easy_perform(curl);
    long status = 0;
    curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &status);

    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);
    curl_global_cleanup();

    // بررسی خطاهای اتصال و پاسخ
    if (result != CURLE_OK) {
        std::cerr << "خطای اتصال: " << curl_easy_strerror(result) << "\n";
        return 1;
    }

    if (status != 200) {
        std::cerr << "خطای HTTP: " << status << "\n" << body << "\n";
        return 1;
    }

    // تبدیل پاسخ JSON
    json root;
    try {
        root = json::parse(body);
    } catch (const std::exception& error) {
        std::cerr << "پاسخ JSON نامعتبر است: " << error.what() << "\n";
        return 1;
    }

    json data = root.value("data", json::object());
    json prices = (data.contains("prices") && data["prices"].is_object()) ? data["prices"] : data;

    // نمایش همه آیتم‌ها، گروه‌بندی‌شده
    struct Group {
        std::string key;
        std::string label;
    };

    const std::vector<Group> groups = {
        {"gold", "طلا"},
        {"currency", "ارز"},
        {"crypto", "کریپتو"}
    };

    int total = 0;
    for (const auto& group : groups) {
        if (!prices.contains(group.key) || !prices[group.key].is_object()) {
            continue;
        }

        const json& items = prices[group.key];
        std::cout << "\n=== " << group.label << " (" << items.size() << " آیتم) ===\n";
        std::cout << std::left << std::setw(20) << "نماد"
                  << std::right << std::setw(16) << "قیمت"
                  << std::setw(10) << "تغییر ۲۴س" << "  به‌روزرسانی\n";

        for (auto it = items.begin(); it != items.end(); ++it) {
            const json& item = it.value();
            std::string current = item.value("current", std::string("-"));
            double change = item.value("ch_24h_percent", 0.0);
            std::string update = item.value("update", std::string("-"));

            std::cout << std::left << std::setw(20) << it.key()
                      << std::right << std::setw(16) << current
                      << std::setw(9) << std::fixed << std::setprecision(2) << change << "%  "
                      << update << "\n";
            total++;
        }
    }

    std::cout << "\nمجموع: " << total << " آیتم\n";
    return 0;
}
