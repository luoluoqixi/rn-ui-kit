import { useTrueSheet } from "@lodev09/react-native-true-sheet";
import { useEffect, useRef } from "react";
import { createWebSheetCommandQueue } from "./sheet_command_queue";
export function useWebSheetCommands(name, open, index, enabled = true, initialDetentIndex) {
    const { present, dismiss, resize } = useTrueSheet();
    const methods = useRef({ present, dismiss, resize, name });
    methods.current = { present, dismiss, resize, name };
    const initialIndex = useRef(enabled && open ? (initialDetentIndex ?? index) : -1).current;
    const queue = useRef(null);
    if (queue.current == null)
        queue.current = createWebSheetCommandQueue({
            present: (i) => methods.current.present(methods.current.name, i),
            dismiss: () => methods.current.dismiss(methods.current.name),
            resize: (i) => methods.current.resize(methods.current.name, i),
        }, initialIndex >= 0, Math.max(0, initialIndex));
    useEffect(() => {
        // React StrictMode replays effect setup/cleanup on the same mounted queue.
        queue.current?.activate();
        return () => queue.current?.dispose();
    }, []);
    useEffect(() => { queue.current?.update(enabled && open, index); }, [enabled, open, index]);
    return { initialIndex, queue: queue.current };
}
