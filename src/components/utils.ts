import axios, { AxiosResponse } from "axios";
import querystring from 'querystring';
import CandleStickData, { CandleStickQuery } from "../interfaces/CandleStickData";
import { QuoteData, QuoteQuery } from "../interfaces/QuoteData";

export const FH_OHLC_ENDPOINT = 'https://finnhub.io/api/v1/stock/candle?';
export const FH_Q_ENDPOINT = 'https://finnhub.io/api/v1/quote?';

//TODO: Can combine the fetch calls into a generic "fetch" function, but probably unecessary?

/**Fetches Candlestick information from FinnHub API */
export function fetchCandles(query: CandleStickQuery): Promise<AxiosResponse<CandleStickData>> {
    const urlParams = querystring.stringify(query as any);
    console.log('fetching candles', urlParams);
    return axios.get(FH_OHLC_ENDPOINT + urlParams);
};

/**Fetches Quote information from FinnHub API */
export function fetchQuote(query: QuoteQuery): Promise<AxiosResponse<QuoteData>> {
    const urlParams = querystring.stringify(query as any);
    console.log('fetching quote', urlParams);
    return axios.get(FH_Q_ENDPOINT + urlParams);
};

/**Handles errors that come from erroneous API calls to FinnHub API */
export const errorHandler = (error: any) => { // generic error handler
    // status code checks
    if (error.response?.status === 401) {
        return console.log('Invalid token, please make sure REACT_APP_API_KEY and REACT_APP_SANDBOX_KEY are set');
    };

    if (error.response?.status === 429) {
        return console.log('Rate limited by API, please wait before trying again');
    };

    console.error(error);
};

/**
 * Wait for a given amount of milliseconds
 * @param ms Number of milliseconds to wait
 * @returns A resolved promise
 */
export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

