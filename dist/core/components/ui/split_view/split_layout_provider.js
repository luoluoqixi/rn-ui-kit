import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { readSplitLayoutState, writeSplitLayoutState } from "./storage";
const SplitLayoutStorageContext = createContext(null);
const resolveNextState = (updater, prev) => {
    return typeof updater === "function"
        ? updater(prev)
        : updater;
};
const createReadyEntry = (state) => ({
    ready: true,
    state,
});
const areArraysEqual = (left, right) => {
    if (left === right)
        return true;
    if (!left || !right)
        return !left && !right;
    if (left.length !== right.length)
        return false;
    for (let index = 0; index < left.length; index++) {
        if (left[index] !== right[index])
            return false;
    }
    return true;
};
const isSplitLayoutStateEqual = (left, right) => {
    if (left === right)
        return true;
    if (!left || !right)
        return !left && !right;
    return areArraysEqual(left.sizes, right.sizes) && areArraysEqual(left.visible, right.visible);
};
export function SplitLayoutProvider({ children, fallbackState, storageAdapter, storageKey, }) {
    const hasStorage = storageAdapter != null && storageKey != null;
    const [entry, setEntry] = useState(() => hasStorage ? { ready: false, state: fallbackState } : createReadyEntry(fallbackState));
    const entryRef = useRef(entry);
    useEffect(() => {
        entryRef.current = entry;
    }, [entry]);
    useEffect(() => {
        if (!hasStorage) {
            setEntry(createReadyEntry(fallbackState));
            return;
        }
        let cancelled = false;
        setEntry({ ready: false, state: fallbackState });
        void readSplitLayoutState(storageAdapter, storageKey).then((state) => {
            if (cancelled)
                return;
            setEntry(createReadyEntry(state ?? fallbackState));
        });
        return () => {
            cancelled = true;
        };
    }, [fallbackState, hasStorage, storageAdapter, storageKey]);
    const setState = useCallback((updater) => {
        if (!hasStorage)
            return;
        const prevEntry = entryRef.current;
        const nextState = resolveNextState(updater, prevEntry.state ?? fallbackState);
        if (isSplitLayoutStateEqual(prevEntry.state, nextState) && prevEntry.ready) {
            return;
        }
        const nextEntry = createReadyEntry(nextState);
        entryRef.current = nextEntry;
        setEntry(nextEntry);
        void writeSplitLayoutState(storageAdapter, storageKey, nextState);
    }, [fallbackState, hasStorage, storageAdapter, storageKey]);
    return (_jsx(SplitLayoutStorageContext.Provider, { value: {
            ready: !hasStorage || entry.ready,
            state: entry.state ?? fallbackState,
            storageAdapter,
            storageKey,
            setState,
        }, children: children }));
}
export function useSplitLayoutStorage(storageKey, fallbackState, storageAdapter) {
    const context = useContext(SplitLayoutStorageContext);
    const useContextStorage = storageKey == null && storageAdapter == null && context != null;
    const resolvedStorageKey = storageKey ?? context?.storageKey;
    const resolvedStorageAdapter = storageAdapter ?? context?.storageAdapter;
    const hasStorage = resolvedStorageAdapter != null && resolvedStorageKey != null;
    const [fallbackEntry, setFallbackEntry] = useState(() => createReadyEntry(fallbackState));
    const fallbackEntryRef = useRef(fallbackEntry);
    useEffect(() => {
        fallbackEntryRef.current = fallbackEntry;
    }, [fallbackEntry]);
    useEffect(() => {
        if (useContextStorage) {
            return;
        }
        if (!hasStorage) {
            setFallbackEntry(createReadyEntry(fallbackState));
            return;
        }
        let cancelled = false;
        setFallbackEntry({ ready: false, state: fallbackState });
        void readSplitLayoutState(resolvedStorageAdapter, resolvedStorageKey).then((state) => {
            if (cancelled)
                return;
            setFallbackEntry(createReadyEntry(state ?? fallbackState));
        });
        return () => {
            cancelled = true;
        };
    }, [
        fallbackState,
        hasStorage,
        resolvedStorageAdapter,
        resolvedStorageKey,
        useContextStorage,
    ]);
    const entry = useContextStorage ? createReadyEntry(context.state) : fallbackEntry;
    const setState = useCallback((updater) => {
        if (useContextStorage) {
            context.setState(updater);
            return;
        }
        if (!hasStorage)
            return;
        const prevEntry = fallbackEntryRef.current;
        const nextState = resolveNextState(updater, prevEntry.state ?? fallbackState);
        if (isSplitLayoutStateEqual(prevEntry.state, nextState) && prevEntry.ready) {
            return;
        }
        const nextEntry = createReadyEntry(nextState);
        fallbackEntryRef.current = nextEntry;
        setFallbackEntry(nextEntry);
        void writeSplitLayoutState(resolvedStorageAdapter, resolvedStorageKey, nextState);
    }, [
        context,
        fallbackState,
        hasStorage,
        resolvedStorageAdapter,
        resolvedStorageKey,
        useContextStorage,
    ]);
    return {
        ready: !hasStorage || (useContextStorage ? context.ready : entry.ready),
        state: entry.state ?? fallbackState,
        setState,
    };
}
