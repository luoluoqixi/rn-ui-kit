### Release

```shell
bun run typecheck
bun run set-version 1.2.3 --push
```

`set-version` 默认只更新版本文件和 `bun.lock`。`--commit` 会继续执行
`git add .`、签名 commit 和创建 tag；`--push` 隐含 `--commit`，还会生成
发布分支，并将发布分支、`main` 和 tag 推送到实际存在的 `origin`/`nas`。
使用 `--commit` 或 `--push` 时，工作区必须干净；如果确认要把已有改动全部
放进 release commit，需要显式增加 `--force`。
如果同名 tag 仅存在于本地，脚本会在 release commit 成功后重新创建它；如果
任一已配置的 `origin`/`nas` 已存在同名 tag，则拒绝继续。

发布脚本位于 `scripts/release/`，Android 示例 APK 发布脚本位于
`scripts/android/release-example-apk.cjs`。

推送 `v<semver>` tag 后，`.github/workflows/release.yml` 会先创建 GitHub
Release。Release 说明会扫描上一个 tag 到当前 tag 的提交，按
`feat`、`fix`、`perf`、`refactor`、`build` 和 `revert` 分类，并忽略
`docs`、`ci`、`chore`、`test`、`style` 等提交。随后 workflow 会构建示例
App 的 release APK，并以
`rn-ui-kit-example-release-<tag>.apk` 上传到对应 Release。

本地预览 Release 说明：

```shell
bun run release:notes v1.2.3
```

如果目标 tag 尚未创建，脚本会自动预览“最近版本 tag 到当前 `HEAD`”的提交；
GitHub Actions 则通过 `--require-tag` 保证正式发布时目标 tag 必须存在。

本地只构建 APK：

```shell
bun run release:android-apk v1.2.3
```

脚本只会让 Gradle 强制重新生成 release JS bundle；React Native Gradle
插件在生成 bundle 时会自动向 Metro 传入 `--reset-cache`，因此 packages
中的源码变更不会复用旧 bundle，也不必强制重编所有原生任务。
