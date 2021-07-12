require('dotenv').config();
const axios = require('axios').default;
const fs = require('fs');
const moment = require('moment');
const querystring = require('querystring');

const token = process.env.REACT_APP_API_KEY;

const symbolEndpoint = `https://finnhub.io/api/v1/stock/symbol?exchange=US&currency=USD&token=${token}`;
const symbolFilename = 'symbols.json';

const initStockSymbol = process.env.REACT_APP_INITIAL_STOCK;
const to = moment().unix();
const from = moment().subtract(1, 'year').unix();
const initStockEndpoint = `https://finnhub.io/api/v1/stock/candle?${querystring.stringify({
    symbol: initStockSymbol,
    to,
    from,
    resolution: 'D',
    token,
})}`;
const initStockFilename = 'initCandles.json';

(async () => {
    try {
        await fetchAndWriteSymbols();
        await fetchAndWriteInitCandles();
    } catch(err) {
        console.error(err);
        console.log('Failed to prefetch data');
    };
})();

async function fetchAndWriteSymbols() {
    console.log('Fetching stock symbols');
    const { data } = await axios.get(symbolEndpoint, { responseType: 'arraybuffer' });
    console.log(`Writing symbols to ./src/${symbolFilename}`);
    fs.writeFileSync(`./src/${symbolFilename}`, data);
};

async function fetchAndWriteInitCandles() {
    console.log(`Fetching ${initStockSymbol} data`);
    const { data } = await axios.get(initStockEndpoint, { responseType: 'arraybuffer' });
    console.log(`Writing initial candles to ./src/${initStockFilename}`);
    fs.writeFileSync(`./src/${initStockFilename}`,data);
};
