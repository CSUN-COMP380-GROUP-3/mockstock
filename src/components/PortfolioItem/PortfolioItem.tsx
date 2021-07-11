import { CardProps } from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { activeStockProvider } from '../../contexts/ActiveStockContext';
import { PortfolioDataInterface } from '../../contexts/PortfolioContext';
import Grid from '@material-ui/core/Grid';
import currency from 'currency.js';

export interface PortfolioListItemProps extends CardProps {
    data: PortfolioDataInterface;
}

export default function PortfolioListItem(props: PortfolioListItemProps) {
    const { style, data } = props;
    const {symbol} = data.stock;

    const useStyles = makeStyles({
        root: {
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            '& .symbol': {
                marginLeft: '1rem',
            },
        }
    });
    const { root } = useStyles();

    const onClick = () => {
        activeStockProvider.switchActiveStock(data.stock);
    };

    const comp = (
        <div
            data-testid="watchlistitem"
            style={style}
            className={root}
            onClick={onClick}
        >
            <Grid container spacing={1} justify="space-around" alignItems="center">
                <Grid item xs={2}>
                    <Typography variant="h6" className="symbol">
                        {symbol}
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <Typography variant="subtitle1">{data.totalShares.toFixed(4)} Shares</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Grid container direction="column" alignItems="center">
                        <Grid item>
                            <Typography variant="caption">Cost Basis</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="subtitle1">{currency(data.sharesPrice).format()}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );

    return comp;
}
