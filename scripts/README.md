### Release

```shell
bun run typecheck
bun run set-version 1.2.3
git add .
git commit -m "release: v1.2.3"

git tag -a v1.2.3 -m "v1.2.3"
git push origin v1.2.3

bun run package-release --pack-only
bun run package-release
git push -u origin rn-ui-kit-1.2.3
```

发布脚本位于 `scripts/release/`，Android 示例 APK 发布脚本位于
`scripts/android/release-example-apk.js`。

推送 `v<semver>` tag 后，`.github/workflows/release.yml` 会先创建 GitHub
Release，再构建示例 App 的 release APK，并以
`rn-ui-kit-example-release-<tag>.apk` 上传到对应 Release。

本地只构建 APK：

```shell
bun run release:android-apk v1.2.3
```

脚本只会让 Gradle 强制重新生成 release JS bundle；React Native Gradle
插件在生成 bundle 时会自动向 Metro 传入 `--reset-cache`，因此 packages
中的源码变更不会复用旧 bundle，也不必强制重编所有原生任务。
