import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import StockInfo from './StockInfo';

describe('StockInfo Component', () => {
    let container: RenderResult;
    beforeEach(() => {
        container = render(<StockInfo />);
    });

    it('should render correctly', () => {
        const { queryByTestId } = container;
        expect(queryByTestId('stockinfo')).toBeTruthy();
    });
});