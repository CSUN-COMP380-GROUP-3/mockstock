import React from 'react';
import { render } from '@testing-library/react';
import { GlobalContext } from './GlobalContext';


xit('renders component', () => {
    const { queryByTestId } = render(<GlobalContext />);
    expect(queryByTestId('globalcontext')).toBeTruthy();
});