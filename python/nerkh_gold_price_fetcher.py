import os
import requests
from datetime import datetime
from dotenv import load_dotenv
from colorama import init, Fore, Style

# Initialize colorama
init()

# Load environment variables
load_dotenv()

# Configuration
CONFIG = {
    'api_url': os.getenv('API_URL'),
    'api_key': os.getenv('API_KEY')
}

# Gold price types to fetch
GOLD_TYPES = {
    'BAHAR': 'Bahare Azadi Coin',
    'EMAMI': 'Emami Coin',
    'NIM': 'Half Coin',
    'ROB': 'Quarter Coin',
    'GOLD_18': '18K Gold',
    'GOLD_24': '24K Gold'
}

class NerkhGoldPriceFetcher:
    def __init__(self):
        self.prices = {}
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {CONFIG["api_key"]}'
        })

    def fetch_prices(self):
        try:
            response = self.session.get(CONFIG['api_url'])
            response.raise_for_status()
            data = response.json()
            self.prices = self.process_prices(data)
            self.display_prices()
            return self.prices
        except requests.exceptions.RequestException as e:
            print(f"{Fore.RED}Error fetching gold prices: {str(e)}{Style.RESET_ALL}")
            raise

    def display_prices(self):
        for type_name, data in self.prices.items():
            print(f"{Fore.CYAN}{Style.BRIGHT}{type_name}:{Style.RESET_ALL}")
            print(f"  Current Price: {Fore.GREEN}{data['price']}{Style.RESET_ALL}")
            print(f"  1-hour Range: {Fore.YELLOW}{data['min_1h']} - {data['max_1h']} ({self.format_change(data['change_1h'])}){Style.RESET_ALL}")
            print(f"  12-hour Range: {Fore.MAGENTA}{data['min_12h']} - {data['max_12h']} ({self.format_change(data['change_12h'])}){Style.RESET_ALL}")
            print(f"  Last Update: {Fore.LIGHTBLACK_EX}{data['timestamp']}{Style.RESET_ALL}")
            print('---')

    def process_prices(self, data):
        prices = data['data']['prices']
        
        price_types = {
            GOLD_TYPES['BAHAR']: 'SEKE_BAHAR',
            GOLD_TYPES['EMAMI']: 'SEKE_EMAMI',
            GOLD_TYPES['NIM']: 'SEKE_NIM',
            GOLD_TYPES['ROB']: 'SEKE_ROB',
            GOLD_TYPES['GOLD_18']: 'GOLD18K',
            GOLD_TYPES['GOLD_24']: 'GOLD24K'
        }

        result = {}
        for type_name, api_type in price_types.items():
            result[type_name] = {
                'price': self.format_price(prices[api_type]['current']),
                'min_1h': self.format_price(prices[api_type]['min']['1hour']),
                'max_1h': self.format_price(prices[api_type]['max']['1hour']),
                'min_12h': self.format_price(prices[api_type]['min']['12hour']),
                'max_12h': self.format_price(prices[api_type]['max']['12hour']),
                'timestamp': prices[api_type]['update'],
                'change_1h': self.calculate_change(
                    int(prices[api_type]['current']),
                    int(prices[api_type]['min']['1hour']),
                    int(prices[api_type]['max']['1hour'])
                ),
                'change_12h': self.calculate_change(
                    int(prices[api_type]['current']),
                    int(prices[api_type]['min']['12hour']),
                    int(prices[api_type]['max']['12hour'])
                )
            }
        return result

    def calculate_change(self, current, min_price, max_price):
        range_price = max_price - min_price
        if range_price == 0:
            return 0
        position = current - min_price
        return (position / range_price) * 100

    def format_price(self, price):
        return f"{int(price):,}"

    def format_change(self, change):
        color = Fore.GREEN if change >= 50 else Fore.RED
        return f"{color}{change:.1f}%{Style.RESET_ALL}"

if __name__ == "__main__":
    fetcher = NerkhGoldPriceFetcher()
    try:
        fetcher.fetch_prices()
        print(f"{Fore.GREEN}Gold prices fetched successfully{Style.RESET_ALL}")
    except Exception as e:
        print(f"{Fore.RED}Error: {str(e)}{Style.RESET_ALL}")
        exit(1) 