type ToastPortalHost = {
  hostName: string;
  parentHostName: string | null;
};

const hosts: ToastPortalHost[] = [];

/** Register only visible Android windows; the last entry receives unaddressed toasts. */
export function registerAndroidToastPortalHost(hostName: string, parentHostName: string | null) {
  const entry = { hostName, parentHostName };
  // React runs child effects first when nested windows mount together. Insert
  // their parent below them rather than letting the parent's effect cover them.
  const childIndex = hosts.findIndex((host) => host.parentHostName === hostName);
  hosts.splice(childIndex < 0 ? hosts.length : childIndex, 0, entry);

  return () => {
    const index = hosts.indexOf(entry);
    if (index >= 0) hosts.splice(index, 1);
  };
}

export function getAndroidToastPortalHost(): string | undefined {
  return hosts[hosts.length - 1]?.hostName;
}
