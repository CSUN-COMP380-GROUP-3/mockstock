export default interface CandleStickData {
    c: number[]; // list of close prices for returned candles
    h: number[]; // list of high prices for returned candles
    l: number[]; // list of low prices for returned candles
    o: number[]; // list of open prices for returned candles
    s: string;   // status of the response
    v: number[]; // list of volume data for returned candles
    t: number[]; // list of UNIX timestamp for returned candles.
};

export type RESOLUTION = '1'|'5'|'15'|'30'|'60'|'D'|'W'|'M';

export interface CandleStickQuery {
    symbol: string;
    to: number;
    from: number;
    resolution: RESOLUTION;
    token: string;
};