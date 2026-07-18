# rn_ui_kit

The single public package for `rn_ui_kit`. Core implementation lives under
`src/core`, debug tools live under `src/debug`, and the default entry exports
core APIs only. Debug APIs are available from the opt-in `rn_ui_kit/debug`
subpath.

```ts
import "rn_ui_kit/initialize";
import { Button } from "rn_ui_kit";
import { RnUiKitDebugPanel } from "rn_ui_kit/debug";
```

Core is also available from `rn_ui_kit/core`. Applications only need to depend
on `rn_ui_kit`; importing the debug subpath is opt-in.
