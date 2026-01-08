// Type declarations for svg-path-parser

declare module "svg-path-parser" {
  export interface Command {
    code: string;
    command: string;
    relative?: boolean;
    x?: number;
    y?: number;
    x0?: number;
    y0?: number;
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    rx?: number;
    ry?: number;
    xAxisRotation?: number;
    largeArc?: boolean;
    sweep?: boolean;
  }

  export function parseSVG(path: string): Command[];
  export function makeAbsolute(commands: Command[]): Command[];
}
