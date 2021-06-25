import React from 'react';
import MuiSlider, {
    SliderProps as MuiSliderProps,
} from '@material-ui/core/Slider';

export interface SliderProps extends MuiSliderProps {}

export default function Slider(props: SliderProps) {
    return (
        <div data-testid="slider">
            <MuiSlider {...props} step={0.0001} min={0} />
        </div>
    );
}
