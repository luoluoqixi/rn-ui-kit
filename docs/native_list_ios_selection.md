# NativeList：iOS 导航行选中态问题与修复记录

记录日期：2026-11-26。

本文记录 NativeList 在 iOS 原生列表中的导航选中态问题、排查中的错误方向、当前实现及验证边界。这里的“选中”指点击导航行后保留、返回时逐渐消退的行背景，不是 Select 控件的选项值，也不是 NativeList 编辑模式的多选集合。

## 1. 范围与当前状态

问题最终集中在本地 `@luoluoqixi/expo-ui-55` 的原生实现，当前修复文件为：

- `expo-ui-55/ios/Button/Button.swift`：触摸观察、Button action 确认、逻辑行与 cell 的绑定和解绑。
- `expo-ui-55/ios/ListView.swift`：导航选中 session、选中背景、返回转场协调、cell 重新托管。

本机源码仓库为 `/Users/luoqixi/luoqixi/project/luoluoqixi/expo-ui-55`，示例应用通过 `bun link` 引用。修复后的 Swift 代码必须重新编译 iOS 开发包；只刷新 Metro 无法更新原生二进制。

本文对应源码的 SHA-256：

```text
ios/ListView.swift
f766671be4e73ab4df2833fe5d978662975233522f64acc398b451a1053276e3

ios/Button/Button.swift
ab9448f6ae2a3441e5075482e5b23c541cc5276101ea0d53536c84badf275f7f
```

这是当前工作区实现的记录，不代表已经发布的包版本或所有历史提交都包含此方案。后续代码变化时，应重新核对本文中的实现和验证结论。

主要复现路径已有开发包模拟器验证；用户最新反馈为“大部分情况可以正常”。尚不应把这些反馈扩大为全部真机、全部系统版本及全部边界场景均已验收。

本次原生选中态修复没有修改 TrueSheet 源码，没有以强制立即反馈代替默认触摸策略，也没有改写 NativeList 的分区外观或公共业务 API。

## 2. 问题表现必须分开描述

### 2.1 首次点击后，松手时选中背景提前消失

从调试首页首次进入组件列表，滚动到 Select，点击进入详情。手指按下时有背景，但松手、push 刚开始时背景已经消失。再次返回列表后，第二次点击同一行又可能正常。

此问题曾在 iOS 18 和较新 iOS 的开发包中报告，不能仅按 iOS 26 的问题处理。Release 包未复现不能证明逻辑正确：不同执行时序可能掩盖问题。

### 2.2 iOS 26+ 的 TrueSheet 返回后残留、滚动后串行

用户最终明确的首次复现步骤是：

1. 重新进入应用，使用开发包。
2. 点击“以 NativeSheet 打开调试首页”。
3. 在 Sheet 中点击“组件示例”。
4. 向下滚动到 Select，第一次点击该行。
5. 在 Select 详情中，通过返回按钮或边缘拖拽回到组件列表。
6. 立即观察 Select 行是否仍然保留选中背景。
7. 若已经残留，再分别滚动到列表顶部、底部，观察背景是否转移到其他行。

首次进入列表和首次点击是重要前提。返回后继续点击 Select 再返回，往往会改变后续表现，不能把第二次点击当作同一次复现。

这一 Sheet 特有的残留、滚动串行问题，用户后来单独确认 iOS 26+ 可复现，iOS 18 未观察到同样表现。不要把它与上一节跨版本的首次点击问题混为一谈。

### 2.3 排查过程中引入或暴露的回归

- 拖拽返回时背景由浅变深，而预期应由深变浅。
- 完全返回后仍保留背景，过零点几秒才突然清除。
- 点击后的持久选中恢复了，但返回渐变变成结束时瞬间清除。
- 列表原有分组底色、首尾圆角受到影响。
- push 开始时 Select 背景消失，其他行（录像中为 RadioGroup）反而出现选中背景。

这些现象分别涉及转场方向、动画所有权和 cell 生命周期。仅凭“最后没有灰色残留”不能宣布修复成功，push 的中间帧和交互返回的中间帧也必须正确。

## 3. 架构背景与根因

### 3.1 当前导航不由一个原生 NavigationLink 全程管理

项目的链路是：

```text
NativeListNavigationItem
  → expo-ui-55 的 SwiftUI Button / List
  → JS onPress
  → React Navigation / react-native-screens 的 native-stack
  → 普通页面或 TrueSheet 内的导航栈
```

SwiftUI Button 的按下反馈、List 托管 cell 的选中状态、JS 导航状态和 UIKit 返回转场，属于不同的生命周期。它们没有天然共享一个“这次导航选择仍然有效”的状态所有者。

因此不能假定：SwiftUI Button 松手后会为外部 native-stack 自动保留选中背景，或者页面返回时 SwiftUI 会自动以外部导航手势的进度取消选中。

### 3.2 临时 pressed、高亮和持久导航选中被混在一起

Button 的 pressed 外观在松手后会被 SwiftUI 释放。导航行则需要在本次点击确认后继续显示选中状态，直到返回转场开始，再随转场消退。

另外，UIKit 的 `isHighlighted` 与 `isSelected` 并不等价。持续保持 `isHighlighted=true`，会让按下态覆盖选中态的淡出效果；在返回时重新选中、重新高亮，也可能与正在进行的取消选中动画叠加。

只修改 JS 选中值、只设置一次 cell 的 `isSelected`，或者在结束后补一次清除，都不足以管理上述整个过程。

### 3.3 触摸结束、Button action 与返回取消并非同一时刻

被动触摸观察器收到 `.ended`，不保证 SwiftUI Button action 已经执行。滚动、边缘返回或系统导航历史菜单还可能取消或改变手势归属。

如果根据很短的固定延时猜测“没有 action，所以清除”，可能在合法的 action 尚未到达前把背景擦掉；迟到的 action 又可能确认错误的一次触摸。类似地，上一轮返回的 completion 如果不校验 session，可能清掉新一轮点击的选中状态。

因此当前实现同时区分：逻辑行 ID、一次触摸的 sequence、一次导航选中的 session。三者不能用同一个布尔值代替。

### 3.4 最后一轮定位到的直接证据：背景跟错了可复用 cell

为保住松手后的选中背景，collection cell 路径加入了独立背景视图。但最初没有把该背景的解绑与逻辑行 source 的生命周期配对。

诊断日志记录了同一个 cell 被用于不同逻辑行的过程：

| 时间 | 观察 |
| --- | --- |
| 02:44:08.197 | Select 的 source ID 为 `_r_1e_`，位于 cell `0x13b4b4000`，indexPath 为 `[0,33]`。 |
| 02:44:08.734 | Select source 从旧 cell 离开。 |
| 02:44:08.923 | 同一个 cell 内的 source 已变为 `_r_19_`；录像对应另一行 RadioGroup。 |
| 02:44:11.322 | Select 重新托管到 cell `0x13b4b4f00`。 |

原背景留在旧 cell 的 `contentView`，于是 cell 被复用时，背景也“跟着 cell 换行”。这解释了那轮录像中 push 时 Select 失色、其他行变色的具体回归。

这是修复过程中必须补上的背景归属问题，不能反过来说所有历史现象都已由这一条日志单独证明。此前的松手清除、返回动画和 session 竞争仍是不同层面的处理。

TrueSheet 和 iOS 26 的托管、复用时序使问题更容易暴露，但现有证据不足以把根因归结为 TrueSheet 本身，也不是 HeroUI 的 CSS 或 Select 控件的选项值出了问题。

## 4. 当前修复如何工作

### 4.1 用 session 管理导航选中，不在按下阶段触发 SwiftUI selection 重建

`ListSelectionInteractionState` 保存 pending / confirmed 行、当前 session 及对应 target。

- 触摸开始建立 session，并登记原生导航转场观察。
- SwiftUI Button action 必须携带本次触摸对应的 session 才能确认。
- 被滚动、越界或其他 pan 取消的触摸不能被迟到 action 重新确认。
- 旧转场的回调必须检查自己是否仍属于当前 session，不能修改后续点击。
- 触摸开始的登记不直接写 SwiftUI 的编辑选中集合，避免和 push 同一事务触发不必要的 List 协调。

编辑多选与导航选中继续分离。保留现有系统版本分流：iOS 26 以下常驻 List selection binding；iOS 26+ 在导航模式中隔离该 binding。仅改变 binding 参数，保持单一 List 结构，不因切换模式替换整个 List。

这个版本分流处理的是旧系统的 List 身份、编辑和滚动兼容，不应再次被当作本次所有导航视觉问题的统一修复开关。

### 4.2 尊重 delaysContentTouches

调用层 `NativeList` 的映射为：

| 属性 | 传给原生的值 | 预期 |
| --- | --- | --- |
| `iosPressFeedback="automatic"`，默认 | `delaysContentTouches=true` | 保留系统的延迟触摸反馈。 |
| `iosPressFeedback="immediate"` | `delaysContentTouches=false` | 按下时立即显示行反馈。 |

原生仅在底层 scroll view 的 `delaysContentTouches` 为 false 时，立即执行 `select(highlighted: true)`。默认模式不通过强制关闭延迟来掩盖问题。

触摸松开后，合法点击需要保持持久导航选中，这与“是否在按下瞬间立即反馈”是两件事。当前 `select()` 默认不保持 highlighted，避免按下态遮住返回动画。

### 4.3 collection cell 的持久背景由 target 独立持有

`ListNavigationSelectionTarget` 保存当前 table / collection view、可更新的 indexPath、弱引用 source 和选中背景。

collection 分支的背景是插入 `cell.contentView` 底层的不响应触摸的 UIView。它不替换 cell 原有 background configuration，保留列表的分组底色及圆角。

颜色由 cell 的 `defaultBackgroundConfiguration().updated(for:)` 以 selected、非 highlighted 状态解析，再结合当前 tint 和 trait 取值，不硬编码固定灰色。

table 分支继续使用原生 table selection / deselection；不能笼统描述成所有系统和所有 cell 都由自绘背景替代。

### 4.4 背景归属于逻辑行，重新托管时重新绑定

`ListSelectionTouchTrackingUIView` 监听移入 / 移出窗口、父视图变化、selection ID 变化和释放：

1. source 离开旧 cell 或改变身份时，解绑旧背景。
2. 同一逻辑行重新托管时，通过 `expoListSelectionTarget(selectionID)` 找回当前 target。
3. 沿真实 UIView 祖先找到新 cell，重新读取 indexPath。
4. 若逻辑导航选中仍有效，将背景挂到当前正确 cell。
5. `detachSource` 只有在 source 仍是当前持有者时才生效，防止旧 source 迟到的解绑清掉新 source 已接管的背景。

解绑视图只结束这次视觉挂载，不结束导航 session。否则页面暂时离屏或 SwiftUI 重建宿主，就会错误取消仍在进行的导航选中。

触摸观察器本身也随 source 移动而从旧 cell 移除，防止同一触摸被两个逻辑行的旧、新观察器重复处理。

### 4.5 返回动画交给真实转场协调器

`deselectNavigationRowAlongsideTransition` 使用 `UIViewControllerTransitionCoordinator`：

- 返回前恢复目标应有的持久选中起点。
- 在协调器的 alongsideTransition 中，将 collection 背景 alpha 从 1 驱动到 0；table 使用原生取消选中。
- collection 的系统 selected / highlighted 状态同步清除，避免底下另有一套 SwiftUI / UIKit 背景动画与 alpha 动画竞争。
- 交互返回应随手势由深变浅；取消返回后，仍有效的 session 恢复选中。
- 完成返回后清理背景与 session，并向调用层通知清除。

不能在成功返回后才另起一个淡出动画，也不能通过延迟几百毫秒强制清除来替代转场过程。那只能掩盖最终残留，无法修正中间帧和取消返回。

### 4.6 当前仍然存在的兼容处理

当前方案不是“只加一张背景、完全没有时序代码”：

- Button action 未到达时有局部有界等待：每次约 1/60 秒，最多 60 次，确认或取消后结束。
- 未正常收到结束的触摸有 1 秒保护性清理。
- 交互返回取消、系统层级恢复后，有下一主循环或约 50ms 后的补充恢复 / 清理。
- iOS 18 的无 session 视觉 fallback 保留；有非空旧 session 时不能绕过归属检查。
- 旧系统还有返回结束后的视觉清理重试：每次约 50ms，最多 8 次，并检查是否已有新 session。该兼容分支实际条件为低于 iOS 19；它是最终协调后的兜底，不承担交互返回渐变。
- 旧 target 交接时仍保留对该 cell 子树 `backgroundColor` 动画的定向结束处理。

这些逻辑不等于全列表持续逐帧轮询，也不应被描述为“完全没有延迟或重试”。它们是当前实现复杂度和后续维护风险的一部分。

## 5. 踩坑与后续禁止照搬的方向

| 尝试或判断 | 问题及教训 |
| --- | --- |
| 最初因 HeroUI 迁移前后表现不同，直接归因于新组件 | 用户回退后发现更早提交也有问题，且旧正常录像使用 Release 包。先对齐构建模式、首次路径和原生代码。 |
| 将 iOS 26 以下的 selection binding 分流视为统一根因 | 它原本用于避免旧系统模式切换重建；用户在 iOS 26+ 同样复现。不要破坏已有兼容处理换取表面变化。 |
| 用 Release 包验证开发包时序问题 | Release 未复现可能只是时序不同。必须使用 Debug + Metro，并确认安装的实际二进制。 |
| 只复现普通页面，没有进入 TrueSheet | 无法证明 Sheet 特有残留是否修复。两个场景应分别记录。 |
| 返回后再次点击 Select，再判断是否残留 | 破坏“首次进入、首次点击”条件。每次修复前后使用同样的冷启动路径。 |
| 强制立即反馈 | 改变调用方的 delaysContentTouches 语义，而且用户验证不能解决根因。两种模式应独立测试。 |
| 返回后延迟清除背景 | 最终可能不残留，但出现停顿后消失，或者掩盖由浅变深的错误方向。 |
| 持续设置 highlighted，或每次出现都重新 select | 容易让按下背景遮住淡出，或叠加第二笔 cell 选中事务。区分 pressed、selected 和转场。 |
| 只在返回完成时清空 selected | 没有随交互返回的渐变，也无法正确处理中途取消。 |
| 改写 cell 的整体背景 | 曾导致分组底色 / 圆角回归。只管理专属选中背景，保留原有配置。 |
| 背景插入 cell 后只保存 cell / indexPath | cell 会被复用；出现 Select 背景跑到 RadioGroup。必须处理 source 的身份与挂载生命周期。 |
| 在日志中看到状态已清，就认为画面已清 | 动画 presentation 状态、SwiftUI 内部背景和实际 cell 身份可能不同。检查连续画面。 |
| 用 XML 判断行颜色和渐变 | XML 适合查控件和结构，不能代替截图、录像的视觉判断。 |

用户提供的历史定位锚点也应保留：早期曾认为 `0f1567c9d765a8e8fb95dbaa77565b576037e34a` 的包正常，之后确认那是 Release；用户回测 `f6e6ec9cf3121740ad5fc3380698059fbdfe47bb` 已有问题；本地 expo-ui-55 的 `d38fc64263728940866f42f1977577a62fc4e624` 也已存在。这些是复测记录，不是严格二分得到的引入提交。

## 6. 录像和证据处理的特别教训

本机 FFmpeg 9.0.1 对本次部分 `simctl recordVideo` 生成的 H.264 视频，连续解码和输入 seek 曾得到不一致的内容，导致对“Select 在 push 时是否提前失色”的错误抽帧判断。

最终关键帧使用 macOS AVFoundation 按原视频时间戳重新提取，并与原始录像及原生诊断日志交叉核对。此处仅记录这批素材和本机工具链的异常，不泛化为 FFmpeg 对所有视频都不可靠。

- 旧录像约 18.800 秒的背景转移，经 AVFoundation 确认确实存在。
- 修复后录像约 20.683 秒起进入 push，系统抽帧显示 Select 背景仍属于 Select。
- WDA 事件时间与 MP4 时间原点不保证一致，不能直接把事件秒数当作精确帧时间。
- 不能继续引用本次异常的 FFmpeg 联系图作为最终通过或失败证据。

本机证据归档目录为：

```text
/Users/luoqixi/.codex/visualizations/2026/11/20/01a1fa09-af68-79f2-b685-22c8f3a1e500/native-list-selection/row-ownership-2026-11-26
```

目录中的 `verification.md`、原始 MP4、带时间戳帧图、`before-row-reuse-diagnostic.log`、构建日志及抽帧脚本互相对应。父目录较早的验证结论已标记失效，不应与新一轮结果混用。本机证据未随本文复制进仓库，其他机器不能假定该路径存在。

## 7. 已完成的验证与未覆盖范围

以下来自上述修复版本的历史验证记录；本次补文档没有再次运行设备或扩大验收范围。

环境：Debug + Metro 开发包；bundle 为 `com.luoluoqixi.rnuikitexample.release`，虽然名称包含 release，但当时构建配置确认为 Debug。模拟器为 iPhone 17 Pro / iOS 26.4.1、iPhone 16 Pro / iOS 18.1；WDA 为 16.15.3。

WDA 使用真实 W3C touch：点击按住 120ms，边缘返回从 x=10 拖到 x=350，持续 1800ms。每条首次路径都先终止并重启应用；返回后先保存截图与 XML，再滚动两端。

| 场景 | 历史观察 |
| --- | --- |
| iOS 26，默认延迟，Sheet 首次 push | Select 保持选中，未见背景转移到 RadioGroup。 |
| iOS 26，Sheet 交互返回并滚动到两端 | 背景随返回变浅，结束后清除，未见残留或串行。 |
| iOS 26，Sheet 取消交互返回，再返回并滚动 | 未见残留。 |
| iOS 26，普通页面及继续返回首页 | 未见 push 串色或返回残留。 |
| iOS 26，立即反馈，导航后点击返回按钮并滚动 | 未见串色或残留。 |
| iOS 18，默认延迟，普通页面 / Sheet | 未见首次导航及返回残留；Sheet 滚动两端未见串行。 |
| iOS 18，立即反馈，普通页面交互返回 | 未见串色或残留。 |
| 列表外观 | 分组底色和首尾圆角仍保留。 |

当时 `node --test tests/native_list_selection.test.cjs` 的 3 项检查通过，主要覆盖状态回调、单一 List 结构和版本 binding 策略；不覆盖 UIKit cell 复用和实际动画视觉，不能代替录像验证。

不要据此声称已覆盖全部 List 样式、所有动态插删 / 排序、所有无障碍激活、任意异步导航延迟、全部系统版本或完整真机矩阵。

## 8. 影响、风险和维护边界

### 明确的影响范围

- 修复主要作用于配置了导航选中跟踪的 iOS List / Button 路径。
- 不改变 Select 的选项值，不将导航选中混入编辑多选，不替换 Android / Web 的 basic 列表实现。
- collection 路径增加独立选中背景及生命周期管理；额外视图不响应触摸，绑定当前导航 target，不为每一行常驻创建一套逐帧任务。
- 原生代码仍包含 session、取消清理和系统版本兼容逻辑，维护成本没有归零。

### 仍需承认的风险

| 风险 | 为什么仍需关注 |
| --- | --- |
| SwiftUI 内部托管层级变化 | 通过 UIView 祖先寻找公开的 table / collection cell；未按私有类名匹配或 swizzle，但宿主结构仍由 SwiftUI 决定，未来 iOS / Expo 升级可能改变它。 |
| 导航手势的识别方式 | 除系统边缘返回手势外，还按 pan recognizer 类名中的 Transition / RNS / Pan 特征发现转场手势；react-native-screens 或系统修改类名、挂载层级时需要核对。前一行“未按私有类名匹配”仅指 cell 查找，不代表整条链路完全没有实现细节依赖。 |
| 数据动态变化 | indexPath 不是业务身份；当前重绑会更新它，但导航中插删、排序、source 不再出现等组合没有被全部验证。 |
| 交互取消和快速连续导航 | session 用于防止旧 completion 修改新点击，现有清理仍有主循环及短延迟处理，极端时序不能宣称绝无竞态。 |
| 非触摸激活 | action 确认依赖触摸 session，VoiceOver、键盘、自动化 accessibility click 等路径需单独关注；当前真实触摸验证不能证明这些路径等价。 |
| 主题和自定义外观 | 背景颜色在显示时按当前 configuration / trait 解析；选中期间动态换主题、自定义行背景、特殊 List 样式等尚未全覆盖。 |
| 子视图自定义动画 | 旧 target 的背景动画清理会查找 cell 子树的 backgroundColor 动画；若该行自定义内容也在执行同类动画，存在被提前结束的可能，尚未记录为已复现问题。 |
| 未确认触摸的保护时间 | 有界等待及 1 秒清理是保护路径；极慢 action、长按与系统菜单等特殊交互需要结合具体触发方式判断。 |
| 构建和依赖升级 | bun link 的 Swift 源码修改要重新编译；升级 expo-ui-55 时必须核对修复是否保留，不能只看 JS 依赖指向。 |

结论是：当前方案修复了已观察到的状态归属和视觉生命周期问题，风险比“延迟强制清除”更可控，但不是一个完全不依赖宿主实现的标准 NavigationLink 行为。若后续出现新问题，应优先检查 session、source、cell 和转场是否仍属于同一次交互，不再靠全局改触摸延迟或返回后补清除来规避。

## 9. 后续遇到回归时的最小排查顺序

1. 确认 Debug 二进制确实包含所测 Swift 修改；记录源码版本、系统版本、普通页面 / Sheet 和 delaysContentTouches。
2. 按首次进入、首次点击的原路径复现，返回前后不要追加第二次点击。
3. 将按下、松手、push、返回开始、返回取消 / 完成、滚动复用分开观察。
4. 对齐 selection ID、touch sequence、navigation session、source 对象、cell 对象和当前 indexPath；不要只打印一个 selected 布尔值。
5. 判断是模型清了、临时高亮清了、独立背景移走了，还是背景仍停留在旧 cell / 旧动画上。
6. 保留原始录像，检查连续中间帧；XML 只作结构辅助。
7. 修改后使用同一路径比较，并保留分组底色、圆角、交互返回取消和两种触摸延迟语义。
