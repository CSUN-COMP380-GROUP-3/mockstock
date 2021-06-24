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
    addToPortfolio: (trade: Trade) => PortfolioInterface;
    length: number;
};

export class PortfolioProvider implements PortfolioContextInterface {
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

    addToPortfolio(trade: Trade): PortfolioInterface {
        // check if the symbol is in the portfolio
        // if has returns true then we have an existing array for the corresponding symbol, 
        // other wise we need to create one
        const {stock} = trade;
        if (this.has(stock.symbol)) {
            // symbol already in portfolio
            // add most recent trade to the top of the stack
            this.portfolio[stock.symbol].unshift(trade);
        } else {
            // symbol not in portfolio
            this.portfolio[stock.symbol] = [trade];
        };

        return Object.assign({}, this.portfolio);
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