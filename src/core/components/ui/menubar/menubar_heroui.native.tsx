import { View } from "react-native";
import { Menu } from "heroui-native/menu";
import { Button } from "../button";
import { MenuSurface } from "../menu/menu_heroui.native";
import { HeroUIWindowAnchor } from "../utils/overlay/heroui_anchor.native";
import { resolveRenderProp } from "../utils/render";
import { cn } from "../utils/cn";
import { useMenubarModel } from "./menubar_heroui_shared";
import type { MenubarProps } from "./types";

export function MenubarHeroUI(p: MenubarProps) {
  const m = useMenubarModel(p);
  return <View style={p.style} className={cn("flex-row self-start items-center gap-1 rounded-4xl bg-default p-1", p.className)} accessibilityLabel={p.accessibilityLabel ?? "菜单栏"} testID={p.testID}>
    {p.items.map(item => {
      const open = m.value === item.value;
      const disabled = !m.enabled.includes(item);
      return <Menu key={item.value} isOpen={open} onOpenChange={next => m.change(item, next)} isDisabled={disabled}>
        <Menu.Trigger asChild><HeroUIWindowAnchor isOpen={open}>
          <Button {...item.triggerProps} native={false} nativeHaptics={false} size={item.triggerProps?.size ?? p.size ?? "sm"}
            variant={item.triggerProps?.variant ?? "ghost"}
            className={cn(item.triggerProps?.variant == null && open && "bg-segment", item.triggerProps?.className)}
            textClassName={cn(item.triggerProps?.variant == null && open && "text-segment-foreground", item.triggerProps?.textClassName)} isDisabled={disabled}>
            {resolveRenderProp(item.title, { value: item.value, open, disabled })}
          </Button>
        </HeroUIWindowAnchor></Menu.Trigger>
        <MenuSurface items={m.entries(item)} contentProps={{ align: "start", ...p.contentProps, ...item.contentProps }} accessibilityLabel={item.value} />
      </Menu>;
    })}
  </View>;
}
