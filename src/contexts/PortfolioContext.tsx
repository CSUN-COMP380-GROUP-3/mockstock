import React from 'react';
import Stock from '../interfaces/Stock';
import Trade from '../interfaces/Trade';

/**
 * {
 *  "GME": [{}, {}],
 *  "AMC": [{}, {}],
 * }
 */
export interface PortfolioInterface {
    [key: string]: Trade[],
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

