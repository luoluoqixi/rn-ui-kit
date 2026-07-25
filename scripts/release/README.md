# rn-ui-kit 构建与发布分支说明

本工程使用“源码单包 + 编译产物发布分支”的发布方式。

- 源码包：仓库根目录
- 发布包名：`rn-ui-kit`
- 发布分支：`rn-ui-kit-<version>`
- 发布产物目录：`dist/`
- 发布脚本：`scripts/release/package.cjs`
- 构建脚本：`scripts/release/build-package.cjs`

发布分支根目录是一个可被 Bun 直接安装的独立 package，不包含仓库中的示例 App 与发布工具。

## 1. 本地构建

在仓库根目录执行：

```bash
bun run build
```

该命令使用根目录 `tsconfig.build.json` 编译源码，输出到：

```text
dist/
```

执行完整类型检查：

```bash
bun run typecheck
```

## 2. 修改版本号

例如准备发布 `1.2.3`：

```bash
bun run set-version 1.2.3
```

该命令会更新：

- 根 `package.json`
- `examples/app/package.json`
- 根目录 `bun.lock`

默认不会 commit 或 push。自动创建签名 release commit 和 tag：

```bash
bun run set-version 1.2.3 --commit
```

使用 `--commit` 时工作区必须干净。存在已跟踪或未跟踪改动时，脚本会在修改
版本文件之前终止。如果确认要将这些已有改动全部加入 release commit，必须
显式执行：

```bash
bun run set-version 1.2.3 --commit --force
```

该模式依次执行：

```bash
git add .
git commit -S -m "release: 1.2.3"
git tag -a v1.2.3 -m "v1.2.3"
```

完整自动发布：

```bash
bun run set-version 1.2.3 --push
```

`--push` 隐含 `--commit`，并继续执行 `bun run package-release`。脚本只检查
静态 remote 列表 `origin`、`nas`，对实际存在的每一个 remote 依次推送：

```bash
git push -u <remote> rn-ui-kit-1.2.3
git push <remote> main
git push <remote> v1.2.3
```

`--push` 必须在 `main` 分支执行。如果 `origin`、`nas` 都不存在，脚本会在
修改版本文件之前终止。`--push` 同样要求工作区干净；只有显式增加 `--force`
时，`git add .` 才会将已有的全部未忽略变更纳入 release commit。

自动模式遇到同名本地 tag 时，会通过 `git ls-remote` 检查实际配置的
`origin`、`nas`。只要任一远端已存在该 tag，脚本就会拒绝继续；如果所有目标
远端都不存在，则在 release commit 成功后删除旧本地 tag，并重新创建 tag
使其指向新的 release commit。远端检查失败时不会删除本地 tag。

发布构建读取当前工作区文件，包括尚未提交的修改。正式发布前应先运行 `git status`，确保发布产物与源码 commit、tag 一致。

## 3. 只构建发布包

```bash
bun run package-release --pack-only
```

`--pack-only` 只构建发布目录和 tarball，不创建 Git 分支或 commit。

### 3.1 读取版本

脚本读取：

```text
package.json
```

假设当前版本为 `1.2.3`，发布名称为：

```text
rn-ui-kit-1.2.3
```

### 3.2 创建干净的发布目录

脚本清理并重新创建：

```text
dist/rn-ui-kit-1.2.3-package/
```

只会修改 `dist` 下对应的发布目录，不会修改源码目录。

### 3.3 生成发布 package.json

发布 manifest 基于：

```text
package.json
```

生成。

源码入口：

```json
{
  "main": "src/index.ts",
  "react-native": "src/index.ts",
  "types": "src/index.ts"
}
```

会被转换为编译入口：

```json
{
  "main": "./dist/index.js",
  "react-native": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
```

发布包提供以下 exports：

```text
rn-ui-kit
rn-ui-kit/core
rn-ui-kit/debug
rn-ui-kit/initialize
rn-ui-kit/package.json
```

发布 manifest 会：

- 保留 `dependencies`
- 保留 `peerDependencies`
- 保留 `bin`
- 删除 `devDependencies`
- 删除构建和 typecheck 等开发脚本
- 只保留 `sync-patches`
- 不包含 workspace 配置
- 不包含 `workspace:*`

### 3.4 编译源码

构建器直接编译：

```text
src/
```

输出到：

```text
dist/rn-ui-kit-1.2.3-package/dist/
```

主要入口包括：

```text
dist/index.js
dist/index.d.ts
dist/core.js
dist/core.d.ts
dist/debug.js
dist/debug.d.ts
dist/initialize.js
dist/initialize.d.ts
```

平台文件会保持原有后缀，例如：

```text
native_picker.android.js
native_picker.android.d.ts
native_picker.ios.js
native_picker.ios.d.ts
index.native.js
index.native.d.ts
index.web.js
index.web.d.ts
```

Metro 仍然可以根据目标平台选择对应文件。

### 3.5 复制附加文件

发布目录还会包含：

```text
README.md
LICENSE
patches/
scripts/
```

其中只复制根目录的 `scripts/sync-patches.mjs`，不会把内部发布与 Android
自动化脚本打进发布包。

### 3.6 生成 tarball

脚本执行等价于：

```bash
npm pack --ignore-scripts
```

最终生成：

```text
dist/rn-ui-kit-1.2.3.tgz
```

`--pack-only` 到这里结束，不会：

- 创建发布分支
- 创建 release commit
- 切换当前分支
- push GitHub
- 创建 Git tag
- 发布 npm

## 4. 创建发布分支

执行：

```bash
bun run package-release
```

该命令会重新完成编译和打包，然后继续创建发布分支。

### 4.1 创建临时 Git 仓库

临时仓库位于：

```text
dist/rn-ui-kit-1.2.3/
```

临时仓库用于生成 release commit，不会切换当前源码仓库的分支。

### 4.2 创建或更新版本分支

脚本检查本地及远端是否已经存在：

```text
rn-ui-kit-1.2.3
```

首次发布该版本时，会创建 orphan 分支。

重复执行同一版本时，会基于已有发布分支更新。若产物没有变化，不会创建重复 commit。

### 4.3 写入发布内容

脚本清空临时发布分支的工作区，解压：

```text
dist/rn-ui-kit-1.2.3.tgz
```

然后把 tarball 中 `package/` 目录的内容复制到发布分支根目录。

发布分支结构类似：

```text
package.json
README.md
LICENSE
dist/
src/
patches/
scripts/
```

发布分支不包含：

```text
packages/
examples/
workspace 配置
开发依赖
```

### 4.4 创建 release commit

存在产物变化时，提交信息为：

```text
release: rn-ui-kit-1.2.3
```

### 4.5 更新当前仓库的本地发布分支

临时仓库提交完成后，脚本将其写回当前仓库的本地分支：

```text
rn-ui-kit-1.2.3
```

当前源码分支保持不变，不会自动 checkout 发布分支。

### 4.6 推送发布分支

`package-release` 不会自动 push，只会输出提示命令：

```bash
git push -u origin rn-ui-kit-1.2.3
```

确认产物后手动执行该命令。

## 5. 创建源码 Tag

发布脚本不会创建 tag。源码版本提交后单独执行：

```bash
git tag -a v1.2.3 -m "v1.2.3"
git push origin v1.2.3
```

- `v1.2.3` tag 指向源码版本
- `rn-ui-kit-1.2.3` 分支保存编译后的可安装产物

### 5.1 自动创建 GitHub Release

tag push 会触发 `.github/workflows/release.yml`。Workflow 会完整 checkout
tag 历史，执行：

```bash
bun run release:notes v1.2.3
```

本地预览时，如果 `v1.2.3` 尚未创建，脚本会使用当前 `HEAD` 作为扫描终点。
GitHub Actions 使用 `--require-tag`，确保正式生成 Release 说明时目标 tag
已经存在。

脚本扫描上一个版本 tag 到当前 tag 的非 merge commits，按 `feat`、`fix`、
`perf`、`refactor`、`build`、`revert` 和 breaking changes 分类，并忽略
`docs`、`ci`、`chore`、`test`、`style`、`release` 及其他未收录类型。
生成的每一项都包含 commit 链接，末尾包含两个 tag 的完整比较链接。

Release 创建成功后，后续 job 会构建 Android 示例 APK 并上传到该 Release。

## 6. 外部 App 安装

发布分支推送后，可以使用：

```bash
bun add github:luoluoqixi/rn-ui-kit#rn-ui-kit-1.2.3
```

私有仓库可以使用 SSH：

```bash
bun add "git+ssh://git@github.com/luoluoqixi/rn-ui-kit.git#rn-ui-kit-1.2.3"
```

外部 App 下载的是发布分支根目录，不需要：

- 识别 workspace
- 执行 tsc
- 执行 `prepare`

React Native/Metro 会使用发布包中的 `src/` 平台源码；其他默认入口使用已编译的
`dist/`。

## 7. 推荐发布流程

完整流程：

```bash
bun run typecheck
bun run set-version 1.2.3 --push
```

如果需要逐步检查，可以使用默认模式后手动执行：

```bash
bun run set-version 1.2.3
bun run package-release --pack-only
bun run package-release
git push -u origin rn-ui-kit-1.2.3
```

## 8. 命令职责对照

| 命令 | 作用 |
| --- | --- |
| `bun run build` | 在源码包目录生成本地 `dist` |
| `bun run typecheck` | 检查 package 和 example App |
| `bun run set-version 1.2.3` | 修改工程版本并同步 `bun.lock` |
| `bun run set-version 1.2.3 --commit` | 更新版本、签名 commit 并创建 tag |
| `bun run set-version 1.2.3 --commit --force` | 将已有工作区改动一并提交 |
| `bun run set-version 1.2.3 --push` | commit、打包并推送发布分支、`main` 和 tag |
| `bun run package-release --pack-only` | 生成发布目录和 tgz，不操作 Git 分支 |
| `bun run package-release` | 生成发布目录、tgz 和本地发布分支 |
| `bun run release:notes v1.2.3` | 预览自动生成的 GitHub Release 说明 |
| `git push -u origin rn-ui-kit-1.2.3` | 将发布分支推送到 GitHub |
| `git tag -a v1.2.3 -m "v1.2.3"` | 为源码 commit 创建版本 tag |
| `git push origin v1.2.3` | 将源码 tag 推送到 GitHub |
