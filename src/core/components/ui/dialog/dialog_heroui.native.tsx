import { Dialog as HeroDialog } from "heroui-native/dialog";
import { View } from "react-native";
import { CloseButton } from "../close_button";
import { Text } from "../text";
import { useDefaultTextStyle } from "../provider/font_provider";
import { cn } from "../utils/cn";
import { DialogActions, useDialogModel, type DialogAdapterProps } from "./dialog_shared";
import { OverlayPortalWindow } from "../utils/overlay/overlay_portal";

export function DialogHeroUI(p: DialogAdapterProps) {
  const m = useDialogModel(p);
  const back = p.dismissOnBackPress ?? !p.isAlert;
  const overlay = p.dismissOnOverlayPress ?? !p.isAlert;
  const titleStyle = useDefaultTextStyle(p.titleProps?.style, p.titleClassName);
  const descriptionStyle = useDefaultTextStyle(p.descriptionProps?.style, p.descriptionClassName);
  return <HeroDialog {...p.herouiNativeProps} isOpen={m.open}
    onOpenChange={next => { if (next || back) m.setOpen(next); }}>
    {m.trigger && <HeroDialog.Trigger asChild>{m.trigger}</HeroDialog.Trigger>}
    {/* A window overlay is always above future sheets. A native Modal can
        present a child TrueSheet and retains the caller's React contexts. */}
    {m.open && <OverlayPortalWindow forceFullScreen onRequestClose={() => { if (back) m.close(); }}>
      <View pointerEvents="box-none" className={cn("absolute inset-0 justify-center", p.portalProps?.className)} style={p.portalProps?.style}>
      <HeroDialog.Overlay {...p.overlayProps?.herouiNativeProps} className={p.overlayProps?.className}
        isCloseOnPress={false} onPress={() => { if (overlay) m.close(); }} />
      <HeroDialog.Content {...p.contentProps?.herouiNativeProps}
        isSwipeable={back && !p.isAlert && p.contentProps?.herouiNativeProps?.isSwipeable !== false}
        accessibilityLabel={p.accessibilityLabel} accessibilityRole={p.isAlert ? "alert" : undefined} accessibilityViewIsModal
        className={cn("mx-4 gap-4", p.contentClassName, p.contentProps?.className)}>
        {(p.showCloseButton ?? !p.isAlert) && <CloseButton className="absolute right-3 top-3 z-10" onPress={m.close} />}
        {(m.title != null || m.description != null) && <View className={cn("gap-2", p.headerClassName)}>
          {m.title != null && <HeroDialog.Title {...p.titleProps} className={p.titleClassName} style={titleStyle}>{m.title}</HeroDialog.Title>}
          {m.description != null && <HeroDialog.Description {...p.descriptionProps} className={p.descriptionClassName} style={descriptionStyle}>{m.description}</HeroDialog.Description>}
        </View>}
        {typeof m.content === "string" || typeof m.content === "number" ? <Text>{m.content}</Text> : m.content}
        {(p.actions != null || p.cancelLabel != null || p.actionLabel != null || p.destructiveLabel != null) &&
          <View className={cn("flex-row flex-wrap justify-end gap-2", p.footerClassName)}><DialogActions props={p} model={m} /></View>}
      </HeroDialog.Content>
      </View>
    </OverlayPortalWindow>}
  </HeroDialog>;
}
