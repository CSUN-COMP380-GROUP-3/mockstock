import React from 'react';
import currency from 'currency.js';

import { LiquidBalanceContext } from '../../contexts/LiquidBalanceContext';

export default function LiquidBalance() {

    const { liquidBalance, updateLiquidBalance } = React.useContext(LiquidBalanceContext);
    const { prev, curr } = liquidBalance;

    const [testValue, updateTestValue] = React.useState(100);
    const changeHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        updateTestValue(e.target.valueAsNumber);
    };

    const clickHandler = () => {
        let {prev, curr} = liquidBalance;

        prev = currency(curr.value);
        curr = curr.add(currency(testValue));

        updateLiquidBalance({prev, curr});
    };

    const getPercent = () => ((getProfit().value / prev.value) * 100.00).toFixed(2) ;

    const getProfit = () => curr.subtract(prev);

    // input and button are only used to test the increase and decrease in balance value
    return (
        <React.Fragment>
            <h1 data-testid="liquidbalance">LiquidBalance</h1>
            <h2 data-testid="liquidbalance-cash">{curr.format()}</h2>
            <h3 data-testid="liquidbalance-profit">{getProfit().format()}</h3>
            <h3 data-testid="liquidbalance-percent">{getPercent().toString()}%</h3>
            <input 
                type="number" 
                id="test-lb" 
                value={testValue}
                onChange={changeHandler}
            />
            <button 
                id="test-button" 
                onClick={clickHandler}
            >Add
            </button>
        </React.Fragment>
    );
};