cmake_minimum_required(VERSION 3.16)
project(nerkh_example CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# دریافت هدر-only کتابخانه JSON
include(FetchContent)
FetchContent_Declare(
  nlohmann_json
  URL https://github.com/nlohmann/json/releases/download/v3.11.3/json.tar.xz
)
FetchContent_MakeAvailable(nlohmann_json)

# کتابخانه cURL باید روی سیستم نصب باشد
find_package(CURL REQUIRED)

add_executable(nerkh_example main.cpp)
target_link_libraries(nerkh_example PRIVATE CURL::libcurl nlohmann_json::nlohmann_json)
