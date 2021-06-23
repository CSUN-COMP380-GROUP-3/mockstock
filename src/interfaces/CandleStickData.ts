/**The expected API response from a Candlestick API call from FinnHub */
export default interface CandleStickData {
    c: number[]; // list of close prices for returned candles
    h: number[]; // list of high prices for returned candles
    l: number[]; // list of low prices for returned candles
    o: number[]; // list of open prices for returned candles
    s: string;   // status of the response
    v: number[]; // list of volume data for returned candles
    t: number[]; // list of UNIX timestamp for returned candles.
};

/**The different possible values for the resolution argument in a Candlestick Query to FinnHub */
export type RESOLUTION = '1' | '5' | '15' | '30' | '60' | 'D' | 'W' | 'M';

/**The expected arguments for a Candlestick Query to FinnHub */
export interface CandleStickQuery {
    symbol: string;
    to: number;
    from: number;
    resolution: RESOLUTION;
    token: string;
};