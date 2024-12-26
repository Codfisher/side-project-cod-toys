export interface MainApi {
  updateHeight: (height: number) => void;
  hideWindow: () => void;
  openExternal: (url: string) => void;
}

export interface Config {
  kaomoji: {
    url: string;
    token: string;
  };
}
export interface ConfigApi {
  get: () => Promise<Config>;
  update: (data: Partial<Config>) => Promise<void>;
  onUpdate: (callback: (config: Config) => void) => void;
}

declare global {
  interface Window {
    main: MainApi;
    config: ConfigApi;
  }
}

export { }
