export declare function createFableHero(
  host: HTMLElement,
  options?: {
    assets?: string;
    classes?: Record<string, string>;
    looks?: boolean;
    seed?: number;
    shelters?: [number, number, number, number][];
    onUnsupported?: (err: any) => void;
    onLook?: (look: string) => void;
  }
): {
  dispose: () => void;
  setSpeed?: (speed?: number) => void;
  setBlur?: (blur?: boolean) => void;
  setLook?: (look: string) => void;
  setShelters?: (...shelters: [number, number, number, number][]) => void;
  cue?: () => void;
  readonly look?: string;
  readonly seed?: number;
  readonly ready?: boolean;
  readonly bird?: string;
  readonly birdXY?: { x: number; y: number } | null;
};
