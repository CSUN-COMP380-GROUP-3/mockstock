import React from 'react';
import Typography from '@material-ui/core/Typography';
import { ActiveStockContext } from '../../contexts/ActiveStockContext';
import { LiquidBalanceContext } from '../../contexts/LiquidBalanceContext';
import DatePicker, {minDate, maxDate} from '../DatePicker/DatePicker';
import moment from 'moment';
import { BaseKeyboardPickerProps } from '@material-ui/pickers/_shared/hooks/useKeyboardPickerState';
import { Button } from '@material-ui/core';
import Trade from '../../interfaces/Trade';
import currency from 'currency.js';
import Slider from '../Slider/Slider';
import Input from '../Input/Input';
import { fetchCandles, errorHandler } from '../utils';
import CandleStickData from '../../interfaces/CandleStickData';
import { TokenContext } from '../../contexts/TokenContext';
import { TradesContext } from '../../contexts/TradesContext';
import { PortfolioContext } from '../../contexts/PortfolioContext';

export interface SellBoxForm extends Trade {
    type: 'SELL';
};

export interface SellBoxProps {
};

export default function SellBox() {
    const isInit = React.useRef(false);

    const token = React.useContext<string>(TokenContext);

    const { activeStock } = React.useContext(ActiveStockContext);

    const { stock } = activeStock;

    const { liquidBalance, updateLiquidBalance } = React.useContext(LiquidBalanceContext);

    /**
     * Very important that we do not dereference this object as the internal 'this' keyword becomes undefined
     * when you do const { trades, updateTrades } = TradesContext;
     */
    const tradesContext = React.useContext(TradesContext);

    const { portfolio, updatePortfolio } = React.useContext(PortfolioContext);

    const totalShares = tradesContext.getTotalSharesBySymbol(stock.symbol);
    const earliestDate = tradesContext.getEarliestDateBySymbol(stock.symbol);

    const [ form, updateForm ] = React.useState<SellBoxForm>({
        date: earliestDate || minDate, // because we cannot sell prior to time it was first purchased, the buy date should be the minimum date
        total: currency(0),
        type: 'SELL',
        stock,
        timestamp: moment(),
    });
    const { date } = form;

    // this state controls the number of shares to sell
    const [ shareAmount, updateShareAmount ] = React.useState(0);
    
    // this state controls the oneDayCandle aka where we will extract the selling price from
    const [ oneDayCandle, updateOneDayCandle ] = React.useState<CandleStickData>();

    React.useEffect(() => {
        if (!isInit.current) {
            fetchCandles({
                symbol: stock.symbol,
                from: date?.unix() || minDate.unix(),
                to: date?.unix() || minDate.unix(),
                resolution: 'D',
                token,
            })
                .then(res => {
                    if (res.data.s === 'ok') {
                        console.log('init oneDayCandle');
                        console.log(res.data);
                        updateOneDayCandle(res.data);
                    };
                })
                .catch(errorHandler)
            isInit.current = true;
        };
    });

    const onChangeSellDate: BaseKeyboardPickerProps['onChange'] = async (date) => {
        // should be some form of validation here
        // there will be some days where there is no trading activity
        
        // when this date changes we need to fetch the new candlestick data
        // should we fetch from the api or do we just search within our own candlestick data?
        try {
            if (!!date) {
                // first update form with latest user selected date
                updateForm({
                    ...form,
                    date,
                });

                // now we need to look at the date and fetch the candles and see if we get data back
                // otherwise if no_data then we to tell the user to select another date
                const res = await fetchCandles({
                    symbol: stock.symbol,
                    from: date.unix(),
                    to: date.unix(),
                    resolution: 'D',
                    token,
                });

                if (res.data.s === 'no_data') {
                    alert(`No trading data for ${date.toString()}`);
                    updateOneDayCandle(undefined);
                    return;
                };

                console.log(res.data);
                updateOneDayCandle(res.data);
                return;
            };
        } catch(error) {
            // if an error fetching data from the api occurs we need to also let the user know so they can retry
            errorHandler(error);
        };
    };

    const onClick = () => {
        // need to calculate the amount of the trade
        // amount = shares * price
        // getting the price is a bit tricky
        // need to find the price that corresponds to the sell date

        // should not be able to click this if oneDayCandle is not set
        const price = getPrice();
        const total = getTotal();

        const trade: SellBoxForm = {
            ...form,
            timestamp: moment(),
            total,
            price,
        };

        updateLiquidBalance({
            curr: liquidBalance.curr.add(total),
            prev: liquidBalance.prev,
        });

        tradesContext.updateTrades([trade, ...tradesContext.trades]);
    };

    const getPrice = (): currency => {
        if (!!oneDayCandle) {
            return currency(oneDayCandle.h[0]);
        };
        return currency(0);
    };

    const getTotal = () => {
        const shares = currency(shareAmount);
        return getPrice().multiply(shares);
    }
    
    const onChangeInput = (event: any) => {
        updateShareAmount(currency(event.target.value).value);
    };

    const onChangeSlider: any = (event: React.ChangeEvent<{}>, value: number) => {
        updateShareAmount(value);
    };

    const getMarks = (maxShares: number) => maxShares === 0 ? [] : [
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
        return !oneDayCandle || totalShares <= 0 || resultingTrade < 0;
    };
    return (
        <div data-testid="sellbox">
            <Typography variant="h5">Sell {stock.symbol}</Typography>
            <DatePicker 
                id="sellDate" 
                label="Sell Date" 
                value={date} 
                onChange={onChangeSellDate}
                minDate={!!earliestDate ? earliestDate : minDate}
                maxDate={maxDate}
            />
            <Input 
                adornment="Shares:" 
                id="amount" 
                inputProps={{
                    type: 'number',
                    defaultValue: 0,
                    step: 1,
                    max: totalShares,
                }}
                value={shareAmount}
                onChange={onChangeInput}
            />
            <Slider
                value={shareAmount}
                onChange={onChangeSlider}
                marks={getMarks(totalShares)}
                max={totalShares}
            />
            <Button
                onClick={onClick} 
                disabled={isDisabled()}
            >Sell
            </Button>
        </div>
    );
};