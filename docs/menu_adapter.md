# 外部菜单适配器

`ContextMenu` 和 `Dropdown` 的 Web 实现支持宿主注入菜单呈现能力。桌面系统菜单、自绘原生菜单、IPC 菜单服务或另一个 Web 菜单库都可以接入；rn-ui-kit 不依赖 Tauri、wcpopup，也不根据平台名称选择后端。

## 接入与选择规则

```tsx
import { ContextMenu, Dropdown, MenuProvider, type MenuAdapter } from "rn-ui-kit";

const desktopMenuAdapter: MenuAdapter = {
  open(request) {
    // 在宿主项目实现。下面两节分别说明返回 ID 和回调两类后端。
    return myMenuBackend.open(request);
  },
};

<MenuProvider value={{ menuAdapter: desktopMenuAdapter }}>
  <ContextMenu
    trigger={<MyButton>右键打开</MyButton>}
    items={[{ value: "copy", label: "复制", onSelect: copy }]}
  />
  <Dropdown
    triggerLabel="更多"
    items={[{ value: "copy", label: "复制", onSelect: copy }]}
  />
</MenuProvider>
```

也可以只为某一个组件配置 `menuAdapter={myAdapter}`，无需 Provider。Provider 的 `value` 保持原有的**整体替换**语义，嵌套 Provider 不会自动合并配置。

| 配置 | Web 行为 |
| --- | --- |
| 不配置适配器 | 保留 HeroUI |
| Provider 或组件提供适配器，未指定 native | 使用外部适配器 |
| 组件 `native={false}` | 使用 HeroUI，优先于适配器 |
| Provider `native: false` | 默认使用 HeroUI；组件可通过 `native` 显式启用外部适配器 |
| 组件 `menuAdapter={anotherAdapter}` | 覆盖 Provider 的适配器；仍遵循 native 的选择规则 |
| 组件 `menuAdapter={false}` | 禁用继承的外部适配器及旧 showNativeMenu，回落 HeroUI |
| Provider `menuAdapter: false` | 禁用全局外部适配器及旧接口；组件可指定自己的适配器 |
| `native` 为 true，但没有可用适配器 | 回落 HeroUI |

适配器要求数据式 `items`，不解释任意组合式 children。ContextMenu 的 trigger 可以使用 children，Dropdown 保留现有自定义 trigger、默认 Button、NativeTrigger。

**移动端边界不变**：iOS / Android 继续使用已有系统原生或 HeroUI Native 分支，外部适配器不参与运行。ContextMenu 仍遵循原有 `MenuProvider.native` 默认值，Dropdown 的移动端默认值仍为系统原生，不受旧 Provider 配置影响。仅设置 `menuAdapter={false}` 不会关闭移动端系统菜单；需要自绘时使用 `native={false}`。

## 适配器请求

导出类型：`MenuAdapter`、`MenuAdapterRequest`、`MenuAdapterSession`、`MenuAdapterItem`、`MenuAnchorRect`。

- `kind`：`context-menu` 或 `dropdown`，可在一个适配器内选择不同呈现方式。
- `source`：`pointer / keyboard / programmatic`。ContextMenu 支持右键、ContextMenu 键及 Shift+F10；Dropdown 支持点击、键盘激活、上下方向键和已有命令式句柄。
- `anchor.rect`：trigger 在**当前 Web 视口中的 CSS 像素矩形** `{ x, y, width, height }`。
- `anchor.point`：ContextMenu 右键的触点。键盘及程序打开没有此字段，应按 trigger 矩形定位。
- `placement`：来自 `contentProps.side / align / sideOffset`，默认 `bottom / start / 0`。
- `x / y`：建议弹出点。右键即触点；其他入口根据锚点、方向、对齐和偏移计算。它不是最终菜单左上角，特别是 top / end / center 对齐需要结合菜单自身大小计算；宿主可直接使用完整的 anchor/placement。
- `options`：组件 `menuAdapterOptions` 原样传入的扩展配置，例如主题、目标窗口或后端专用定位策略。基础库不解释这些字段。
- `items`：下面介绍的菜单树。
- `select(id)`：通过当前菜单项 ID 调用选择回调，返回 Promise。未知、禁用、分隔线和子菜单父项 ID 不执行动作。
- `signal`、`isCurrent()`：请求取消与有效性检查。异步创建资源前后均应检查；新的菜单请求、禁用、卸载或可观察的关闭会使旧请求失效。

定位使用 CSS 视口坐标，不是 page/screen 坐标或原生物理像素。窗口原点、WebView 缩放、DPI、平台坐标系和屏幕边缘避让由宿主适配器处理，库不会擅自乘 `devicePixelRatio`。不要求后端完整支持 placement；不支持的能力由宿主决定如何降级。

## 菜单数据与可定制性

`MenuAdapterItem` 沿用并扩展现有 `NativeMenuItem`。两个名称均可导入。字段包括：

- `id`：本次快照中唯一的透明 ID，子菜单重复 value 也不会冲突。宿主应原样返回，不能跨请求缓存或解释格式。转换后的 items 始终有 ID；旧宿主手工构造的 NativeMenuItem 仍允许不提供 ID。
- `value`：调用方原有的业务标识。
- `text`：优先 textValue，其次 aria-label，再使用字符串/数字 label，最后回退到 value。复杂 React label 应提供 textValue。
- `disabled / checked / separator / subMenu / destructive / subtitle / shortcut / shouldCloseOnSelect`：菜单语义与提示。
- `iconProps`：已有的图标元数据；React `icon` 元素不会发送给宿主。
- `hostData`：在调用方原始菜单项上提供的自定义数据，不解释字段结构。例如 `{ icon: "app.copy", role: "copy" }`，由宿主映射自己的图标或系统预定义动作。
- `onSelect()`：保留 JS 回调方式，适合直接在 JS 中构造的菜单。

所有字段均由宿主按能力转换，不承诺系统菜单能表现任意 React 内容。`shortcut` 只是展示文字，**不会自动注册 accelerator**；需要注册时在 hostData 中明确约定。

不要把整个 request 或 items 对象直接作为 IPC DTO。它们含回调、AbortSignal 等 JS 对象，iconProps/hostData/options 也不保证可序列化；桥接代码应挑选需要的可序列化字段。

ContextMenu 的选中回调保持 `onCheckedChange` 后优先 `onSelect`、其次 `onPress`；Dropdown 保持先 `onPress`、后不同引用的 `onSelect`，相同函数引用仅调用一次。禁用状态传递到子菜单。菜单显示期间数据是该次请求的快照；勾选后是否保持打开、如何更新可见菜单由宿主处理，库不会强制关闭或重建宿主菜单。

## 返回选择 ID 的后端

适合 IPC 服务、wcpopup 一类的“选中或取消后返回”接口。以下是**宿主侧示意实现**，`myPopupService` 和 `toSerializableItems` 需要由应用实现：

```ts
import type { MenuAdapter } from "rn-ui-kit";

const adapter: MenuAdapter = {
  open(request) {
    const popup = myPopupService.open({
      items: toSerializableItems(request.items), // 递归保留 id / text / disabled / checked 等
      anchor: request.anchor,
      placement: request.placement,
      kind: request.kind,
      options: request.options,
      signal: request.signal,
    });
    return {
      // result 必须涵盖“选中 / 点击外部 / Escape 取消”的真实结束。
      closed: popup.result.then(async (id: string | null) => {
        if (id !== null) await request.select(id);
      }),
      close: () => popup.cancel(),
      dispose: () => popup.dispose(),
    };
  },
};
```

应在 `closed` resolve 之前派发本次选择，否则请求已经失效，迟到动作会被忽略。关闭、选择或创建失败会通过 Provider 的 `onNativeMenuError` 报告；直接调用 `item.onSelect` / `request.select` 的异常需要由适配器等待或捕获。

## 回调型后端与关闭通知

回调型后端可以把 `item.onSelect` 绑定到菜单动作，也可以绑定 `() => request.select(item.id)`。不要同时绑定两种方式，否则同一个操作会执行两次。

`open()` 返回一个 session，允许异步创建：

```ts
const adapter: MenuAdapter = {
  async open(request) {
    const menu = await callbackBackend.create(request.items, request.options);
    // 创建期间可能已被替换/卸载。即便取消也返回资源句柄，库会关闭并释放它。
    if (request.isCurrent()) await menu.show(request.anchor, request.placement);
    return {
      closed: menu.whenActuallyClosed, // 只有后端确实提供此通知时才传
      close: () => menu.hide(),
      dispose: () => menu.release(),
    };
  },
};
```

三种生命周期不能混用：

1. `open` 返回：本次请求已交给宿主，资源句柄可用了，不自动表示菜单关闭。
2. `closed` resolve：菜单真实关闭，包括取消；库结束打开反馈、失效动作并 dispose。正常关闭不会再调用 close。
3. 取消：新的菜单取代旧菜单、组件禁用/卸载或受控关闭时，库 abort 请求并尽力 close，随后 dispose。异步 open 迟到的资源也会被清理。close / dispose 建议设计成幂等；signal 监听与它们可能指向同一个底层资源。

同一 document 中 ContextMenu 和 Dropdown 的外部请求互斥，避免旧菜单继续操作；独立窗口的 document 不相互影响。后端不支持程序关闭时可以省略 close，此时库只能使旧动作失效，不能物理移除宿主窗口。若后端操作必须串行，宿主仍应在自己的适配层串行管理资源。

### 没有关闭通知时

可以返回 `{ close, dispose }`，甚至 `{}`，省略 `closed`。库在 open 完成后复位 trigger/NativeList 行的打开反馈，但保留回调与资源直到下次请求、禁用或卸载；不会用定时器或焦点变化猜测菜单关闭。

这个模式下的 `onOpenChange(false)` 仅表示组件不再维持持续打开反馈，**不代表系统菜单已经关闭**；`open` 也不能追踪宿主窗口的真实状态。若应用需要准确的打开态、关闭后的焦点恢复或保持选中反馈，后端必须提供可靠的 closed 通知。无通知时不会主动抢回焦点。

有真实关闭通知时，只在原焦点仍连接、且焦点未移到其他控件时归还焦点。库不会因旧请求的完成抢走新菜单或其他输入控件的焦点。

## 现有 NativeList 用法

无需增加宿主专用的列表 API：

```tsx
<MenuProvider value={{ menuAdapter: adapter }}>
  <NativeList contextMenuProps={{ items: rowMenu }}>
    <NativeListSection title="文件">
      <NativeListItem title="README" />
      <NativeListItem title="只用应用菜单" contextMenuProps={{ native: false, items: rowMenu }} />
      <NativeListItem title="单独指定后端" contextMenuProps={{ native: true, menuAdapter: otherAdapter, items: rowMenu }} />
      <NativeListItem title="无右键菜单" contextMenuProps={false} />
      <NativeListDropdownItem title="格式" dropdownProps={{ items: formatMenu }} />
    </NativeListSection>
  </NativeList>
</MenuProvider>
```

保留 Root → Section → Item 的现有继承/覆盖规则：显式传入菜单对象会整体覆盖继承值，`false` 停止继承；禁用与编辑模式继续抑制菜单。Dropdown 的整行触发仍通过原有 `presentMenu()` 句柄进入相同适配器，不额外创建另一份菜单。

此能力不自动替换 iOS NativeList 的系统上下文菜单，也不将 Menubar / Select basic 的 HeroUI 菜单隐式改成外部菜单。Select 明确使用 Dropdown 模式时，仍按其现有 Dropdown 入口和 native 配置选择 renderer。

## 旧接口兼容

`MenuProvider.value.showNativeMenu(request): Promise<void>` 继续只用于 Web ContextMenu，仍需要 `native: true`。既有 `{ items, x, y, isCurrent }` 调用和 NativeMenuItem 形状均保留，Promise 完成沿用“关闭”含义。新适配器优先于旧接口；不会因扩展而让旧配置突然接管 Dropdown。

若某个后端的 popup Promise 仅表示已显示，旧接口本来就无法准确表达其生命周期，应该迁移到 `menuAdapter`，由宿主选择提供真实 closed，或显式接受上述无关闭通知模式。不同后端、版本和桥接封装的 Promise 含义可能不同，应以应用实际实现为准。

## 验证范围

自动化覆盖：保留旧 showNativeMenu 的右键/键盘行为；Provider/组件优先级和 HeroUI 回落；iOS/Android 原生 dispatch；ContextMenu 禁用与取消、受控/defaultOpen/命令式状态；真实 Web Button 和 NativeTrigger 点击；Dropdown 键盘及 NativeList 整行触发；NativeList 菜单继承与局部禁用；ID/回调派发；跨组件替换、独立窗口作用域、卸载、迟到结果、错误、资源回收、焦点保护，以及无关闭通知时的后续动作。

具体宿主的系统菜单窗口、DPI 换算、屏幕边缘定位、图标/快捷键、IPC 关闭事件仍需在宿主项目中验收。此轮未修改 lonanote，也未把某个后端的设备或桌面表现作为自动化测试已通过的结论。

2026-11-26 验证结果：`bun test test` 共 147 项通过、0 失败；库及示例应用 typecheck、库 build、`git diff --check` 通过。Expo 三端实际导出成功；source map 中 Web 包含 117 个 HeroUI React 模块，iOS / Android 各包含 361 个 HeroUI Native 模块，三端另一套 HeroUI 运行时均为 0。新增宿主菜单 Web 运行时只出现在 Web 模块图中，iOS / Android 均未引入。
