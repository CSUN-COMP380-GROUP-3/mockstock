import StockSymbolData from './StockSymbolData';
import currency from 'currency.js';
import { Moment } from 'moment';

// related to buying or selling
export default interface Stock {
    stock: StockSymbolData;
    price: currency;
    shares: number;
    timestamp: Moment;
};