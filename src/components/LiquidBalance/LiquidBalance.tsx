import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { LiquidBalanceContext } from '../../contexts/LiquidBalanceContext';

export default function LiquidBalance() {

    const { liquidBalance } = React.useContext(LiquidBalanceContext);
    const { prev, curr } = liquidBalance;

    const getPercent = () => ((getProfit().value / prev.value) * 100.00).toFixed(2) ;

    const getProfit = () => curr.subtract(prev);

    const getSign = () => getProfit().value > 0 ? '+' : '';

    const useStyles = makeStyles(() => {
        const profitValue = getProfit().value;
        return {
            root: {
                display: 'flex',
                justifyContent: 'space-between',
                width: '450px',
                '& .label': {
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'left',
                },
                '& .amount': {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    textAlign: 'right',
                    '& .dollar': { 
                        textAlign: 'right',
                    },
                    '& .details': {
                        color: profitValue === 0 ? undefined : profitValue > 0 ? 'green' : 'red',  
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        '& .profit': {
                            marginRight: '0.25rem',
                        },
                        '& .percent': {
                            textAlign: 'right',
                        }
                    }
                }
            }
    
        }
    });
    
    const { root } = useStyles();
    return (
        <React.Fragment>

            <div data-testid="liquidbalance" className={root}>
                <Typography variant="h3" className="label">Cash</Typography>
                <div className="amount">
                    <Typography variant="h4" data-testid="liquidbalance-cash" className="dollar">{curr.format()}</Typography>
                    <div className="details">
                        <Typography variant="subtitle2" data-testid="liquidbalance-profit" className="profit">{getSign()}{getProfit().format()}</Typography>
                        <Typography variant="subtitle2" data-testid="liquidbalance-percent" className="percent">({getPercent().toString()}%)</Typography>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};