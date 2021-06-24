import React from 'react';
import { WatchListContext, WatchListContextInterface } from '../../contexts/WatchListContext';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import WatchListItem from '../WatchListItem/WatchListItem';
import "./WatchList.css";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

export default function WatchList() {

    const { watchList } = React.useContext<WatchListContextInterface>(WatchListContext);

    return <React.Fragment>
        <Card data-testid="watchlist">
            <CardHeader title="Watchlist">
            </CardHeader>
            <CardContent className="watch-list">
                <List>
                    {Object.entries(watchList).map(([symbol, value]) => {
                        return (<ListItem key={symbol}>
                            <WatchListItem symbol={symbol}></WatchListItem>
                        </ListItem>);
                    })}
                </List>
            </CardContent>
        </Card>
    </React.Fragment>;

};