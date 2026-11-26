/** Register only visible Android windows; the last entry receives unaddressed toasts. */
export declare function registerAndroidToastPortalHost(hostName: string, parentHostName: string | null): () => void;
export declare function getAndroidToastPortalHost(): string | undefined;
