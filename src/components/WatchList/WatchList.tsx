import React from 'react';
import { WatchListContext } from '../../contexts/WatchListContext';
import socket, { subscribe } from '../websocket';
import { WebSocketRawData } from '../../interfaces/WebSocketData';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import WatchListItem from '../WatchListItem/WatchListItem';
import { WatchListDataContext, WatchListDataInterface } from '../../contexts/WatchListDataContext';
import "./WatchList.css";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { makeStyles } from '@material-ui/core/styles';


export default function WatchList() {
    const watchListDataCache = React.useRef<WatchListDataInterface>({});

    const { watchList, updateWatchList } = React.useContext(WatchListContext);

    // const cleanUp = () => { // need to think of a way to close this socket

    // };

    const { watchListData, updateWatchListData } = React.useContext(WatchListDataContext);

    // function messageHandler({data}: any) {
    //     if (!!data && typeof data === 'string') {
    //         const dataObj: WebSocketRawData = JSON.parse(data);
    //         let newWatchListData = { ...watchListDataCache.current };
    //         dataObj.data?.forEach(({s, p}) => {
    //             newWatchListData[s] = p;
    //         });
    //         watchListDataCache.current = {...newWatchListData};
    //         updateWatchListData(watchListDataCache.current);
    //     };
    // };

    React.useEffect(() => {
        if (socket.OPEN) {
            socket.addEventListener('open', () => {
                console.log('socket is open');
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

    // we use the fix size list because we want to render the contents of the watchlist with virtualization
    // because the watchlist item is essentially rerendered everytime there is a new price it is more performant this way
    // the drawback being that we have to hard set some of the dimensions
    // if you want to style the individual watchlist items you can either style it directly in the return block or
    //   you can add css styling to the WatchListItem

    return <React.Fragment>
        <Card data-testid="watchlist">
            <CardHeader title="Watchlist"></CardHeader>
            <CardContent>
                <FixedSizeList height={400} width={400} itemSize={80} itemCount={watchList.stockSymbols.length}>
                    {Row}
                </FixedSizeList>
            </CardContent>
        </Card>
    </React.Fragment>;

    // return <React.Fragment>
    //   <Card data-testid="watchlist">
    //     <CardHeader title="Watchlist"></CardHeader>
    //     <CardContent className="watch-list">
    //       <List>
    //         {Object.keys(watchList.stocks).map((symbol, index) => {
    //           return (<ListItem key={index}>
    //             <WatchListItem data={watchList.stocks[symbol]}></WatchListItem>
    //           </ListItem>);
    //         })}
    //       </List>
    //     </CardContent>
    //   </Card>
    // </React.Fragment>;

};