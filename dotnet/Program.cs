/*
 * nerkh.io
 * nerkh Development team
 * 2026-11-04
 */

using System.Net.Http.Headers;
using System.Text.Json;

// ---------------------------------------------------------------
// تنظیمات — این بخش را تغییر دهید
// ---------------------------------------------------------------
const string BaseUrl = "https://api.nerkh.io"; // آدرس پایه API
const string Endpoint = "/v2/prices/json/all";  // مسیر همه قیمت‌ها (V2 - JSON)
const string ApiToken = "YOUR_TOKEN_HERE";      // توکن Bearer خود را اینجا قرار دهید
// ---------------------------------------------------------------

// ساخت درخواست GET همراه با توکن
using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(20) };
using var request = new HttpRequestMessage(HttpMethod.Get, BaseUrl + Endpoint);
request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", ApiToken);
request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

// ارسال درخواست و دریافت پاسخ
using var response = await http.SendAsync(request);
var body = await response.Content.ReadAsStringAsync();

if (!response.IsSuccessStatusCode)
{
    Console.Error.WriteLine($"خطای HTTP: {(int)response.StatusCode}\n{body}");
    return;
}

// خواندن پاسخ JSON
using var document = JsonDocument.Parse(body);
var data = document.RootElement.GetProperty("data");
var prices = data.TryGetProperty("prices", out var nested) ? nested : data;

// نمایش همه آیتم‌ها، گروه‌بندی‌شده
var groups = new[]
{
    (Key: "gold", Label: "طلا"),
    (Key: "currency", Label: "ارز"),
    (Key: "crypto", Label: "کریپتو")
};

var total = 0;
foreach (var group in groups)
{
    if (!prices.TryGetProperty(group.Key, out var items))
    {
        continue;
    }

    var symbols = items.EnumerateObject().ToList();
    Console.WriteLine($"\n=== {group.Label} ({symbols.Count} آیتم) ===");
    Console.WriteLine(string.Format("{0,-20} {1,16} {2,10}  {3}", "نماد", "قیمت", "تغییر ۲۴س", "به‌روزرسانی"));

    foreach (var item in symbols)
    {
        var current = GetString(item.Value, "current");
        var change = GetString(item.Value, "ch_24h_percent");
        var update = GetString(item.Value, "update");

        Console.WriteLine(string.Format("{0,-20} {1,16} {2,9}%  {3}", item.Name, current, change, update));
        total++;
    }
}

Console.WriteLine($"\nمجموع: {total} آیتم");

// خواندن یک مقدار متنی از JSON با مقدار پیش‌فرض
static string GetString(JsonElement element, string propertyName) =>
    element.TryGetProperty(propertyName, out var value) ? value.ToString() : "-";
