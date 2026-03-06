// src/types/creation.ts

import type { RGBA, ParamsBase } from "./common";
import type { EffectConfig, GradientStop } from "./styling";

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
  fillColor?: RGBA;
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
  fillColor?: RGBA | '__none__';
  strokeColor?: RGBA;
  strokeWeight?: number;
  clipsContent?: boolean;
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
  /** Gap between wrapped rows/columns. Only applies when layoutWrap is "WRAP". */
  counterAxisSpacing?: number;
  /** Uniform corner radius applied to all corners (or selected corners if `corners` is provided) */
  cornerRadius?: number;
  /** Which corners receive the radius: [topLeft, topRight, bottomRight, bottomLeft]. Defaults to all true. */
  corners?: [boolean, boolean, boolean, boolean];
  /** Node opacity (0–1). Default: 1. */
  opacity?: number;
  /** Effects (shadows, blur) to apply on creation. Same format as setEffects. */
  effects?: EffectConfig[];
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
 * Composite frame creation — collapses create_frame + set_layout_positioning
 * + set_layout_sizing + set_gradient_fill + set_visibility into one command.
 */
export interface CreateFrameFullParams extends ParamsBase {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  parentId?: string;
  fillColor?: RGBA | '__none__';
  strokeColor?: RGBA;
  strokeWeight?: number;
  clipsContent?: boolean;
  layoutMode?: "NONE" | "HORIZONTAL" | "VERTICAL";
  layoutWrap?: "NO_WRAP" | "WRAP";
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  primaryAxisAlignItems?: "MIN" | "MAX" | "CENTER" | "SPACE_BETWEEN";
  counterAxisAlignItems?: "MIN" | "MAX" | "CENTER" | "BASELINE";
  itemSpacing?: number;
  counterAxisSpacing?: number;
  cornerRadius?: number;
  corners?: [boolean, boolean, boolean, boolean];
  opacity?: number;
  effects?: EffectConfig[];
  // Post-creation properties folded in
  layoutSizingHorizontal?: "FIXED" | "HUG" | "FILL";
  layoutSizingVertical?: "FIXED" | "HUG" | "FILL";
  positioning?: "AUTO" | "ABSOLUTE";
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  gradientType?: "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "GRADIENT_DIAMOND";
  gradientStops?: GradientStop[];
  gradientAngle?: number;
  visible?: boolean;
}

/**
 * Composite text creation — collapses create_text + set_opacity + set_line_height
 * + set_letter_spacing + set_text_truncation + set_layout_sizing + set_gradient_fill
 * + set_visibility into one command.
 */
export interface CreateTextFullParams extends ParamsBase {
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
  // Post-creation properties folded in
  opacity?: number;
  lineHeight?: number | "AUTO";
  lineHeightUnit?: "PIXELS" | "PERCENT";
  letterSpacing?: number;
  letterSpacingUnit?: "PIXELS" | "PERCENT";
  maxLines?: number;
  layoutSizingHorizontal?: "FIXED" | "HUG" | "FILL";
  layoutSizingVertical?: "FIXED" | "HUG" | "FILL";
  gradientType?: "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "GRADIENT_DIAMOND";
  gradientStops?: GradientStop[];
  gradientAngle?: number;
  visible?: boolean;
}

/**
 * Composite SVG creation — collapses create_svg + set_opacity
 * + set_layout_sizing + set_visibility into one command.
 */
export interface CreateSvgFullParams extends ParamsBase {
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
  windingRule?: "EVENODD" | "NONZERO";
  // Post-creation properties folded in
  opacity?: number;
  layoutSizingHorizontal?: "FIXED" | "HUG" | "FILL";
  layoutSizingVertical?: "FIXED" | "HUG" | "FILL";
  visible?: boolean;
}

/**
 * Composite rectangle creation — collapses create_rectangle + set_corner_radius
 * + set_opacity + set_layout_sizing + set_visibility into one command.
 */
export interface CreateRectangleFullParams extends ParamsBase {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  parentId?: string;
  fillColor?: RGBA;
  // Post-creation properties folded in
  cornerRadius?: number;
  opacity?: number;
  layoutSizingHorizontal?: "FIXED" | "HUG" | "FILL";
  layoutSizingVertical?: "FIXED" | "HUG" | "FILL";
  visible?: boolean;
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
