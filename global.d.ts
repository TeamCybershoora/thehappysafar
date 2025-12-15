declare module "*.css";

declare module "lenis" {
  export interface LenisOptions {
    duration?: number;
    smoothWheel?: boolean;
    smoothTouch?: boolean;
    direction?: "vertical" | "horizontal";
    gestureDirection?: "vertical" | "horizontal";
    lerp?: number;
    wheelMultiplier?: number;
    touchMultiplier?: number;
    infinite?: boolean;
  }

  export interface ScrollToOptions {
    offset?: number;
    immediate?: boolean;
    lock?: boolean;
    duration?: number;
    easing?: (t: number) => number;
  }

  export default class Lenis {
    constructor(options?: LenisOptions);
    raf(time: number): void;
    scrollTo(target: HTMLElement | string | number, options?: ScrollToOptions): void;
    destroy(): void;
  }
}

declare global {
  interface Window {
    lenis?: import("lenis").default;
  }
}

export {};
