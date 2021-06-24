import React from 'react';
import { TradesInterface } from '../contexts/TradesContext';
import Trade from '../interfaces/Trade';

export interface PortfolioInterface {
    [key: string]: TradesInterface,
};

export interface PortfolioContextInterface {
    portfolio: PortfolioInterface;
    updatePortfolio: (portfolio: PortfolioInterface) => void;
    has: (symbol: string) => boolean;
    addToPortfolio: (trade: Trade) => boolean;
    length: number;
};

/**
 * PortfolioProvider is meant to be a wrapper around the portfolio state. When the portfolio state 
 * is created it's reference and its update function are held in the PortfolioProvider's portfolio, 
 * and updatePortfolio property respectively. Doing so allows all logic pertaining to the portfolio 
 * to be handled within this exported instance on line 64. 
 */
class PortfolioProvider implements PortfolioContextInterface {
    portfolio: PortfolioInterface;
    updatePortfolio: (portfolio: PortfolioInterface) => void;
    constructor() {
        this.portfolio = {};
        this.updatePortfolio = () => {};
    };

    /**
     * Checks if a certain stock is in the portfolio
     * @param symbol The stock's unique identifier
     */
    has(symbol: string): boolean {
        return !!this.portfolio[symbol] && this.portfolio[symbol].length >= 0;
    };

    addToPortfolio(trade: Trade): boolean {
        // check if the symbol is in the portfolio
        // if has returns true then we have an existing array for the corresponding symbol, 
        // otherwise we need to create one
        const {stock} = trade;
        const newPortfolio = Object.assign({}, this.portfolio);
        if (this.has(stock.symbol)) {
            // symbol already in portfolio
            // add most recent trade to the top of the stack
            newPortfolio[stock.symbol].unshift(trade);
        } else {
            // symbol not in portfolio
            newPortfolio[stock.symbol] = [trade];
        };
        this.updatePortfolio(newPortfolio);
        return true;
    }; 

    /**
     * Returns the number of unique stocks in the portfolio
     */
    get length(): number {
        return Object.keys(this.portfolio).length;
    };

};

export const portfolioProvider = new PortfolioProvider();

export const PortfolioContext = React.createContext<PortfolioInterface>(portfolioProvider.portfolio);