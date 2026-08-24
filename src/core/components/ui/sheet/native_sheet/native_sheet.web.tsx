import { useTrueSheet } from "@lodev09/react-native-true-sheet";
import type { TrueSheetProps } from "@lodev09/react-native-true-sheet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useAppBackgroundColors } from "../../utils/theme";

import { createTrueSheetOverlayPortalHostName } from "./true_sheet/overlay_host_name";
import { TrueSheetPanel } from "./true_sheet/panel";
import type { NativeSheetProps, NativeSheetSnapPoint } from "./types";
import { useHasOpenWebSheetAbove } from "./web_sheet_stack";

type WebSheetDetent = NonNullable<TrueSheetProps["detents"]>[number];
type WebDidDismissEvent = Parameters<NonNullable<TrueSheetProps["onDidDismiss"]>>[0];
type WebDidPresentEvent = Parameters<NonNullable<TrueSheetProps["onDidPresent"]>>[0];
type WebDetentChangeEvent = Parameters<NonNullable<TrueSheetProps["onDetentChange"]>>[0];

type WebDetentNormalization = {
  detents: WebSheetDetent[];
  sourceDetentCount: number;
  toNativeIndex: (index: number) => number;
  fromNativeIndex: (index: number) => number;
};

let nativeSheetCounter = 0;

function clampDetentIndex(index: number | undefined, detentCount: number) {
  if (detentCount <= 0 || index == null || !Number.isFinite(index)) {
    return 0;
  }

  return Math.max(0, Math.min(detentCount - 1, Math.round(index)));
}

function resolveWebSnapPoint(point: NativeSheetSnapPoint): number | null {
  if (typeof point === "number") {
    return Number.isFinite(point) ? Math.max(0.01, Math.min(1, point)) : null;
  }

  const percent = point.trim().match(/^(\d+(?:\.\d+)?)%$/);
  return percent == null
    ? null
    : Math.max(0.01, Math.min(1, Number.parseFloat(percent[1]) / 100));
}

function normalizeWebDetents(
  detents: NativeSheetProps["detents"],
  snapPoints: NativeSheetProps["snapPoints"],
): WebDetentNormalization {
  const hasDirectDetents = detents != null && detents.length > 0;
  const sourceDetents: WebSheetDetent[] =
    hasDirectDetents
      ? detents
      : snapPoints == null || snapPoints.length === 0
        ? [1]
        : snapPoints
            .map((point) => resolveWebSnapPoint(point))
            .filter((point): point is number => point != null);
  const limitedSourceDetents = sourceDetents.slice(0, 3);
  const indexedDetents = limitedSourceDetents
    .map((detent, originalIndex) => ({
      detent:
        typeof detent === "number" ? Math.max(0.01, Math.min(1, detent)) : detent,
      originalIndex,
    }));

  if (indexedDetents.length === 0) {
    return {
      detents: [1],
      sourceDetentCount: 1,
      toNativeIndex: () => 0,
      fromNativeIndex: () => 0,
    };
  }

  if (hasDirectDetents) {
    return {
      detents: indexedDetents.map((entry) => entry.detent),
      sourceDetentCount: indexedDetents.length,
      toNativeIndex: (index) => index,
      fromNativeIndex: (index) => index,
    };
  }

  const sortedDetents = [...indexedDetents].sort((left, right) => {
    if (typeof left.detent !== "number") return typeof right.detent !== "number" ? 0 : -1;
    if (typeof right.detent !== "number") return 1;
    return left.detent - right.detent;
  });
  const originalToNative = new Map<number, number>();
  const nativeToOriginal = new Map<number, number>();

  sortedDetents.forEach((entry, nativeIndex) => {
    originalToNative.set(entry.originalIndex, nativeIndex);
    nativeToOriginal.set(nativeIndex, entry.originalIndex);
  });

  return {
    detents: sortedDetents.map((entry) => entry.detent),
    sourceDetentCount: limitedSourceDetents.length,
    toNativeIndex: (index) => originalToNative.get(index) ?? 0,
    fromNativeIndex: (index) => nativeToOriginal.get(index) ?? index,
  };
}

function useControllableNativeSheetState({
  defaultOpen = false,
  defaultPosition = 0,
  onOpenChange,
  onSnapPointChange,
  open: openProp,
  position: positionProp,
}: Pick<
  NativeSheetProps,
  "defaultOpen" | "defaultPosition" | "onOpenChange" | "onSnapPointChange" | "open" | "position"
>) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [uncontrolledPosition, setUncontrolledPosition] = useState(defaultPosition);
  const open = openProp ?? uncontrolledOpen;
  const position = positionProp ?? uncontrolledPosition;

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (openProp == null) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [onOpenChange, openProp],
  );

  const setPosition = useCallback(
    (nextPosition: number) => {
      if (positionProp == null) {
        setUncontrolledPosition(nextPosition);
      }

      onSnapPointChange?.(nextPosition);
    },
    [onSnapPointChange, positionProp],
  );

  return { open, position, setOpen, setPosition };
}

export function NativeSheet({
  ...props
}: NativeSheetProps) {
  const {
    backgroundColor,
    children,
    content,
    defaultOpen,
    defaultPosition,
    detents,
    dismissOnBackPress,
    dismissOnOverlayPress = true,
    disableDrag,
    dismissible,
    draggable,
    dimmed,
    grabberContentInsetTop,
    handle,
    grabber,
    initialDetentIndex,
    modal,
    name,
    native,
    onAnimationComplete,
    onDetentChange,
    onDidDismiss,
    onDidPresent,
    onOpenChange,
    onPositionChange,
    onSnapPointChange,
    open: openProp,
    overlay,
    overlayPortalHostName,
    position: positionProp,
    snapPoints,
    transition,
    ...trueSheetProps
  } = props;
  const appBackgroundColors = useAppBackgroundColors();
  const { present, dismiss, resize } = useTrueSheet();
  const [generatedSheetName] = useState(() => `ui-sheet-web-${++nativeSheetCounter}`);
  const sheetName = name ?? generatedSheetName;
  const [generatedOverlayPortalHostName] = useState(() => `${sheetName}-overlay`);
  const resolvedOverlayPortalHostName = createTrueSheetOverlayPortalHostName(
    overlayPortalHostName ?? generatedOverlayPortalHostName,
  );
  const sheetState = useControllableNativeSheetState({
    defaultOpen,
    defaultPosition,
    onOpenChange,
    onSnapPointChange,
    open: openProp,
    position: positionProp,
  });
  const detentNormalization = useMemo(
    () => normalizeWebDetents(detents, snapPoints),
    [detents, snapPoints],
  );
  const requestedPosition = clampDetentIndex(
    sheetState.position,
    detentNormalization.sourceDetentCount,
  );
  const resolvedDetentIndex = detentNormalization.toNativeIndex(requestedPosition);
  const hasOpenSheetAbove = useHasOpenWebSheetAbove(sheetName, sheetState.open);
  const resolvedDismissible =
    (dismissible ?? dismissOnOverlayPress !== false) && !hasOpenSheetAbove;
  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (modal === false) return;

    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    if (sheetState.open) {
      void present(sheetName, resolvedDetentIndex).catch(() => undefined);
    } else {
      void dismiss(sheetName).catch(() => undefined);
    }
  }, [dismiss, modal, present, resolvedDetentIndex, sheetName, sheetState.open]);

  useEffect(() => {
    if (!sheetState.open) return;
    void resize(sheetName, resolvedDetentIndex).catch(() => undefined);
  }, [resize, resolvedDetentIndex, sheetName, sheetState.open]);

  const handleDidPresent = useCallback(
    (event: WebDidPresentEvent) => {
      onDidPresent?.(event);
      sheetState.setPosition(detentNormalization.fromNativeIndex(event.nativeEvent.index));
      onAnimationComplete?.({ open: true });
    },
    [detentNormalization, onAnimationComplete, onDidPresent, sheetState],
  );
  const handleDidDismiss = useCallback(
    (event: WebDidDismissEvent) => {
      onDidDismiss?.(event);
      sheetState.setOpen(false);
      onAnimationComplete?.({ open: false });
    },
    [onAnimationComplete, onDidDismiss, sheetState],
  );
  const handleDetentChange = useCallback(
    (event: WebDetentChangeEvent) => {
      onDetentChange?.(event);
      sheetState.setPosition(detentNormalization.fromNativeIndex(event.nativeEvent.index));
    },
    [detentNormalization, onDetentChange, sheetState],
  );

  if (modal === false) return null;

  const resolvedBackgroundColor = backgroundColor ?? appBackgroundColors.sheet;

  return (
    <TrueSheetPanel
      backgroundColor={resolvedBackgroundColor}
      grabber={grabber ?? handle ?? false}
      grabberContentInsetTop={grabberContentInsetTop}
      name={sheetName}
      onRequestClose={() => sheetState.setOpen(false)}
      overlayPortalHostName={resolvedOverlayPortalHostName}
      sheetProps={{
        ...trueSheetProps,
        detents: detentNormalization.detents,
        dimmed: dimmed ?? overlay ?? true,
        dismissible: resolvedDismissible,
        draggable: draggable ?? disableDrag !== true,
        grabber: grabber ?? handle ?? false,
        initialDetentIndex: initialDetentIndex ?? (sheetState.open ? resolvedDetentIndex : -1),
        onDetentChange: handleDetentChange,
        onPositionChange,
        onDidDismiss: handleDidDismiss,
        onDidPresent: handleDidPresent,
      }}
    >
      {content ?? children}
    </TrueSheetPanel>
  );
}
