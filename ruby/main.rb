#!/usr/bin/env ruby
# nerkh.io
# nerkh Development team
# 2026-11-04

require "json"
require "net/http"
require "uri"

# ---------------------------------------------------------------
# تنظیمات — این بخش را تغییر دهید
# ---------------------------------------------------------------
BASE_URL  = ENV.fetch("NERKH_API_BASE", "https://api.nerkh.io") # آدرس پایه API
ENDPOINT  = "/v2/prices/json/all"                               # مسیر همه قیمت‌ها (V2 - JSON)
API_TOKEN = ENV.fetch("NERKH_API_TOKEN", "YOUR_TOKEN_HERE")     # توکن Bearer
# ---------------------------------------------------------------

GROUPS = [
  ["gold", "طلا"],
  ["currency", "ارز"],
  ["crypto", "کریپتو"]
].freeze

# ارسال درخواست GET همراه با توکن
uri = URI(BASE_URL + ENDPOINT)
request = Net::HTTP::Get.new(uri)
request["Accept"] = "application/json"
request["Authorization"] = "Bearer #{API_TOKEN}"

begin
  response = Net::HTTP.start(
    uri.host, uri.port,
    use_ssl: uri.scheme == "https",
    open_timeout: 20, read_timeout: 20
  ) { |http| http.request(request) }
rescue StandardError => error
  warn "خطای اتصال: #{error.message}"
  exit 1
end

# بررسی موفقیت پاسخ
unless response.is_a?(Net::HTTPSuccess)
  warn "خطای HTTP: #{response.code}"
  warn response.body
  exit 1
end

# تبدیل پاسخ JSON
payload = JSON.parse(response.body)["data"] || {}
prices = payload["prices"] || payload

# نمایش همه آیتم‌ها، گروه‌بندی‌شده
total = 0
GROUPS.each do |key, label|
  items = prices[key] || {}
  next if items.empty?

  puts "\n=== #{label} (#{items.size} آیتم) ==="
  puts format("%-20s %16s %10s  %s", "نماد", "قیمت", "تغییر ۲۴س", "به‌روزرسانی")

  items.each do |symbol, item|
    current = item["current"] || "-"
    change = item["ch_24h_percent"] || 0
    update = item["update"] || "-"
    puts format("%-20s %16s %9.2f%%  %s", symbol, current, change, update)
    total += 1
  end
end

puts "\nمجموع: #{total} آیتم"
