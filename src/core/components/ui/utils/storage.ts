export type UiStorageAdapter = {
  getItem: (key: string) => Promise<unknown> | unknown;
  save?: () => Promise<void> | void;
  setItem: (key: string, value: unknown) => Promise<void> | void;
};
