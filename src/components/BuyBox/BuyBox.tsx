import React from 'react';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import currency from 'currency.js';
import Trade from '../../interfaces/Trade';
import { tradesProvider } from '../../contexts/TradesContext';
import { portfolioProvider } from '../../contexts/PortfolioContext';
import DatePicker, { maxDate, minDate } from '../DatePicker/DatePicker';
import { BaseKeyboardPickerProps } from '@material-ui/pickers/_shared/hooks/useKeyboardPickerState';
import { LiquidBalanceContext } from '../../contexts/LiquidBalanceContext';
import { ActiveStockContext, activeStockProvider } from '../../contexts/ActiveStockContext';
import Input from '../Input/Input';

export interface BuyBoxForm extends Trade {
    type: 'BUY',
};

export interface BuyBoxProps { };

export default function BuyBox() {
    const activeStock = React.useContext(ActiveStockContext);
    const { stock } = activeStock;

    const { liquidBalance, updateLiquidBalance } = React.useContext(LiquidBalanceContext);
    const { curr } = liquidBalance;

    const [ form, updateForm ] = React.useState<BuyBoxForm>({
        date: activeStockProvider.minDate || minDate, // this is the selected date of the buy
        total: currency(0),
        stock,
        timestamp: moment(),
        type: 'BUY'
    });

    const { date } = form;

    // this state controls the amount user wants to spend
    const [ buyAmount, updateBuyAmount ] = React.useState(0);

    // this state controls the candlestick index
    const [ candlestickIndex, updateCandlestickIndex ] = React.useState(activeStockProvider.getIndexByTimestamp(date.unix()));

    const onChangeBuyDate: BaseKeyboardPickerProps['onChange'] = (date) => {
        if (!!date) {
            const index = activeStockProvider.getIndexByTimestamp(date.unix());
            if (index === -1) {
                // invalid date
                return alert('No trading data available for selected date. Please pick another date.');
            };
            updateForm({
                ...form,
                date,
            });
            updateCandlestickIndex(index);
        };
    };

    const onClick = () => {
        const price = getPrice(); // price is the price of the stock at purchase time
        if (price === undefined) return;
        const total = getTotal(); // total is the amount the user wants to spend
        // from the two vars above we can do all the calculations we need

        const trade: BuyBoxForm = {
            ...form,
            stock: activeStock.stock,
            timestamp: moment(),
            total,
            price,
        };

        updateLiquidBalance({
            curr: liquidBalance.curr.subtract(total),
            prev: liquidBalance.prev,
        });

        tradesProvider.addToTrades(trade);
        portfolioProvider.addToPortfolio(trade);
    };

    const getPrice = () => {
        return activeStockProvider.getBuyPriceByIndex(candlestickIndex);
    };

    const getTotal = () => {
        return currency(buyAmount);
    };

    const isDisabled = () => {
        return candlestickIndex === -1 || buyAmount > curr.value;
    };

    const onChangeInput = (event: any) => {
        updateBuyAmount(currency(event.target.value).value);
    };

    const onChangeSlider: any = (event: React.ChangeEvent<{}>, value: number) => {
        updateBuyAmount(value);
    }; 

    const getMarks = (maxAmount: number) => curr.value === 0 ? [] : [
        {
            value: 0,
            label: '0%',
        },
        {
            value: maxAmount * 0.25,
            label: '25%',
        },
        {
            value: maxAmount * 0.5,
            label: '50%',
        },
        {
            value: maxAmount * 0.75,
            label: '75%',
        },
        {
            value: maxAmount,
            label: '100%',
        },
    ];

    return (
        <div data-testid="buybox">
            <Typography id="input-slider" gutterBottom variant="h5">Buy {stock.symbol}</Typography>
            <DatePicker
                id="buyDate"
                label="Buy Date"
                value={date}
                onChange={onChangeBuyDate}
                minDate={activeStockProvider.minDate || minDate}
                maxDate={activeStockProvider.maxDate || maxDate}
            />
            <Input
                adornment="$"
                value={buyAmount}
                onChange={onChangeInput}
                inputProps={{
                    type: 'number',
                    min: 0,
                    step: 0.01,
                    max: curr.value,
                }}
            />
            <Slider
                value={buyAmount}
                onChange={onChangeSlider}
                marks={getMarks(curr.value)}
                max={curr.value}
            />
            <Button
                disabled={isDisabled()}
                onClick={onClick}
            >Buy
            </Button>
        </div>
    );
};
