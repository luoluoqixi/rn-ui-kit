import type { ViewProps } from "react-native";
import Animated, { LinearTransition, ReduceMotion } from "react-native-reanimated";

// Match HeroUI Native 1.1.1 Accordion's default layout spring. The accordion
// animates its own items; this parent moves the label and demo together when
// an earlier section expands or collapses on our continuous example page.
const sectionLayout = LinearTransition.springify()
  .damping(140)
  .stiffness(1600)
  .mass(4)
  .reduceMotion(ReduceMotion.System);

export function ExampleSectionView(props: ViewProps) {
  return <Animated.View {...props} collapsable={false} layout={sectionLayout} />;
}
