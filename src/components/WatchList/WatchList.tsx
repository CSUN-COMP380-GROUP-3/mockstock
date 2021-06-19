import React from 'react';
import { WatchListContext } from '../../contexts/WatchListContext';
import socket, { subscribe } from './websocket';
import { WebSocketRawData } from '../../interfaces/WebSocketData';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import WatchListItem from '../WatchListItem/WatchListItem';
import { makeStyles } from '@material-ui/core/styles';
import { WatchListDataContext, WatchListDataInterface } from '../../contexts/WatchListDataContext';

export default function WatchList() {
    const watchListDataCache = React.useRef<WatchListDataInterface>({});

    const { watchList, updateWatchList } = React.useContext(WatchListContext);
    
    // const cleanUp = () => { // need to think of a way to close this socket
        
    // };
    
    const { watchListData, updateWatchListData } = React.useContext(WatchListDataContext);

    function messageHandler({data}: any) {
        if (!!data && typeof data === 'string') {
            const dataObj: WebSocketRawData = JSON.parse(data);
            let newWatchListData = { ...watchListDataCache.current };
            dataObj.data?.forEach(({s, p}) => {
                newWatchListData[s] = p;
            });
            watchListDataCache.current = {...newWatchListData};
            updateWatchListData(watchListDataCache.current);
        };
    };

    React.useEffect(() => {
        if (socket.OPEN) {
            socket.addEventListener('open', () => {
                console.log('socket is open');
                socket.addEventListener('message', messageHandler);
                watchList.stockSymbols.forEach(subscribe);
            });
        };
    }, [socket.OPEN]);


    const Row = (props: ListChildComponentProps) => {
        const { index, style } = props;
        const symbol = watchList.stockSymbols[index];
        const price = watchListData[symbol];
        return (
            <WatchListItem 
                key={index} 
                style={style} 
                symbol={symbol}
                price={price}
            />
        );
    };

    const useStyles = makeStyles({
        root: {
            height: '100%',
        }
    });

    const classes = useStyles();

    return <React.Fragment>
        <Card data-testid="watchlist" className={classes.root}>
            <CardHeader title="Watchlist"></CardHeader>
            <CardContent>
                <FixedSizeList height={400} width={400} itemSize={80} itemCount={watchList.stockSymbols.length}>
                    {Row}
                </FixedSizeList>
            </CardContent>
        </Card>
    </React.Fragment>;
};