import type { ReactElement, ReactNode } from "react";
import type { ViewProps } from "react-native";
import type {
  AlertOptions as BurntAlertOptions,
  ToastOptions as BurntToastOptions,
  IconParams,
} from "burnt/build/types";
import type {
  ExternalToast as SonnerExternalToast,
  ToasterProps as SonnerToasterProps,
} from "sonner";
import type {
  ToastProps as SonnerNativeToastProps,
  ToasterProps as SonnerNativeToasterProps,
} from "sonner-native";
import type { RenderProp } from "../utils/render";
import type { NativeHapticsSetting } from "../utils/haptics";
import type { IconProps } from "../icon";

export type ToastCustomViewProps = Omit<ViewProps, "children">;

export type TitleToast = RenderProp<undefined>;
export type BurntToastAdvancedOptions = Partial<Omit<BurntToastOptions, "title" | "message">>;
export type BurntAlertAdvancedOptions = Partial<Omit<BurntAlertOptions, "title" | "message">>;
export type SonnerAdvancedOptions = Partial<SonnerExternalToast>;
export type SonnerNativeAdvancedOptions = Partial<
  Omit<SonnerNativeToastProps, "id" | "title" | "index" | "numberOfToasts" | "orderedToastIds">
>;

/** Shared options. `duration` is milliseconds; the native Burnt adapter converts it to seconds. */
export type ToastShowOptions = {
  message?: TitleToast;
  description?: TitleToast;
  duration?: number;
  id?: string | number;
  native?: boolean;
  variant?: string;
  viewportName?: string | "default";
  toasterId?: string;
  preset?: "done" | "error" | "none" | "custom";
  haptic?: "success" | "warning" | "error" | "none";
  shouldDismissByDrag?: boolean;
  shouldDismissByTap?: boolean;
  from?: "top" | "bottom";
  layout?: { iconSize?: { width: number; height: number } };
  icon?: IconParams | RenderProp<undefined>;
  /** Whether a basic loading toast can be dismissed by the user. Defaults to false for loading. */
  dismissible?: boolean;
  /** Haptic setting for basic Sonner toasts on native platforms. */
  basicHaptics?: NativeHapticsSetting;
  /** Unified haptic setting for basic and Burnt native toasts. Defaults to true. */
  haptics?: NativeHapticsSetting;
  customToastViewProps?: ToastCustomViewProps;
  closeButton?: boolean;
  action?: RenderProp<undefined>;
  cancel?: RenderProp<undefined>;
  jsx?: RenderProp<undefined>;
  sonnerOptions?: SonnerAdvancedOptions;
  sonnerNativeOptions?: SonnerNativeAdvancedOptions;
  burntOptions?: BurntToastAdvancedOptions | BurntAlertAdvancedOptions;
};

export type ToastPromiseContent<ToastData = unknown> =
  | RenderProp<ToastData | unknown>
  | ((data: ToastData | unknown) => Promise<ReactNode>);
export type ToastPromiseData<ToastData = unknown> = {
  description?: ToastPromiseContent<ToastData>;
  error?: ToastPromiseContent<unknown>;
  finally?: () => void | Promise<void>;
  loading?: RenderProp<undefined>;
  native?: boolean;
  success?: ToastPromiseContent<ToastData>;
};

export type ToastPromise<ToastData> = PromiseLike<ToastData> | (() => PromiseLike<ToastData>);
export type ToastFunc = (title: TitleToast, options?: ToastShowOptions) => string | number;
export type ToastVariantFunc = ToastFunc;
export type ToastCustomFunc = (
  jsx: (id: string | number) => ReactElement,
  data?: ToastShowOptions,
) => string | number;
export type ToastPromiseFunc = <ToastData>(
  promise: ToastPromise<ToastData>,
  data?: ToastPromiseData<ToastData>,
) => { unwrap: () => Promise<ToastData> };

export interface ToastInterface {
  message: ToastVariantFunc;
  info: ToastVariantFunc;
  success: ToastVariantFunc;
  error: ToastVariantFunc;
  warning: ToastVariantFunc;
  loading: ToastVariantFunc;
  custom: ToastCustomFunc;
  promise: ToastPromiseFunc;
  close: (id: string | number) => void;
  closeAll: () => void;
}

export interface ToastContext {
  toast: ToastFunc & ToastInterface;
}

export type ToastNativeToasterProps = {
  accentThemeName?: string;
  viewportName?: string;
  offset?: number;
  /** Size of status icons rendered by the non-native Toast adapter. */
  iconSize?: IconProps["size"];
  /** Defaults to true for basic success/warning/error toasts on native platforms. */
  basicHaptics?: NativeHapticsSetting;
  /** Defaults to true for success/warning/error toasts on native platforms. */
  haptics?: NativeHapticsSetting;
  /** Props for the View wrapping basic custom JSX. `style` can override its defaults. */
  customToastViewProps?: ToastCustomViewProps;
  /** Web only. Defaults to true for non-loading, non-custom toasts. */
  closeButton?: boolean;
  /** Web only. Replaces the default close icon. */
  closeButtonIcon?: ReactNode;
  /** Web only. CSS class applied to the close button. */
  closeButtonClassName?: string;
  sonnerProps?: Partial<SonnerToasterProps>;
  sonnerNativeProps?: Partial<SonnerNativeToasterProps>;
};
