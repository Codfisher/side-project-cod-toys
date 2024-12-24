export interface MainApi {
  updateHeight: (height: number) => void;
  hideWindow: () => void;
}

declare global {
  interface Window {
    main: MainApi;
  }
}

export { }
