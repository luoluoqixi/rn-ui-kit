import { useControllableState } from "@tamagui/use-controllable-state";
import { useSheetController } from "./useSheetController";
export const useSheetOpenState = (props) => {
    const { isHidden, controller } = useSheetController();
    const onOpenChangeInternal = (val) => {
        controller?.onOpenChange?.(val);
        props.onOpenChange?.(val);
    };
    const propVal = props.preferAdaptParentOpenState
        ? (controller?.open ?? props.open)
        : (props.open ?? controller?.open);
    const [open, setOpen] = useControllableState({
        prop: propVal,
        defaultProp: props.defaultOpen ?? false,
        onChange: onOpenChangeInternal,
        strategy: "most-recent-wins",
    });
    return {
        open,
        setOpen,
        isHidden,
        controller,
    };
};
