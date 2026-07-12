import { NavigationContainer, type NavigationProp, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { YStack } from "tamagui";
import { NativeSheet, NativeSheetStack } from "rn_ui_kit";

import { RnUiKitDebugHomePage } from "./pages/debug_home_page";
import { RnUiKitDebugSectionPage } from "./pages/debug_section_page";
import { getRnUiKitDebugRouteDefinition, rnUiKitDebugRouteDefinitions } from "./routes";

import type { RnUiKitDebugPanelProps, RnUiKitDebugRouteKey } from "./types";

type RnUiKitDebugStackParamList = {
  index: undefined;
} & Record<RnUiKitDebugRouteKey, undefined>;

const Stack = createNativeStackNavigator<RnUiKitDebugStackParamList>();
const DEBUG_PANEL_SHEET_OVERLAY_HOST = "rn-ui-kit-debug-panel-sheet-overlay";
const DEBUG_PANEL_SECTION_SHEET_OVERLAY_HOST = "rn-ui-kit-debug-panel-section-sheet-overlay";
const DEBUG_SECTION_SHEET_OVERLAY_HOST = "rn-ui-kit-debug-section-sheet-overlay";
const debugSheetStackScreenOptions = {
  headerRight: undefined,
  headerStatusBarHeight: 0,
  headerStyle: {
    height: 56,
  },
};

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
      <RnUiKitDebugPanelSheet
        initialRouteKey={initialRouteKey}
        onOpenChange={handleOpenChange}
        open={open}
        {...props}
      />
    );
  }

  return <RnUiKitDebugPanelContent initialRouteKey={initialRouteKey} {...props} />;
}

function RnUiKitDebugPanelSheet({
  initialRouteKey = "components",
  onOpenChange,
  open,
  ...props
}: RnUiKitDebugPanelProps & {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  const [openSectionsInSheet, setOpenSectionsInSheet] = useState(false);
  const [sheetRouteKey, setSheetRouteKey] = useState<RnUiKitDebugRouteKey>(initialRouteKey);
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetRouteDefinition = useMemo(
    () => getRnUiKitDebugRouteDefinition(sheetRouteKey),
    [sheetRouteKey],
  );

  const handlePanelOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSheetOpen(false);
    }

    onOpenChange(nextOpen);
  };

  function HomeRoute() {
    return (
      <RnUiKitDebugHomeRoute
        onOpenInSheet={(key) => {
          setSheetRouteKey(key);
          setSheetOpen(true);
        }}
        onOpenSectionsInSheetChange={setOpenSectionsInSheet}
        openSectionsInSheet={openSectionsInSheet}
      />
    );
  }

  return (
    <>
      <NativeSheetStack
        initialRouteName="index"
        name="rn-ui-kit-debug-panel-sheet"
        onOpenChange={handlePanelOpenChange}
        open={open}
        overlayPortalHostName={DEBUG_PANEL_SHEET_OVERLAY_HOST}
        screenOptions={debugSheetStackScreenOptions}
        sheetProps={{
          grabber: true,
          snapPoints: ["88%"],
          snapPointsMode: "percent",
        }}
      >
        <NativeSheetStack.Screen name="index" options={{ title: "rn_ui_kit 调试" }}>
          {() => <HomeRoute />}
        </NativeSheetStack.Screen>
        {rnUiKitDebugRouteDefinitions.map((definition) => (
          <NativeSheetStack.Screen
            key={definition.key}
            name={definition.key}
            options={{ title: definition.label }}
          >
            {() => (
              <RnUiKitDebugSectionPage
                contentTitle={definition.label}
                instanceId={`panel-sheet-stack-${definition.key}`}
                sectionKey={definition.key}
              />
            )}
          </NativeSheetStack.Screen>
        ))}
      </NativeSheetStack>

      <NativeSheet
        handle
        name="rn-ui-kit-debug-panel-section-sheet"
        onOpenChange={setSheetOpen}
        open={sheetOpen}
        overlayPortalHostName={DEBUG_PANEL_SECTION_SHEET_OVERLAY_HOST}
        snapPoints={["82%"]}
        snapPointsMode="percent"
      >
        <View style={{ flex: 1 }}>
          <RnUiKitDebugSectionPage
            contentTitle={sheetRouteDefinition.label}
            instanceId={`panel-sheet-section-${sheetRouteKey}`}
            sectionKey={sheetRouteKey}
          />
        </View>
      </NativeSheet>
    </>
  );
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
        overlayPortalHostName={DEBUG_SECTION_SHEET_OVERLAY_HOST}
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
