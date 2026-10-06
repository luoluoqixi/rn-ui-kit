import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { Platform, Pressable } from "react-native";
import Animated from "react-native-reanimated";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
/**
 * This component is used to wrap animated views that should only be animated on native.
 * @param props - The props for the animated view.
 * @returns The animated view if the platform is native, otherwise the children.
 * @example
 * <NativeOnlyAnimatedView entering={FadeIn} exiting={FadeOut}>
 *   <Text>I am only animated on native</Text>
 * </NativeOnlyAnimatedView>
 */
function NativeOnlyAnimatedView(props) {
    if (Platform.OS === "web") {
        return _jsx(_Fragment, { children: props.children });
    }
    else {
        if (props.as === "Pressable") {
            return _jsx(AnimatedPressable, { ...props });
        }
        return _jsx(Animated.View, { ...props });
    }
}
export { NativeOnlyAnimatedView };
