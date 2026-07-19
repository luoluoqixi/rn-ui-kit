import React from "react";
import type { SliderProps, SliderThumbProps, SliderTrackActiveProps, SliderTrackProps } from "./types";
declare function SliderRoot(props: SliderProps): React.JSX.Element;
declare function SliderTrackWrapper(props: SliderTrackProps): React.JSX.Element;
declare function SliderTrackActiveWrapper(props: SliderTrackActiveProps): React.JSX.Element;
declare function SliderThumbWrapper(props: SliderThumbProps): React.JSX.Element;
export declare const Slider: typeof SliderRoot & {
    Track: typeof SliderTrackWrapper;
    TrackActive: typeof SliderTrackActiveWrapper;
    Thumb: typeof SliderThumbWrapper;
};
export {};
