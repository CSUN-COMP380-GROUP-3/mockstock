import React from 'react';
import Stock from '../interfaces/Stock';

export interface PortfolioInterface {
    [key: string]: Stock[],
};

export interface PortfolioContextInterface {
    portfolio: PortfolioInterface;
    updatePortfolio: (portfolio: PortfolioInterface) => void;
};

export const initPortfolioContext: PortfolioContextInterface = {
    portfolio: {},
    updatePortfolio: () => {}
};

export const PortfolioContext = React.createContext<PortfolioContextInterface>(initPortfolioContext);

