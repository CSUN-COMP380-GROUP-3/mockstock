import React from 'react';
import Typography from '@material-ui/core/Typography';
import {
    ActiveStockContext,
    activeStockProvider,
} from '../../contexts/ActiveStockContext';
import { LiquidBalanceContext } from '../../contexts/LiquidBalanceContext';
import DatePicker, { minDate, maxDate } from '../DatePicker/DatePicker';
import moment from 'moment';
import { BaseKeyboardPickerProps } from '@material-ui/pickers/_shared/hooks/useKeyboardPickerState';
import { Button } from '@material-ui/core';
import Trade from '../../interfaces/Trade';
import currency from 'currency.js';
import Slider from '../Slider/Slider';
import Input from '../Input/Input';
import { tradesProvider } from '../../contexts/TradesContext';
import { portfolioProvider } from '../../contexts/PortfolioContext';

export interface SellBoxForm extends Trade {
    type: 'SELL';
}

export interface SellBoxProps {}

export default function SellBox() {
    const activeStock = React.useContext(ActiveStockContext);
    const { stock } = activeStock;

    const { liquidBalance, updateLiquidBalance } =
        React.useContext(LiquidBalanceContext);

    const totalShares = tradesProvider.getTotalSharesBySymbol(stock.symbol);
    const earliestDate = tradesProvider.getEarliestDateBySymbol(stock.symbol);

    const [form, updateForm] = React.useState<SellBoxForm>({
        date: earliestDate || activeStockProvider.minDate || minDate,
        total: currency(0),
        type: 'SELL',
        stock,
        timestamp: moment(),
    });
    const { date } = form;

    // this state controls the number of shares to sell
    const [shareAmount, updateShareAmount] = React.useState(0);

    // this state controls the candlestick index
    const [candlestickIndex, updateCandlestickIndex] = React.useState(
        activeStockProvider.getIndexByTimestamp(date.unix()),
    );

    const onChangeSellDate: BaseKeyboardPickerProps['onChange'] = (date) => {
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
                date,
            });
            updateCandlestickIndex(index);
        }
    };

    const onClick = () => {
        // need to calculate the amount of the trade
        // amount = shares * price
        // getting the price is a bit tricky
        // need to find the price that corresponds to the sell date

        // should not be able to click this if oneDayCandle is not set
        const price = getPrice();
        if (price === undefined) return;
        const total = getTotal();
        if (total === undefined) return;

        const trade: SellBoxForm = {
            ...form,
            stock: activeStock.stock,
            timestamp: moment(),
            total,
            price,
        };

        updateLiquidBalance({
            curr: liquidBalance.curr.add(total),
            prev: liquidBalance.prev,
        });

        tradesProvider.addToTrades(trade);
        portfolioProvider.addToPortfolio(trade);
    };

    const getPrice = () => {
        return activeStockProvider.getSellPriceByIndex(candlestickIndex);
    };

    const getTotal = () => {
        console.log(shareAmount);
        const shares = currency(shareAmount);
        console.log(shares);
        console.log(shares.value);
        return getPrice()?.multiply(shares);
    };

    const onChangeInput = (event: any) => {
        if (isNaN(event.target.value)) {
            return;
        }
        updateShareAmount(event.target.value);
    };

    const handleBlur = () => {
        if (shareAmount < 0) {
            updateShareAmount(0);
        } else if (shareAmount > totalShares) {
            updateShareAmount(totalShares);
        } else {
            var num = Number(shareAmount).toFixed(4);
            updateShareAmount(Number(num));
        }
    };

    const onChangeSlider: any = (
        event: React.ChangeEvent<{}>,
        value: number,
    ) => {
        updateShareAmount(value);
    };

    const getMarks = (maxShares: number) =>
        maxShares === 0
            ? []
            : [
                  {
                      value: 0,
                      label: '0%',
                  },
                  {
                      value: maxShares * 0.25,
                      label: '25%',
                  },
                  {
                      value: maxShares * 0.5,
                      label: '50%',
                  },
                  {
                      value: maxShares * 0.75,
                      label: '75%',
                  },
                  {
                      value: maxShares,
                      label: '100%',
                  },
              ];

    const isDisabled = () => {
        // here we need to check and see if the stock is in the portfolio
        // we cannot sell an asset we do not own
        // should not be able to click if there is no oneDayCandle

        // also cannot sell if the resulting trade would be less than 0;
        const resultingTrade = totalShares - shareAmount;
        return (
            candlestickIndex === -1 || totalShares <= 0 || resultingTrade < 0
        );
    };
    return (
        <div data-testid="sellbox">
            <Typography variant="h5">Sell {stock.symbol}</Typography>
            <DatePicker
                id="sellDate"
                value={date}
                onChange={onChangeSellDate}
                minDate={earliestDate || activeStockProvider.minDate || minDate}
                maxDate={activeStockProvider.maxDate || maxDate}
                disableWeekends={true}
            />
            <Input
                adornment="Shares:"
                value={shareAmount}
                onChange={onChangeInput}
                onBlur={handleBlur}
                inputProps={{
                    type: 'number || string',
                    min: 0,
                    step: 1,
                    max: totalShares,
                }}
                id="amount"
            />
            <Slider
                value={shareAmount}
                onChange={onChangeSlider}
                marks={getMarks(totalShares)}
                max={totalShares}
            />
            <Button onClick={onClick} disabled={isDisabled()}>
                Sell
            </Button>
        </div>
    );
}
