import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import Header from './Header';

describe('Header Component', () => {
    let container: RenderResult;
    beforeEach(() => {
        container = render(<Header />);
    });

    it('should render correctly', () => {
        const { queryByTestId } = container;
        expect(queryByTestId('header')).toBeTruthy();
    });

    it('should render logo', () => {
        const { queryByTestId } = container;
        expect(queryByTestId('header-logo')).toBeTruthy();
        expect(queryByTestId('header-logo-subtitle')).toBeTruthy();
    });

    it('should render logo subtitle', () => {
        const { queryByTestId } = container;
        expect(queryByTestId('header-logo-subtitle')?.textContent).toBe("Official Stock Market Simulator");
    });

    it('should render symbol box', () => {
        const { queryByTestId } = container;
        expect(queryByTestId('symbolbox')).toBeTruthy();
    });
});