import type Store from 'electron-store'
import type { configApi, llmApi, mainApi } from './preload'

export interface UserConfig {
  kaomoji: {
    databaseId: string;
    token: string;
  };
}

export type ConfigStore = Store<{ config: UserConfig }>

declare global {
  interface Window {
    main: typeof mainApi;
    config: typeof configApi;
    llm: typeof llmApi;
  }
}

export { }
