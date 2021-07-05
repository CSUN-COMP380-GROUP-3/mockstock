import Card, { CardProps } from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { activeStockProvider } from '../../contexts/ActiveStockContext';
import StockSymbolData from '../../interfaces/StockSymbolData';

export interface PortfolioListItemProps extends CardProps {
    data: {
        totalShares: number;
        sharesPrice: number;
        stock: StockSymbolData;
    };
}

export default function PortfolioListItem(props: PortfolioListItemProps) {
    const { style, data } = props;
    const stock = data.stock;
    const { symbol } = stock;

    const useStyles = makeStyles({
        root: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            '& .symbol': {
                marginLeft: '1rem',
            },
            '& .details': {
                marginRight: '1rem',
                '& .dollar': {
                    textAlign: 'right',
                },
                '& .percent': {
                    textAlign: 'right',
                },
            },
        },
    });
    const { root } = useStyles();

    const onClick = () => {
        activeStockProvider.switchActiveStock(stock);
    };

    const comp = (
        <Card
            data-testid="watchlistitem"
            style={style}
            className={root}
            onClick={onClick}
        >
            <Typography variant="h6" className="symbol">
                {symbol}
            </Typography>
            <div className="details">
                {/* <Typography variant="subtitle2" className="dollar" data-testid="portfolioitem-dollar">{(total$Buys.subtract(total$Sells)).toString()}</Typography> */}
                <Typography
                    variant="subtitle2"
                    className="cost"
                    data-testid="portfolioitem-cost"
                >
                    {/* {costBasis.toString()} */}
                    {data.sharesPrice}
                </Typography>
                <Typography
                    variant="subtitle2"
                    className="shares"
                    data-testid="portfolioitem-shares"
                >
                    {/* {totalShares} */}
                    {data.totalShares}
                </Typography>
            </div>
        </Card>
    );

    return comp;
}
