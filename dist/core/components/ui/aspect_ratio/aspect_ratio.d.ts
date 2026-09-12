declare const AspectRatio: {
    ({ asChild, ratio, style, ref, ...props }: Omit<import("@rn-primitives/types").SlottableViewProps, "style"> & {
        ratio?: number;
        style?: import("react-native").ViewStyle;
    } & import("react").RefAttributes<import("react-native").View>): React.JSX.Element;
    displayName: string;
};
export { AspectRatio };
