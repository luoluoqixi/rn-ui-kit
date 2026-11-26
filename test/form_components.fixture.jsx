import { afterEach, expect, mock, test } from "bun:test";
import { Window } from "happy-dom";
const win = new Window({ url: "http://localhost/" });
for (const key of [
  "window",
  "document",
  "navigator",
  "HTMLElement",
  "HTMLButtonElement",
  "HTMLAnchorElement",
  "HTMLInputElement",
  "HTMLTextAreaElement",
  "SVGElement",
  "Element",
  "Node",
  "NodeFilter",
  "HTMLLabelElement",
  "Event",
  "InputEvent",
  "MouseEvent",
  "KeyboardEvent",
  "PointerEvent",
  "ShadowRoot",
  "MutationObserver",
  "ResizeObserver",
  "CSSRuleList",
  "CSS",
])
  globalThis[key] = key === "window" ? win : win[key];
globalThis.getComputedStyle = win.getComputedStyle.bind(win);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.requestAnimationFrame = (fn) => setTimeout(fn, 0);
globalThis.cancelAnimationFrame = clearTimeout;
const React = await import("react");
const { act } = React;
const RNW = await import("react-native-web");
const native = process.env.FORM_TEST_PLATFORM === "native";
const nativeProps = [];
const openedURLs = [];
function interop(Component) {
  return React.forwardRef(function Interop(
    { className, style, ...props },
    ref,
  ) {
    nativeProps.push(props);
    return (
      <Component
        {...props}
        ref={ref}
        style={[
          className === undefined ? {} : { $$css: true, tailwind: className },
          style,
        ]}
      />
    );
  });
}
const NativeView = interop(RNW.View);
mock.module("react-native", () => ({
  ...RNW,
  Text: interop(RNW.Text),
  View: NativeView,
  Pressable: interop(RNW.Pressable),
  TextInput: interop(RNW.TextInput),
  Linking: { openURL: async (url) => openedURLs.push(url) },
}));
mock.module("uniwind", () => ({ withUniwind: (component) => component }));
const haptics = [];
mock.module("../src/core/components/ui/utils/haptics", () => ({
  useResolvedNativeHaptics: (value) => value,
  triggerNativeHaptics: (value) => haptics.push(value),
}));
// Device and animation edges are replaced; installed HeroUI components/primitives remain real.
if (native) {
  const transition = {};
  for (const method of ["duration", "easing", "delay", "reduceMotion"])
    transition[method] = () => transition;
  const sharedValue = (value) => ({
    value,
    get() {
      return this.value;
    },
    set(next) {
      this.value = next;
    },
  });
  mock.module("react-native-reanimated", () => ({
    default: {
      View: NativeView,
      Text: interop(RNW.Text),
      createAnimatedComponent: (component) => component,
    },
    FadeIn: transition,
    FadeOut: transition,
    FlipInXDown: transition,
    FlipOutXDown: transition,
    Easing: {
      linear: (x) => x,
      out: (x) => x,
      inOut: (x) => x,
      bezier: () => (x) => x,
    },
    useAnimatedStyle: () => ({}),
    useReducedMotion: () => true,
    withTiming: (x) => x,
    withRepeat: (x) => x,
    withSequence: (x) => x,
    cancelAnimation: () => {},
    useSharedValue: (value) => React.useRef(sharedValue(value)).current,
  }));
  const { createContext } = await import(
    "../node_modules/heroui-native/src/helpers/internal/utils/create-context"
  );
  const { childrenToString } = await import(
    "../node_modules/heroui-native/src/helpers/internal/utils/children-to-string"
  );
  const { getElementWithDefault } = await import(
    "../node_modules/heroui-native/src/helpers/internal/utils/get-element-with-default"
  );
  const { useControllableState } = await import(
    "../node_modules/heroui-native/src/helpers/internal/hooks/use-controllable-state"
  );
  const animationUtils = await import(
    "../node_modules/heroui-native/src/helpers/internal/utils/animation"
  );
  mock.module(
    "../node_modules/heroui-native/src/helpers/internal/utils",
    () => ({
      ...animationUtils,
      createContext,
      childrenToString,
      getElementWithDefault,
      combineStyles: (styles) => styles,
      hasProp: (element, key) => key in element.props,
    }),
  );
  mock.module(
    "../node_modules/heroui-native/src/helpers/internal/hooks",
    () => ({ useControllableState }),
  );
  mock.module(
    "../node_modules/heroui-native/src/helpers/external/hooks",
    () => ({
      useTextInputComponent: () => ({ textInputProps: {} }),
      useTextComponent: () => ({ textProps: { allowFontScaling: false } }),
      useIsOnSurface: () => false,
      useThemeColor: (colors) =>
        Array.isArray(colors) ? colors.map(() => "#123456") : "#123456",
    }),
  );
  const FieldContext = React.createContext(null);
  mock.module(
    "../node_modules/heroui-native/src/helpers/internal/contexts",
    () => ({
      AnimationSettingsProvider: ({ children }) => children,
      FormFieldProvider: FieldContext.Provider,
      useFormField: () => React.useContext(FieldContext),
    }),
  );
  const { HeroText } = await import(
    "../node_modules/heroui-native/src/helpers/internal/components/hero-text"
  );
  const { HeroTextInput } = await import(
    "../node_modules/heroui-native/src/helpers/internal/components/hero-text-input"
  );
  const DummyIcon = () => <svg />;
  mock.module(
    "../node_modules/heroui-native/src/helpers/internal/components",
    () => ({
      HeroText,
      HeroTextInput,
      ThemeBackground: NativeView,
      useHasDefaultThemeBackground: () => false,
      AnimatedCheckIcon: DummyIcon,
      CheckIcon: DummyIcon,
      MinusIcon: DummyIcon,
    }),
  );
  for (const [name, hooks] of Object.entries({
    label: ["useLabelRootAnimation"],
    description: ["useDescriptionAnimation"],
    "text-field": ["useTextFieldRootAnimation"],
    "input-group": ["useInputGroupRootAnimation"],
    "field-error": ["useFieldErrorRootAnimation"],
    "control-field": ["useControlFieldRootAnimation"],
    "radio-group": ["useRadioGroupRootAnimation"],
    radio: [
      "useRadioRootAnimation",
      "useRadioIndicatorAnimation",
      "useRadioIndicatorThumbAnimation",
    ],
    tabs: [
      "useTabsRootAnimation",
      "useTabsIndicatorAnimation",
      "useTabsSeparatorAnimation",
    ],
    "input-otp": [
      "useInputOTPRootAnimation",
      "useInputOTPSlotValueAnimation",
      "useInputOTPSlotCaretAnimation",
    ],
  }))
    mock.module(
      "../node_modules/heroui-native/src/components/" +
        name +
        "/" +
        name +
        ".animation",
      () => Object.fromEntries(hooks.map((hook) => [hook, () => ({})])),
    );
  const CheckboxContext = React.createContext({
    isCheckboxPressed: sharedValue(false),
  });
  mock.module(
    "../node_modules/heroui-native/src/components/switch/switch.animation",
    () => ({
      SwitchAnimationProvider: ({ children }) => children,
      useSwitchRootAnimation: () => ({}),
      useSwitchThumbAnimation: () => ({}),
    }),
  );
  mock.module(
    "../node_modules/heroui-native/src/components/checkbox/checkbox.animation",
    () => ({
      CheckboxAnimationProvider: CheckboxContext.Provider,
      useCheckboxAnimation: () => React.useContext(CheckboxContext),
      useCheckboxRootAnimation: () => ({
        isCheckboxPressed: sharedValue(false),
      }),
      useCheckboxIndicatorAnimation: () => ({}),
    }),
  );
  // Keep real LinkButton, Button and PressableFeedback; replace only their worklet hooks.
  mock.module(
    "../node_modules/heroui-native/src/components/pressable-feedback/pressable-feedback.animation",
    () => ({
      PressableFeedbackRootAnimationProvider: ({ children }) => children,
      usePressableFeedbackRootAnimation: () => ({
        isPressed: sharedValue(false),
        containerWidth: sharedValue(0),
        containerHeight: sharedValue(0),
        animationOnPressIn() {},
        animationOnPressOut() {},
      }),
      usePressableFeedbackScaleAnimation: () => ({}),
      usePressableFeedbackHighlightAnimation: () => ({}),
      usePressableFeedbackRippleAnimation: () => ({
        animationOnTouchStart() {},
        animationOnTouchEnd() {},
      }),
    }),
  );
  for (const [name, exportName] of [
    ["text", "Typography"],
    ["label", "Label"],
    ["description", "Description"],
    ["field-error", "FieldError"],
    ["input", "Input"],
    ["text-area", "TextArea"],
    ["input-group", "InputGroup"],
    ["input-otp", "InputOTP"],
    ["text-field", "TextField"],
    ["checkbox", "Checkbox"],
    ["control-field", "ControlField"],
    ["radio-group", "RadioGroup"],
    ["radio", "Radio"],
    ["tabs", "Tabs"],
    ["link-button", "LinkButton"],
  ]) {
    const component = await import(
      "../node_modules/heroui-native/src/components/" + name + "/" + name
    );
    mock.module("heroui-native/" + name, () => ({
      [exportName]: component.default,
    }));
  }
  const parts = await import(
    "../src/core/components/ui/utils/field_parts_heroui.native"
  );
  mock.module(
    "../src/core/components/ui/utils/field_parts_heroui",
    () => parts,
  );
  for (const name of [
    "text",
    "label",
    "input",
    "textarea",
    "input_group",
    "input_otp",
    "text_field",
    "checkbox",
    "radio_group",
    "tabs",
    "link",
  ]) {
    const adapter = await import(
      "../src/core/components/ui/" + name + "/" + name + "_heroui.native"
    );
    mock.module(
      "../src/core/components/ui/" + name + "/" + name + "_heroui",
      () => adapter,
    );
  }
}
const { Text } = await import("../src/core/components/ui/text");
const { Input } = await import("../src/core/components/ui/input");
const { Textarea } = await import("../src/core/components/ui/textarea");
const { InputGroup } = await import("../src/core/components/ui/input_group");
const { InputOTP } = await import("../src/core/components/ui/input_otp");
const { TextField } = await import("../src/core/components/ui/text_field");
const { Checkbox } = await import("../src/core/components/ui/checkbox");
const { RadioGroup } = await import("../src/core/components/ui/radio_group");
const { Tabs } = await import("../src/core/components/ui/tabs");
const { Link } = await import("../src/core/components/ui/link");
const { TextFontProvider } = await import(
  "../src/core/components/ui/provider/font_provider"
);
const { createRoot } = await import("react-dom/client");
const extension = (props) =>
  native ? { herouiNativeProps: props } : { herouiWebProps: props };
const idProps = (id) => (native ? { nativeID: id } : { id });
const node = (id) => document.getElementById(id);
const isInputDisabled = (id) =>
  native
    ? nativeProps.findLast((props) => props.nativeID === id)?.editable === false
    : node(id).disabled;
let root;
async function settle() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 60));
  });
}
async function render(content) {
  if (!root) {
    const mount = document.createElement("div");
    document.body.append(mount);
    root = createRoot(mount);
  }
  await act(() => root.render(content));
  await settle();
}
async function click(element) {
  await act(() => element.click());
  await settle();
}
async function input(element, value) {
  await act(() => {
    const proto =
      element.tagName === "TEXTAREA"
        ? win.HTMLTextAreaElement.prototype
        : win.HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, "value").set.call(element, value);
    element.dispatchEvent(new win.Event("input", { bubbles: true }));
    element.dispatchEvent(new win.Event("change", { bubbles: true }));
  });
}
afterEach(async () => {
  await act(() => root?.unmount());
  root = undefined;
  document.body.replaceChildren();
  nativeProps.length = 0;
  openedURLs.length = 0;
});

if (!native) test("Textarea root owns uncontrolled and controlled values without duplicate child state", async () => {
  const errors = [];
  const originalError = console.error;
  console.error = (...args) => errors.push(args.map(String).join(" "));
  try {
    const changes = [];
    await render(<TextField multiline key="uncontrolled" nativeID="area" label="简介" defaultValue="初始简介" onChangeText={value => changes.push(value)} />);
    expect(node("area").value).toBe("初始简介");
    await input(node("area"), "修改简介");
    expect(changes).toEqual(["修改简介"]);
    expect(node("area").value).toBe("修改简介");
    await render(<TextField multiline key="controlled" nativeID="area" label="简介" value="受控简介" defaultValue="忽略默认值" />);
    expect(node("area").value).toBe("受控简介");
    expect(errors.filter(message => message.includes("both value and defaultValue"))).toEqual([]);
  } finally { console.error = originalError; }
});

test("Input and Textarea preserve real controls, fonts, text state, platform refs and focus handles", async () => {
  const ref = React.createRef(),
    handle = React.createRef();
  let changed;
  await render(
    <TextFontProvider family="Project Font">
      <Input
        nativeID="input"
        controlRef={handle}
        {...extension({ ref })}
        defaultValue="initial"
        onChangeText={(value) => (changed = value)}
        style={{ lineHeight: 24 }}
      />
      <Textarea nativeID="area" rows={5} defaultValue="long" />
    </TextFontProvider>,
  );
  expect(ref.current === node("input")).toBe(true);
  expect(node("input").tagName).toBe("INPUT");
  expect(node("area").tagName).toBe("TEXTAREA");
  expect(node("input").style.fontFamily).toContain("Project Font");
  expect(node("input").style.lineHeight).toBe("24px");
  await act(() => handle.current.focus());
  expect(document.activeElement === node("input")).toBe(true);
  await input(node("input"), "edited");
  expect(changed).toBe("edited");
  if (!native) expect(Number(node("area").rows)).toBe(5);
  await render(
    <Input
      nativeID="input"
      type="password"
      isDisabled
      isInvalid
      defaultValue="secret"
    />,
  );
  expect(isInputDisabled("input")).toBe(true);
  if (!native) expect(node("input").getAttribute("aria-invalid")).toBe("true");
  await render(<Input nativeID="input" type="password" isReadOnly />);
  expect(
    node("input").readOnly ||
      nativeProps.findLast((props) => props.nativeID === "input")?.editable ===
        false,
  ).toBe(true);
});

test("InputGroup renders real decorators, keeps input events/ref, and cascades disabled state", async () => {
  const ref = React.createRef();
  let changed;
  await render(
    <InputGroup
      prefix="https://"
      suffix=".com"
      prefixProps={{ isDecorative: true }}
      inputProps={extension({ ref })}
      nativeID="group-input"
      onChangeText={(value) => (changed = value)}
    />,
  );
  expect(document.body.textContent).toContain("https://");
  expect(document.body.textContent).toContain(".com");
  expect(ref.current === node("group-input")).toBe(true);
  await input(node("group-input"), "example");
  expect(changed).toBe("example");
  await render(<InputGroup nativeID="group-input" prefix="¥" isDisabled />);
  expect(isInputDisabled("group-input")).toBe(true);
});

test("TextField associates label, help and error; supports group/multiline, required and disabled", async () => {
  await render(
    <TextFontProvider family="Project Font">
      <TextField
        nativeID="field"
        label="Email"
        description="Private"
        errorMessage="Invalid email"
        errorMessageProps={{ herouiWebProps: { style: () => ({ opacity: 0.8 }) } }}
        isInvalid
        isRequired
        type="email"
      />
    </TextFontProvider>,
  );
  const control = node("field");
  expect(control.getAttribute("aria-labelledby")).toContain("field-label");
  expect(control.getAttribute("aria-describedby")).toContain(
    "field-description",
  );
  expect(control.getAttribute("aria-describedby")).toContain("field-error");
  expect(node("field-label").textContent).toContain("Email");
  expect(node("field-description").textContent).toBe("Private");
  expect(node("field-error").textContent).toBe("Invalid email");
  expect(node("field-description").style.fontFamily).toContain("Project Font");
  if (!native) expect(node("field-error").style.opacity).toBe("0.8");
  if (native) {
    await click(node("field-label"));
    expect(document.activeElement === control).toBe(true);
  } else expect(node("field-label").htmlFor).toBe("field");
  await render(
    <TextField nativeID="field" label="Notes" multiline isDisabled />,
  );
  expect(node("field").tagName).toBe("TEXTAREA");
  expect(isInputDisabled("field")).toBe(true);
  expect(node("field-error")).toBeNull();
  await render(
    <TextField
      nativeID="field"
      label="Budget"
      inputGroupProps={{ prefix: "¥" }}
    />,
  );
  expect(document.body.textContent).toContain("¥");
  expect(node("field").tagName).toBe("INPUT");
});

test("Checkbox supports controlled/uncontrolled selection, label/description, custom indicator, disabled and errors", async () => {
  let changed;
  await render(
    <Checkbox
      label="Backups"
      description="Wi-Fi only"
      onSelectedChange={(value) => (changed = value)}
      {...extension(idProps("check"))}
    />,
  );
  let button = document.querySelector(
    '[role="checkbox"],input[type="checkbox"]',
  );
  expect(button).not.toBeNull();
  await click(button);
  expect(changed).toBe(true);
  expect(
    native
      ? String(
          nativeProps.findLast(
            (props) =>
              props.accessibilityRole === "checkbox" && props.accessible,
          )?.accessibilityState?.checked,
        )
      : String(document.querySelector('input[type="checkbox"]').checked),
  ).toBe("true");
  expect(document.body.textContent).toContain("Wi-Fi only");
  await render(
    <Checkbox
      label="Backups"
      isSelected={false}
      isInvalid
      errorMessage="Required"
      onSelectedChange={(value) => (changed = value)}
    />,
  );
  await click(
    document.querySelector('[role="checkbox"],input[type="checkbox"]'),
  );
  expect(
    native
      ? String(
          nativeProps.findLast(
            (props) =>
              props.accessibilityRole === "checkbox" && props.accessible,
          )?.accessibilityState?.checked,
        )
      : String(document.querySelector('input[type="checkbox"]').checked),
  ).toBe("false");
  expect(document.body.textContent).toContain("Required");
  changed = undefined;
  await render(
    <Checkbox
      label="Backups"
      isDisabled
      onSelectedChange={(value) => (changed = value)}
    />,
  );
  await click(
    document.querySelector('[role="checkbox"],input[type="checkbox"]'),
  );
  expect(changed).toBeUndefined();
  await render(
    <Checkbox
      label="Custom"
      isSelected
      indicator={({ isSelected }) =>
        isSelected ? <span>Custom check</span> : null
      }
    />,
  );
  expect(document.body.textContent).toContain("Custom check");
});

test("RadioGroup maps simple items with descriptions, selected state and disabled guards", async () => {
  let changed;
  const items = [
    { value: "a", label: "Standard", description: "5 days" },
    { value: "b", label: "Express" },
    { value: "c", label: "Unavailable", isDisabled: true },
  ];
  await render(
    <RadioGroup
      label="Shipping"
      items={items}
      defaultValue="a"
      onValueChange={(value) => (changed = value)}
    />,
  );
  let radios = [
    ...document.querySelectorAll('[role="radio"],input[type="radio"]'),
  ];
  expect(radios).toHaveLength(3);
  await click(radios[1]);
  expect(changed).toBe("b");
  expect(
    native
      ? document
          .querySelectorAll('[role="radio"]')[1]
          .getAttribute("aria-checked")
      : String(document.querySelectorAll('input[type="radio"]')[1].checked),
  ).toBe("true");
  changed = undefined;
  await click(radios[2]);
  expect(changed).toBeUndefined();
  await render(
    <RadioGroup
      label="Shipping"
      items={items}
      value="a"
      isInvalid
      errorMessage="Choose one"
      isDisabled
      onValueChange={(value) => (changed = value)}
    />,
  );
  await click(
    document.querySelectorAll('[role="radio"],input[type="radio"]')[1],
  );
  expect(changed).toBeUndefined();
  expect(document.body.textContent).toContain("Choose one");
});

test("RadioGroup horizontal labels retain intrinsic width and right indicators align descriptions", async () => {
  await render(<RadioGroup label="更新频率" orientation="horizontal" items={[{ value: "day", label: "每天" }, { value: "week", label: "每周" }]} />);
  expect(document.body.textContent).toContain("每天");
  expect(document.body.textContent).toContain("每周");
  if (native) {
    const label = [...document.querySelectorAll("div")].find(node => node.textContent === "每天" && node.className.includes("gap-1"));
    expect(label?.className).toContain("shrink");
    expect(label?.className).not.toContain("flex-1");
  } else {
    await render(<RadioGroup label="右侧指示器" labelPosition="left" items={[{ value: "day", label: "每天", description: "每日检查更新" }]} />);
    expect(document.querySelector('[data-slot="radio"]').className).toContain("[&>[data-slot=description]]:ps-0");
  }
});

test("Tabs use real triggers/panels, select first enabled tab and preserve controlled state", async () => {
  let changed;
  const items = [
    { value: "off", title: "Unavailable", content: "Off", isDisabled: true },
    { value: "a", title: "Overview", content: <span>Overview body</span> },
    { value: "b", title: "Activity", content: <span>Activity body</span> },
  ];
  await render(
    <Tabs
      items={items}
      onValueChange={(value) => (changed = value)}
      triggerProps={{ herouiWebProps: { style: ({ isSelected }) => ({ opacity: isSelected ? 1 : 0.5 }) } }}
    />,
  );
  expect(
    document.querySelector('[role="tab"][aria-selected="true"]').textContent,
  ).toContain("Overview");
  if (!native) {
    expect(document.querySelector('[role="tab"][aria-selected="true"]').style.opacity).toBe("1");
    expect(document.querySelector('[role="tab"][aria-selected="false"]').style.opacity).toBe("0.5");
  }
  await click(document.querySelectorAll('[role="tab"]')[2]);
  expect(changed).toBe("b");
  const selectedTab = document.querySelector(
    '[role="tab"][aria-selected="true"]',
  );
  const selectedPanel = document.querySelector(
    `[role="tabpanel"][aria-labelledby="${selectedTab.id}"]`,
  );
  expect(selectedPanel?.textContent).toContain("Activity body");
  await render(
    <Tabs
      items={items}
      value="a"
      onValueChange={(value) => (changed = value)}
    />,
  );
  await click(document.querySelectorAll('[role="tab"]')[2]);
  expect(
    document.querySelector('[role="tab"][aria-selected="true"]').textContent,
  ).toContain("Overview");
  changed = undefined;
  await click(document.querySelectorAll('[role="tab"]')[0]);
  expect(changed).toBeUndefined();
  await render(<Tabs items={items} value="a" keepMounted />);
  const overview = [...document.querySelectorAll("span")].find(
    (element) => element.textContent === "Overview body",
  );
  const activity = [...document.querySelectorAll("span")].find(
    (element) => element.textContent === "Activity body",
  );
  expect(overview).not.toBeUndefined();
  expect(activity).not.toBeUndefined();
  const activityPanel = activity.closest(native ? '[role="tabpanel"]' : '.tabs__panel');
  expect(activityPanel.classList.contains("hidden")).toBe(true);
  await render(<Tabs items={items} value="b" keepMounted />);
  expect(
    [...document.querySelectorAll("span")].find(
      (element) => element.textContent === "Overview body",
    ) === overview,
  ).toBe(true);
  expect(
    [...document.querySelectorAll("span")].find(
      (element) => element.textContent === "Activity body",
    ) === activity,
  ).toBe(true);
  const activeTab = document.querySelector(
    '[role="tab"][aria-selected="true"]',
  );
  const activePanel = document.querySelector(
    `[role="tabpanel"][aria-labelledby="${activeTab.id}"]`,
  );
  expect(activePanel?.textContent).toContain("Activity body");
  expect(activePanel.classList.contains("hidden")).toBe(false);
});

test("Link uses real anchor/LinkButton and disables activation", async () => {
  let clicked = 0;
  await render(
    <TextFontProvider family="Project Font">
      <Link
        href="https://example.com"
        target="_blank"
        onPress={() => clicked++}
        herouiWebProps={{ style: ({ isDisabled }) => ({ opacity: isDisabled ? 0.5 : 0.9 }) }}
      >
        Docs
      </Link>
    </TextFontProvider>,
  );
  const link = document.querySelector('[role="link"],a');
  expect(link).not.toBeNull();
  const label = native ? link.querySelector(".text-accent") : link;
  expect(label?.classList.contains("text-accent")).toBe(true);
  if (!native) {
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toBe("https://example.com");
    expect(link.rel).toBe("noopener noreferrer");
    expect(link.style.opacity).toBe("0.9");
    expect(link.style.fontFamily).toContain("Project Font");
  }
  await click(link);
  expect(clicked).toBe(1);
  if (native) expect(openedURLs).toEqual(["https://example.com"]);
  await render(<Link labelClassName="text-danger">Danger link</Link>);
  const customLink = document.querySelector('[role="link"],a');
  const customLabel = native ? customLink.querySelector(".text-danger") : customLink;
  expect(customLabel?.classList.contains("text-danger")).toBe(true);
  expect(customLabel?.classList.contains("text-accent")).toBe(false);
  await render(
    <Link href="https://example.com" isDisabled onPress={() => clicked++}>
      Docs
    </Link>,
  );
  await click(document.querySelector('[role="link"],a'));
  expect(clicked).toBe(1);
});

test("InputOTP generates groups/slots and handles value, pattern, complete, paste and disabled", async () => {
  let changed, completed;
  await render(
    <InputOTP
      nativeID="otp"
      maxLength={4}
      groupSize={2}
      onChangeText={(value) => (changed = value)}
      onComplete={(value) => (completed = value)}
      accessibilityLabel="PIN"
    />,
  );
  const control = node("otp");
  expect(control.tagName).toBe("INPUT");
  if (native) {
    const inputProps = nativeProps.findLast(
      (props) => props.nativeID === "otp",
    );
    await act(() => inputProps.onChangeText("1234"));
  } else await input(control, "1234");
  expect(changed).toBe("1234");
  expect(completed).toBe("1234");
  await render(
    <InputOTP nativeID="otp" maxLength={4} defaultValue="" isDisabled />,
  );
  expect(isInputDisabled("otp")).toBe(true);
});

test("Ordinary Text does not claim field description slots and keeps project font", async () => {
  await render(
    <TextFontProvider family="Project Font">
      <TextField
        label={<Text>Project label</Text>}
        description={<Text>Project help</Text>}
      />
      <Checkbox
        label={<Text>Agreement</Text>}
        description={<Text>Details</Text>}
      />
      <RadioGroup
        label="Mode"
        items={[
          {
            value: "a",
            label: <Text>Choice</Text>,
            description: <Text>Choice help</Text>,
          },
        ]}
      />
    </TextFontProvider>,
  );
  for (const content of [
    "Project label",
    "Project help",
    "Agreement",
    "Details",
    "Choice",
    "Choice help",
  ]) {
    expect(document.body.textContent).toContain(content);
    const element = [...document.querySelectorAll("span")].find(
      (element) => element.textContent === content && element.style.fontFamily,
    );
    expect(element?.style.fontFamily).toContain("Project Font");
  }
});

test("OTP validates pattern, transforms paste and renders every grouped slot once", async () => {
  let changed;
  const ref = React.createRef();
  await render(
    <InputOTP
      key="pattern"
      nativeID="otp-extra"
      maxLength={4}
      groupSize={2}
      defaultValue="12"
      pattern="^[0-9]+$"
      onChangeText={(value) => (changed = value)}
      pasteTransformer={(text) => text.replace(/-/g, "")}
      {...extension({ ref })}
      groupProps={extension(idProps("otp-group"))}
      slotProps={extension(idProps("otp-slot"))}
      separatorProps={extension(idProps("otp-separator"))}
      accessibilityLabel="Verification"
    />,
  );
  expect(node("otp-extra").value).toBe("12");
  expect(document.querySelectorAll('[id="otp-group"]')).toHaveLength(2);
  expect(document.querySelectorAll('[id="otp-slot"]')).toHaveLength(4);
  expect(document.querySelectorAll('[id="otp-separator"]')).toHaveLength(1);
  expect(ref.current).not.toBeNull();
  if (native) await act(() => ref.current.setValue("12x"));
  else await input(node("otp-extra"), "12x");
  expect(changed).toBeUndefined();
  expect(node("otp-extra").value).toBe("12");
  if (native) await act(() => ref.current.setValue("12-34"));
  else {
    await act(() => {
      node("otp-extra").setSelectionRange(0, 2);
      const event = new win.Event("paste", { bubbles: true, cancelable: true });
      Object.defineProperty(event, "clipboardData", {
        value: { getData: () => "12-34" },
      });
      node("otp-extra").dispatchEvent(event);
    });
  }
  await settle();
  expect(changed).toBe("1234");
  expect(node("otp-extra").value).toBe("1234");
});

test("TextField root owns initial/controlled text and fires one callback for each edit", async () => {
  for (const mode of [
    {},
    { multiline: true },
    { inputGroupProps: { prefix: "¥" } },
  ]) {
    let calls = [];
    await render(
      <TextField
        key={JSON.stringify(mode)}
        {...mode}
        nativeID="initial-field"
        label="Initial"
        defaultValue="saved value"
        onChangeText={(value) => calls.push(value)}
      />,
    );
    expect(node("initial-field").value).toBe("saved value");
    await input(node("initial-field"), "edited value");
    expect(calls).toEqual(["edited value"]);
    expect(node("initial-field").value).toBe("edited value");
  }
});
