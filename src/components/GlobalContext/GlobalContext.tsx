// we store and initialize all of the contexts necessary throughout the application
import React from 'react';
import { TokenContext, TOKEN } from '../../contexts/TokenContext';
import { StockSymbolsContext, filteredSymbols } from '../../contexts/StockSymbolsContext';

export const GlobalContext: React.FC = ({ children }) => {
    return <React.Fragment>
        <TokenContext.Provider value={TOKEN}>
            <StockSymbolsContext.Provider value={filteredSymbols}>
                {children}
            </StockSymbolsContext.Provider>
        </TokenContext.Provider>
    </React.Fragment>
};
