import React from 'react';
import Typography from '@material-ui/core/Typography';
import { WatchListData } from '../../contexts/WatchListContext';

import "./WatchListItem.css";
import { ComponentsProps } from '@material-ui/core/styles/props';

export interface WatchListItemProps extends ComponentsProps {
  data: WatchListData;
};

export default function WatchListItem(props: WatchListItemProps) {
  const { data } = props;

  return (
    <div data-testid="watchlistitem" className="list-item">
      <Typography variant="h6" className="symbol">{data.symbol}</Typography>
      <div className="details">
        <Typography variant="subtitle2" className="percent" data-testid="watchlistitem-percent">(-%)</Typography>
        <Typography variant="h6" className="dollar" data-testid="watchlistitem-dollar">{!!data.price ? data.price.format() : '$-'}</Typography>
      </div>
    </div>
  );
};