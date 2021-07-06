import StockSymbolData from './StockSymbolData';

export type TradeType = 'BUY' | 'SELL';

// related to buying or selling
export default interface Trade {
    stock: StockSymbolData;
    date: number; // unix timestamp
    price?: number; // price related to the asset
    total: number; // total amount of the trade
    timestamp: number; // unix timestamp
    type: TradeType;
}
