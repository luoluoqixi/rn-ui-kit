import { NavigationContainer, type NavigationProp, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";
import { Platform, View } from "react-native";
import { YStack } from "tamagui";
import { NativeSheet, NativeSheetStack } from "rn_ui_kit";

import { RnUiKitDebugHomePage } from "./pages/debug_home_page";
import { RnUiKitDebugSectionPage } from "./pages/debug_section_page";
import {
  getComponentExampleRouteName,
  RnUiKitComponentExampleDetailPage,
  RnUiKitComponentExamplesDebugPage,
} from "./pages/component_examples/component_examples_page";
import { componentExampleDefinitions } from "./pages/component_examples/catalog";
import { rnUiKitDebugRouteDefinitions } from "./routes";

import type {
  RnUiKitDebugPanelProps,
  RnUiKitDebugRouteDefinition,
  RnUiKitDebugRouteKey,
} from "./types";

type RnUiKitDebugStackParamList = {
  index: undefined;
} & Record<RnUiKitDebugRouteKey, undefined>;

const Stack = createNativeStackNavigator<RnUiKitDebugStackParamList>();
const DEBUG_PANEL_SHEET_OVERLAY_HOST = "rn-ui-kit-debug-panel-sheet-overlay";
const DEBUG_SECTION_SHEET_OVERLAY_HOST = "rn-ui-kit-debug-section-sheet-overlay";
const DEBUG_SECTION_SHEET_SNAP_POINTS = [50, 75, 100];
const debugSheetStackScreenOptions = {
  headerRight: undefined,
  headerStatusBarHeight: 0,
  headerStyle: { height: 56 },
};

export function RnUiKitDebugPanel({
  defaultOpen = true,
  initialRouteKey = "components",
  onOpenChange,
  open: openProp,
  pages: pagesProp,
  sheetMode = false,
  ...props
}: RnUiKitDebugPanelProps) {
  const pages = Array.from(
    new Map(
      [...rnUiKitDebugRouteDefinitions, ...(pagesProp ?? [])].map((page) => [page.key, page]),
    ).values(),
  );
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (openProp == null) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  if (sheetMode) {
    return (
      <RnUiKitDebugPanelSheet
        initialRouteKey={initialRouteKey}
        onOpenChange={handleOpenChange}
        open={open}
        pages={pages}
        {...props}
      />
    );
  }

  return <RnUiKitDebugPanelContent initialRouteKey={initialRouteKey} pages={pages} {...props} />;
}

function RnUiKitDebugPanelSheet({
  onOpenChange,
  open,
  pages,
  ...props
}: RnUiKitDebugPanelProps & {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  pages: RnUiKitDebugRouteDefinition[];
}) {
  const [openSectionsInSheet, setOpenSectionsInSheet] = useState(false);
  const [sectionSheetPosition, setSectionSheetPosition] = useState(0);
  const [openSectionSheets, setOpenSectionSheets] = useState<Set<RnUiKitDebugRouteKey>>(new Set());

  const handlePanelOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setOpenSectionSheets(new Set());
    onOpenChange(nextOpen);
  };

  function HomeRoute() {
    return (
      <RnUiKitDebugHomeRoute
        onOpenInSheet={(key) => setOpenSectionSheets((current) => new Set(current).add(key))}
        pages={pages}
        onOpenSectionsInSheetChange={(enabled) => {
          setOpenSectionsInSheet(enabled);
          if (!enabled) setOpenSectionSheets(new Set());
        }}
        onSectionSheetPositionChange={setSectionSheetPosition}
        openSectionsInSheet={openSectionsInSheet}
        sectionSheetPosition={sectionSheetPosition}
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
        sheetProps={{ snapPoints: [88], snapPointsMode: "percent" }}
      >
        <NativeSheetStack.Screen name="index" options={{ title: "rn_ui_kit" }}>
          {() => <HomeRoute />}
        </NativeSheetStack.Screen>
        {pages.map((definition) => (
          <NativeSheetStack.Screen
            key={definition.key}
            name={definition.key}
            options={{ title: definition.label }}
          >
            {() => (
              <RnUiKitDebugSectionPage
                contentTitle={definition.label}
                instanceId={`panel-sheet-stack-${definition.key}`}
                layoutHost="nativeSheet"
                pages={pages}
                sectionKey={definition.key}
              />
            )}
          </NativeSheetStack.Screen>
        ))}
        {componentExampleDefinitions.map((definition) => (
          <NativeSheetStack.Screen
            key={getComponentExampleRouteName(definition.key)}
            name={getComponentExampleRouteName(definition.key)}
            options={{ title: definition.label }}
          >
            {() => <RnUiKitComponentExampleDetailPage definition={definition} />}
          </NativeSheetStack.Screen>
        ))}
      </NativeSheetStack>

      <RnUiKitDebugSectionSheets
        pages={pages}
        instancePrefix="panel-sheet-section"
        onOpenChange={setOpenSectionSheets}
        openKeys={openSectionSheets}
        position={sectionSheetPosition}
      />
    </>
  );
}

function RnUiKitDebugPanelContent({
  initialRouteKey = "components",
  pages,
  ...props
}: RnUiKitDebugPanelProps & { pages: RnUiKitDebugRouteDefinition[] }) {
  const [openSectionsInSheet, setOpenSectionsInSheet] = useState(false);
  const [panelSheetOpen, setPanelSheetOpen] = useState(false);
  const [sectionSheetPosition, setSectionSheetPosition] = useState(0);
  const [openSectionSheets, setOpenSectionSheets] = useState<Set<RnUiKitDebugRouteKey>>(new Set());

  return (
    <YStack background="$background" flex={1} {...props}>
      <NavigationContainer>
        <Stack.Navigator id="rn-ui-kit-debug-stack" initialRouteName="index">
          <Stack.Screen name="index" options={{ title: "rn_ui_kit" }}>
            {() => (
              <RnUiKitDebugHomeRoute
                onOpenInSheet={(key) =>
                  setOpenSectionSheets((current) => new Set(current).add(key))
                }
                onOpenPanelSheet={() => setPanelSheetOpen(true)}
                pages={pages}
                onOpenSectionsInSheetChange={(enabled) => {
                  setOpenSectionsInSheet(enabled);
                  if (!enabled) setOpenSectionSheets(new Set());
                }}
                onSectionSheetPositionChange={setSectionSheetPosition}
                openSectionsInSheet={openSectionsInSheet}
                sectionSheetPosition={sectionSheetPosition}
              />
            )}
          </Stack.Screen>
          {pages.map((definition) => (
            <Stack.Screen
              key={definition.key}
              name={definition.key}
              options={{ title: definition.label }}
            >
              {() => (
                <RnUiKitDebugSectionPage
                  contentTitle={definition.label}
                  instanceId={`stack-${definition.key}`}
                  pages={pages}
                  sectionKey={definition.key}
                />
              )}
            </Stack.Screen>
          ))}
          {componentExampleDefinitions.map((definition) => (
            <Stack.Screen
              key={getComponentExampleRouteName(definition.key)}
              name={getComponentExampleRouteName(definition.key)}
              options={{ title: definition.label }}
            >
              {() => <RnUiKitComponentExampleDetailPage definition={definition} />}
            </Stack.Screen>
          ))}
        </Stack.Navigator>
      </NavigationContainer>

      <RnUiKitDebugSectionSheets
        pages={pages}
        instancePrefix="sheet"
        onOpenChange={setOpenSectionSheets}
        openKeys={openSectionSheets}
        position={sectionSheetPosition}
      />

      <RnUiKitDebugPanel
        onOpenChange={setPanelSheetOpen}
        open={panelSheetOpen}
        pages={pages}
        sheetMode
      />
    </YStack>
  );
}

function RnUiKitDebugHomeRoute({
  onOpenInSheet,
  pages,
  onOpenPanelSheet,
  onOpenSectionsInSheetChange,
  onSectionSheetPositionChange,
  openSectionsInSheet,
  sectionSheetPosition,
}: {
  onOpenInSheet: (key: RnUiKitDebugRouteKey) => void;
  pages: RnUiKitDebugRouteDefinition[];
  onOpenPanelSheet?: () => void;
  onOpenSectionsInSheetChange: (openInSheet: boolean) => void;
  onSectionSheetPositionChange: (position: number) => void;
  openSectionsInSheet: boolean;
  sectionSheetPosition: number;
}) {
  const navigation = useNavigation<NavigationProp<RnUiKitDebugStackParamList>>();

  return (
    <RnUiKitDebugHomePage
      onOpenSection={(key) => {
        if (openSectionsInSheet) return onOpenInSheet(key);
        navigation.navigate(key);
      }}
      onOpenPanelSheet={onOpenPanelSheet}
      onOpenSectionsInSheetChange={onOpenSectionsInSheetChange}
      onSectionSheetPositionChange={onSectionSheetPositionChange}
      openSectionsInSheet={openSectionsInSheet}
      pages={pages}
      sectionSheetPosition={sectionSheetPosition}
    />
  );
}

function RnUiKitDebugSectionSheets({
  instancePrefix,
  pages,
  onOpenChange,
  openKeys,
  position,
}: {
  instancePrefix: string;
  pages: RnUiKitDebugRouteDefinition[];
  onOpenChange: (keys: Set<RnUiKitDebugRouteKey>) => void;
  openKeys: Set<RnUiKitDebugRouteKey>;
  position: number;
}) {
  const closeSheet = (key: RnUiKitDebugRouteKey, nextOpen: boolean) => {
    if (!nextOpen) {
      const next = new Set(openKeys);
      next.delete(key);
      onOpenChange(next);
    }
  };

  return pages.map((definition) => {
    const name = `rn-ui-kit-debug-${instancePrefix}-${definition.key}`;
    const overlayPortalHostName = `${DEBUG_SECTION_SHEET_OVERLAY_HOST}:${instancePrefix}:${definition.key}`;

    // The examples list needs actual stack history even when a section is opened directly in a sheet.
    if (definition.key === "component-examples") {
      return (
        <NativeSheetStack
          initialRouteName="index"
          key={definition.key}
          name={name}
          onOpenChange={(nextOpen) => closeSheet(definition.key, nextOpen)}
          open={openKeys.has(definition.key)}
          overlayPortalHostName={overlayPortalHostName}
          screenOptions={debugSheetStackScreenOptions}
          sheetProps={{
            initialDetentIndex: position,
            snapPoints: DEBUG_SECTION_SHEET_SNAP_POINTS,
            snapPointsMode: "percent",
          }}
        >
          <NativeSheetStack.Screen name="index" options={{ title: definition.label }}>
            {() => <RnUiKitComponentExamplesDebugPage />}
          </NativeSheetStack.Screen>
          {componentExampleDefinitions.map((example) => (
            <NativeSheetStack.Screen
              key={getComponentExampleRouteName(example.key)}
              name={getComponentExampleRouteName(example.key)}
              options={{ title: example.label }}
            >
              {() => <RnUiKitComponentExampleDetailPage definition={example} />}
            </NativeSheetStack.Screen>
          ))}
        </NativeSheetStack>
      );
    }

    return (
      <NativeSheet
        handle
        key={definition.key}
        name={name}
        onOpenChange={(nextOpen) => closeSheet(definition.key, nextOpen)}
        open={openKeys.has(definition.key)}
        overlayPortalHostName={overlayPortalHostName}
        position={position}
        snapPoints={DEBUG_SECTION_SHEET_SNAP_POINTS}
        snapPointsMode="percent"
      >
        <View style={{ flex: 1 }}>
          <RnUiKitDebugSectionPage
            contentTitle={definition.label}
            instanceId={`${instancePrefix}-${definition.key}`}
            layoutHost={
              Platform.OS === "ios" || Platform.OS === "android" ? "nativeSheet" : "default"
            }
            pages={pages}
            sectionKey={definition.key}
          />
        </View>
      </NativeSheet>
    );
  });
}
