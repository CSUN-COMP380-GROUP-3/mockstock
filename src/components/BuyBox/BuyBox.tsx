import React from 'react';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import currency from 'currency.js';
import CandleStickData from '../../interfaces/CandleStickData';
import { TokenContext } from '../../contexts/TokenContext';
import Trade from '../../interfaces/Trade';
import { TradesContext } from '../../contexts/TradesContext';
import { PortfolioContext, portfolioProvider } from '../../contexts/PortfolioContext';
import DatePicker, { maxDate } from '../DatePicker/DatePicker';
import { BaseKeyboardPickerProps } from '@material-ui/pickers/_shared/hooks/useKeyboardPickerState';
import { minDate } from '../../components/DatePicker/DatePicker';
import { LiquidBalanceContext } from '../../contexts/LiquidBalanceContext';
import { ActiveStockContext } from '../../contexts/ActiveStockContext';
import { fetchCandles, errorHandler } from '../utils';
import Input from '../Input/Input';

export interface BuyBoxForm extends Trade {
    type: 'BUY',
};

export interface BuyBoxProps { };

export default function BuyBox() {

    const isInit = React.useRef(false);

    const token = React.useContext<string>(TokenContext);

    const { activeStock } = React.useContext(ActiveStockContext);

    const { stock } = activeStock;

    const { liquidBalance, updateLiquidBalance } = React.useContext(LiquidBalanceContext);
    const { curr } = liquidBalance;

    const tradesContext = React.useContext(TradesContext);

    const portfolio = React.useContext(PortfolioContext);

    const [ form, updateForm ] = React.useState<BuyBoxForm>({
        date: minDate, // this is the selected date of the buy
        total: currency(0),
        stock,
        timestamp: moment(),
        type: 'BUY'
    });

    const { date } = form;

    // this state controls the amount user wants to spend
    const [ buyAmount, updateBuyAmount ] = React.useState(0);

    // this state controls the oneDayCandle aka where we will extract the selling price from
    const [ oneDayCandle, updateOneDayCandle ] = React.useState<CandleStickData>();

    React.useEffect(() => {
        if (!isInit.current) {
            fetchCandles({
                symbol: stock.symbol,
                from: date.unix(),
                to: date.unix(),
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

    const onChangeBuyDate: BaseKeyboardPickerProps['onChange'] = async (date) => {
        try {
            if (!!date) {
                updateForm({
                    ...form,
                    date,
                });

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
            errorHandler(error);
        };
    };

    const onClick = () => {
        const price = getPrice(); // price is the price of the stock at purchase time
        const total = getTotal(); // total is the amount the user wants to spend
        // from the two vars above we can do all the calculations we need
        
        // const shares = getShares();

        const trade: BuyBoxForm = {
            ...form,
            timestamp: moment(),
            total,
            price,
        };

        updateLiquidBalance({
            curr: liquidBalance.curr.subtract(total),
            prev: liquidBalance.prev,
        });

        tradesContext.updateTrades([trade, ...tradesContext.trades]);
        const newPortfolio = portfolioProvider.addToPortfolio(trade);
        portfolioProvider.updatePortfolio(newPortfolio);
    };

    const getPrice = (): currency => {
        if (!!oneDayCandle) {
            return currency(oneDayCandle.l[0]);
        };
        return currency(0);
    };

    const getTotal = () => {
        return currency(buyAmount);
    };

    const isDisabled = () => {

        return !oneDayCandle;
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
                minDate={minDate}
                maxDate={maxDate}
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
