import { beforeEach, expect, mock, test } from "bun:test";

// Execute the installed Native mutables, cancellation and animation algorithms.
// Only the device scheduler/serialization boundary is replaced. In Worklets 0.8,
// scheduleOnUI batches through a microtask; Shareable.setAsync submits directly.
// An immediate-value animation mock cannot expose their ordering regression.
const entry = process.env.REANIMATED_TEST_ENTRY === "module" ? "lib/module" : "src";
const packageRoot = process.env.REANIMATED_TEST_PACKAGE ?? new URL("../examples/app/node_modules/react-native-reanimated/", import.meta.url).pathname;
const base = `${packageRoot.replace(/\/$/, "")}/${entry}/`;
globalThis.__DEV__ = false;
globalThis.__RUNTIME_KIND = 1;
globalThis.__callMicrotasks = () => {};
let uiJobs = [];
let batchedJobs = [];
let frameJobs = [];
let timestamp = 1000;
let reduceMotion = false;
function onUI(callback) {
  const previous = globalThis.__RUNTIME_KIND;
  globalThis.__RUNTIME_KIND = 2;
  try { return callback(); } finally { globalThis.__RUNTIME_KIND = previous; }
}
function scheduleOnUI(callback, ...args) {
  batchedJobs.push(() => callback(...args));
  if (batchedJobs.length === 1) queueMicrotask(() => {
    const jobs = batchedJobs;
    batchedJobs = [];
    uiJobs.push(() => jobs.forEach(job => job()));
  });
}
async function flushUI() {
  await Promise.resolve();
  while (uiJobs.length) onUI(uiJobs.shift());
}
async function advance(milliseconds) {
  await flushUI();
  for (let elapsed = 0; elapsed < milliseconds; elapsed += 10) {
    timestamp += Math.min(10, milliseconds - elapsed);
    const jobs = frameJobs;
    frameJobs = [];
    onUI(() => jobs.forEach(job => job(timestamp)));
  }
}
globalThis._getAnimationTimestamp = () => timestamp;
globalThis.requestAnimationFrame = callback => { frameJobs.push(callback); return frameJobs.length; };

mock.module(Bun.resolveSync("react-native-worklets", base), () => ({
  RuntimeKind: { ReactNative: 1, UI: 2 }, UIRuntimeId: 2,
  scheduleOnUI, runOnUISync: (callback, ...args) => onUI(() => callback(...args)),
  createSerializable: value => value, serializableMappingCache: new WeakMap(),
  isWorkletFunction: () => true,
  createSynchronizable: initial => {
    let value = initial;
    return { getBlocking: () => value, setBlocking: next => { value = next; } };
  },
  createShareable: (_runtimeId, initial, { hostDecorator, guestDecorator }) => {
    const host = onUI(() => hostDecorator({ value: initial }));
    return guestDecorator({
      getSync: () => host.value,
      setAsync: next => {
        const apply = () => { host.value = typeof next === "function" ? next(host.value) : next; };
        // Serialization resolves a captured Shareable to its UI host. Calling
        // into that host is synchronous when already executing on UI.
        if (globalThis.__RUNTIME_KIND === 2) apply(); else uiJobs.push(apply);
      },
    });
  },
}));
mock.module(base + "common", () => ({
  IS_JEST: false, SHOULD_BE_USE_WEB: false, logger: { warn() {} }, ReanimatedError: Error,
}));
mock.module(base + "featureFlags", () => ({ getStaticFeatureFlag: () => true }));
mock.module(base + "reactUtils", () => ({ isReactRendering: () => false, isFirstReactRender: () => false }));
mock.module(base + "ReducedMotion", () => ({
  ReducedMotionManager: { jsValue: false, uiValue: { get value() { return reduceMotion; } } },
}));
mock.module(base + "Colors", () => ({
  clampRGBA: value => value, convertToRGBA: value => value, isColor: () => false,
  rgbaArrayToRGBAColor: value => value, toGammaSpace: value => value, toLinearSpace: value => value,
}));
const { makeMutable } = await import(base + "mutables");
const { cancelAnimation } = await import(base + "animation/util");
const { withTiming } = await import(base + "animation/timing");
const { withRepeat } = await import(base + "animation/repeat");
const { Easing } = await import(base + "Easing");
const { ReduceMotion } = await import(base + "commonTypes");

beforeEach(() => {
  uiJobs = []; batchedJobs = []; frameJobs = []; timestamp = 1000; reduceMotion = false;
});
test("Progress value changes survive cleanup of the previous effect", async () => {
  const progress = makeMutable(0.35);
  progress.value = withTiming(0.35);
  await flushUI();
  cancelAnimation(progress);
  progress.value = withTiming(0.45, { duration: 300, easing: Easing.linear });
  await advance(150);
  expect(progress.get()).toBeGreaterThan(0.35);
  expect(progress.get()).toBeLessThan(0.45);
  await advance(150);
  expect(progress.get()).toBeCloseTo(0.45);
  cancelAnimation(progress);
  progress.set(withTiming(1, { duration: 300 }));
  await advance(300);
  expect(progress.get()).toBe(1);
});
test("indeterminate Progress cancels, resets and repeats without cancelling the new sweep", async () => {
  const sweep = makeMutable(0);
  cancelAnimation(sweep);
  sweep.value = 0;
  sweep.value = withRepeat(withTiming(1, { duration: 100, easing: Easing.linear }), -1, false);
  await advance(50);
  expect(sweep.get()).toBeCloseTo(0.5);
  await advance(100);
  expect(sweep.get()).toBeCloseTo(0.5);
});
for (const reverse of [false, true]) {
  test(`Skeleton ${reverse ? "pulse" : "shimmer"} restarts after its layout render`, async () => {
    const progress = makeMutable(0);
    function start() {
      progress.set(0);
      progress.value = withRepeat(withTiming(1, { duration: 100, easing: Easing.linear }), -1, reverse);
    }
    start();
    await advance(30);
    cancelAnimation(progress); // useEffect cleanup after measuring the skeleton.
    start();
    await advance(50);
    expect(progress.get()).toBeCloseTo(0.5);
    await advance(100);
    expect(progress.get()).toBeCloseTo(0.5);
  });
}
test("a cancellation requested after a start still stops that animation", async () => {
  const progress = makeMutable(0);
  progress.set(withTiming(1, { duration: 100 }));
  cancelAnimation(progress);
  await advance(200);
  expect(progress.get()).toBe(0);
});
test("unmount cancellation remains final after a pending restart", async () => {
  const progress = makeMutable(0);
  cancelAnimation(progress);
  progress.set(withRepeat(withTiming(1, { duration: 100 }), -1, false));
  cancelAnimation(progress);
  await advance(200);
  expect(progress.get()).toBe(0);
});
test("system reduced motion still settles determined progress and stops repeating motion", async () => {
  reduceMotion = true;
  const progress = makeMutable(0);
  cancelAnimation(progress);
  progress.set(withTiming(1, { duration: 300, reduceMotion: ReduceMotion.System }));
  await advance(10);
  expect(progress.get()).toBe(1);
  const pulse = makeMutable(0);
  pulse.set(withRepeat(withTiming(1, { duration: 100 }), -1, true, undefined, ReduceMotion.System));
  await advance(200);
  expect(pulse.get()).toBe(0);
});
