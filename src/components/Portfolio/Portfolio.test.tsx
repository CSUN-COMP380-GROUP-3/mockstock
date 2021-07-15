import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import Portfolio from './Portfolio';

describe('Portfolio Component', () => {
    let container: RenderResult;

    beforeEach(() => {
        container = render(<Portfolio />);
    });

    it('should render correctly', () => {
        const { queryByTestId } = container;
        expect(queryByTestId('portfolio')).toBeTruthy();
    });
});