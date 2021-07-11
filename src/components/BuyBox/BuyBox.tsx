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
import AssetTracker from '../assetTracker';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

export interface BuyBoxForm extends Trade {
    type: 'BUY';
}

const useStyles = makeStyles({
    buyButton: {
        backgroundColor: "var(--green)",
        color: "white",
        width: "100%",
        border: "2px solid var(--less-dark)",
        "&:hover": {
            backgroundColor: "var(--green)",
        },
        "&:disabled": {
            backgroundColor: "var(--less-green)"
        }
    },
    inputLabel: {
        paddingBottom: ".1rem"
    },
    sliderContainer: {
        paddingLeft: '1rem',
        paddingBottom: '.5rem',
    },
    slider: {
        color: "var(--less-dark)"
    }
});

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

        AssetTracker.buyAtForAmountAt(date, moment().utcOffset(), stock.symbol, total, price);

        const trade: BuyBoxForm = {
            ...form,
            stock,
            timestamp: moment().unix(),
            total,
            price,
        };

        tradesProvider.addToTrades(trade);
        portfolioProvider.addToPortfolio(trade);
        liquidBalanceProvider.updateLiquidBalance(AssetTracker.getLatestCashBalance());

        updateBuyAmount(0);
    };

    const getPrice = () => {
        return activeStockProvider.getBuyPriceByIndex(candlestickIndex);
    };

    const getTotal = () => {
        return buyAmount;
    };

    const getShares = () => {
        const price = getPrice();
        const total = getTotal();
        if (price) { return total / price; };
        return 0;
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

    const getMaxBalance = () => {
        const convertedDate = AssetTracker.convertTimestampToMidnightUTC(date, moment().utcOffset());
        return AssetTracker.getSpendableCashAt(convertedDate);
    };

    const isDisabled = () => {
        return candlestickIndex === -1 || buyAmount > getMaxBalance();
    };
    
    const classes = useStyles();

    return (
        <Grid 
            container
            spacing={1}
            className="main-container"
        >
            <Grid item xs={9}>
                <Grid 
                    container
                    direction="column"
                >
                    <Grid item>
                        <Typography gutterBottom variant="h6">
                            Buy {stock.symbol}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Grid 
                            container
                            alignItems="flex-end"
                            spacing={1}
                        >
                            <Grid item xs={3}>
                                <Typography 
                                    gutterBottom 
                                    variant="body2"
                                    align="right"
                                    className={classes.inputLabel}
                                >
                                    Amount:
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Grid container direction="column">
                                    <Grid item>
                                        <Typography 
                                            gutterBottom 
                                            variant="caption"
                                        >
                                            Est. Shares: { getShares().toFixed(4) }
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Input
                                            adornment="$"
                                            value={buyAmount}
                                            onChange={onChangeInput}
                                            onBlur={handleBlur}
                                            inputProps={{
                                                type: 'number || string',
                                                min: 0,
                                                step: 0.01,
                                                max: getMaxBalance(),
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item className={classes.sliderContainer}>
                        <Slider
                            value={buyAmount}
                            onChange={onChangeSlider}
                            marks={getMarks(balance)}
                            max={getMaxBalance()}
                            step={0.01}
                            classes={{
                                root: classes.slider,
                            }}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={3}>
                <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                    spacing={1}
                    className="date-buybutton-container"
                >
                    <Grid item>
                        <DatePicker
                            id="buyDate"
                            value={moment.unix(date)}
                            onChange={onChangeBuyDate}
                            minDate={activeStockProvider.minDate || minDate}
                            maxDate={activeStockProvider.maxDate || maxDate}
                            validUnixTimestamps={candles.t}
                        />
                    </Grid>
                    <Grid item className="buybutton-container">
                        <Button 
                            disabled={isDisabled()} 
                            onClick={onClick}
                            classes={{
                                root: classes.buyButton,
                            }}
                            variant="contained"
                        >
                            Buy
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
