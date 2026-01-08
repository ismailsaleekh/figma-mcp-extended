// src/types/creation.ts

import type { RGBA, ParamsBase } from "./common";

/**
 * Rectangle creation parameters
 */
export interface CreateRectangleParams extends ParamsBase {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  parentId?: string;
}

/**
 * Frame creation parameters with auto-layout support
 */
export interface CreateFrameParams extends ParamsBase {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  parentId?: string;
  fillColor?: RGBA;
  strokeColor?: RGBA;
  strokeWeight?: number;
  layoutMode?: "NONE" | "HORIZONTAL" | "VERTICAL";
  layoutWrap?: "NO_WRAP" | "WRAP";
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  primaryAxisAlignItems?: "MIN" | "MAX" | "CENTER" | "SPACE_BETWEEN";
  counterAxisAlignItems?: "MIN" | "MAX" | "CENTER" | "BASELINE";
  layoutSizingHorizontal?: "FIXED" | "HUG" | "FILL";
  layoutSizingVertical?: "FIXED" | "HUG" | "FILL";
  itemSpacing?: number;
}

/**
 * Text creation parameters
 */
export interface CreateTextParams extends ParamsBase {
  x?: number;
  y?: number;
  width?: number;
  text?: string;
  fontSize?: number;
  fontWeight?: number;
  fontColor?: RGBA;
  textAlignHorizontal?: "LEFT" | "CENTER" | "RIGHT" | "JUSTIFIED";
  name?: string;
  parentId?: string;
}

/**
 * Move node parameters
 */
export interface MoveNodeParams extends ParamsBase {
  nodeId: string;
  x: number;
  y: number;
}

/**
 * Resize node parameters
 */
export interface ResizeNodeParams extends ParamsBase {
  nodeId: string;
  width: number;
  height: number;
}

/**
 * Delete node parameters
 */
export interface DeleteNodeParams extends ParamsBase {
  nodeId: string;
}

/**
 * Clone node parameters
 */
export interface CloneNodeParams extends ParamsBase {
  nodeId: string;
  x?: number;
  y?: number;
}

/**
 * Ellipse creation parameters
 */
export interface CreateEllipseParams extends ParamsBase {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  parentId?: string;
  fillColor?: RGBA;
}

/**
 * Line creation parameters
 */
export interface CreateLineParams extends ParamsBase {
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  name?: string;
  parentId?: string;
  strokeColor?: RGBA;
  strokeWeight?: number;
}

/**
 * Polygon creation parameters
 */
export interface CreatePolygonParams extends ParamsBase {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  pointCount?: number;
  name?: string;
  parentId?: string;
  fillColor?: RGBA;
}

/**
 * Vector path definition
 */
export interface VectorPathData {
  windingRule: "EVENODD" | "NONZERO";
  data: string;
}

/**
 * Vector creation parameters
 */
export interface CreateVectorParams extends ParamsBase {
  vectorPaths: VectorPathData[];
  x?: number;
  y?: number;
  name?: string;
  parentId?: string;
  fillColor?: RGBA;
  strokeColor?: RGBA;
  strokeWeight?: number;
}

/**
 * SVG creation parameters - supports complex SVG paths (curves, arcs, etc.)
 */
export interface CreateSvgParams extends ParamsBase {
  /** SVG path data (d attribute) OR full SVG content */
  svg: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  parentId?: string;
  fillColor?: RGBA;
  strokeColor?: RGBA;
  strokeWeight?: number;
  /** Winding rule for fill */
  windingRule?: "EVENODD" | "NONZERO";
}
