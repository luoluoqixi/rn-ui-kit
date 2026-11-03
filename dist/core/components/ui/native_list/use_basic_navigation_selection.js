import { NavigationContext } from "@react-navigation/native";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createBasicNavigationSelection, } from "./basic_navigation_selection";
export const BasicNavigationSelectionContext = createContext(undefined);
export function useBasicNavigationSelection(enabled, onPress, options) {
    const navigation = useContext(NavigationContext);
    const group = useContext(BasicNavigationSelectionContext);
    const [selected, setSelected] = useState(false);
    const selection = useMemo(() => createBasicNavigationSelection(navigation, setSelected), [navigation]);
    useEffect(() => {
        if (!enabled)
            selection.clear();
        return () => {
            selection.clear();
            if (group?.current === selection)
                group.current = undefined;
        };
    }, [enabled, group, selection]);
    return {
        selected: enabled && selected,
        onPress: !enabled || onPress == null
            ? onPress
            : () => {
                // Rapid taps on different rows must leave only the latest row highlighted.
                group?.current?.clear();
                if (group != null)
                    group.current = selection;
                const controls = selection.select(options);
                try {
                    onPress(controls);
                }
                catch (error) {
                    controls.cancel();
                    throw error;
                }
            },
    };
}
