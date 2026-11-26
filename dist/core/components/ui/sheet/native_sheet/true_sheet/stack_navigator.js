import { Platform } from "react-native";
/** True Sheet 内：iOS 用 Native Stack；Android Sheet 子树无法用 react-native-screens。 */
export const trueSheetUsesNativeStackNavigator = Platform.OS === "ios";
