

本地链接 expo-ui-55:

```bash
cd /path/to/expo-ui-55
bun link

cd /path/to/rn_ui_kit/examples/app
bun link @luoluoqixi/expo-ui-55
```

## 组件尺寸基准

UI 组件统一使用以下尺寸名：`default`、`2xs`、`xs`、`sm`、`md`、`lg`、`xl`、`2xl`。除组件有明确的平台限制外，新增或调整组件时应优先复用这套等级，不要为单个组件重新定义一套相近但不同的尺寸。

`default` 通常是组件未传递 `size` 时使用的默认值，实际尺寸与 `md` 完全一致。组件可以保留自身的语义变体行为，但显式传入 `size="default"` 时必须等同于 `size="md"`。`Text` 是例外：未传递 `size` 或显式传入 `size="default"` 时都保持语义变体自身的字号；需要明确使用统一基准字号时传入 `size="md"`。

### 统一字号基准

| size | 字号 |
| --- | ---: |
| `default` | 通常与 `md` 相同；`Text` 保持语义变体字号 |
| `2xs` | 10 |
| `xs` | 12 |
| `sm` | 14 |
| `md` | 16 |
| `lg` | 18 |
| `xl` | 20 |
| `2xl` | 24 |

控件的高度、内边距、图标和其他尺寸应围绕同一等级设计；如果组件需要保留底层库的数值或字符串尺寸，应在标准尺寸之外明确兼容，并确保 `default`（`Text` 除外）仍然映射到 `md`。
