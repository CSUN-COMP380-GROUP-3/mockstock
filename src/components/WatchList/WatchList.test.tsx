import React from 'react';
import { render, screen } from '@testing-library/react';
import WatchList from './WatchList';

test('it renders component', () => {
    render(<WatchList />);
    const element = screen.getByText(/WatchList/i);
    expect(element).toBeInTheDocument();
});