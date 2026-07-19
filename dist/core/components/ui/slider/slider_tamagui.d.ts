import React from "react";
import type { SliderProps, SliderThumbProps, SliderTrackActiveProps, SliderTrackProps } from "./types";
declare function TamaguiSliderRoot(props: SliderProps): React.JSX.Element;
declare function TamaguiSliderTrackWrapper(props: SliderTrackProps): React.JSX.Element;
declare function TamaguiSliderTrackActiveWrapper(props: SliderTrackActiveProps): React.JSX.Element;
declare function TamaguiSliderThumbWrapper(props: SliderThumbProps): React.JSX.Element;
export declare const TamaguiSlider: typeof TamaguiSliderRoot & {
    Track: typeof TamaguiSliderTrackWrapper;
    TrackActive: typeof TamaguiSliderTrackActiveWrapper;
    Thumb: typeof TamaguiSliderThumbWrapper;
};
export {};
