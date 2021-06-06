import React from 'react';

import CandleStickData from '../interfaces/CandleStickData';
import StockSymbolData from '../interfaces/StockSymbolData';
import { minDate } from '../components/DatePicker/DatePicker';
import moment, { Moment } from 'moment';
import initCandles from '../initCandles.json';
import { filteredSymbols } from './StockSymbolsContext';


export interface ActiveInvestmentInterface {
    stock: StockSymbolData;
    from: Moment;
    to: Moment;
    amount: string;
    candles?: CandleStickData; // really should be mandatory since we will preload with info
};

export interface ActiveInvestmentContextInterface {
    activeInvestment: ActiveInvestmentInterface;
    updateActiveInvestment: (activeInvestment: ActiveInvestmentInterface) => void;
};

const initSymbol = process.env.REACT_APP_INITIAL_STOCK || 'GME';
const initAmount = process.env.REACT_APP_INITIAL_AMOUNT || '10000.00';

export const initActiveInvestmentContext: ActiveInvestmentContextInterface = {
    activeInvestment: {
        stock: filteredSymbols.find(s => s.symbol === initSymbol) || filteredSymbols[0],
        from: minDate, // 1 year in the past
        to: moment(),  // current
        amount: initAmount,
        candles: initCandles
    },
    updateActiveInvestment: () => {}
};

export const ActiveInvestmentContext = React.createContext<ActiveInvestmentContextInterface>(initActiveInvestmentContext);
