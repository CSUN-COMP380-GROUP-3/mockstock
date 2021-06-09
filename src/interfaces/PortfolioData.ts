import StockSymbolData from './StockSymbolData';
import Trade from './Trade';

export default interface PortfolioItem {
    stock: StockSymbolData;
    trades: Trade[];
};