import { createRef } from "react";
import type { View } from "react-native";
import { Accordion, type AccordionProps } from "../../src/core/components/ui/accordion";

const items = [{ value: "first", title: "Title", content: "Content" }];

// One public entry must typecheck both platforms without moduleSuffixes.
<Accordion items={items} value={undefined} onValueChange={value => {
  const single: string | undefined = value;
  void single;
}} herouiNativeProps={{ ref: createRef<View>(), animation: "disable-all" }}
  herouiWebProps={{ ref: createRef<HTMLDivElement>(), id: "web-accordion" }}
  triggerProps={{
    className: "py-2",
    onPress: event => {
      if ("nativeEvent" in event) void event.nativeEvent;
      else void event.pointerType;
    },
    herouiNativeProps: { ref: createRef<View>(), onLongPress: event => void event.nativeEvent },
    herouiWebProps: { ref: createRef<HTMLButtonElement>(), onPressStart: event => void event.pointerType },
  }} contentProps={{
    herouiNativeProps: { animation: false },
    herouiWebProps: { ref: createRef<HTMLDivElement>() },
  }} />;

<Accordion selectionMode="multiple" items={items} defaultValue={["first"]} onValueChange={value => {
  const multiple: string[] = value;
  void multiple;
}} />;

// @ts-expect-error Single mode cannot accept an array.
const invalidSingle: AccordionProps = { items, value: ["first"] };
// @ts-expect-error Multiple mode requires array values.
const invalidMultiple: AccordionProps = { items, selectionMode: "multiple", value: "first" };
// @ts-expect-error Accordion does not invent a size API absent from both HeroUI implementations.
<Accordion items={items} size="sm" />;
// @ts-expect-error Native refs must not be checked as DOM refs or vice versa.
<Accordion items={items} herouiNativeProps={{ ref: createRef<HTMLDivElement>() }} />;
// @ts-expect-error Managed expansion state is exposed through the shared model only.
<Accordion items={items} herouiWebProps={{ expandedKeys: new Set(["first"]) }} />;
void [invalidSingle, invalidMultiple];
