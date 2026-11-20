import { afterEach, expect, mock, test } from "bun:test";
import { Window } from "happy-dom";
const win = new Window({ url: 'http://localhost/' });
for (const key of ["window", "document", "navigator", "HTMLElement", "HTMLDivElement", "HTMLInputElement", "HTMLTextAreaElement", "ShadowRoot", "Element", "Node", "NodeFilter", "MutationObserver", "CustomEvent", "Event", "ResizeObserver", "PointerEvent", "DOMRect", "AnimationEvent", "KeyboardEvent"]) {
  globalThis[key] = key === "window" ? win : win[key];
}
globalThis.getComputedStyle = win.getComputedStyle.bind(win);
globalThis.requestAnimationFrame = win.requestAnimationFrame.bind(win);
globalThis.cancelAnimationFrame = win.cancelAnimationFrame.bind(win);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
mock.module("react-native", () => require("react-native-web"));
const React = await import('react');
const { act, createRef } = React;
const { createRoot } = await import('react-dom/client');
const { TrueSheet } = await import('../node_modules/@lodev09/react-native-true-sheet/src/TrueSheet.web');
const { TrueSheetProvider } = await import('../node_modules/@lodev09/react-native-true-sheet/src/TrueSheetProvider.web');
const { observeSheetLayout } = await import('../node_modules/@lodev09/react-native-true-sheet/src/web/layout');
let root;
const wait = (ms=400) => new Promise(resolve => setTimeout(resolve, ms));
afterEach(async () => { await act(() => root?.unmount()); document.body.replaceChildren(); });
test('auto measurement stays invisible when navigation descendants explicitly restore visibility', () => {
  const drawer = document.createElement('div');
  const layout = document.createElement('div');
  const content = document.createElement('div');
  content.style.visibility = 'visible';
  content.textContent = 'native/JS navigation screen';
  layout.append(content); drawer.append(layout); document.body.append(drawer);
  const observer = observeSheetLayout({
    drawer, layout, getContent: () => content, getHeader: () => null,
    getFooter: () => null, getScrollable: () => null, absoluteHeader: false,
    absoluteFooter: false, footerInsetAdjustment: false, measureContent: true,
    onHeightChange: () => {},
  });
  const measurement = drawer.querySelector('[data-truesheet-measure]');
  expect(measurement.style.opacity).toBe('0');
  expect(measurement.inert).toBe(true);
  expect(measurement.getAttribute('aria-hidden')).toBe('true');
  expect(measurement.firstElementChild.style.visibility).toBe('visible');
  observer.disconnect();
  expect(drawer.querySelector('[data-truesheet-measure]')).toBeNull();
});
test('actual v4 Web present/dismiss promises settle after lifecycle events and resize keeps one open sheet', async () => {
  const events=[];
  const ref=createRef();
  const host=document.createElement('div');document.body.append(host);root=createRoot(host);
  await act(() => root.render(<TrueSheetProvider><TrueSheet ref={ref} name="real-web" detents={[0.4,0.8]}
    onWillPresent={() => events.push('willPresent')} onDidPresent={() => events.push('didPresent')}
    onDetentChange={e => events.push('detent:'+e.nativeEvent.index)}
    onWillDismiss={() => events.push('willDismiss')} onDidDismiss={() => events.push('didDismiss')}>
    <div><input id="inside"/>content</div>
  </TrueSheet></TrueSheetProvider>));
  let presentation;
  await act(async () => { presentation=ref.current.present(0).then(() => events.push('presentResolved')); await wait(); });
  await presentation;
  expect(events.indexOf('willPresent')).toBeLessThan(events.indexOf('didPresent'));
  expect(events.indexOf('didPresent')).toBeLessThan(events.indexOf('presentResolved'));
  await act(async () => { await ref.current.resize(1); await wait(); });
  expect(events.filter(x=>x==='willPresent')).toHaveLength(1);
  expect(events).toContain('detent:1');
  let dismissal;
  await act(async () => { dismissal=ref.current.dismiss().then(()=>events.push('dismissResolved')); await wait(); });
  await dismissal;
  expect(events.indexOf('willDismiss')).toBeLessThan(events.indexOf('didDismiss'));
  expect(events.indexOf('didDismiss')).toBeLessThan(events.indexOf('dismissResolved'));
  await act(async () => { presentation=ref.current.present(1); await wait(); });
  await presentation;
  expect(events.filter(x=>x==='willPresent')).toHaveLength(2);
});
