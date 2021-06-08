import React from 'react';
import { isEmptyStatement } from 'typescript';
import PortfolioData from '../interfaces/PortfolioData';


export interface PortfolioInterface {
    list: Array<PortfolioData>
};

export interface PortfolioContextInterface {
    portfolio: PortfolioInterface;
    updatePortfolio: (portfolio: [PortfolioInterface]) => void;
};


export const initPortfolioContext: PortfolioContextInterface = {
    portfolio: {
        list: []
    },
    updatePortfolio: () => {}
};

export const PortfolioContext = React.createContext<PortfolioContextInterface>(initPortfolioContext);


