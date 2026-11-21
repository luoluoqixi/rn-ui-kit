import { createRef } from "react";
import type { TextInput, View } from "react-native";
import {
  Input,
  Textarea,
  TextField,
  InputGroup,
  InputOTP,
  Checkbox,
  RadioGroup,
  Tabs,
  Link,
  type TextInputHandle,
} from "../../src/core";
const portable = createRef<TextInputHandle>();
const nativeInput = createRef<TextInput>();
const webInput = createRef<HTMLInputElement>();
const webArea = createRef<HTMLTextAreaElement>();
const webDiv = createRef<HTMLDivElement>();
const nativeView = createRef<View>();
void (
  <Input
    value="name"
    onChangeText={(text) => text.toUpperCase()}
    controlRef={portable}
    herouiNativeProps={{
      ref: nativeInput,
      keyboardType: "email-address",
      onChange: (event) => event.nativeEvent.text,
    }}
    herouiWebProps={{
      ref: webInput,
      onChange: (event) => event.currentTarget.value,
      onFocus: (event) => event.currentTarget.select(),
      style: ({ isFocused }) => ({ opacity: isFocused ? 1 : 0.5 }),
    }}
  />
);
void (
  <Textarea
    rows={4}
    herouiWebProps={{
      ref: webArea,
      onChange: (event) => event.currentTarget.rows,
    }}
  />
);
void (
  <TextField
    label="Email"
    description="Help"
    errorMessage="Invalid"
    type="email"
    isRequired
    isInvalid
    inputProps={{ herouiNativeProps: { ref: nativeInput } }}
  />
);
void (
  <TextField
    multiline
    label="Notes"
    textareaProps={{ herouiWebProps: { ref: webArea } }}
  />
);
void (
  <InputGroup
    prefix="¥"
    suffix="CNY"
    prefixProps={{ isDecorative: true }}
    inputProps={{ herouiWebProps: { ref: webInput } }}
    herouiWebProps={{ ref: webDiv }}
    herouiNativeProps={{ ref: nativeView }}
  />
);
void (
  <InputOTP
    maxLength={6}
    groupSize={3}
    onChangeText={(text) => text.toUpperCase()}
    onComplete={(text) => text.length}
    slotProps={{
      herouiNativeProps: { ref: nativeView },
      herouiWebProps: { ref: webDiv },
    }}
  />
);
void (
  <Checkbox
    label={({ isSelected }) => (isSelected ? "On" : "Off")}
    defaultSelected
    onSelectedChange={(value) => !value}
  />
);
void (
  <RadioGroup
    label="Mode"
    items={[
      {
        value: "a",
        label: ({ isSelected }) => (isSelected ? "A selected" : "A"),
        description: "Help",
      },
    ]}
    defaultValue="a"
  />
);
void (
  <Tabs
    items={[
      {
        value: "a",
        title: "Overview",
        content: ({ isSelected }) => (isSelected ? "Current" : "Other"),
      },
    ]}
    keepMounted
    variant="secondary"
  />
);
void (
  <Link
    size="sm"
    href="https://example.com"
    herouiWebProps={{
      ref: createRef<HTMLAnchorElement>(),
      onPress: (event) => event.pointerType,
    }}
    herouiNativeProps={{ onPress: (event) => event.preventDefault() }}
  />
);
// @ts-expect-error RNR checked model was intentionally removed.
void (<Checkbox checked onCheckedChange={() => {}} />);
// @ts-expect-error List/card selection belongs to NativeList composition.
void (<Checkbox card label="List item" />);
// @ts-expect-error Native does not offer a common Input size variant.
void (<Input size="lg" />);
// @ts-expect-error Textarea does not retain eight RNR sizes.
void (<Textarea size="2xl" />);
// @ts-expect-error Radio and tabs use HeroUI defaults/classes rather than invented shared size.
void (<RadioGroup size="sm" items={[]} />);
// @ts-expect-error DOM input refs cannot cross into the Native ref namespace.
void (<Input herouiNativeProps={{ ref: webInput }} />);
// @ts-expect-error Native refs cannot cross into the Web ref namespace.
void (<Input herouiWebProps={{ ref: nativeInput }} />);
// @ts-expect-error Textarea refs point to textarea, not input.
void (<Textarea herouiWebProps={{ ref: webInput }} />);
// @ts-expect-error Native refs cannot be passed as DOM container refs.
void (<InputGroup herouiWebProps={{ ref: nativeView }} />);
// @ts-expect-error Platform events must not be advertised as an untyped shared event.
void (<Input onChange={() => {}} />);
// @ts-expect-error Old RNR compound trigger API is not a public compatibility layer.
void (<Tabs.Trigger value="a" />);
