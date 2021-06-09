import StockSymbolData from './StockSymbolData';
import currency from 'currency.js';
import { Moment } from 'moment';

// related to buying or selling
export default interface Trade {
    stock: StockSymbolData;
    startDate: Moment;
    endDate: Moment;
    buyInPrice: currency;
    sellPrice: currency;
    amount: currency;
    timestamp: Moment;
};