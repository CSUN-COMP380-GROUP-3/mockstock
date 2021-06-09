import React from 'react';
import PortfolioItem from '../interfaces/PortfolioData';

export interface PortfolioInterface {
    items: PortfolioItem[];
};

export interface PortfolioContextInterface {
    portfolio: PortfolioInterface;
    updatePortfolio: (portfolio: PortfolioInterface) => void;
};

export const initPortfolioContext: PortfolioContextInterface = {
    portfolio: {
        items: []
    },
    updatePortfolio: () => {}
};

export const PortfolioContext = React.createContext<PortfolioContextInterface>(initPortfolioContext);


