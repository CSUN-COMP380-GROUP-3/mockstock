import React from 'react';
import Grid from '@material-ui/core/Grid';
import './Header.css';
import SymbolBox from '../SymbolBox/SymbolBox';

export default function Header() {
    return (
        <React.Fragment>
            <Grid container direction="row" alignItems="center" data-testid="header">
                <Grid item className="mockstock-logo">
                    <img src="MockStockLogo.png" alt="" data-testid="header-logo"/>
                    <h5 className="subtitle" data-testid="header-logo-subtitle">
                        Official Stock Market Simulator
                    </h5>
                </Grid>
                <Grid item className="symbol-box-container">
                    <SymbolBox />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
