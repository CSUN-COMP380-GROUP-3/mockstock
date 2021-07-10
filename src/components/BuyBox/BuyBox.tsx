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
import { liquidBalanceProvider } from '../../contexts/LiquidBalanceContext';
import { activeStockProvider } from '../../contexts/ActiveStockContext';
import Input from '../Input/Input';
import "./BuyBox.css";
export interface BuyBoxForm extends Trade {
    type: 'BUY';
}

export interface BuyBoxProps { }

export default function BuyBox() {
    // when active stock changes we want to rerender this component
    const [activeStock, updateActiveStock] = React.useState(activeStockProvider.activeStock);

    // when liquid balance changes we need to rerender this component
    const [balance, updateBalance] = React.useState(liquidBalanceProvider.balance);

    React.useEffect(() => {
        const activeStockSubscription = activeStockProvider.activeStock$.subscribe(updateActiveStock);
        const balanceSubscription = liquidBalanceProvider.balance$.subscribe(updateBalance);
        return () => {
            activeStockSubscription.unsubscribe();
            balanceSubscription.unsubscribe();
        };
    }, []);

    const { stock, candles } = activeStock;

    const [form, updateForm] = React.useState<BuyBoxForm>({
        date: maxDate.unix(), // this is the selected date of the buy
        total: 0,
        stock,
        timestamp: moment().unix(),
        type: 'BUY',
    });

    const { date } = form;

    // this state controls the amount user wants to spend
    const [buyAmount, updateBuyAmount] = React.useState(0);

    // this state controls the candlestick index
    const [candlestickIndex, updateCandlestickIndex] = React.useState(0);

    const onChangeBuyDate: BaseKeyboardPickerProps['onChange'] = (date) => {
        if (!!date) {
            const index = activeStockProvider.getIndexByTimestamp(date.unix());
            if (index === -1) {
                // invalid date
                return alert(
                    'No trading data available for selected date. Please pick another date.',
                );
            }
            updateForm({
                ...form,
                date: date.unix(),
            });
            updateCandlestickIndex(index);
        }
    };

    const onClick = () => {
        const price = getPrice(); // price is the price of the stock at purchase time
        if (price === undefined) return;
        const total = getTotal(); // total is the amount the user wants to spend
        // from the two vars above we can do all the calculations we need
        if (total === 0) return;

        const trade: BuyBoxForm = {
            ...form,
            stock,
            timestamp: moment().unix(),
            total,
            price,
        };

        liquidBalanceProvider.subtract(total);
        tradesProvider.addToTrades(trade);
        portfolioProvider.addToPortfolio(trade);

        updateBuyAmount(0);
    };

    const getPrice = () => {
        return activeStockProvider.getBuyPriceByIndex(candlestickIndex);
    };

    const getTotal = () => {
        return buyAmount;
    };

    const isDisabled = () => {
        return candlestickIndex === -1 || buyAmount > balance;
    };

    const onChangeInput = (event: any) => {
        if (isNaN(event.target.value)) {
            return;
        }
        updateBuyAmount(event.target.value);
    };

    const handleBlur = () => {
        if (buyAmount < 0) {
            updateBuyAmount(0);
        } else if (buyAmount > balance) {
            updateBuyAmount(balance);
        } else {
            updateBuyAmount(currency(buyAmount).value);
        }
    };

    const onChangeSlider: any = (
        event: React.ChangeEvent<{}>,
        value: number,
    ) => {
        updateBuyAmount(value);
    };

    const getMarks = (maxAmount: number) =>
        balance === 0
            ? []
            : [
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
        <div data-testid="buybox" className = "buy-box">
            <Typography id="input-slider" gutterBottom variant="h5">
                Buy {stock.symbol}
            </Typography>
            <DatePicker
                id="buyDate"
                value={moment.unix(date)}
                onChange={onChangeBuyDate}
                minDate={activeStockProvider.minDate || minDate}
                maxDate={activeStockProvider.maxDate || maxDate}
                validUnixTimestamps={candles.t}
            />
            <Input
                adornment="$"
                value={buyAmount}
                onChange={onChangeInput}
                onBlur={handleBlur}
                inputProps={{
                    type: 'number || string',
                    min: 0,
                    step: 0.01,
                    max: balance,
                }}
            />
            <Slider
                value={buyAmount}
                onChange={onChangeSlider}
                marks={getMarks(balance)}
                max={balance}
                step={0.01}
            />
            <Button disabled={isDisabled()} onClick={onClick} className = "buy-button">
                Buy
            </Button>
        </div>
    );
}
