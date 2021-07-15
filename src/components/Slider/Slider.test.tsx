import React from 'react';
import { render } from '@testing-library/react';
import Slider from './Slider';

describe.only('Slider Component', () => {
    it('should render correctly', () => {
        const { queryByTestId } = render(<Slider />);
        expect(queryByTestId('slider')).toBeTruthy();
    });
});