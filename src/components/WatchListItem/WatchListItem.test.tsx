import React from 'react';
import { render } from '@testing-library/react';
import WatchListItem from './WatchListItem';

it('renders component', () => {
    const { queryByTestId } = render(<WatchListItem />);
    expect(queryByTestId('watchlistitem')).toBeTruthy();
});