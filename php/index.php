<?php
/*
 * nerkh.io
 * nerkh Development team
 * 2026-11-04
 */

// ---------------------------------------------------------------
// تنظیمات — این بخش را تغییر دهید
// ---------------------------------------------------------------
$BASE_URL  = "https://api.nerkh.io";   // آدرس پایه API
$ENDPOINT  = "/v2/prices/json/all";    // مسیر همه قیمت‌ها (V2 - JSON)
$API_TOKEN = getenv("NERKH_API_TOKEN") ?: "YOUR_TOKEN_HERE"; // توکن Bearer
// ---------------------------------------------------------------

// ارسال درخواست GET همراه با توکن
$ch = curl_init($BASE_URL . $ENDPOINT);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => [
        "Accept: application/json",
        "Authorization: Bearer " . $API_TOKEN,
    ],
    CURLOPT_TIMEOUT        => 20,
]);

$body   = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error  = curl_error($ch);
curl_close($ch);

// بررسی خطاهای اتصال و پاسخ
if ($body === false) {
    fwrite(STDERR, "خطای اتصال: $error\n");
    exit(1);
}

if ($status !== 200) {
    fwrite(STDERR, "خطای HTTP: $status\n$body\n");
    exit(1);
}

// تبدیل پاسخ JSON به آرایه
$data = json_decode($body, true);
if (!is_array($data) || !isset($data["data"])) {
    fwrite(STDERR, "پاسخ JSON نامعتبر است\n");
    exit(1);
}

$payload = $data["data"];
$prices  = $payload["prices"] ?? $payload;

// نمایش همه آیتم‌ها، گروه‌بندی‌شده
$groups = [
    "gold"     => "طلا",
    "currency" => "ارز",
    "crypto"   => "کریپتو",
];

$total = 0;
foreach ($groups as $key => $label) {
    if (!isset($prices[$key]) || !is_array($prices[$key])) {
        continue;
    }

    $items = $prices[$key];
    printf("\n=== %s (%d آیتم) ===\n", $label, count($items));
    printf("%-20s %16s %10s  %s\n", "نماد", "قیمت", "تغییر ۲۴س", "به‌روزرسانی");

    foreach ($items as $symbol => $item) {
        printf(
            "%-20s %16s %9s%%  %s\n",
            $symbol,
            $item["current"] ?? "-",
            $item["ch_24h_percent"] ?? "-",
            $item["update"] ?? "-"
        );
        $total++;
    }
}

printf("\nمجموع: %d آیتم\n", $total);
