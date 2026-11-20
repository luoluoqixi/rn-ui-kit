export declare function assertHeroUIPlatform(moduleName: string, platform: string | null): void;
export declare function withHeroUIConfig<T extends { projectRoot?: string }>(
  config: T,
  options: {
    cssEntryFile: string;
    nativeCssEntryFile: string;
    dtsFile?: string;
    extraThemes?: string[];
  },
): T;
