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

`RnUiKitDebugPanel` includes an independent navigation container by default for
standalone and sheet usage. When it is rendered inside a host Native Stack,
one prop connects all debug pages to that stack:

```tsx
<RnUiKitDebugPanel
  backButtonLabel="露娜笔记"
  navigationMode="host"
/>
```

Host mode manages the debug route state and header options internally. With one
native stack owning every page, iOS preserves scroll-edge header appearance,
transition coordination, interactive back gestures, and the long-press history
menu.
