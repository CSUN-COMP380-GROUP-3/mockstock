import React from 'react';
import Popover from '@material-ui/core/Popover';
import TradeHistoryTable from '../TradeHistoryTable/TradeHistoryTable';
import HistoryIcon from '@material-ui/icons/History';

export default function TradeHistory() {

    const [ anchorEl, setAnchorEl ] = React.useState<SVGSVGElement | null>(null);

    const onClick = (event: React.MouseEvent<SVGSVGElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const onClose = () => {
        setAnchorEl(null);
    };

    return (
        <React.Fragment>
            <HistoryIcon onClick={onClick}/>
            <Popover
                open={!!anchorEl}
                onClose={onClose}
                anchorEl={anchorEl}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
            >
                <TradeHistoryTable />
            </Popover>
        </React.Fragment>
    );
}
