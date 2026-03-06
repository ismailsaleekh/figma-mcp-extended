// src/types/images.ts

import type { RGBA, ParamsBase } from "./common";

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

/**
 * Composite image creation — collapses create_image_rectangle + set_stroke_color
 * + set_opacity + set_layout_sizing + set_visibility into one command.
 */
export interface CreateImageFullParams extends ParamsBase {
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
  // Post-creation properties folded in
  strokeColor?: RGBA;
  strokeWeight?: number;
  opacity?: number;
  layoutSizingHorizontal?: "FIXED" | "HUG" | "FILL";
  layoutSizingVertical?: "FIXED" | "HUG" | "FILL";
  visible?: boolean;
}
