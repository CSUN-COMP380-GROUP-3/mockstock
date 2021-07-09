import symbols from '../symbols.json';
import StockSymbolData from '../interfaces/StockSymbolData';

export const filteredSymbols = (symbols || [])
    .filter(s => s.type === 'Common Stock')
    .sort((a, b) => a.symbol.localeCompare(b.symbol)) as StockSymbolData[];