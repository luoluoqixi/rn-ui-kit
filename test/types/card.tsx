import { createRef } from "react";
import type { Text, View } from "react-native";
import { Card, type CardProps } from "../../src/core/components/ui/card";

// Both platforms are checked from one public types.ts without moduleSuffixes.
<Card title="Title" description={() => "Description"} variant="secondary" content={0}
  herouiNativeProps={{ ref: createRef<View>(), onLayout: event => void event.nativeEvent.layout, animation: "disable-all" }}
  herouiWebProps={{ ref: createRef<HTMLDivElement>(), onClick: event => void event.currentTarget, role: "region" }}
  headerProps={{ herouiNativeProps: { ref: createRef<View>() }, herouiWebProps: { ref: createRef<HTMLDivElement>() } }}
  titleProps={{ herouiNativeProps: { ref: createRef<Text>(), allowFontScaling: true }, herouiWebProps: { ref: createRef<HTMLHeadingElement>(), style: { fontSize: "1.5rem" } } }}
  descriptionProps={{ herouiNativeProps: { ref: createRef<Text>() }, herouiWebProps: { ref: createRef<HTMLParagraphElement>() } }}
  contentProps={{ className: "gap-3", herouiNativeProps: { ref: createRef<View>() }, herouiWebProps: { ref: createRef<HTMLDivElement>() } }}
  footerProps={{ herouiNativeProps: { ref: createRef<View>() }, herouiWebProps: { ref: createRef<HTMLDivElement>() } }} />;

// @ts-expect-error No synthetic size API absent from HeroUI Card.
<Card size="sm" />;
// @ts-expect-error System-native mode is not invented for Card.
<Card native />;
// @ts-expect-error No old compound API; all slots are configured through props.
<Card.Title>Title</Card.Title>;
// @ts-expect-error A Native ref cannot point to a DOM element.
<Card herouiNativeProps={{ ref: createRef<HTMLDivElement>() }} />;
// @ts-expect-error A Web ref cannot point to an RN Text instance.
<Card titleProps={{ herouiWebProps: { ref: createRef<Text>() } }} />;
// @ts-expect-error Managed children cannot be overridden through platform props.
const invalidChildren: CardProps = { herouiWebProps: { children: "Bypass" } };
// @ts-expect-error Surface asChild conflicts with the wrapper-managed structure.
<Card herouiNativeProps={{ asChild: true }} />;
// @ts-expect-error Variant is controlled through the shared prop.
<Card herouiNativeProps={{ variant: "secondary" }} />;
void invalidChildren;
