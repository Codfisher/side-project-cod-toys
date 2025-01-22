import type { configApi, llmApi, mainApi } from './preload'

export interface UserConfig {
  kaomoji: {
    databaseId: string;
    token: string;
  };
}

declare global {
  interface Window {
    main: typeof mainApi;
    config: typeof configApi;
    llm: typeof llmApi;
  }
}

export { }
