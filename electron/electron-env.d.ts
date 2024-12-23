export interface MainApi {
  updateHeight: (height: number) => void;
}

declare global {
  interface Window {
    main: MainApi;
  }
}

export { }
