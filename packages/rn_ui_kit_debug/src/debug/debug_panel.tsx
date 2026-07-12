import { NavigationContainer, type NavigationProp, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { YStack } from "tamagui";
import { NativeSheet } from "rn_ui_kit";

import { RnUiKitDebugHomePage } from "./pages/debug_home_page";
import { RnUiKitDebugSectionPage } from "./pages/debug_section_page";
import { getRnUiKitDebugRouteDefinition, rnUiKitDebugRouteDefinitions } from "./routes";

import type { RnUiKitDebugPanelProps, RnUiKitDebugRouteKey } from "./types";

type RnUiKitDebugStackParamList = {
  index: undefined;
} & Record<RnUiKitDebugRouteKey, undefined>;

const Stack = createNativeStackNavigator<RnUiKitDebugStackParamList>();

export function RnUiKitDebugPanel({
  defaultOpen = true,
  initialRouteKey = "components",
  onOpenChange,
  open: openProp,
  sheetMode = false,
  ...props
}: RnUiKitDebugPanelProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (openProp == null) {
      setUncontrolledOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  };

  if (sheetMode) {
    return (
      <NativeSheet
        handle
        name="rn-ui-kit-debug-panel-sheet"
        onOpenChange={handleOpenChange}
        open={open}
        snapPoints={["88%"]}
        snapPointsMode="percent"
      >
        <View style={{ flex: 1 }}>
          <RnUiKitDebugPanelContent initialRouteKey={initialRouteKey} sheetMode {...props} />
        </View>
      </NativeSheet>
    );
  }

  return <RnUiKitDebugPanelContent initialRouteKey={initialRouteKey} {...props} />;
}

function RnUiKitDebugPanelContent({
  initialRouteKey = "components",
  sheetMode = false,
  ...props
}: RnUiKitDebugPanelProps) {
  const [openSectionsInSheet, setOpenSectionsInSheet] = useState(false);
  const [panelSheetOpen, setPanelSheetOpen] = useState(false);
  const [sheetRouteKey, setSheetRouteKey] = useState<RnUiKitDebugRouteKey>(initialRouteKey);
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetRouteDefinition = useMemo(
    () => getRnUiKitDebugRouteDefinition(sheetRouteKey),
    [sheetRouteKey],
  );

  return (
    <YStack background="$background" flex={1} {...props}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="index">
          <Stack.Screen name="index" options={{ title: "rn_ui_kit 调试" }}>
            {() => (
              <RnUiKitDebugHomeRoute
                onOpenInSheet={(key) => {
                  setSheetRouteKey(key);
                  setSheetOpen(true);
                }}
                onOpenPanelSheet={sheetMode ? undefined : () => setPanelSheetOpen(true)}
                onOpenSectionsInSheetChange={setOpenSectionsInSheet}
                openSectionsInSheet={openSectionsInSheet}
              />
            )}
          </Stack.Screen>
          {rnUiKitDebugRouteDefinitions.map((definition) => (
            <Stack.Screen
              key={definition.key}
              name={definition.key}
              options={{ title: definition.label }}
            >
              {() => (
                <RnUiKitDebugSectionPage
                  contentTitle={definition.label}
                  instanceId={`stack-${definition.key}`}
                  sectionKey={definition.key}
                />
              )}
            </Stack.Screen>
          ))}
        </Stack.Navigator>
      </NavigationContainer>

      <NativeSheet
        handle
        name="rn-ui-kit-debug-section-sheet"
        onOpenChange={setSheetOpen}
        open={sheetOpen}
        snapPoints={["82%"]}
        snapPointsMode="percent"
      >
        <View style={{ flex: 1 }}>
          <RnUiKitDebugSectionPage
            contentTitle={sheetRouteDefinition.label}
            instanceId={`sheet-${sheetRouteKey}`}
            sectionKey={sheetRouteKey}
          />
        </View>
      </NativeSheet>

      {!sheetMode ? (
        <RnUiKitDebugPanel
          onOpenChange={setPanelSheetOpen}
          open={panelSheetOpen}
          sheetMode
        />
      ) : null}
    </YStack>
  );
}

function RnUiKitDebugHomeRoute({
  onOpenInSheet,
  onOpenPanelSheet,
  onOpenSectionsInSheetChange,
  openSectionsInSheet,
}: {
  onOpenInSheet: (key: RnUiKitDebugRouteKey) => void;
  onOpenPanelSheet?: () => void;
  onOpenSectionsInSheetChange: (openInSheet: boolean) => void;
  openSectionsInSheet: boolean;
}) {
  const navigation = useNavigation<NavigationProp<RnUiKitDebugStackParamList>>();

  return (
    <RnUiKitDebugHomePage
      onOpenSection={(key) => {
        if (openSectionsInSheet) {
          onOpenInSheet(key);
          return;
        }

        navigation.navigate(key);
      }}
      onOpenPanelSheet={onOpenPanelSheet}
      onOpenSectionsInSheetChange={onOpenSectionsInSheetChange}
      openSectionsInSheet={openSectionsInSheet}
    />
  );
}
