

## 修改依赖 patch

修改或重新生成任何依赖 patch 前，必须先阅读
[Bun patch：同一文件多个 diff 块的产出与验证](./patch/bun_same_file_hunk_offset.md)。
必须保持最小改动、不影响旧 patch 的行为，并在修改完成后进行完整 patch 的 diff review；
具体产出流程与验证要求以该文档为准。

本地链接 expo-ui-55:

```bash
cd /path/to/expo-ui-55
bun link

cd /path/to/rn_ui_kit/examples/app
bun link @luoluoqixi/expo-ui-55
```

## 组件尺寸与样式

HeroUI 没有跨组件的全局 `size` 设置。封装组件时沿用对应 HeroUI 组件自身的 size 取值和默认值；组件没有 size 能力时，不额外发明统一尺寸枚举。系统原生实现、NativeTrigger 等项目专属交互可保留自己的尺寸 API。

颜色使用 `src/theme.css` 中的 HeroUI 语义 token。Web 与 Native 分别从各自 CSS 入口加载 HeroUI 样式，并通过 Metro 配置隔离组件模块；修改样式后运行 `bun run typecheck`、`bun run build` 和 `bun test test`。需要检查实际发布模块图时，在 `examples/app` 导出三端 source map，再运行 `bun run check:heroui-bundle <web|ios|android> <导出目录>`。详细配置见 [HeroUI 迁移记录](./heroui-migration.md)。
