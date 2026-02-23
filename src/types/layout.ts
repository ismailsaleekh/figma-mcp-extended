// src/types/layout.ts

import type { ParamsBase } from "./common";

/**
 * Layout mode parameters
 */
export interface SetLayoutModeParams extends ParamsBase {
  nodeId: string;
  layoutMode?: "NONE" | "HORIZONTAL" | "VERTICAL";
  layoutWrap?: "NO_WRAP" | "WRAP";
}

/**
 * Padding parameters
 */
export interface SetPaddingParams extends ParamsBase {
  nodeId: string;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
}

/**
 * Axis alignment parameters
 */
export interface SetAxisAlignParams extends ParamsBase {
  nodeId: string;
  primaryAxisAlignItems?: "MIN" | "MAX" | "CENTER" | "SPACE_BETWEEN";
  counterAxisAlignItems?: "MIN" | "MAX" | "CENTER" | "BASELINE";
}

/**
 * Layout sizing parameters
 */
export interface SetLayoutSizingParams extends ParamsBase {
  nodeId: string;
  layoutSizingHorizontal?: "FIXED" | "HUG" | "FILL";
  layoutSizingVertical?: "FIXED" | "HUG" | "FILL";
}

/**
 * Item spacing parameters
 */
export interface SetItemSpacingParams extends ParamsBase {
  nodeId: string;
  itemSpacing?: number;
  counterAxisSpacing?: number;
}

/**
 * Min/max size constraint parameters
 */
export interface SetMinMaxSizeParams extends ParamsBase {
  nodeId: string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
}

/**
 * Layout positioning parameters.
 * Sets a node to absolute positioning within its auto-layout parent,
 * removing it from the layout flow. Used for FABs, badges, overlays,
 * pagination dots, and other floating elements.
 *
 * Supports two positioning modes:
 * - Legacy: pass x/y directly
 * - Offset-based: pass top/left/right/bottom offsets; the plugin computes
 *   x/y using the actual parent dimensions (fixes parentWidth propagation bug)
 */
export interface SetLayoutPositioningParams extends ParamsBase {
  nodeId: string;
  positioning: "ABSOLUTE" | "AUTO";
  x?: number;
  y?: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}
