import React from 'react';
import currency from 'currency.js';
import { ActiveInvestmentContext } from '../../contexts/ActiveInvestmentContext';

export const truncateDecimal = (percent: string, places?: number) => {
    const decimalIndex = percent.indexOf('.') + 1;
    return percent.slice(0, decimalIndex + (places || 2));
};

export default function StatBox() {
    const { activeInvestment } = React.useContext(ActiveInvestmentContext);
    const { candles, amount } = activeInvestment;

    const getAmountInvested = () => {
        return currency(amount);
    };

    const getBuyInPrice = () => { // we assume perfect market entry, meaning we buy at the lowest price at the start of our investment term
        return currency(candles?.l[0]!);
    };

    const getSellPrice = () => { // we assume perfect exit, meaning we sell at the highest price at the end of our investment term
        const length = candles?.h.length!;
        return currency(candles?.h[length-1]!);
    };

    const getShares = () => {
        const amountInvested = getAmountInvested().value;
        const buyIn = getBuyInPrice().value;
        return amountInvested / buyIn;
    };

    const getInvestmentTotal = () => { // number of shares sold at the final price
        const shares = getShares();
        const sellPrice = getSellPrice();
        return currency(shares * sellPrice.value);
    };

    // https://www.investopedia.com/ask/answers/how-do-you-calculate-percentage-gain-or-loss-investment/
    const getInvestmentPercentage = () => {
        const end = getSellPrice().value;
        const start = getBuyInPrice().value;
        return ((end - start) / start) * 100;
    };

    const getInvestmentProfit = () => {
        const end = getInvestmentTotal();
        const start = getAmountInvested();
        return end.subtract(start);
    };
    return <React.Fragment>
        <h2>StatBox</h2>
        <pre>
            {
                JSON.stringify({
                    buyInPrice: '$'+getBuyInPrice().toString(),
                    sellPrice: '$'+getSellPrice().toString(),
                    shares: truncateDecimal(getShares().toString(), 4),
                    investmentAmount: '$'+getAmountInvested().toString(),
                    investmentTotal: '$'+getInvestmentTotal().toString(),
                    investmentPercentGain: truncateDecimal(getInvestmentPercentage().toString()) + '%',
                    investmentProfit: '$'+getInvestmentProfit().toString()
                })
            }
        </pre>
    </React.Fragment>
};