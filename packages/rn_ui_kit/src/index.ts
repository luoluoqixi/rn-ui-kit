// rn_ui_kit 源码会读取 Metro 提供的 `process.env`；显式加载 Expo 的全局声明，
// 避免消费者的源码级 typecheck 偶然依赖某个组件的导入顺序。
import type {} from "expo-modules-core";
import type {} from "./types/tamagui";

export * from "./components/ui";
