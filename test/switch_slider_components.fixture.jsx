import { afterEach, expect, mock, test } from "bun:test";
import { Window } from "happy-dom";
const win = new Window({ url: "http://localhost/" });
for (const key of ["window", "document", "navigator", "HTMLElement", "HTMLButtonElement", "HTMLLabelElement", "HTMLOutputElement", "HTMLInputElement", "HTMLAnchorElement", "SVGElement", "Element", "Node", "NodeFilter", "Event", "MouseEvent", "KeyboardEvent", "PointerEvent", "ShadowRoot", "MutationObserver", "ResizeObserver", "CSSRuleList", "CSS"])
  globalThis[key] = key === "window" ? win : win[key];
globalThis.getComputedStyle = win.getComputedStyle.bind(win);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.requestAnimationFrame = (fn) => setTimeout(fn, 0);
globalThis.cancelAnimationFrame = clearTimeout;
const React = await import("react");
const { act } = React;
const RNW = await import("../node_modules/react-native-web/dist/index.js");
const platform = process.env.CONTROLS_TEST_PLATFORM ?? "web";
const native = platform !== "web";
mock.module("react-native-web", () => RNW);
const nativeProps = [];
function interop(Component) {
  return React.forwardRef(function Interop({ className, style, ...props }, ref) {
    nativeProps.push({ ...props, className, style });
    const state = props.accessibilityState;
    if (state?.checked != null) props["aria-checked"] = state.checked;
    const value = props.accessibilityValue;
    if (value) { props["aria-valuenow"]=value.now; props["aria-valuemin"]=value.min; props["aria-valuemax"]=value.max; }
    return <Component {...props} ref={ref} style={[className === undefined ? {} : { $$css: true, tailwind: className }, style]} />;
  });
}
const NativeView = interop(RNW.View);
mock.module("react-native", () => ({ ...RNW, Platform: { ...RNW.Platform, OS: platform, Version: "26.0" }, Text: interop(RNW.Text), View: NativeView, Pressable: interop(RNW.Pressable) }));
mock.module("uniwind", () => ({ withUniwind: (component) => component }));
mock.module("expo-haptics", () => ({ ImpactFeedbackStyle: {Light:"light",Medium:"medium",Heavy:"heavy"}, AndroidHaptics: {} }));
const haptics = [];
const { getSliderHapticsBuckets } = await import("../src/core/components/ui/utils/haptics");
mock.module("../src/core/components/ui/utils/haptics", () => ({ useResolvedNativeHaptics: (value) => value ?? true, getSliderHapticsBuckets, triggerNativeHaptics: (value) => { if (native && value) haptics.push(value); }, triggerSliderNativeHaptics: (value) => { if (native && value) haptics.push(value); } }));
const gestures = [];
function gesture(type) {
 const handlers = { type }; let proxy;
 proxy = new Proxy(handlers, { get(target, key) { return key in target ? target[key] : (value) => { target[key + "Value"] = value; return proxy; }; } });
 gestures.push(handlers); return proxy;
}
mock.module("react-native-gesture-handler", () => ({ Gesture: { Pan: () => gesture("pan"), Tap: () => gesture("tap") }, GestureDetector: ({ children }) => children }));
const theme = { fieldBorder: "#cccccc", background: "#ffffff", foreground: "#111111", muted: "#777777", surfaceSecondary: "#dddddd", accent: "#2563eb", accentForeground: "#ffffff", default: "#f4f4f5", defaultForeground: "#18181b", danger: "#dc2626", dangerForeground: "#ffffff" };
mock.module("../src/core/components/ui/utils/theme", () => ({ useUiTheme: () => theme }));
const { toARGB } = await import("../src/core/components/ui/utils/color/android_argb");
const { toSwiftUIHexColor } = await import("../src/core/components/ui/utils/color/swift_ui_color");
const hapticsAPI = await import("../src/core/components/ui/utils/haptics");
mock.module("../src/core/components/ui/utils", () => ({ ...hapticsAPI, toARGB, toSwiftUIHexColor, useUiTheme: () => theme, supportsImpactHaptics: () => true }));
const sharedValue = (value) => ({ value, get() { return this.value; }, set(next) { this.value = next; } });
const rotations = [];
const transition = { duration() { return this; }, easing() { return this; } };
mock.module("react-native-reanimated", () => ({
  default: { View: NativeView, Text: interop(RNW.Text), createAnimatedComponent: (component) => component },
  FadeIn: transition, FadeOut: transition,
  Easing: { bezier: () => x => x, linear: (x) => x, out: (x) => x, ease: (x) => x }, useAnimatedStyle: () => ({}),
  cancelAnimation() {}, withTiming: (x) => { rotations.push(x); return x; }, withRepeat: (x) => x,
  useSharedValue: (value) => React.useRef(sharedValue(value)).current,
}));
const svgExports = {};
for (const name of ["Svg", "Path", "Circle", "G", "Defs", "LinearGradient", "Stop", "Rect", "Line", "Polyline", "Polygon", "Ellipse", "ClipPath", "Mask", "Text", "TSpan", "Use", "Symbol", "Pattern", "Image", "RadialGradient"])
  svgExports[name] = React.forwardRef(({ children, ...props }, ref) => React.createElement(name === "Svg" ? "svg" : name.toLowerCase(), { ...props, ref }, children));
mock.module("react-native-svg", () => ({ default: svgExports.Svg, ...svgExports }));
if (native) {
  const { createContext } = await import("../node_modules/heroui-native/src/helpers/internal/utils/create-context");
  const { childrenToString } = await import("../node_modules/heroui-native/src/helpers/internal/utils/children-to-string");
  const { getElementWithDefault } = await import("../node_modules/heroui-native/src/helpers/internal/utils/get-element-with-default");
  const animationUtils = await import("../node_modules/heroui-native/src/helpers/internal/utils/animation");
  mock.module("../node_modules/heroui-native/src/helpers/internal/utils", () => ({ ...animationUtils, createContext, childrenToString, getElementWithDefault, hasProp: (element, key) => key in element.props, combineStyles: (styles) => styles }));
  const { useControllableState } = await import("../node_modules/heroui-native/src/helpers/internal/hooks/use-controllable-state");
  mock.module("../node_modules/heroui-native/src/helpers/internal/hooks", () => ({ useControllableState, useIsRTL: () => false }));
  mock.module("../node_modules/heroui-native/src/helpers/external/hooks", () => ({
    useIsOnSurface: () => false,
    useTextComponent: () => ({ textProps: { allowFontScaling: false } }),
    useThemeColor: (colors) => Array.isArray(colors) ? colors.map(() => "#123456") : "#123456",
  }));
  const { HeroText } = await import("../node_modules/heroui-native/src/helpers/internal/components/hero-text");
  mock.module("../node_modules/heroui-native/src/helpers/internal/components", () => ({ HeroText, AnimatedCheckIcon: () => null, CheckIcon: () => null, ThemeBackground: NativeView, useHasDefaultThemeBackground: () => false }));
  const FieldContext = React.createContext(null);
  mock.module("../node_modules/heroui-native/src/helpers/internal/contexts", () => ({ AnimationSettingsProvider: ({ children }) => children, FormFieldProvider: FieldContext.Provider, useFormField: () => React.useContext(FieldContext) }));
  for (const [name, hooks] of Object.entries({ label: ["useLabelRootAnimation"], description: ["useDescriptionAnimation"], "field-error": ["useFieldErrorRootAnimation"], "control-field": ["useControlFieldRootAnimation"], slider: ["useSliderRootAnimation", "useSliderThumbAnimation"], checkbox: ["CheckboxAnimationProvider", "useCheckboxIndicatorAnimation", "useCheckboxRootAnimation"], radio: ["useRadioIndicatorThumbAnimation", "useRadioRootAnimation"] }))
    mock.module("../node_modules/heroui-native/src/components/" + name + "/" + name + ".animation", () => Object.fromEntries(hooks.map(hook => [hook, () => ({})])));
  mock.module("../node_modules/heroui-native/src/components/switch/switch.animation", () => ({
    SwitchAnimationProvider: ({ children }) => children,
    useSwitchRootAnimation: () => ({ isSwitchPressed: sharedValue(false), contentContainerWidth: sharedValue(48) }),
    useSwitchThumbAnimation: () => ({}),
  }));
  mock.module("../node_modules/heroui-native/src/components/pressable-feedback/pressable-feedback.animation", () => ({
    PressableFeedbackRootAnimationProvider: ({ children }) => children,
    usePressableFeedbackRootAnimation: () => ({ isPressed: sharedValue(false), containerWidth: sharedValue(0), containerHeight: sharedValue(0), animationOnPressIn() {}, animationOnPressOut() {} }),
    usePressableFeedbackScaleAnimation: () => ({}), usePressableFeedbackHighlightAnimation: () => ({}),
    usePressableFeedbackRippleAnimation: () => ({ animationOnTouchStart() {}, animationOnTouchEnd() {} }),
  }));
  mock.module("../node_modules/heroui-native/src/components/spinner/spinner.animation", () => ({ useSpinnerRootAnimation: () => ({}), useSpinnerIndicatorAnimation: () => ({}) }));
  for (const [name, exportName] of [["text", "Typography"], ["label", "Label"], ["description", "Description"], ["field-error", "FieldError"], ["control-field", "ControlField"], ["switch", "Switch"], ["slider", "Slider"]]) {
    const component = await import("../node_modules/heroui-native/src/components/" + name + "/" + name);
    mock.module("heroui-native/" + name, () => ({ [exportName]: component.default }));
  }
  for (const name of ["text", "label", "switch", "slider"]) {
    const adapter = await import("../src/core/components/ui/" + name + "/" + name + "_heroui.native");
    mock.module("../src/core/components/ui/" + name + "/" + name + "_heroui", () => adapter);
  }
  const messages = await import("../src/core/components/ui/utils/field_parts_heroui.native");
  mock.module("../src/core/components/ui/utils/field_parts_heroui", () => messages);
}
// System renderers stay real. Only the Expo UI native-view boundary is substituted.
const systems = [];
function systemPart(name) {
  return ({ children, ...props }) => { systems.push({ name, ...props }); return <div data-system={name}>{children}</div>; };
}
if (native) {
  const parts = ["Switch", "Toggle", "Slider", "Host"];
  const expo = Object.fromEntries(parts.map((name) => [name, systemPart(name)]));
  mock.module("@luoluoqixi/expo-ui-55/swift-ui", () => expo);
  mock.module("@luoluoqixi/expo-ui-55/jetpack-compose", () => expo);
  const modifiers = Object.fromEntries(["tint", "toggleStyle", "disabled"].map((name) => [name, (...args) => ({ type: name, args })]));
  mock.module("@luoluoqixi/expo-ui-55/swift-ui/modifiers", () => modifiers);
  mock.module("@luoluoqixi/expo-ui-55/jetpack-compose/modifiers", () => modifiers);
  for (const name of ["switch", "slider"]) {
    const renderer = await import("../src/core/components/ui/" + name + "/" + name + "_native." + platform);
    mock.module("../src/core/components/ui/" + name + "/" + name + "_native", () => renderer);
  }
}
const { Switch } = await import("../src/core/components/ui/switch");
const { Slider } = await import("../src/core/components/ui/slider");
const { TextFontProvider } = await import("../src/core/components/ui/provider/font_provider");
const { createRoot } = await import("react-dom/client");
let root;
const latest = name => systems.findLast(p => p.name === name);
const control = () => document.querySelector('[role="switch"]');
const thumbs = () => [...document.querySelectorAll('[role="slider"],input[type="range"]')];
async function settle() { await act(async () => { await new Promise(resolve => setTimeout(resolve, 50)); }); }
async function render(content) {
  if (!root) { const mount = document.createElement("div"); document.body.append(mount); root = createRoot(mount); }
  await act(() => root.render(content)); await settle();
}
async function click(node) { await act(() => node.click()); await settle(); }
async function key(node, value) {
  await act(() => node.dispatchEvent(new win.KeyboardEvent("keydown", { key: value, bubbles: true, cancelable: true })));
  await act(() => node.dispatchEvent(new win.KeyboardEvent("keyup", { key: value, bubbles: true, cancelable: true })));
  await settle();
}
async function measure() {
  for (const cls of ["slider__track", "slider__thumb-container"])
    await act(() => nativeProps.findLast(p => p.className?.includes(cls) && p.onLayout)?.onLayout({ nativeEvent: { layout: { x: 0, y: 0, width: cls === "slider__track" ? 224 : 24, height: cls === "slider__track" ? 224 : 24 } } }));
  await settle();
}
async function tap(value) {
  const tap = gestures.findLast(g => g.type === "tap");
  if (tap.enabledValue) await act(() => tap.onEndValue({ x: 12 + value * 2, y: 212 - value * 2 }));
  await settle();
}
afterEach(async () => { await act(() => root?.unmount()); root = undefined; document.body.replaceChildren(); nativeProps.length = 0; systems.length = 0; gestures.length = 0; haptics.length = 0; });

test("Switch: default/controlled state, labels, disabled and single callback/haptic", async () => {
  const changes=[];
  await render(<Switch native={false} label="通知" description="保持更新" defaultSelected onSelectedChange={v => changes.push(v)} />);
  expect((native ? control().getAttribute("aria-checked") : String(control().checked))).toBe("true");
  await click(control());
  expect((native ? control().getAttribute("aria-checked") : String(control().checked))).toBe("false"); expect(changes).toEqual([false]);
  expect(haptics.length).toBe(native ? 1 : 0);
  await render(<Switch native={false} label="通知" isSelected onSelectedChange={v => changes.push(v)} />);
  await click(control()); expect((native ? control().getAttribute("aria-checked") : String(control().checked))).toBe("true"); expect(changes).toEqual([false,false]);
  await render(<Switch native={false} label="通知" isDisabled isSelected onSelectedChange={v => changes.push(v)} />);
  await click(control()); expect(changes).toHaveLength(2);
  await render(null);
  await render(<Switch native={false} label={({ isSelected }) => isSelected ? "开启" : "关闭"} defaultSelected />);
  expect(document.body.textContent).toContain("开启"); await click(control()); expect(document.body.textContent).toContain("关闭");
});

test("Switch: sizes, thumb content, project font and platform ref", async () => {
  const ref=React.createRef();
  for(const size of ["sm","md","lg"]){
    await render(<TextFontProvider family="ControlsTest"><Switch native={false} size={size} label="设置" labelPosition="left"
      thumbContent={({ isSelected })=>isSelected ? "1" : "0"} {...(native ? { herouiNativeProps: { ref } } : { herouiWebProps: { ref } })} /></TextFontProvider>);
    expect(ref.current).toBeTruthy(); expect(document.body.textContent).toContain("0");
    if(!native) expect(ref.current.className).toContain("switch--"+size);
    expect([...document.querySelectorAll("span,div")].some(n=>n.textContent==="设置" && n.style.fontFamily.includes("ControlsTest"))).toBe(true);
  }
  await render(null); expect(ref.current).toBeNull();
});

test("Slider: label/output, numeric callback shape, final value and programmatic update", async () => {
  const changes=[], ends=[], arrays=[];
  function Example(){ const [v,set]=React.useState(30); return <Slider native={false} label="音量" value={v} onChange={next=>{changes.push(next);set(next)}} onChangeEnd={v=>ends.push(v)} onValueChange={v=>arrays.push(v)} />; }
  await render(<Example />);
  if(native){await measure();await tap(60);}else{ await key(thumbs()[0],"ArrowRight"); }
  expect(changes).toEqual([native ? 60 : 31]); expect(ends).toEqual(changes); expect(arrays).toEqual([[changes[0]]]);
  expect(document.body.textContent).toContain(String(changes[0]));
  await render(<Slider native={false} label="音量" value={90} />);
  expect(native ? thumbs()[0].getAttribute("aria-valuenow") : thumbs()[0].value).toBe("90");
});

test("Slider: range ordering, fractional step/format, disabled and positive continuous divisor", async () => {
  const changes=[];
  await render(<Slider native={false} label="折扣" defaultValue={[0.2,0.75]} minValue={0} maxValue={1} step={0.01} formatOptions={{style:"percent"}} onChange={v=>changes.push(v)} />);
  expect(thumbs()).toHaveLength(2); expect(document.body.textContent).toContain("20%"); expect(document.body.textContent).toContain("75%");
  if(native){ await measure(); await tap(25); }else{await key(thumbs()[0],"End");}
  expect(Array.isArray(changes[0])).toBe(true); expect(changes[0][0]).toBeLessThanOrEqual(changes[0][1]);
  await render(null);
  await render(<Slider native={false} label="禁用" isDisabled defaultValue={40} onChange={v=>changes.push(v)} />);
  const previous=changes.length;
  if(native){await measure();await tap(80);}else await key(thumbs()[0],"ArrowRight");
  expect(changes).toHaveLength(previous);
  await render(null);
  await render(<Slider native={false} label="精细" defaultValue={50} step={0} onChange={v=>changes.push(v)} />);
  if(native){await measure();await tap(63.25);}else await key(thumbs()[0],"ArrowRight");
  expect(Number.isFinite(changes.at(-1))).toBe(true);
});

if(native){
  test("Slider: vertical gestures, single final event and haptic buckets", async()=>{
    const changes=[],ends=[];
    await render(<Slider native={false} orientation="vertical" label="高度" defaultValue={20} nativeHapticsInterval={10} onChange={v=>changes.push(v)} onChangeEnd={v=>ends.push(v)} />);
    await measure(); const pan=gestures.findLast(g=>g.type==="pan");
    await act(()=>pan.onBeginValue()); await act(()=>pan.onUpdateValue({translationY:-10,translationX:0})); await settle();
    expect(changes).toEqual([25]); expect(haptics).toHaveLength(0);
    await act(()=>pan.onUpdateValue({translationY:-40,translationX:0})); await settle();
    await act(()=>pan.onFinalizeValue());await settle();
    expect(changes).toEqual([25,40]);expect(ends).toEqual([40]);expect(haptics).toHaveLength(1);
  });
  test("System Switch: default routing, overrides, label, iOS native feedback and disabling", async()=>{
    const events=[],overrides=[];
    await render(<Switch label="原生开关" nativeSwiftProps={{onIsOnChange:v=>overrides.push(v),modifiers:[{custom:true}]}}
      nativeComposeProps={{onCheckedChange:v=>overrides.push(v),colors:{checkedTrackColor:"#ff0000"}}} onSelectedChange={v=>events.push(v)} />);
    const part=latest(platform==="ios"?"Toggle":"Switch");
    await act(()=>platform==="ios"?part.onIsOnChange(true):part.onCheckedChange(true));await settle();
    expect(events).toEqual([true]);expect(overrides).toEqual([true]);expect(haptics).toHaveLength(platform==="ios"?0:1);
    if(platform==="ios"){expect(latest("Host").ignoreSafeArea).toBe("all");expect(part.modifiers).toContainEqual({custom:true});}
    else expect(part.colors.checkedTrackColor).toBe(toARGB("#ff0000"));
    await click(document.querySelector('[role="switch"]'));expect(events).toEqual([true,false]);
    await render(<Switch isDisabled label="原生开关" onSelectedChange={v=>events.push(v)} />);
    await click(document.querySelector('[role="switch"]'));expect(events).toHaveLength(2);
  });
  test("System Slider: continuous/step, controlled and local values, finished callbacks, native colors", async()=>{
    const events=[],ends=[];
    await render(<Slider defaultValue={50} step={0} colors={{activeTrackColor:"#ff0000"}} onChange={v=>events.push(v)} onChangeEnd={v=>ends.push(v)} />);
    expect(latest("Slider").value).toBe(50);
    if(platform==="ios"){expect(latest("Host").ignoreSafeArea).toBe("all");expect(latest("Slider").step).toBeUndefined();}
    else {expect(latest("Slider").steps).toBe(0);expect(latest("Slider").colors.activeTrackColor).toBe(toARGB("#ff0000"));}
    await act(()=>latest("Slider").onValueChange(61.234)); await settle();
    expect(events).toEqual([61.234]);expect(latest("Slider").value).toBe(61.234);
    await act(()=>platform==="ios"?latest("Slider").onEditingChanged(false):latest("Slider").onValueChangeFinished());await settle();expect(ends).toEqual([61.234]);
    await render(<Slider value={80} isDisabled step={5} />);expect(latest("Slider").value).toBe(80);
    if(platform==="ios")expect(latest("Slider").modifiers).toContainEqual({type:"disabled",args:[true]});else expect(latest("Slider").enabled).toBe(false);
    await render(null);
    await render(<Slider defaultValue={[20,80]} label="自动区间" />);expect(thumbs()).toHaveLength(2);
    expect(document.querySelector('[data-system="Slider"]')).toBeNull();
  });
}

test("Slider: bounds normalization and decimal precision", async()=>{
  const {sliderBounds,normalizeSliderValues}=await import("../src/core/components/ui/slider/slider_state");
  expect(sliderBounds()).toEqual({min:0,max:100,nativeStep:1,step:1});
  expect(sliderBounds(0,100,0).step).toBe(0.01);
  expect(sliderBounds(NaN,Infinity,-1)).toEqual({min:0,max:100,nativeStep:1,step:1});
  expect(normalizeSliderValues([80,-5,NaN,200],0,100,1)).toEqual([0,0,80,100]);
  expect(normalizeSliderValues(0.31,0.1,1.1,0.1)).toEqual([0.3]);
  expect(normalizeSliderValues([],0,100,1)).toEqual([0]);
});

if (!native) test("Slider custom active color also controls the filled end cap theme token", async () => {
  await render(<Slider native={false} label="绿色轨道" defaultValue={40} colors={{activeTrackColor: "#00aa44"}} />);
  expect(document.querySelector('[data-slot="slider"]').style.getPropertyValue("--accent").toLowerCase()).toBe("#00aa44");
  await render(<Slider native={false} label="覆盖主题" defaultValue={40} colors={{activeTrackColor: "#00aa44"}} herouiWebProps={{style: {"--accent": "#ff8800"}}} />);
  expect(document.querySelector('[data-slot="slider"]').style.getPropertyValue("--accent")).toBe("#ff8800");
});

test("Slider: custom value label and root/slot refs remain usable", async()=>{
  const ref=React.createRef(),track=React.createRef(),thumb=React.createRef();
  const ext=ref=>native?{herouiNativeProps:{ref}}:{herouiWebProps:{ref}};
  await render(<Slider native={false} label="自定义输出" defaultValue={40} valueLabel={({formattedValue})=>formattedValue+" dB"}
    {...ext(ref)} trackProps={ext(track)} thumbProps={ext(thumb)} />);
  expect(document.body.textContent).toContain("40 dB");expect(ref.current).toBeTruthy();expect(track.current).toBeTruthy();expect(thumb.current).toBeTruthy();
  await render(null);expect(ref.current).toBeNull();expect(track.current).toBeNull();expect(thumb.current).toBeNull();
});
