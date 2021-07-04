import React from 'react';
import StockSymbolData from '../interfaces/StockSymbolData';
import Trade from '../interfaces/Trade';

export interface PortfolioInterface {
    [key: string]: {
        totalShares: number;
        sharesPrice: number;
        stock: StockSymbolData;
    };
}

export interface PortfolioContextInterface {
    portfolio: PortfolioInterface;
    updatePortfolio: (portfolio: PortfolioInterface) => void;
    has: (symbol: string) => boolean;
    addToPortfolio: (trade: Trade) => boolean;
    length: number;
}

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
        this.updatePortfolio = () => { };
    }

    /**
     * Checks if a certain stock is in the portfolio
     * @param symbol The stock's unique identifier
     */
    has(symbol: string): boolean {
        return !!this.portfolio[symbol];
    }

    addToPortfolio(trade: Trade): boolean {
        // check if the symbol is in the portfolio
        // if has returns true then we have an existing array for the corresponding symbol,
        // otherwise we need to create one
        const { stock, total, price, type } = trade;
        const newPortfolio = Object.assign({}, this.portfolio);
        if (this.has(stock.symbol)) {
            if (type === 'BUY') {
                const tradeTotalShares = total / Number(price);
                const tradeSharePrice = Number(price);
                const oldTotalShares = newPortfolio[stock.symbol].totalShares;
                const oldSharesPrice = newPortfolio[stock.symbol].sharesPrice;
                const newTotalShares = tradeTotalShares + oldTotalShares;
                const newTop =
                    tradeTotalShares * tradeSharePrice +
                    oldTotalShares * oldSharesPrice;
                const newSharesPrice = newTop / newTotalShares;

                newPortfolio[stock.symbol].totalShares = newTotalShares;
                newPortfolio[stock.symbol].sharesPrice = newSharesPrice;
            } else {
                // SELL
                const tradeTotalShares = total / Number(price);
                const oldTotalShares = newPortfolio[stock.symbol].totalShares;
                const newTotalShares = oldTotalShares - tradeTotalShares;

                newPortfolio[stock.symbol].totalShares = newTotalShares;
                if (
                    newTotalShares === 0 ||
                    newTotalShares === Number.POSITIVE_INFINITY ||
                    newTotalShares === Number.NEGATIVE_INFINITY ||
                    newTotalShares < 0.00000001
                ) {
                    delete newPortfolio[stock.symbol];
                }
            }
        } else {
            // symbol not in portfolio
            newPortfolio[stock.symbol] = {
                stock,
                totalShares: total / Number(price),
                sharesPrice: Number(price),
            };
        }
        this.updatePortfolio(newPortfolio);
        return true;
    }

    /**
     * Returns the number of unique stocks in the portfolio
     */
    get length(): number {
        return Object.keys(this.portfolio).length;
    }
}

export const portfolioProvider = new PortfolioProvider();

export const PortfolioContext = React.createContext<PortfolioInterface>(
    portfolioProvider.portfolio,
);
