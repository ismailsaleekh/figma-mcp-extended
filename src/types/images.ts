// src/types/images.ts

import type { ParamsBase } from "./common";

/**
 * Export node as image parameters
 */
export interface ExportNodeAsImageParams extends ParamsBase {
  nodeId: string;
  scale?: number;
}

/**
 * Set image fill parameters
 */
export interface SetImageFillParams extends ParamsBase {
  nodeId: string;
  imageUrl?: string;
  imageBase64?: string;
  scaleMode?: "FILL" | "FIT" | "CROP" | "TILE";
}

/**
 * Create image rectangle parameters
 */
export interface CreateImageRectangleParams extends ParamsBase {
  imageUrl?: string;
  imageBase64?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  parentId?: string;
  scaleMode?: "FILL" | "FIT" | "CROP" | "TILE";
  cornerRadius?: number;
}
