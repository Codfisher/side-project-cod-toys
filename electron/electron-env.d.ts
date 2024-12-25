export interface MainApi {
  updateHeight: (height: number) => void;
  hideWindow: () => void;
  openExternal: (url: string) => void;
}

declare global {
  interface Window {
    main: MainApi;
  }
}

export { }
