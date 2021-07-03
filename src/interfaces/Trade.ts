import StockSymbolData from './StockSymbolData';
import currency from 'currency.js';
import { Moment } from 'moment';

export type TradeType = 'BUY' | 'SELL';

// related to buying or selling
export default interface Trade {
    stock: StockSymbolData;
    date: Moment;
    price?: number; // price related to the asset
    total: number; // total amount of the trade
    timestamp: Moment;
    type: TradeType;
}
