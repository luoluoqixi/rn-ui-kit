# rn-ui-kit 构建与发布分支说明

本工程使用“源码单包 + 编译产物发布分支”的发布方式。

- 源码包：`packages/rn-ui-kit`
- 发布包名：`rn-ui-kit`
- 发布分支：`rn-ui-kit-<version>`
- 发布产物目录：`dist/`
- 发布脚本：`scripts/release/package.js`
- 构建脚本：`scripts/release/build-package.js`

发布分支根目录是一个可被 Bun 直接安装的独立 package，不包含 workspace，也不要求外部 App 执行 TypeScript 构建。

## 1. 本地构建

在仓库根目录执行：

```bash
bun run build
```

该命令等价于：

```bash
bun --cwd packages/rn-ui-kit build
```

使用 `packages/rn-ui-kit/tsconfig.build.json` 编译源码，输出到：

```text
packages/rn-ui-kit/dist/
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
- `packages/rn-ui-kit/package.json`
- `examples/app/package.json`
- `bun.lock`

修改版本后，先提交源码：

```bash
git add .
git commit -m "chore(release): v1.2.3"
```

发布构建读取当前工作区文件，包括尚未提交的修改。正式发布前应先运行 `git status`，确保发布产物与源码 commit、tag 一致。

## 3. 只构建发布包

```bash
bun run package-release --pack-only
```

`--pack-only` 只构建发布目录和 tarball，不创建 Git 分支或 commit。

### 3.1 校验版本

脚本读取：

```text
packages/rn-ui-kit/package.json
```

并检查根 `package.json` 与包版本是否一致。

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
packages/rn-ui-kit/package.json
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
packages/rn-ui-kit/src/
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

其中 `scripts/` 来自 `packages/rn-ui-kit/scripts/`，主要用于提供 `rn-ui-sync-patches` 命令。

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
patches/
scripts/
```

发布分支不包含：

```text
packages/
examples/
workspace 配置
TypeScript 源码
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
- 安装内部 core/debug 包
- 执行 tsc
- 执行 `prepare`
- 编译 TypeScript 源码

## 7. 推荐发布流程

完整流程：

```bash
bun run typecheck
bun run set-version 1.2.3

git add .
git commit -m "chore(release): v1.2.3"

bun run package-release --pack-only
bun run package-release
git push -u origin rn-ui-kit-1.2.3

git tag -a v1.2.3 -m "v1.2.3"
git push origin v1.2.3
```

`--pack-only` 是可选的发布前检查。若不需要单独预检，可以直接：

```bash
bun run package-release
git push -u origin rn-ui-kit-1.2.3
```

## 8. 命令职责对照

| 命令 | 作用 |
| --- | --- |
| `bun run build` | 在源码包目录生成本地 `dist` |
| `bun run typecheck` | 检查 package 和 example App |
| `bun run set-version 1.2.3` | 修改工程版本并同步 `bun.lock` |
| `bun run package-release --pack-only` | 生成发布目录和 tgz，不操作 Git 分支 |
| `bun run package-release` | 生成发布目录、tgz 和本地发布分支 |
| `git push -u origin rn-ui-kit-1.2.3` | 将发布分支推送到 GitHub |
| `git tag -a v1.2.3 -m "v1.2.3"` | 为源码 commit 创建版本 tag |
| `git push origin v1.2.3` | 将源码 tag 推送到 GitHub |
