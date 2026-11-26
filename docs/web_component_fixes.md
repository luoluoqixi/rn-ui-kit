# HeroUI Web 组件修复记录

日期：2026-11-27。适用于当前锁定的 HeroUI React / Styles 3.2.7、React Aria Components 1.22.1，以及 TrueSheet 4.1.2 Web 实现。

本轮主要调整 Web 适配层，保留系统原生组件、NativeTrigger、NativeList 和 TrueSheet 补丁。Native 唯一的组件布局修正是 RadioGroup 横向排列的标签宽度；Dialog 示例则使用公开的 NativeSheetScrollContent 承载 Sheet 内容。

## 问题与处理

| 反馈 | 原因与处理 |
| --- | --- |
| Dialog 中的菜单、右键子菜单越界后被裁切 | 原局部 portal host 位于带 overflow: clip 的 Modal.Dialog 内。将 ModalContentScope 移到 Modal.Container 内、Dialog 外，保持 modal 与焦点作用域归属，同时避开内容裁切。没有全局关闭 Dialog 的 overflow。 |
| Dialog 中仅含 Input 的 Popover 太窄 | 局部 portal host 不参与布局，宽度为 0，内容不能依赖其百分比宽度。Popover 默认使用 w-72，最大宽度为视口减 2rem；调用方的 contentClassName / contentProps.className 仍可覆盖。 |
| Dialog 中打开 Sheet 后内容不能滚动 | 该示例原本使用普通 View。改为 NativeSheetScrollContent，保留原有内容和间距，使溢出内容进入真实滚动容器。 |
| Dialog → Sheet 菜单裁切，以及 Sheet 中 Dropdown / Menubar / ContextMenu 子菜单不可见 | Sheet portal host 原为普通流中的 relative 节点，可能排在全高页面后、原点落到视口外。根菜单能部分补偿坐标，但侧向子菜单被计算成高度 0。首次改为 absolute 后，Dialog 的零宽 TrueSheetProvider anchor 仍使坐标向右偏移；最终使用 fixed、top / left 为 0、width: 100%、height: 0，以视口作为坐标基准。保留局部 modal 所属关系，并位于 Drawer 的 transform / paint 裁切容器外。 |
| 页面底部 Dropdown 不向上翻转 | 原适配层把默认 maxHeight 传到 Popover，干扰动态菜单集合完成后的高度重测。高度上限和滚动交给实际 Menu；Popover 使用自然尺寸测量，默认 shouldFlip=true。 |
| Menubar 不响应外部点击、重复触发器点击或 Escape | Menubar 为允许相邻按钮切换使用 non-modal 菜单；补齐所属菜单外的 pointerdown 关闭，并处理鼠标再次按下已打开的触发器。菜单及其子菜单携带同一所有权标记，内部操作不会误关。根 Escape 关闭整组，子菜单保留 React Aria 的逐层退出行为。 |
| PressableFeedback Web 没有涟漪 | 原适配只改变覆盖层透明度。ripple 现在按触点创建扩散圆；键盘触发从中心扩散，动画结束清理，并有清理兜底。禁用、isAnimationDisabled 和 prefers-reduced-motion 均不创建涟漪。 |
| RadioGroup 右侧指示器说明缩进不对 | HeroUI 默认给说明预留左侧指示器空间；右侧指示器布局取消这段说明缩进，并让行内容占满宽度。 |
| Native 横向 RadioGroup 标签消失 | 标签容器 flex-1 在内在宽度的横向条目中无法获得正常宽度。横向改为 shrink，保留标签自身宽度；纵向继续 flex-1。Web 的每天 / 每周 / 关闭文案本身正确。 |
| Slider 自定义轨道残留主色 | HeroUI 不只用 Fill 背景，还用 --accent 绘制轨道端帽和滑块底层。显式 activeTrackColor / activeTrackStyle 同步到局部 --accent；示例使用局部 success / warning 语义变量统一轨道和滑块颜色。 |
| Textarea 受控与非受控警告 | TextField 同时向自身与 Textarea 传 defaultValue；React Aria 根上下文又为子节点提供 value，导致 DOM 两者共存。状态仅由根 TextField 管理，子控件不重复接收 value / defaultValue / onChangeText；受控时忽略根 defaultValue。 |
| 浏览器原生 Select 触发器外观不统一 | 普通浏览器 select 使用 HeroUI select__trigger 的字段背景、圆角、边框、阴影、焦点与禁用样式，匹配 sm / md / lg 高度。保留真实 select 的键盘选择、浏览器选择器及所有 NativeTrigger 分支。 |
| 日志中 Separator 自定义 render 期望 hr、实际返回 div | 装饰性分割线显式指定 elementType=div，使 React Aria 期望节点与 HeroUI 实际渲染一致。非装饰性分割线和显式 elementType 沿用原配置。 |

## 配置与实现边界

### 菜单方向和高度

Dropdown / ContextMenu / Menubar 共用 MenuSurface。默认 bottom start，在可用空间不足时自动翻转；调用方仍可配置 side、align、sideOffset，以及 herouiWebProps.placement / offset。需要严格禁止翻转时可以使用：

```tsx
<Dropdown
  native={false}
  items={items}
  contentProps={{
    side: "bottom",
    maxHeight: 280,
    herouiWebProps: { shouldFlip: false },
  }}
/>
```

maxHeight 控制实际菜单滚动高度；外层 Popover 仍由 React Aria 计算视口可用空间。不要通过固定屏幕坐标、负偏移或逐组件补偿修复 Sheet 中的定位。

### Sheet 滚动

普通 View 不会因放进 Sheet 自动变成滚动容器。需要滚动的内容使用本库的 NativeSheetScrollContent；不额外叠加浏览器滚动锁或修改 TrueSheet 依赖源码。此次在 900×640 / 1000×640 窗口中，示例内容高 412px、滚动视口高 384px，滚轮后 scrollTop 从 0 到 28，末尾按钮可访问。

### 层级与交互

局部 portal 的目标是同时满足：避开 Dialog / Drawer 内容裁切、保留 modal DOM 归属、保留 React Aria 焦点管理，以及不屏蔽同层触摸。Modal.Container 默认不接收指针，因此局部 host 与 TrueSheetProvider anchor 显式恢复 pointer-events: auto；host 本身仍为零高度，不覆盖页面形成透明点击层。

Menubar 的 document pointerdown 监听只在菜单打开时存在，关闭或卸载时清理。用户若完全受控管理 value，仍须响应 onValueChange；不会绕过受控值强制关闭。

## 验证

自动化：

- bun test test：148 项、0 失败，覆盖 38 个测试入口。
- bun run typecheck：库与 Expo 示例通过。
- bun run build：库构建通过。
- bun run --cwd examples/app build:web：Web 生产导出与资源路径重写通过。
- Expo 三端 source map 导出通过；模块隔离审计 Web / iOS / Android 各自另一端 HeroUI 模块均为 0（本端 HeroUI 模块分别为 117 / 361 / 361）。
- 新增或调整回归断言覆盖 portal 归属与原点、Dialog 外裁切边界、Menubar 关闭和原有方向键 / RTL / Tab / 子菜单 Escape、横向 Radio 标签宽度、右侧说明、TextField multiline 状态、涟漪清理和禁用、Slider 局部颜色。

实际 Chromium 开发页面验证：

- Dialog 中 Dropdown / 子菜单越界显示与点击命中；输入框 Popover 内容宽 288px、Input 宽 256px。
- Dialog → Sheet 真实滚轮滚动、Sheet 二级菜单；Sheet 中 Dropdown / Menubar / ContextMenu 子菜单有非零高度且能命中。
- Sheet 中 Menubar 与 ContextMenu 子菜单 Escape 只关闭子级，再次 Escape 关闭根菜单，保留 Sheet；Menubar 再次点击当前按钮可关闭。
- Chromium 触摸输入模式下，Menubar 首次 tap 打开、再次 tap 当前触发器关闭。
- 620px 高窗口中，底部编辑菜单 data-placement=top；长菜单 maxHeight=280px，scrollHeight=1530px，可用滚轮滚到 scrollTop=450。
- ripple 实际存在扩散 transform / opacity 动画，结束后无残留；减少动态效果时不创建。
- Slider 自定义轨道端帽、Fill 和滑块底层颜色一致；浏览器原生 Select 可改变选中值，NativeTrigger 保持其独立样式。
- Textarea 编辑正常，目标警告不再出现；Separator 示例不再有自定义 render 节点警告。

生产 Web 页面额外验证：Dialog 菜单及子菜单不在 clipped Dialog 内但仍属于 Modal.Container，实际点击命中；Popover 宽度、Dialog → Sheet 滚动与子菜单正常；底部 Dropdown 翻转为 top。静态测试服务器仅记录 favicon.ico 404，与组件无关。

本轮未进行 iOS / Android 真机或模拟器交互验证。Native 横向 RadioGroup 的真实组件 fixture 通过，但不能代替设备布局验收；其他组件修复集中在 Web 文件中。浏览器验证使用 Chromium，不代表已经在 Safari / Firefox 全部验收。

## 二次验收修正：嵌套 Sheet 坐标、Tooltip 与细轨道 Slider

以上首轮验收遗漏了菜单与触发器的横向对齐，以及细轨道滑块外层底色。后续按用户截图在真实浏览器中复现并修正：

- **Dialog → Sheet 的 Select / Dropdown 向右偏移**：Dialog 下的 TrueSheetProvider 使用零宽 anchor；absolute host 的 100% 宽度也变成 0，原点继承 anchor 的偏移。1000×740 窗口中，anchor / host 原点为 (500, 40)，Select trigger 左边为 204，但弹层被钳制到 512。Sheet 子弹层 host 改为 fixed 后，实际原点为 (0, 0)、宽度 1000；Select 左边恢复为 204、宽度 592，顶部 500，恰好为 trigger 底部 492 加 8px。不是为 Select 单独设置位置补偿，也没有把 host 移到 body 破坏 modal 归属。
- **Dialog Tooltip 逐字换行**：零宽 portal host 导致 Tooltip 自动宽度收缩。默认设置 w-max，并以 min(20rem, 100svw - 2rem) 限制宽度；调用方仍可覆盖 className。当前示例从约 28×176 恢复到约 109×32。
- **Slider 细轨道右侧露色**：HeroUI Thumb 的外层命中区域宽 28px，内层可见滑块宽 24px，外层背景在细轨道上露出两侧。仅在电量目标 / 提醒强度这两个自定义示例中，通过 thumbProps.herouiWebProps.style 将外层背景设为透明，保留内层滑块、完整命中面积、轨道和填充。默认 HeroUI Slider 与 Native 样式保持原样。背景有过渡动画，视觉检查需等过渡结束。

新增回归覆盖零宽偏移 anchor 下 Sheet host 的 fixed 原点、宽度及 modal 归属，Tooltip 默认宽度及调用方覆盖。真实 Chromium 页面重新加载后复查 Select / Dropdown / 二级菜单、窄窗口对齐、Tooltip 和自定义 Slider，避免将仅验证菜单存在或不裁切当作定位正确。

二次修正后重新执行 bun test test（148 项、0 失败）、bun run typecheck 与 Web 生产导出，均通过。生产静态页面中的 Tooltip 为约 109×32，Sheet Select 的 trigger / list 左边同为 204、宽度同为 592，列表距 trigger 底部 8px；未捕获页面异常。普通 Sheet 路径也保持触发器对齐。自定义 Slider 实测键盘从 65 调到 66，再拖动到 80，输出值同步，外层背景透明而内层滑块仍可见。
