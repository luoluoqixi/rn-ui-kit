import Animated from "react-native-reanimated";
declare const AnimatedPressable: import("react-native-reanimated/lib/typescript/createAnimatedComponent").AnimatedComponentType<Readonly<import("react-native").PressableProps & import("react").RefAttributes<import("react-native").View>>, import("react").ForwardRefExoticComponent<import("react-native").PressableProps & import("react").RefAttributes<import("react-native").View>>>;
/**
 * This component is used to wrap animated views that should only be animated on native.
 * @param props - The props for the animated view.
 * @returns The animated view if the platform is native, otherwise the children.
 * @example
 * <NativeOnlyAnimatedView entering={FadeIn} exiting={FadeOut}>
 *   <Text>I am only animated on native</Text>
 * </NativeOnlyAnimatedView>
 */
declare function NativeOnlyAnimatedView(props: (React.ComponentProps<typeof Animated.View> & React.RefAttributes<typeof Animated.View> & {
    as?: "View";
}) | (React.ComponentProps<typeof AnimatedPressable> & React.RefAttributes<typeof AnimatedPressable> & {
    as: "Pressable";
})): import("react").JSX.Element;
export { NativeOnlyAnimatedView };
