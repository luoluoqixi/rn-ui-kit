import { jsx as _jsx } from "react/jsx-runtime";
import { ScrollShadow } from "heroui-native/scroll-shadow";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { ScrollView } from "../scroll_view";
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
export function ScrollShadowHeroUI(p) {
    const { style, ...scrollProps } = p.nativeScrollProps ?? {};
    const onScroll = p.onNativeScroll;
    // HeroUI composes worklet handlers only; a plain JS callback would be silently ignored.
    const scrollHandler = useAnimatedScrollHandler(event => {
        if (onScroll)
            scheduleOnRN(onScroll, event);
    }, [onScroll]);
    return _jsx(ScrollShadow, { ...p.herouiNativeProps, className: p.className, size: p.size ?? 40, orientation: p.orientation, visibility: p.isEnabled === false ? "none" : p.visibility, isEnabled: p.isEnabled, children: _jsx(AnimatedScrollView, { ...scrollProps, horizontal: p.orientation === "horizontal", style: [{ flex: 1 }, style], onScroll: scrollHandler, showsVerticalScrollIndicator: !p.hideScrollBar, showsHorizontalScrollIndicator: !p.hideScrollBar, children: p.children }) });
}
