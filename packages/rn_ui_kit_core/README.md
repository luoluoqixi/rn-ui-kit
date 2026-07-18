# rn_ui_kit_core

`rn_ui_kit_core` contains the core components and platform integrations used by the public `rn_ui_kit` package.

## Patch synchronization

Run `rn-ui-sync-patches` from an app to copy the kit's required Bun patches and register them in that app's `package.json`. All kit patches are synchronized by default.

An app can retain its own patch for a dependency by excluding the kit patch in its `package.json`:

```json
{
  "rnUiKitSyncPatches": {
    "exclude": ["@expo/cli@55.0.32"]
  }
}
```

Excluded dependencies are left untouched: the sync command neither copies nor registers that kit patch.
