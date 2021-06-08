import React from 'react';
import { render } from '@testing-library/react';
import WatchList from './WatchList';

it('renders component', () => {
    const { queryByTestId } = render(<WatchList />);
    expect(queryByTestId('watchlist')).toBeTruthy();
});