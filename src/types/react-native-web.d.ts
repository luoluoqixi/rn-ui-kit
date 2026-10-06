import "react-native";

export {};

/** React Native Web adds hover state to Pressable render callbacks. */
declare module "react-native" {
  interface PressableStateCallbackType {
    readonly hovered: boolean;
  }
}
