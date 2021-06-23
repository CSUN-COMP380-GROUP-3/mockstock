import axios from "axios";
import querystring from 'querystring';
import { CandleStickQuery } from "../interfaces/CandleStickData";
import { QuoteQuery } from "../interfaces/QuoteData";

export const FH_OHLC_ENDPOINT = 'https://finnhub.io/api/v1/stock/candle?';
export const FH_Q_ENDPOINT = 'https://finnhub.io/api/v1/quote?';

/**Fetches Candlestick information from FinnHub API */
export function fetchCandles(query: CandleStickQuery) {
    const urlParams = querystring.stringify(query as any);
    console.log('fetching candles', urlParams);
    return axios.get(FH_OHLC_ENDPOINT + urlParams);
};

/**Fetches Quote information from FinnHub API */
export function fetchQuote(query: QuoteQuery) {
    const urlParams = querystring.stringify(query as any);
    console.log('fetching quote', urlParams);
    return axios.get(FH_Q_ENDPOINT + urlParams);
};

/**Handles errors that come from erroneous API calls to FinnHub API */
export const errorHandler = (error: any) => { // generic error handler
    if (error.response?.status === 401) {
        console.log("Invalid token, please make sure it is set as react app environment variable");
    };
    console.error(error);
};

