import StockSymbolData from './StockSymbolData';
import currency from 'currency.js';
import { Moment } from 'moment';

export type TradeType = 'BUY' | 'SELL';

// related to buying or selling
export default interface Trade {
    stock: StockSymbolData;
    date: Moment;
    price?: currency; // price related to the asset
    total: currency; // total amount of the trade
    timestamp: Moment;
    type: TradeType;
};