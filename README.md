# NERKH Lab Environment

This repository provides a lightweight and modular lab environment for working with the **NERKH** web service and API.

It is built to support various experiments, simulations, and local setups using modern scripting tools and service orchestration.

## Website / Documentation
🌐 Official Website: [https://nerkh.io](https://nerkh.io)

📚 Official Documentation: [https://docs.nerkh.io](https://docs.nerkh.io)

## 📦 Features

- Ready-to-use environment for API simulations
- Supports both scripting and containerized workflows
- Easily adaptable for internal use or prototyping
- Pre-configured API testing examples
- Support for both Bearer token and API key authentication

## 🛠️ Stack & Tools

- Python & JavaScript runtime support
- Custom configuration and routing setup for local environments
- cURL commands for direct API testing
- Example requests for all major endpoints

## 🛠️ Prerequisites
- cURL (for command line testing)
- Valid NERKH API credentials (Bearer token or API key)


## 🚀 API Testing Examples

#### Authentication
```bash
# Validate token
curl -X POST 'https://api.nerkh.io/v1/auth/validate' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Currency Prices
```bash
# Get all currency prices (JSON)
curl -X GET 'https://api.nerkh.io/v1/prices/json/currency' \
  -H 'Authorization: Bearer YOUR_TOKEN'

# Get USD price (JSON)
curl -X GET 'https://api.nerkh.io/v1/prices/json/currency/USD' \
  -H 'Authorization: Bearer YOUR_TOKEN'

# Get USD price (XML)
curl -X GET 'https://api.nerkh.io/v1/prices/xml/currency/USD' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

#### Gold Prices
```bash
# Get all gold prices (JSON)
curl -X GET 'https://api.nerkh.io/v1/prices/json/gold' \
  -H 'Authorization: Bearer YOUR_TOKEN'

# Get 18K gold price (JSON)
curl -X GET 'https://api.nerkh.io/v1/prices/json/gold/GOLD18K' \
  -H 'Authorization: Bearer YOUR_TOKEN'

# Get 24K gold price (XML)
curl -X GET 'https://api.nerkh.io/v1/prices/xml/gold/GOLD24K' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```


#### Crypto Prices
```bash
# Get all crypto prices (JSON)
curl -X GET 'https://api.nerkh.io/v1/prices/json/crypto' \
  -H 'Authorization: Bearer YOUR_TOKEN'

# Get BTC price (JSON)
curl -X GET 'https://api.nerkh.io/v1/prices/json/crypto/BTC' \
  -H 'Authorization: Bearer YOUR_TOKEN'

# Get BTC price (XML)
curl -X GET 'https://api.nerkh.io/v1/prices/xml/crypto/BTC' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```


#### Using API Key (Alternative Authentication)
```bash
# Get currency prices with API key
curl -X GET 'https://api.nerkh.io/v1/prices/json/currency?x-api-key=YOUR_TOKEN'

# Get crypto prices with API key
curl -X GET 'https://api.nerkh.io/v1/prices/json/crypto?x-api-key=YOUR_TOKEN'

# Get gold prices with API key
curl -X GET 'https://api.nerkh.io/v1/prices/json/gold?x-api-key=YOUR_TOKEN'

```
