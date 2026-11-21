import { createRef } from "react";
import type { GestureResponderEvent, View } from "react-native";
import { Button, type ButtonProps, type ButtonSize, type ButtonHeroUINativeProps } from "../../src/core";
const dimensions: ButtonSize = { height: 42, width: 120 };
const rnRef = createRef<View>();
const domRef = createRef<HTMLButtonElement>();
const onPress = (event: GestureResponderEvent) => event.preventDefault();
void (<Button ref={rnRef} native buttonSize={dimensions} size="lg" variant="danger-soft"
  buttonColor="#123456" circular textClassName="font-bold" textStyle={{ fontSize: 18 }}
  loading loadingIcon={null} nativeMatchContents={{ horizontal: true }} nativeButtonStyle="glass"
  nativeSystemImage="heart.fill" nativeSystemImageSize={24} nativeSwiftProps={{ label: "Swift" }}
  nativeComposeProps={{ enabled: true }} nativeHaptics="heavy" title="Save" onPress={onPress}
  onPressIn={(event) => event.nativeEvent.locationX} onLongPress={onPress}
  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
  herouiNativeProps={{ ref: rnRef, feedbackVariant: "scale-ripple", animation: { ripple: { opacity: { value: [0, 1, 0] } } }, onPress }}
  herouiWebProps={{ ref: domRef, type: "submit", onPress: (event) => event.pointerType, onFocus: (event) => event.currentTarget.getAttribute("id"), style: ({ isPressed }) => ({ opacity: isPressed ? 0.8 : 1 }) }}
/>);
void (<Button isIconOnly isDisabled disabled onPressOut={onPress}>{({ pressed }) => pressed ? "Pressed" : "Idle"}</Button>);
void ({} satisfies ButtonProps);
// @ts-expect-error Eight RNR size levels were deliberately removed.
void (<Button size="xs" />);
// @ts-expect-error HeroUI uses primary, not default.
void (<Button variant="default" />);
// @ts-expect-error Destructive is now danger.
void (<Button variant="destructive" />);
// @ts-expect-error Icon-only is a boolean, not a color variant.
void (<Button variant="icon" />);
// @ts-expect-error Links use Link or ghost plus textClassName.
void (<Button variant="link" />);
// @ts-expect-error Preserve ButtonSize as the exact-dimensions object.
const wrongDimensions: ButtonSize = "sm";
// @ts-expect-error A DOM ref cannot enter the Native namespace.
void (<Button herouiNativeProps={{ ref: domRef }} />);
// @ts-expect-error An RN ref cannot enter the Web namespace.
void (<Button herouiWebProps={{ ref: rnRef }} />);
// @ts-expect-error Native feedback 'none' does not accept ripple animation.
const wrongFeedback: ButtonHeroUINativeProps = { feedbackVariant: "none", animation: { ripple: false } };
// @ts-expect-error Platform extensions cannot redefine the public variant.
void (<Button herouiWebProps={{ variant: "primary" }} />);
