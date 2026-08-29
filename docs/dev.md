

本地链接 expo-ui-55:

```bash
cd /path/to/expo-ui-55
bun link

cd /path/to/rn_ui_kit/examples/app
bun link @luoluoqixi/expo-ui-55
```

## 组件尺寸基准

UI 组件统一使用 `2xs`、`xs`、`sm`、`md`、`lg`、`xl`、`2xl` 七级尺寸。除组件有明确的平台限制外，新增或调整组件时应优先复用这套等级，不要为单个组件重新定义一套相近但不同的尺寸。

### Button

`Button` 的默认尺寸是 `md`。以下是 RNR/Pressable 渲染路径的跨平台设计基准值；Tailwind/Uniwind 类名应围绕这些值实现，Web 不再通过断点把同一等级缩小。`native` 模式由系统控件决定尺寸，需使用 `buttonSize` 覆盖。

| size | 高度 | 水平内边距 | 默认文字 |
| --- | ---: | ---: | --- |
| `2xs` | 32 | 8 | `text-xs`（12） |
| `xs` | 36 | 12 | `text-xs`（12） |
| `sm` | 40 | 16 | `text-sm`（14） |
| `md`（默认） | 44 | 20 | `text-base`（16） |
| `lg` | 48 | 24 | `text-base`（16） |
| `xl` | 56 | 32 | `text-lg`（18） |
| `2xl` | 64 | 40 | `text-xl`（20） |

图标按钮使用 `variant="icon"`，并与 `size` 组合后保持正方形，例如 `size="lg" variant="icon"`。`size="icon"` 不属于尺寸基准，也不再作为 Button API 支持。

### Text

`Text` 的 `variant` 负责语义和特殊风格，`size` 负责字号。`size` 使用统一的 `2xs`、`xs`、`sm`、`md`、`lg`、`xl`、`2xl` 七级基准：

| size | 字号 |
| --- | ---: |
| `2xs` | 10 |
| `xs` | 12 |
| `sm` | 14 |
| `md` | 16 |
| `lg` | 18 |
| `xl` | 20 |
| `2xl` | 24 |

未传 `size` 时，`Text` 和 `p` 使用 16 号默认字号，`h1`、`h2`、`h3`、`h4` 保持现有字号（分别为 36、30、24、20），`code` 和 `muted` 保留自身的 14 号字号，`lead` 保留自身的 20 号字号。显式传入 `size` 后只覆盖字号，variant 的字重、边框、颜色、间距和语义角色继续生效。纯字号的 `large`、`small` variant 已移除，请使用 `size` 替代。

### Avatar 与 Badge

`Avatar` 和 `Badge` 使用同一套 `2xs`、`xs`、`sm`、`md`、`lg`、`xl`、`2xl` 尺寸名；Avatar 默认使用 `md`，Badge 默认使用 `sm`。Avatar 的尺寸表示头像直径（24、32、36、40、48、56、64）；Badge 的尺寸表示控件高度（20、24、28、32、36、40、48）。两者的 `variant` 继续只负责语义颜色和外观，尺寸统一通过 `size` 控制。

### Icon 与 Alert

`Icon` 使用同一套七级尺寸名，对应图标尺寸 `12/14/16/20/24/28/32`。未传 `size` 时默认为 `md`（20）。除七级尺寸名外，数字或其他字符串会原样传递给 Lucide，以保留 Lucide 的原生尺寸能力。

`Alert` 的图标尺寸通过独立的 `iconSize` 控制；它优先于 `iconProps.size`，未传入时保持 Alert 原有的 16 号图标尺寸。

### Checkbox

`Checkbox` 使用统一的七级尺寸名，方框尺寸对应 `12/14/16/20/24/28/32`，默认使用 `sm`（16）。勾选图标会随方框尺寸同步调整；如需精确控制，可通过 `iconProps.size` 覆盖。

### NativeTrigger

`NativeTrigger` 使用统一的七级尺寸名，对应最小高度 `32/36/40/44/48/56/64`，默认使用 `md`（44），与 Button 的默认尺寸保持一致。Dropdown/Select 的原生触发器通过 `nativeTriggerProps={{ size: "lg" }}` 传入尺寸；自定义 `content` 时，尺寸由自定义内容自行决定。

`Select` 的所有非原生触发器路径（`native={false}`、`native="sheet"`、`native="dialog"`、`native="wheel"` 等）通过统一的 `triggerSize` 控制，默认使用 `md`。`triggerSize` 同时会传递到原生触发器；未设置时再回退到 `triggerProps.size` 或 `nativeTriggerProps.size`。

触发器文字粗细通过 `triggerFontWeight` 控制，默认值为公共常量 `SELECT_TRIGGER_FONT_WEIGHT`（`500`）。
