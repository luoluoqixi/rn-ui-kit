import {
  NativeList,
  NativeListButtonItem,
  NativeListNavigationItem,
  NativeListSection,
  NativeListSwitchItem,
} from "rn_ui_kit";

import { rnUiKitDebugRouteDefinitions } from "../routes";

import type { RnUiKitDebugRouteKey } from "../types";

export function RnUiKitDebugHomePage({
  openSectionsInSheet,
  onOpenPanelSheet,
  onOpenSection,
  onOpenSectionsInSheetChange,
}: {
  openSectionsInSheet: boolean;
  onOpenPanelSheet?: () => void;
  onOpenSection?: (key: RnUiKitDebugRouteKey) => void;
  onOpenSectionsInSheetChange?: (openInSheet: boolean) => void;
}) {
  return (
    <NativeList>
      <NativeListSection title="调试分区">
        {rnUiKitDebugRouteDefinitions.map((definition) => (
          <NativeListNavigationItem
            key={definition.key}
            onPress={() => onOpenSection?.(definition.key)}
            subtitle={definition.description}
            title={definition.label}
          />
        ))}
      </NativeListSection>

      <NativeListSection
        footer="关闭时通过 Stack 进入子页面；开启后点击分区会改为 NativeSheet 弹出。"
        title="分区打开方式"
      >
        <NativeListSwitchItem
          switchProps={{
            checked: openSectionsInSheet,
            onCheckedChange: onOpenSectionsInSheetChange,
          }}
          title="用 NativeSheet 打开分区"
        />
      </NativeListSection>

      {onOpenPanelSheet != null ? (
        <NativeListSection title="面板模式">
          <NativeListButtonItem
            onPress={onOpenPanelSheet}
            title="以 NativeSheet 打开调试首页"
          />
        </NativeListSection>
      ) : null}
    </NativeList>
  );
}
