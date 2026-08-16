import { createStyledContext } from "@tamagui/core";
export const SLIDER_NAME = "Slider";
export const SliderContext = createStyledContext({
    size: "$true",
    min: 0,
    max: 100,
    orientation: "horizontal",
});
export const { Provider: SliderProvider, useStyledContext: useSliderContext } = SliderContext;
export const { Provider: SliderOrientationProvider, useStyledContext: useSliderOrientationContext, } = createStyledContext({
    startEdge: "left",
    endEdge: "right",
    sizeProp: "width",
    size: 0,
    direction: 1,
});
export const PAGE_KEYS = ["PageUp", "PageDown"];
export const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
export const BACK_KEYS = {
    ltr: ["ArrowDown", "Home", "ArrowLeft", "PageDown"],
    rtl: ["ArrowDown", "Home", "ArrowRight", "PageDown"],
};
