import {
  ChevronLeft,
  FolderPlus,
  ListMusic,
  MoreHorizontal,
  Music2,
  Pause,
  Play,
  Plus,
} from "@tamagui/lucide-icons-2";
import { useState, type ReactNode } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Button,
  GlassEffect,
  GlassEffectSearchBar,
  type GlassColorScheme,
  type GlassEffectProps,
  type GlassStyle,
  NativeList,
  NativeListInputItem,
  NativeListItem,
  NativeListSection,
  NativeListSelectItem,
  NativeListSwitchItem,
  Text,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
  useAppBackgroundColors,
  isIos26Plus,
} from "rn-ui-kit/core";

type GlassExampleMode =
  | "floating-buttons"
  | "docked-actions"
  | "search"
  | "music"
  | "container"
  | "style-gallery";

const MODE_OPTIONS: Array<{ label: string; value: GlassExampleMode }> = [
  { label: "悬浮式底部按钮栏", value: "floating-buttons" },
  { label: "贴底式操作栏", value: "docked-actions" },
  { label: "悬浮式搜索栏", value: "search" },
  { label: "悬浮式媒体控制栏", value: "music" },
  { label: "组合式玻璃按钮容器", value: "container" },
  { label: "玻璃材质样式对照", value: "style-gallery" },
];

const GLASS_STYLE_OPTIONS = [
  { label: "Regular", value: "regular" },
  { label: "Clear", value: "clear" },
  { label: "None", value: "none" },
];

const COLOR_SCHEME_OPTIONS = [
  { label: "跟随系统", value: "auto" },
  { label: "浅色", value: "light" },
  { label: "深色", value: "dark" },
];

const TINT_OPTIONS = [
  { label: "无 tint", value: "none" },
  { label: "绿色", value: "#34c759" },
  { label: "蓝色", value: "#0a84ff" },
  { label: "紫色", value: "#af52de" },
  { label: "橙色", value: "#ff9f0a" },
];

const RADIUS_OPTIONS = [16, 24, 32, 999].map((value) => ({
  label: value === 999 ? "胶囊" : `${value} pt`,
  value: String(value),
}));

const INSET_OPTIONS = [0, 12, 20, 32].map((value) => ({
  label: `${value} pt`,
  value: String(value),
}));

const OFFSET_OPTIONS = [8, 20, 48, 88].map((value) => ({
  label: `${value} pt`,
  value: String(value),
}));

const DURATION_OPTIONS = [0.2, 0.35, 0.6, 1].map((value) => ({
  label: `${value} 秒`,
  value: String(value),
}));

const CONTAINER_SPACING_OPTIONS = [0, 8, 20, 40].map((value) => ({
  label: `${value} pt`,
  value: String(value),
}));

function getModeLabel(mode: GlassExampleMode) {
  return MODE_OPTIONS.find((option) => option.value === mode)?.label ?? mode;
}

type ExampleToolbarButtonProps = {
  accessibilityLabel: string;
  appearance?: "glass" | "plain";
  fallbackIcon: ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  title: string;
};

function ExampleToolbarButton({
  accessibilityLabel,
  appearance = "glass",
  fallbackIcon,
  onPress,
  style,
  title,
}: ExampleToolbarButtonProps) {
  const native = Platform.OS === "ios";
  return (
    <Button
      aria-label={accessibilityLabel}
      chromeless={!native && appearance === "plain"}
      circular={!native}
      native={native}
      onPress={onPress}
      style={[styles.nativeIconButton, style]}
      title={native ? title : undefined}
    >
      {native ? undefined : fallbackIcon}
    </Button>
  );
}

type PreviewProps = {
  animateStyleChanges: boolean;
  animationDuration: number;
  bottomOffset: number;
  buttonCount: number;
  colorScheme: GlassColorScheme;
  compact: boolean;
  containerSpacing: number;
  cornerRadius: number;
  effectStyle: GlassStyle;
  fallbackSurfaceColor: string;
  glassAvailable: boolean;
  horizontalInset: number;
  interactive: boolean;
  mode: GlassExampleMode;
  onAction: (action: string) => void;
  onLayoutSizeChange: (size: string) => void;
  onPlayingChange: (playing: boolean) => void;
  onSearchChange: (value: string) => void;
  playing: boolean;
  search: string;
  showSubtitle: boolean;
  tintColor?: string;
};

function GlassEffectPreview({
  animateStyleChanges,
  animationDuration,
  bottomOffset,
  buttonCount,
  colorScheme,
  compact,
  containerSpacing,
  cornerRadius,
  effectStyle,
  fallbackSurfaceColor,
  glassAvailable,
  horizontalInset,
  interactive,
  mode,
  onAction,
  onLayoutSizeChange,
  onPlayingChange,
  onSearchChange,
  playing,
  search,
  showSubtitle,
  tintColor,
}: PreviewProps) {
  const insets = useSafeAreaInsets();
  const colorSchemeName = useColorScheme();
  const dark = colorSchemeName === "dark";
  const foregroundColor = dark ? "#f5f5f7" : "#111114";
  const secondaryColor = dark ? "#b7b7bd" : "#65656b";
  const glassEffectStyle: GlassEffectProps["glassEffectStyle"] = animateStyleChanges
    ? { animate: true, animationDuration, style: effectStyle }
    : effectStyle;
  const sharedGlassProps = {
    colorScheme,
    glassEffectStyle,
    isInteractive: interactive,
    tintColor,
  } satisfies Pick<
    GlassEffectProps,
    "colorScheme" | "glassEffectStyle" | "isInteractive" | "tintColor"
  >;
  const floatingBottom = insets.bottom + bottomOffset;
  const searchBottom = insets.bottom + 8;
  const fallbackStyle = glassAvailable ? undefined : { backgroundColor: fallbackSurfaceColor };
  const handleLayout: NonNullable<GlassEffectProps["onLayout"]> = (event) => {
    const { height, width } = event.nativeEvent.layout;
    onLayoutSizeChange(`${Math.round(width)} × ${Math.round(height)} pt`);
  };

  if (mode === "docked-actions") {
    return (
      <GlassEffect
        {...sharedGlassProps}
        accessibilityLabel="固定在页面底部的操作工具栏"
        onLayout={handleLayout}
        style={[styles.dockedToolbar, { paddingBottom: Math.max(insets.bottom, 8) }, fallbackStyle]}
        testID="glass-effect-docked-toolbar"
      >
        <Button native onPress={() => onAction("移动全部")} title="移动全部" />
        <View style={styles.flexSpacer} />
        <Button native onPress={() => onAction("全部删除")} title="全部删除" />
      </GlassEffect>
    );
  }

  if (mode === "search") {
    return (
      <GlassEffectSearchBar
        {...sharedGlassProps}
        accessibilityLabel="悬浮搜索工具栏"
        inputColor={foregroundColor}
        inputProps={{
          accessibilityLabel: "搜索示例内容",
          onChangeText: onSearchChange,
          value: search,
        }}
        onCancel={() => onAction("取消搜索")}
        onLayout={handleLayout}
        placeholder="搜索组件或设置"
        placeholderTextColor={secondaryColor}
        searchIconColor={secondaryColor}
        searchStyle={[{ borderRadius: cornerRadius }, fallbackStyle]}
        unfocusedTrailing={
          <Button
            aria-label="新建内容"
            native={isIos26Plus() ? "swift-ui" : false}
            circular
            nativeButtonStyle="glass"
            buttonSize={{ height: 40, width: 40 }}
            onPress={() => onAction("新建内容")}
            title="新建"
          />
        }
        style={[
          styles.searchBarRow,
          { bottom: searchBottom, left: horizontalInset, right: horizontalInset },
        ]}
      />
    );
  }

  if (mode === "music") {
    return (
      <GlassEffect
        {...sharedGlassProps}
        accessibilityLabel="自定义音乐播放工具栏"
        onLayout={handleLayout}
        style={[
          styles.floatingToolbar,
          styles.musicToolbar,
          compact ? styles.compactToolbar : undefined,
          {
            borderRadius: cornerRadius,
            bottom: floatingBottom,
            left: horizontalInset,
            right: horizontalInset,
          },
          fallbackStyle,
        ]}
        testID="glass-effect-music-toolbar"
      >
        <View style={styles.albumArtwork}>
          <Music2 color="#ffffff" size={compact ? 20 : 26} />
        </View>
        <View style={styles.musicCopy}>
          <Text fontSize={compact ? 15 : 17} fontWeight="600" numberOfLines={1}>
            Liquid Glass Radio
          </Text>
          {showSubtitle ? (
            <Text fontSize={13} numberOfLines={1} opacity={0.58}>
              任意 React Native 自定义内容
            </Text>
          ) : null}
        </View>
        <Pressable
          accessibilityLabel={playing ? "暂停" : "播放"}
          hitSlop={10}
          onPress={() => {
            onPlayingChange(!playing);
            onAction(playing ? "暂停音乐" : "播放音乐");
          }}
          style={styles.iconButton}
        >
          {playing ? (
            <Pause color={foregroundColor} fill={foregroundColor} size={22} />
          ) : (
            <Play color={foregroundColor} fill={foregroundColor} size={22} />
          )}
        </Pressable>
        <Pressable
          accessibilityLabel="播放队列"
          hitSlop={10}
          onPress={() => onAction("打开播放队列")}
          style={styles.iconButton}
        >
          <ListMusic color={foregroundColor} size={23} />
        </Pressable>
      </GlassEffect>
    );
  }

  if (mode === "container") {
    return (
      <GlassEffect.Container
        accessibilityLabel="多个玻璃按钮的融合容器"
        spacing={containerSpacing}
        style={[
          styles.glassContainer,
          {
            bottom: floatingBottom,
            left: horizontalInset,
            right: horizontalInset,
          },
        ]}
      >
        {[
          { Icon: ChevronLeft, label: "返回" },
          { Icon: Plus, label: "新增" },
          { Icon: FolderPlus, label: "新建文件夹" },
        ].map(({ Icon, label }) => (
          <GlassEffect
            {...sharedGlassProps}
            key={label}
            style={[styles.containerButtonGlass, fallbackStyle]}
          >
            <Pressable
              accessibilityLabel={label}
              onPress={() => onAction(label)}
              style={styles.containerButton}
            >
              <Icon color={foregroundColor} size={22} />
            </Pressable>
          </GlassEffect>
        ))}
      </GlassEffect.Container>
    );
  }

  if (mode === "style-gallery") {
    return (
      <View
        style={[
          styles.styleGallery,
          {
            bottom: floatingBottom,
            left: horizontalInset,
            right: horizontalInset,
          },
        ]}
      >
        {(["regular", "clear", "none"] as const).map((styleName) => (
          <GlassEffect
            {...sharedGlassProps}
            glassEffectStyle={styleName}
            key={styleName}
            onLayout={styleName === "regular" ? handleLayout : undefined}
            style={[styles.galleryGlass, fallbackStyle]}
          >
            <Text fontSize={12} fontWeight="600">
              {styleName}
            </Text>
          </GlassEffect>
        ))}
      </View>
    );
  }

  const buttonDefinitions = [
    { Icon: ChevronLeft, title: "返回", action: "返回" },
    { Icon: Plus, title: "新增", action: "新增" },
    {
      Icon: FolderPlus,
      title: "文件夹",
      action: "新建文件夹",
    },
    {
      Icon: MoreHorizontal,
      title: "更多",
      action: "更多操作",
    },
  ].slice(0, buttonCount);

  return (
    <GlassEffect
      {...sharedGlassProps}
      accessibilityLabel="包含多个原生按钮的悬浮工具栏"
      onLayout={handleLayout}
      style={[
        styles.floatingToolbar,
        styles.nativeButtonsToolbar,
        compact ? styles.compactToolbar : undefined,
        {
          borderRadius: cornerRadius,
          bottom: floatingBottom,
          left: horizontalInset,
          right: horizontalInset,
        },
        fallbackStyle,
      ]}
      testID="glass-effect-floating-buttons"
    >
      {buttonDefinitions.map(({ Icon, ...button }) => (
        <ExampleToolbarButton
          accessibilityLabel={button.title}
          appearance="plain"
          fallbackIcon={<Icon color={foregroundColor} size={23} />}
          key={button.action}
          onPress={() => onAction(button.action)}
          title={button.title}
        />
      ))}
    </GlassEffect>
  );
}

export function GlassEffectExample() {
  const appBackgroundColors = useAppBackgroundColors();
  const colorSchemeName = useColorScheme();
  const [mode, setMode] = useState<GlassExampleMode>("floating-buttons");
  const [effectStyle, setEffectStyle] = useState<GlassStyle>("regular");
  const [colorScheme, setColorScheme] = useState<GlassColorScheme>("auto");
  const [tintColor, setTintColor] = useState<string | undefined>();
  const [interactive, setInteractive] = useState(true);
  const [animateStyleChanges, setAnimateStyleChanges] = useState(true);
  const [animationDuration, setAnimationDuration] = useState(0.35);
  const [cornerRadius, setCornerRadius] = useState(32);
  const [horizontalInset, setHorizontalInset] = useState(20);
  const [bottomOffset, setBottomOffset] = useState(20);
  const [containerSpacing, setContainerSpacing] = useState(20);
  const [compact, setCompact] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [buttonCount, setButtonCount] = useState(3);
  const [search, setSearch] = useState("");
  const [playing, setPlaying] = useState(false);
  const [lastAction, setLastAction] = useState("尚未操作");
  const [lastLayoutSize, setLastLayoutSize] = useState("等待布局");
  const glassAvailable = isLiquidGlassAvailable();
  const glassApiAvailable = isGlassEffectAPIAvailable();
  const fallbackSurfaceColor =
    colorSchemeName === "dark" ? "rgba(44, 44, 48, 0.96)" : "rgba(246, 246, 248, 0.96)";
  return (
    <>
      <NativeList
        automaticallyAdjustsScrollIndicatorInsets={Platform.OS === "ios" ? true : undefined}
        backgroundColor={appBackgroundColors.screen}
        contentInsetAdjustmentBehavior={Platform.OS === "ios" ? "automatic" : undefined}
        contentMarginBottom={190}
        iosListStyle="insetGrouped"
        style={styles.list}
        tracksNavigationBarScrollEdge
      >
        <NativeListSection
          footer="工具栏与导航无关，只是叠放在页面根节点上；切换模式不会改变 NativeList 的滚动容器。"
          title="预览模式"
        >
          <NativeListSelectItem
            selectProps={{
              onValueChange: (value) => value != null && setMode(value as GlassExampleMode),
              options: MODE_OPTIONS,
              value: mode,
            }}
            title="工具栏展示模式"
          />
          <NativeListItem
            chevron={false}
            subtitle={`当前平台：${Platform.OS}`}
            title="Liquid Glass 可用"
            value={glassAvailable ? "是" : "否，普通 View 降级"}
          />
          <NativeListItem
            chevron={false}
            title="原生 Glass API 可用"
            value={glassApiAvailable ? "是" : "否"}
          />
          <NativeListItem chevron={false} title="最近一次布局" value={lastLayoutSize} />
          <NativeListItem chevron={false} title="最近操作" value={lastAction} />
        </NativeListSection>

        <NativeListSection
          footer="这些设置会直接透传到 expo-glass-effect 的 GlassView。"
          title="GlassView props"
        >
          <NativeListSelectItem
            selectProps={{
              onValueChange: (value) => value != null && setEffectStyle(value as GlassStyle),
              options: GLASS_STYLE_OPTIONS,
              value: effectStyle,
            }}
            title="glassEffectStyle"
          />
          <NativeListSwitchItem
            switchProps={{
              checked: animateStyleChanges,
              onCheckedChange: setAnimateStyleChanges,
            }}
            title="动画切换 style"
          />
          <NativeListSelectItem
            selectProps={{
              disabled: !animateStyleChanges,
              onValueChange: (value) => value != null && setAnimationDuration(Number(value)),
              options: DURATION_OPTIONS,
              value: String(animationDuration),
            }}
            title="animationDuration"
          />
          <NativeListSelectItem
            selectProps={{
              onValueChange: (value) => value != null && setColorScheme(value as GlassColorScheme),
              options: COLOR_SCHEME_OPTIONS,
              value: colorScheme,
            }}
            title="colorScheme"
          />
          <NativeListSelectItem
            selectProps={{
              onValueChange: (value) =>
                value != null && setTintColor(value === "none" ? undefined : value),
              options: TINT_OPTIONS,
              value: tintColor ?? "none",
            }}
            title="tintColor"
          />
          <NativeListSwitchItem
            switchProps={{ checked: interactive, onCheckedChange: setInteractive }}
            title="isInteractive"
          />
        </NativeListSection>

        <NativeListSection
          footer="这些是普通 React Native 布局参数，不属于 expo-glass-effect 的固定行为。"
          title="位置与形状"
        >
          <NativeListSelectItem
            selectProps={{
              onValueChange: (value) => value != null && setCornerRadius(Number(value)),
              options: RADIUS_OPTIONS,
              value: String(cornerRadius),
            }}
            title="圆角"
          />
          <NativeListSelectItem
            selectProps={{
              onValueChange: (value) => value != null && setHorizontalInset(Number(value)),
              options: INSET_OPTIONS,
              value: String(horizontalInset),
            }}
            title="水平边距"
          />
          <NativeListSelectItem
            selectProps={{
              onValueChange: (value) => value != null && setBottomOffset(Number(value)),
              options: OFFSET_OPTIONS,
              value: String(bottomOffset),
            }}
            title="底部悬浮距离"
          />
          <NativeListSelectItem
            selectProps={{
              onValueChange: (value) => value != null && setContainerSpacing(Number(value)),
              options: CONTAINER_SPACING_OPTIONS,
              value: String(containerSpacing),
            }}
            title="GlassContainer spacing"
          />
        </NativeListSection>

        <NativeListSection
          footer="搜索框、原生 Button、图标、文本和自定义播放器均作为普通 React Native children 放进 GlassEffect。"
          title="任意 children"
        >
          <NativeListSwitchItem
            switchProps={{ checked: compact, onCheckedChange: setCompact }}
            title="紧凑高度"
          />
          <NativeListSwitchItem
            switchProps={{ checked: showSubtitle, onCheckedChange: setShowSubtitle }}
            title="显示音乐副标题"
          />
          <NativeListSelectItem
            selectProps={{
              onValueChange: (value) => value != null && setButtonCount(Number(value)),
              options: [2, 3, 4].map((value) => ({
                label: `${value} 个`,
                value: String(value),
              })),
              value: String(buttonCount),
            }}
            title="原生 Button 数量"
          />
          <NativeListInputItem
            inputProps={{
              onChangeText: setSearch,
              placeholder: "搜索栏中的内容",
              value: search,
            }}
            title="搜索文本"
          />
          <NativeListSwitchItem
            switchProps={{ checked: playing, onCheckedChange: setPlaying }}
            title="音乐播放状态"
          />
        </NativeListSection>

        <NativeListSection
          footer="额外条目用于确认 NativeList 可以持续滚动，悬浮工具栏始终保持在页面底部。"
          title="滚动内容"
        >
          {Array.from({ length: 12 }, (_, index) => (
            <NativeListItem
              chevron={false}
              key={index}
              onPress={() => setLastAction(`点击滚动示例 ${index + 1}`)}
              subtitle="滚动列表不会改变工具栏的屏幕位置"
              title={`NativeList 示例条目 ${index + 1}`}
              value={index % 2 === 0 ? "可交互" : "参数占位"}
            />
          ))}
        </NativeListSection>
      </NativeList>

      <GlassEffectPreview
        animateStyleChanges={animateStyleChanges}
        animationDuration={animationDuration}
        bottomOffset={bottomOffset}
        buttonCount={buttonCount}
        colorScheme={colorScheme}
        compact={compact}
        containerSpacing={containerSpacing}
        cornerRadius={cornerRadius}
        effectStyle={effectStyle}
        fallbackSurfaceColor={fallbackSurfaceColor}
        glassAvailable={glassAvailable}
        horizontalInset={horizontalInset}
        interactive={interactive}
        mode={mode}
        onAction={setLastAction}
        onLayoutSizeChange={setLastLayoutSize}
        onPlayingChange={setPlaying}
        onSearchChange={setSearch}
        playing={playing}
        search={search}
        showSubtitle={showSubtitle}
        tintColor={tintColor}
      />
    </>
  );
}

const styles = StyleSheet.create({
  albumArtwork: {
    alignItems: "center",
    backgroundColor: "#5e5ce6",
    borderRadius: 12,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  compactToolbar: { minHeight: 52, paddingVertical: 6 },
  containerButton: {
    alignItems: "center",
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  containerButtonGlass: { borderRadius: 26, height: 52, width: 52 },
  dockedToolbar: {
    alignItems: "center",
    bottom: 0,
    flexDirection: "row",
    left: 0,
    minHeight: 64,
    paddingHorizontal: 16,
    paddingTop: 8,
    position: "absolute",
    right: 0,
    zIndex: 20,
  },
  flexSpacer: { flex: 1 },
  floatingToolbar: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 64,
    paddingHorizontal: 14,
    paddingVertical: 10,
    position: "absolute",
    zIndex: 20,
  },
  galleryGlass: {
    alignItems: "center",
    borderRadius: 18,
    flex: 1,
    justifyContent: "center",
    minHeight: 64,
    paddingHorizontal: 8,
  },
  glassContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    justifyContent: "center",
    position: "absolute",
    zIndex: 20,
  },
  iconButton: {
    alignItems: "center",
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  list: { flex: 1, minHeight: 0 },
  musicCopy: { flex: 1, gap: 2, minWidth: 0 },
  musicToolbar: { gap: 10 },
  nativeButtonsToolbar: { gap: 6, justifyContent: "space-around" },
  nativeIconButton: { height: 52, padding: 0, width: 52 },
  searchBarRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    position: "absolute",
    zIndex: 20,
  },
  styleGallery: {
    flexDirection: "row",
    gap: 10,
    position: "absolute",
    zIndex: 20,
  },
});
