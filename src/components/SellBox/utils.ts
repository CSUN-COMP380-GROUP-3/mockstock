import axios from "axios";
import querystring from 'querystring';
import { CandleStickQuery } from "../../interfaces/CandleStickData";

export const FH_OHLC_ENDPOINT = 'https://finnhub.io/api/v1/stock/candle?';

export function fetchCandles(query: CandleStickQuery) {
    const urlParams = querystring.stringify(query as any);
    console.log('fetching candles', urlParams);
    return axios.get(FH_OHLC_ENDPOINT + urlParams);
};

export const errorHandler = (error: any) => { // generic error handler
    if (error.response?.status === 401) {
        console.log("Invalid token, please make sure it is set as react app environment variable");
    };
    console.error(error);
};

