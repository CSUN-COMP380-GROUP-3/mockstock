import React from 'react';
import currency from 'currency.js';

export interface LiquidBalanceInterface {
    prev: currency,
    curr: currency,
};

export interface LiquidBalanceContextInterface {
    liquidBalance: LiquidBalanceInterface,
    updateLiquidBalance: (balance: LiquidBalanceInterface) => void
};

export const initLiquidBalanceContext: LiquidBalanceContextInterface = {
    liquidBalance: {
        prev: currency(process.env.REACT_APP_SEED_MONEY || 100000),
        curr: currency(process.env.REACT_APP_SEED_MONEY || 100000),
    },
    updateLiquidBalance: () => {}
};

export const LiquidBalanceContext = React.createContext(initLiquidBalanceContext);