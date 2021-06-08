import React from 'react';
import { render } from '@testing-library/react';
import Header from './Header';

fdescribe('Header Component', () => {
    it('renders correctly', () => {
        const { queryByTestId } = render(<Header />);
        expect(queryByTestId('header')).toBeTruthy();
    });
});