import { useDefaultTextStyle } from "../provider/font_provider";
import { Fragment } from "react";
import { View } from "react-native";
import { ListGroup } from "heroui-native/list-group";
import { Check } from "lucide-react-native";
import { Text } from "../text";
import { Icon } from "../icon";
import { Separator } from "../separator";
import { cn } from "../utils/cn";
import { useKeySelection } from "../utils/key_selection";
import { resolveRenderProp } from "../utils/render";
import { triggerNativeHaptics, useResolvedNativeHaptics } from "../utils/haptics";
import type { ListGroupProps } from "./types";
export function ListGroupHeroUI(p: ListGroupProps) {
  const sections = p.sections ?? [{ id: "default", items: p.items ?? [] }];
  const font = useDefaultTextStyle();
  const all = sections.flatMap(s => [...s.items]);
  const state = useKeySelection({ ...p, selectionMode: p.selectionMode ?? "none" }, all);
  const haptics = useResolvedNativeHaptics(p.nativeHaptics);
  return <View className={cn("gap-4", p.className)} accessibilityLabel={p.accessibilityLabel}>
    {all.length === 0 && (p.emptyContent ?? <Text color="muted">暂无内容</Text>)}
    {sections.filter(s => s.items.length).map(section => <View key={section.id} className="gap-2">
      {section.title != null && <Text color="muted" className="px-2 text-sm">{section.title}</Text>}
      <ListGroup {...p.herouiNativeProps}>{section.items.map((item, index) => {
        const ctx = { id: item.id, isSelected: state.selected.has(item.id), isDisabled: !!p.isDisabled || state.disabled.has(item.id) };
        const selection = p.selectionMode && p.selectionMode !== "none";
        return <Fragment key={item.id}>
          <ListGroup.Item {...item.herouiNativeProps} disabled={ctx.isDisabled}
            accessibilityLabel={item.textValue ?? (typeof item.title === "string" ? item.title : item.id)}
            accessibilityRole={selection ? p.selectionMode === "single" ? "radio" : "checkbox" : "button"}
            accessibilityState={{ disabled: ctx.isDisabled, ...(selection ? { checked: ctx.isSelected } : {}) }}
            className={cn(ctx.isSelected && "bg-accent-soft", ctx.isDisabled && "opacity-disabled", item.className)}
            onPress={() => { if (ctx.isDisabled) return; state.toggle(item.id); triggerNativeHaptics(haptics); item.onPress?.(); }}>
            {item.startContent != null && <ListGroup.ItemPrefix>{resolveRenderProp(item.startContent, ctx)}</ListGroup.ItemPrefix>}
            <ListGroup.ItemContent><ListGroup.ItemTitle style={font}>{resolveRenderProp(item.title, ctx)}</ListGroup.ItemTitle>
              {item.description != null && <ListGroup.ItemDescription style={font}>{resolveRenderProp(item.description, ctx)}</ListGroup.ItemDescription>}
            </ListGroup.ItemContent>
            {item.endContent != null && <ListGroup.ItemSuffix>{resolveRenderProp(item.endContent, ctx)}</ListGroup.ItemSuffix>}
            {selection ? ctx.isSelected && <ListGroup.ItemSuffix><Icon as={Check} size="sm" color="accent" /></ListGroup.ItemSuffix> : p.showChevron && <ListGroup.ItemSuffix />}
          </ListGroup.Item>
          {p.showSeparators && index < section.items.length - 1 && <Separator className="mx-4" />}
        </Fragment>;
      })}</ListGroup>
    </View>)}
  </View>;
}
