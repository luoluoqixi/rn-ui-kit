# rn_ui_kit

The public package for `rn_ui_kit`. It installs and re-exports both
`rn_ui_kit_core` and `rn_ui_kit_debug`.

```ts
import "rn_ui_kit/initialize";
import { Button, RnUiKitDebugPanel } from "rn_ui_kit";
```

Advanced consumers may use the `rn_ui_kit/core` and `rn_ui_kit/debug`
subpath exports, but applications only need to depend on `rn_ui_kit`.
