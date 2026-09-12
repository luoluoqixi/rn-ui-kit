import type { ColorValue, Insets } from "react-native";

export type ScrollTrackStyling = {
  /** Corner radius for the thumb. Default: 4. */
  thumbBorderRadius?: number;
  thumbColor?: ColorValue;
  /** Thumb color while the pointer hovers over the scroll track on web. */
  thumbHoverColor?: ColorValue;
  thumbHeight?: number;
  minThumbHeight?: number;
  thumbOpacity?: number;
  /** Thumb color while the track is pressed or dragged. */
  thumbPressedColor?: ColorValue;
  thumbShadow?: {
    color?: ColorValue;
    /** Android elevation used to render the shadow. Default: 0. */
    elevation?: number;
    offset?: { height: number; width: number };
    opacity?: number;
    radius?: number;
  };
  /** Corner radius for the optional visible track. Default: 4. */
  trackBorderRadius?: number;
  trackColor?: ColorValue;
  /** Track color while the pointer hovers over it on web. */
  trackHoverColor?: ColorValue;
  trackOpacity?: number;
  /** Track color while it is pressed or dragged. */
  trackPressedColor?: ColorValue;
  trackVisible?: boolean;
  trackWidth?: number;
  zIndex?: number;
};

/** Options for ScrollView's custom, draggable scroll track. */
export type ScrollTrackOptions = {
  /** Keep the custom scrollbar visible. Defaults to false, which fades it after interaction. */
  alwaysVisible?: boolean;
  /** Disables tapping and dragging while retaining the visual indicator. */
  disableGestures?: boolean;
  /** Delay before the custom scrollbar fades out, in milliseconds. Default: 1000. */
  fadeOutDelay?: number;
  /** Expands the track's touch target, in pixels. Default: 22. */
  hitSlop?: number;
  /**
   * Insets applied to the custom scrollbar tracks and their drag targets.
   * They do not affect the ScrollView content or its scrollable range.
   *
   * `top` and `bottom` bound the vertical track; `left` and `right` bound
   * the horizontal track. `right` and `bottom` also keep the respective
   * tracks away from those edges, mirroring iOS scrollIndicatorInsets.
   */
  insets?: Partial<Insets>;
  /** Minimum scroll distance before the indicator is shown. Default: 20. */
  minScrollDistanceToShow?: number;
  onDragEnd?: () => void;
  onDragStart?: () => void;
  onPressEnd?: () => void;
  onPressStart?: () => void;
  styling?: ScrollTrackStyling;
};
