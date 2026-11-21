import { createRef } from "react";
import type { Image, Text, View } from "react-native";
import { Alert } from "../../src/core/components/ui/alert";
import { Avatar } from "../../src/core/components/ui/avatar";
import { Chip } from "../../src/core/components/ui/chip";
import { Badge } from "../../src/core/components/ui/badge";
import { Icon, type IconColor, type IconSize } from "../../src/core/components/ui/icon";
import { Bell } from "lucide-react-native";

const iconSizes: IconSize[] = ["sm", "md", "lg"];
const iconColors: IconColor[] = [
  "inherit",
  "foreground",
  "muted",
  "accent",
  "success",
  "warning",
  "danger",
];
iconSizes.map((size) => <Icon as={Bell} size={size} />);
iconColors.map((color) => <Icon as={Bell} color={color} />);
<Icon
  as={Bell}
  size={18}
  color="#8b5cf6"
  className="text-muted size-6"
  strokeWidth={2}
  absoluteStrokeWidth
/>;
// @ts-expect-error Icon only keeps three semantic size presets.
<Icon as={Bell} size="default" />;
// @ts-expect-error Old extra-small presets are removed.
<Icon as={Bell} size="xs" />;
// @ts-expect-error Custom dimensions are numeric, not arbitrary strings.
<Icon as={Bell} size="18px" />;

// One public types.ts exposes real platform types without moduleSuffixes.
<Alert
  status="warning"
  title={({ status }) => status}
  description="Description"
  action="Retry"
  herouiNativeProps={{ ref: createRef<View>(), onLayout: (event) => void event.nativeEvent.layout }}
  herouiWebProps={{
    ref: createRef<HTMLDivElement>(),
    onClick: (event) => void event.currentTarget,
  }}
  titleProps={{
    herouiNativeProps: { ref: createRef<Text>(), allowFontScaling: true },
    herouiWebProps: { ref: createRef<HTMLParagraphElement>(), style: { fontSize: "1rem" } },
  }}
  descriptionProps={{
    herouiNativeProps: { ref: createRef<Text>() },
    herouiWebProps: { ref: createRef<HTMLSpanElement>() },
  }}
  indicator={null}
/>;
<Avatar
  src="https://example.com/avatar.jpg"
  size="lg"
  variant="soft"
  color="success"
  fallback={({ alt }) => alt}
  herouiNativeProps={{ ref: createRef<View>(), animation: "disable-all" }}
  herouiWebProps={{ "ref": createRef<HTMLSpanElement>(), "aria-label": "Avatar" }}
  imageProps={{
    herouiNativeProps: {
      ref: createRef<Image>(),
      source: 42,
      onError: (event) => void event.nativeEvent.error,
    },
    herouiWebProps: {
      ref: createRef<HTMLImageElement>(),
      onLoadingStatusChange: (status) => void status,
    },
  }}
  fallbackProps={{
    herouiNativeProps: { textProps: { allowFontScaling: true, style: { fontFamily: "System" } } },
    herouiWebProps: { ref: createRef<HTMLSpanElement>(), delayMs: 100 },
  }}
/>;
<Chip
  size="sm"
  variant="soft"
  color="warning"
  label={({ color, size }) => color + size}
  herouiNativeProps={{ ref: createRef<View>(), onPress: (event) => void event.nativeEvent }}
  herouiWebProps={{
    ref: createRef<HTMLSpanElement>(),
    onClick: (event) => void event.currentTarget,
  }}
  labelProps={{
    herouiNativeProps: { allowFontScaling: true },
    herouiWebProps: { ref: createRef<HTMLSpanElement>() },
  }}
  startContent={0}
  endContent="End"
/>;
<Badge
  size="sm"
  variant="soft"
  color="warning"
  placement="bottom-left"
  isHidden={false}
  content={({ color, size, placement }) => color + size + placement}
  accessibilityLabel="New messages"
  herouiNativeProps={{ ref: createRef<View>(), onLayout: (event) => void event.nativeEvent.layout }}
  herouiWebProps={{ ref: createRef<HTMLSpanElement>(), title: "New messages" }}
  anchorProps={{
    herouiNativeProps: { ref: createRef<View>() },
    herouiWebProps: { ref: createRef<HTMLDivElement>() },
  }}
  labelProps={{
    herouiNativeProps: { allowFontScaling: true },
    herouiWebProps: { ref: createRef<HTMLSpanElement>() },
  }}
>
  <Avatar fallback="UI" />
</Badge>;

// @ts-expect-error Badge needs an anchor; standalone tags use Chip.
<Badge content={5} />;
// @ts-expect-error Badge only supports the three shared indicator variants.
<Badge variant="tertiary">
  <Avatar />
</Badge>;
// @ts-expect-error Former Badge label API moved to Chip.
<Badge label="Old tag">
  <Avatar />
</Badge>;
// @ts-expect-error The shared placement cannot be overridden through Web props.
<Badge herouiWebProps={{ placement: "bottom-left" }}>
  <Avatar />
</Badge>;
// @ts-expect-error The shared variant cannot be overridden through Native props.
<Badge herouiNativeProps={{ variant: "soft" }}>
  <Avatar />
</Badge>;
// @ts-expect-error Native anchor refs cannot be DOM refs.
<Badge anchorProps={{ herouiNativeProps: { ref: createRef<HTMLDivElement>() } }}>
  <Avatar />
</Badge>;
// @ts-expect-error The Web anchor uses a div host.
<Badge anchorProps={{ herouiWebProps: { ref: createRef<HTMLSpanElement>() } }}>
  <Avatar />
</Badge>;
// @ts-expect-error Managed content cannot be replaced in platform props.
<Badge herouiWebProps={{ children: "bypass" }}>
  <Avatar />
</Badge>;
// @ts-expect-error The Web host cannot be replaced through platform props.
<Badge herouiWebProps={{ render: () => <div /> }}>
  <Avatar />
</Badge>;

// @ts-expect-error Alert has no artificial size API.
<Alert size="sm" />;
// @ts-expect-error Semantic status replaces the RNR destructive variant.
<Alert variant="destructive" />;
// @ts-expect-error Public API is a single entry.
<Alert.Title>Title</Alert.Title>;
// @ts-expect-error No old RNR size enum.
<Avatar size="2xl" />;
// @ts-expect-error Shared src owns the image URL.
<Avatar imageProps={{ herouiWebProps: { src: "bypass" } }} />;
// @ts-expect-error Native image refs cannot be DOM refs.
<Avatar imageProps={{ herouiNativeProps: { ref: createRef<HTMLImageElement>() } }} />;
// @ts-expect-error No invented system-native implementation.
<Avatar native />;
// @ts-expect-error Use HeroUI Chip variants.
<Chip variant="outline" />;
// @ts-expect-error Shared variant cannot be overridden inside platform props.
<Chip herouiNativeProps={{ variant: "soft" }} />;
// @ts-expect-error Managed label structure cannot be bypassed through platform children.
<Chip herouiWebProps={{ children: "bypass" }} />;
// @ts-expect-error Root Web ref must be a span.
<Chip herouiWebProps={{ ref: createRef<Text>() }} />;
