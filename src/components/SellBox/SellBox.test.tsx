import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import SellBox from './SellBox';

describe('SellBox Component', () => {
    let container: RenderResult;

    beforeEach(() => {
        container = render(<SellBox />);
    });

    it('should render correctly', () => {
        const { queryByTestId } = container;
        expect(queryByTestId('sellbox')).toBeTruthy();
    });
});