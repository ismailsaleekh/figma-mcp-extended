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
