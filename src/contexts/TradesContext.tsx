import React from 'react';
import Trade from '../interfaces/Trade';

export interface TradesInterface {
    items: Trade[];
};

export interface TradesContextInterface {
    trades: TradesInterface;
    updateTrades: (trades: TradesInterface) => void;
};

export const initTradesContext: TradesContextInterface = {
    trades: {
        items: []
    },
    updateTrades: () => {}
};

export const TradesContext = React.createContext<TradesContextInterface>(initTradesContext);
