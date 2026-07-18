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
git push -u origin rn_ui_kit-1.2.3
```
