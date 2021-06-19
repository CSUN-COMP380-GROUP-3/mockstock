import React from 'react';
import { render } from '@testing-library/react';
import Slider from './Slider';

it('renders component', () => {
    const { queryByTestId } = render(<Slider />);
    expect(queryByTestId('slider')).toBeTruthy();
});