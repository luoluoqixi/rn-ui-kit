import * as React from "react";
import * as Sonner from "sonner";
import type { ReactElement } from "react";
import { CheckCircle2, CircleX, Info, TriangleAlert, X } from "lucide-react-native";
import { View } from "react-native";
import type { ToastNativeToasterProps, ToastShowOptions, TitleToast } from "./types";
import {
  configureBasicToastRuntime,
  getBasicOptions,
  getBasicToastRuntimeConfig,
  getToastId,
  getToastMessage,
  resolveToastContent,
} from "./toast_basic_shared";
import type { BasicToastKind } from "./toast_basic_shared";
import { useUiColorScheme, useUiTheme } from "../utils/theme";

let toastId = 0;
const CLOSE_BUTTON_CLASS = "rn-ui-kit-toast-close-button";
function callToast(kind: BasicToastKind, title: TitleToast, options?: ToastShowOptions) {
  const titleContent = resolveToastContent(title);
  if (titleContent == null) return getToastId(options?.id, () => ++toastId);
  const data = {
    ...getBasicOptions(options),
    ...options?.sonnerOptions,
    id: options?.id,
    description: getToastMessage(options),
    toasterId: options?.toasterId ?? options?.viewportName,
    ...(kind === "loading" ? { dismissible: options?.dismissible ?? false } : {}),
  };
  if (kind === "default") return Sonner.toast(titleContent, data);
  return Sonner.toast[kind](titleContent, data);
}
export function showBasicToast(
  title: TitleToast,
  kind: BasicToastKind,
  options?: ToastShowOptions,
) {
  return callToast(kind, title, options);
}
export function showBasicCustom(
  jsx: (id: string | number) => ReactElement,
  options?: ToastShowOptions,
) {
  const requestedId = options?.id;
  const id =
    requestedId == null || (typeof requestedId === "string" && requestedId.length === 0)
      ? `toast-${++toastId}`
      : requestedId;
  const viewProps =
    options?.customToastViewProps ?? getBasicToastRuntimeConfig().customToastViewProps;
  return Sonner.toast.custom(
    (toastId) => (
      <View {...viewProps} style={[{ width: "100%", paddingHorizontal: 16 }, viewProps?.style]}>
        {jsx(toastId)}
      </View>
    ),
    {
      ...getBasicOptions(options),
      ...options?.sonnerOptions,
      id,
      toasterId: options?.toasterId ?? options?.viewportName,
    },
  );
}
export function dismissBasicToast(id?: string | number): void {
  Sonner.toast.dismiss(id);
}
export function dismissAllBasicToasts(): void {
  Sonner.toast.dismiss();
}
export function BasicToaster({
  accentThemeName: _accentThemeName,
  viewportName,
  offset,
  basicHaptics,
  haptics,
  customToastViewProps,
  closeButton,
  closeButtonIcon,
  closeButtonClassName,
  sonnerProps,
  sonnerNativeProps: _sonnerNativeProps,
  ...props
}: ToastNativeToasterProps) {
  const colorScheme = useUiColorScheme();
  const theme = useUiTheme();
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
    ...sonnerProps?.toastOptions,
    classNames: {
      ...sonnerProps?.toastOptions?.classNames,
      closeButton: [
        CLOSE_BUTTON_CLASS,
        sonnerProps?.toastOptions?.classNames?.closeButton,
        closeButtonClassName,
      ]
        .filter(Boolean)
        .join(" "),
    },
  };
  const icons = {
    success: <CheckCircle2 size={18} color="#16a34a" />,
    info: <Info size={18} color="#2563eb" />,
    warning: <TriangleAlert size={18} color="#d97706" />,
    error: <CircleX size={18} color="#dc2626" />,
    close: closeButtonIcon ?? <X size={15} color="currentColor" />,
    ...sonnerProps?.icons,
  };
  const style = {
    "--toast-close-button-start": "unset",
    "--toast-close-button-end": "16px",
    "--toast-close-button-transform": "translate(0, -50%)",
    // A named toaster is mounted inside a TrueSheet. Sonner's fixed position
    // otherwise uses the transformed sheet wrapper (which can be taller than
    // the visible sheet) as its containing block and places the stack below
    // the viewport. Keep an explicit user position untouched.
    ...(viewportName != null && sonnerProps?.style?.position == null
      ? { position: "absolute" as const }
      : {}),
    ...sonnerProps?.style,
  } as React.CSSProperties;
  return (
    <>
      <Sonner.Toaster
        position={viewportName == null ? "bottom-right" : "bottom-center"}
        duration={5000}
        visibleToasts={4}
        theme={colorScheme}
        {...sonnerProps}
        {...props}
        id={viewportName}
        offset={offset ?? sonnerProps?.offset ?? 24}
        closeButton={closeButton ?? sonnerProps?.closeButton ?? true}
        icons={icons}
        style={style}
        toastOptions={toastOptions}
      />
      <style>{`
        [data-sonner-toast][data-styled="true"] {
          background-color: ${theme.background};
        }
        [data-sonner-toast][data-styled="true"] .${CLOSE_BUTTON_CLASS} {
          top: 50% !important;
          left: auto !important;
          right: 16px !important;
          transform: translate(0, -50%) !important;
        }
      `}</style>
    </>
  );
}
