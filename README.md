# rn-ui-kit

The single public package for `rn-ui-kit`. Core implementation lives under
`src/core`, debug tools live under `src/debug`, and the default entry exports
core APIs only. Debug APIs are available from the opt-in `rn-ui-kit/debug`
subpath.

```ts
import "rn-ui-kit/initialize";
import { Button } from "rn-ui-kit";
import { RnUiKitDebugPanel } from "rn-ui-kit/debug";
```

Core is also available from `rn-ui-kit/core`. Applications only need to depend
on `rn-ui-kit`; importing the debug subpath is opt-in.
