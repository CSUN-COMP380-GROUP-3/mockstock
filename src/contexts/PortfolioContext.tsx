import React from 'react';
import StockSymbolData from '../interfaces/StockSymbolData';
import Trade from '../interfaces/Trade';
import storage from '../components/storage';

export interface PortfolioInterface {
    [key: string]: PortfolioDataInterface;
};

export interface PortfolioDataInterface {
    totalShares: number;
    sharesPrice: number;
    stock: StockSymbolData;
};

export interface PortfolioContextInterface {
    portfolio: PortfolioInterface;
    updatePortfolio: (portfolio: PortfolioInterface) => void;
    has: (symbol: string) => boolean;
    addToPortfolio: (trade: Trade) => boolean;
    length: number;
}

const STORAGE_KEY = 'portfolio';

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
        this.importFromStorage();
    }


    /**
     * Portfolio data is a stringified portfolio object so we parse and set as portfolio
     * 
     */
    private importFromStorage() {
        let fromLocal = storage?.getItem(STORAGE_KEY);
        if (!!fromLocal) {
            try {
                let localObject = JSON.parse(fromLocal);
                // here is where we can verify
                if (!!localObject) {
                    this.portfolio = {...localObject};
                }
            } catch(e) {
                console.log('Failed to import portfolio from storage');
            }
        }
    };


    /**
     * Stringify the portfolio and store in local storage
     * 
     * @param portfolio - portfolio object
     */
    private exportToStorage(portfolio: PortfolioInterface) {
        const portfolioStr = JSON.stringify(portfolio);
        if (!!portfolioStr) {
            storage?.setItem(STORAGE_KEY, portfolioStr);
        };
    };

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
        const { symbol } = stock;
        const newPortfolio = Object.assign({}, this.portfolio);
        if (this.has(symbol)) {
            const tradeTotalShares = total / Number(price);
            const oldTotalShares = newPortfolio[symbol].totalShares;
            if (type === 'BUY') {
                const tradeSharePrice = Number(price);
                const oldSharesPrice = newPortfolio[symbol].sharesPrice;
                const newTotalShares = tradeTotalShares + oldTotalShares;
                const newTop =
                    tradeTotalShares * tradeSharePrice +
                    oldTotalShares * oldSharesPrice;
                const newSharesPrice = newTop / newTotalShares;

                newPortfolio[symbol].totalShares = newTotalShares;
                newPortfolio[symbol].sharesPrice = newSharesPrice;
            } else {
                // SELL
                const newTotalShares = oldTotalShares - tradeTotalShares;

                newPortfolio[symbol].totalShares = newTotalShares;
                if (
                    newTotalShares === 0 ||
                    newTotalShares === Number.POSITIVE_INFINITY ||
                    newTotalShares === Number.NEGATIVE_INFINITY ||
                    newTotalShares < 0.00000001
                ) {
                    delete newPortfolio[symbol];
                }
            }
        } else {
            // symbol not in portfolio
            newPortfolio[symbol] = {
                stock,
                totalShares: total / Number(price),
                sharesPrice: Number(price),
            };
        }

        this.updatePortfolio(newPortfolio);
        this.exportToStorage(newPortfolio);

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
