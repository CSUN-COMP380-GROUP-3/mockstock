import React from 'react';
import Stock from '../interfaces/Stock';

export interface PortfolioInterface {
    items: Stock[];
};

export interface PortfolioContextInterface {
    stocks: PortfolioInterface;
    updateStocks: (stocks: PortfolioInterface) => void;
};

export const initPortfolioContext: PortfolioContextInterface = {
    stocks: {
        items: []
    },
    updateStocks: () => {}
};

export const PortfolioContext = React.createContext<PortfolioContextInterface>(initPortfolioContext);

