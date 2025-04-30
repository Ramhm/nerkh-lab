# Nerkh Gold Price Fetcher

> Developed by Nerkh Web Service Team - Testing Department

This is a simple Node.js application that fetches and displays gold prices from the Nerkh API. It supports various types of gold including Bahar Azadi, Emami, Nim, Rob, and different karat gold prices.

## About

This script was developed by the Nerkh Web Service Team's Testing Department to facilitate testing of the gold price API endpoints. It provides a simple interface to fetch and display various gold prices and their historical data.

## Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd javascript
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Copy the `.env.example` file to create your own `.env` file:
     ```bash
     cp .env.example .env
     ```
   - Get your API token:
     1. Visit [nerkh.io](https://nerkh.io/)
     2. Click on "دریافت کلید وب سرویس" (Get API Key)
     3. Copy your API token
   - Edit the `.env` file:
     - The API URL is already set to: `https://api.nerkh.io/v1/prices/json/gold`
     - Replace `your_api_key_here` with the token you copied from nerkh.io

## Usage

To run the application:

```bash
npm start
```

The application will fetch and display the following information for each gold type:
- Current price
- 1-hour price range (min/max)
- 12-hour price range (min/max)
- Price change percentage
- Last update timestamp

## Supported Gold Types

- Bahar Azadi Coin
- Emami Coin
- Half Coin (Nim)
- Quarter Coin (Rob)
- 18K Gold
- 24K Gold

## Output Format

The output is color-coded for better readability:
- Current price: Green
- 1-hour range: Yellow
- 12-hour range: Magenta
- Price changes: Green (≥50%) or Red (<50%)
- Timestamps: Gray

## Error Handling

The application includes basic error handling for:
- API connection issues
- Invalid API credentials
- Data parsing errors

## Dependencies

- axios: For making HTTP requests
- chalk: For colored console output
- dotenv: For environment variable management

## License

This project is provided as-is for testing purposes by the Nerkh Web Service Team. Please ensure you have proper authorization to use the Nerkh API.

## Contact

For any questions or issues regarding this testing tool, please contact the Nerkh Web Service Team's Testing Department. 