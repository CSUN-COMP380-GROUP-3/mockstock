import React from 'react';
import { WatchListTracker } from '../../contexts/WatchListContext';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import WatchListItem from '../WatchListItem/WatchListItem';
import "./WatchList.css";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { v4 as uuid } from 'uuid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

export default function WatchList() {

    const [watchList, updateWatchList] = React.useState(WatchListTracker.WatchList);

    React.useEffect(() => {
        const watchListSubscription = WatchListTracker.WatchList$.subscribe(updateWatchList);
        return () => { watchListSubscription.unsubscribe(); };
    }, []);

    return <React.Fragment>
        <Card data-testid="watchlist">
            <CardHeader title="Watchlist" />
            <CardContent>
                {
                    Object.keys(watchList).length === 0 ?
                        <Typography variant="body1" align="center">Your watchlist is empty. Add stocks to your watchlist.</Typography> :
                        <List className="watch-list">
                            {Object.entries(watchList).map(([symbol]) => (
                                <React.Fragment>
                                    <ListItem key={'w' + uuid()}>
                                        <WatchListItem symbol={symbol}></WatchListItem>
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                }
            </CardContent>
        </Card>
    </React.Fragment>;

};