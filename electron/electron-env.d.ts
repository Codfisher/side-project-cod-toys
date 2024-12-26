export interface MainApi {
  updateHeight: (height: number) => void;
  hideWindow: () => void;
  openExternal: (url: string) => void;
}

export interface UserConfig {
  kaomoji: {
    databaseId: string;
    token: string;
  };
}
export interface ConfigApi {
  get: () => Promise<UserConfig>;
  update: (data: Partial<UserConfig>) => Promise<void>;
  onUpdate: (callback: (config: UserConfig) => void) => void;
}

declare global {
  interface Window {
    main: MainApi;
    config: ConfigApi;
  }
}

export { }
