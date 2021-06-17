import StockSymbolData from './StockSymbolData';
import currency from 'currency.js';
import { Moment } from 'moment';

// related to buying or selling
export default interface Trade {
    stock: StockSymbolData;
    date: Moment;
    price: currency;
    amount: currency;
    isBuy: boolean;
    timestamp: Moment;
};