import React from 'react';
import Popover from '@material-ui/core/Popover';
import TradeHistoryTable from '../TradeHistoryTable/TradeHistoryTable';
import HistoryIcon from '@material-ui/icons/History';
import { makeStyles } from '@material-ui/core/styles';
import Draggable from 'react-draggable';
import Grow from '@material-ui/core/Grow';

const useStyles = makeStyles({
    popoverRoot: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
});

const DraggableWrapper = ({ children, ...other }: any) => {
    return (
        <Draggable handle=".handle">
            {React.cloneElement(children, {...other})}
        </Draggable>
    );
};

const DraggableGrow = ({ children, ...other }: any) => {
    return (
        <Grow {...other} timeout={0}>
            <DraggableWrapper>{children}</DraggableWrapper>
        </Grow>
    );
}

export default function TradeHistory() {
    const classes = useStyles();

    const [ open, setOpen ] = React.useState(false);
 
    const onClick = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <HistoryIcon onClick={onClick}/>
            {open && (
                <Popover
                    open={open}
                    onClose={onClose}
                    anchorReference={"none"}
                    classes={{
                        root: classes.popoverRoot,
                    }}
                    TransitionComponent={DraggableGrow}
                >
                    <TradeHistoryTable />
                </Popover>
            )}
        </React.Fragment>
    );
}
