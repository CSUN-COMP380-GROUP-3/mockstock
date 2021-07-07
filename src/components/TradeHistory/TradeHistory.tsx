import React from 'react';
import Modal from '@material-ui/core/Modal';
import TradeHistoryTable from '../TradeHistoryTable/TradeHistoryTable';

export default function TradeHistory() {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div style={{ margin: 15 }}>
            <button type="button" onClick={handleOpen}>
                Trade History
            </button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <TradeHistoryTable />
            </Modal>
        </div>
    );
}
