import StockSymbolData from './StockSymbolData';
import currency from 'currency.js';

// related to buying or selling
export default interface Stock {
    stock: StockSymbolData;
    price: currency;
    shares: currency;
};