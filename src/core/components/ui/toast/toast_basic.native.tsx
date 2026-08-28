import { toast as SonnerNativeToast, Toaster as SonnerNativeToaster } from "sonner-native";
import type { ReactElement } from "react";
import * as React from "react";
import { View } from "react-native";
import { triggerNativeHaptics } from "../utils/haptics";
import type { ToastNativeToasterProps, ToastShowOptions, TitleToast } from "./types";
import {
  configureBasicToastRuntime,
  getBasicOptions,
  getBasicToastRuntimeConfig,
  getToastId,
  getToastMessageText,
  resolveToastText,
} from "./toast_basic_shared";
import type { BasicToastKind } from "./toast_basic_shared";

let toastId = 0;

function callToast(kind: BasicToastKind, title: TitleToast, options?: ToastShowOptions) {
  const titleText = resolveToastText(title);
  if (titleText == null) return getToastId(options?.id, () => ++toastId);
  const data = {
    ...getBasicOptions(options),
    ...options?.sonnerNativeOptions,
    id: options?.id,
    description: getToastMessageText(options),
    toasterId: options?.toasterId ?? options?.viewportName,
    ...(kind === "loading" ? { dismissible: options?.dismissible ?? false } : {}),
  };
  if (kind === "default") return SonnerNativeToast(titleText, data);
  const id = SonnerNativeToast[kind](titleText, data);
  if (kind === "success" || kind === "warning" || kind === "error") {
    triggerNativeHaptics(
      options?.haptics ??
        options?.basicHaptics ??
        getBasicToastRuntimeConfig().haptics ??
        getBasicToastRuntimeConfig().basicHaptics,
    );
  }
  return id;
}
export function showBasicToast(title: TitleToast, kind: BasicToastKind, options?: ToastShowOptions) { return callToast(kind, title, options); }
export function showBasicCustom(jsx: (id: string | number) => ReactElement, options?: ToastShowOptions) {
  const requestedId = options?.id;
  const id =
    requestedId == null || (typeof requestedId === "string" && requestedId.length === 0)
      ? `toast-${++toastId}`
      : requestedId;
  const viewProps = options?.customToastViewProps ?? getBasicToastRuntimeConfig().customToastViewProps;
  return SonnerNativeToast.custom(
    <View
      {...viewProps}
      style={[{ width: "100%", paddingHorizontal: 16 }, viewProps?.style]}
    >
      {jsx(id)}
    </View>,
    {
    ...getBasicOptions(options),
    ...options?.sonnerNativeOptions,
    id,
    toasterId: options?.toasterId ?? options?.viewportName,
    },
  );
}
export function dismissBasicToast(id?: string | number): void { SonnerNativeToast.dismiss(id); }
export function dismissAllBasicToasts(): void { SonnerNativeToast.dismiss(); }
export function BasicToaster({
  accentThemeName: _accentThemeName,
  viewportName,
  offset,
  basicHaptics,
  haptics,
  customToastViewProps,
  sonnerNativeProps,
  sonnerProps: _sonnerProps,
  closeButton,
  closeButtonIcon: _closeButtonIcon,
  closeButtonClassName: _closeButtonClassName,
  ...props
}: ToastNativeToasterProps) {
  React.useEffect(() => {
    const runtimeConfig = {
      ...(basicHaptics !== undefined
        ? { basicHaptics, ...(haptics === undefined ? { haptics: basicHaptics } : {}) }
        : {}),
      ...(haptics !== undefined ? { haptics, basicHaptics: haptics } : {}),
      ...(customToastViewProps !== undefined ? { customToastViewProps } : {}),
    };
    if (Object.keys(runtimeConfig).length > 0) {
      configureBasicToastRuntime(runtimeConfig);
    }
  }, [basicHaptics, haptics, customToastViewProps]);
  const toastOptions = {
    ...sonnerNativeProps?.toastOptions,
    toastContentStyle: {
      alignItems: "center" as const,
      ...sonnerNativeProps?.toastOptions?.toastContentStyle,
    },
  };
  return (
    <SonnerNativeToaster
      position="bottom-center"
      duration={5000}
      visibleToasts={4}
      {...sonnerNativeProps}
      {...props}
      id={viewportName}
      closeButton={closeButton ?? sonnerNativeProps?.closeButton}
      offset={offset ?? sonnerNativeProps?.offset ?? 40}
      toastOptions={toastOptions}
    />
  );
}
