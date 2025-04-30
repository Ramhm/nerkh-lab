import axios from 'axios';
import chalk from 'chalk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration
const CONFIG = {
    apiUrl: process.env.API_URL,
    apiKey: process.env.API_KEY
};

// Gold price types to fetch
const GOLD_TYPES = {
    BAHAR: 'Bahare Azadi Coin',
    EMAMI: 'Emami Coin',
    NIM: 'Half Coin',
    ROB: 'Quarter Coin',
    GOLD_18: '18K Gold',
    GOLD_24: '24K Gold',
};

class NerkhGoldPriceFetcher {
    constructor() {
        this.prices = {};
        this.axiosInstance = axios.create({
            baseURL: CONFIG.apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.apiKey}`
            }
        });
    }

    async fetchPrices() {
        try {
            const response = await this.axiosInstance.get('');
            const data = response.data;
            this.prices = this.processPrices(data);
            this.displayPrices();
            return this.prices;
        } catch (error) {
            throw error;
        }
    }

    displayPrices() {
        Object.entries(this.prices).forEach(([type, data]) => {
            console.log(chalk.bold.cyan(`${type}:`));
            console.log(`  Current Price: ${chalk.green(data.price)}`);
            console.log(`  1-hour Range: ${chalk.yellow(data.min_1h)} - ${chalk.yellow(data.max_1h)} (${this.formatChange(data.change_1h)})`);
            console.log(`  12-hour Range: ${chalk.magenta(data.min_12h)} - ${chalk.magenta(data.max_12h)} (${this.formatChange(data.change_12h)})`);
            console.log(`  Last Update: ${chalk.gray(data.timestamp)}`);
            console.log('---');
        });
    }

    processPrices(data) {
        // Get the prices from the nested data structure
        const prices = data.data.prices;
        
        // Define the mapping between our types and API types
        const priceTypes = {
            [GOLD_TYPES.BAHAR]: 'SEKE_BAHAR',
            [GOLD_TYPES.EMAMI]: 'SEKE_EMAMI',
            [GOLD_TYPES.NIM]: 'SEKE_NIM',
            [GOLD_TYPES.ROB]: 'SEKE_ROB',
            [GOLD_TYPES.GOLD_18]: 'GOLD18K',
            [GOLD_TYPES.GOLD_24]: 'GOLD24K'
        };

        // Process all gold types in a loop
        return Object.entries(priceTypes).reduce((result, [type, apiType]) => {
            result[type] = {
                price: this.formatPrice(prices[apiType].current),
                min_1h: this.formatPrice(prices[apiType].min['1hour']),
                max_1h: this.formatPrice(prices[apiType].max['1hour']),
                min_12h: this.formatPrice(prices[apiType].min['12hour']),
                max_12h: this.formatPrice(prices[apiType].max['12hour']),
                timestamp: prices[apiType].update,
                change_1h: this.calculateChange(
                    parseInt(prices[apiType].current),
                    parseInt(prices[apiType].min['1hour']),
                    parseInt(prices[apiType].max['1hour'])
                ),
                change_12h: this.calculateChange(
                    parseInt(prices[apiType].current),
                    parseInt(prices[apiType].min['12hour']),
                    parseInt(prices[apiType].max['12hour'])
                )
            };
            return result;
        }, {});
    }

    calculateChange(current, min, max) {
        const range = max - min;
        if (range === 0) return 0;
        const position = current - min;
        return (position / range) * 100;
    }

    formatPrice(price) {
        // Format price with commas
        return new Intl.NumberFormat('en-US').format(price);
    }

    formatChange(change) {
        const color = change >= 50 ? chalk.green : chalk.red;
        return color(`${change.toFixed(1)}%`);
    }
}

// Export for use in other modules if needed
export default NerkhGoldPriceFetcher;

// Create an instance and run the fetcher
const fetcher = new NerkhGoldPriceFetcher();
fetcher.fetchPrices()
    .then(() => {
        console.log('Gold prices fetched successfully');
    })
    .catch(error => {
        console.error('Error fetching gold prices:', error.message);
        process.exit(1);
    }); 