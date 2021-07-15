import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import BuyBox from './BuyBox';

describe('BuyBox Component', () => {
    let container: RenderResult;

    beforeEach(() => {
        container = render(<BuyBox />);
    });

    it('should render correctly', () => {
        const { queryByTestId } = container;
        expect(queryByTestId('buybox')).toBeTruthy();
    });
});