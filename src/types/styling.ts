// src/types/styling.ts

import type { RGBA, ParamsBase } from "./common";

/**
 * Fill color parameters
 */
export interface SetFillColorParams extends ParamsBase {
  nodeId: string;
  color: RGBA;
}

/**
 * Stroke color parameters
 */
export interface SetStrokeColorParams extends ParamsBase {
  nodeId: string;
  color: RGBA;
  weight?: number;
}

/**
 * Corner radius parameters
 */
export interface SetCornerRadiusParams extends ParamsBase {
  nodeId: string;
  radius: number;
  corners?: [boolean, boolean, boolean, boolean];
}

/**
 * Set opacity parameters
 */
export interface SetOpacityParams extends ParamsBase {
  nodeId: string;
  opacity: number;
}

/**
 * Effect configuration for shadows and blur
 */
export interface EffectConfig {
  type: "DROP_SHADOW" | "INNER_SHADOW" | "LAYER_BLUR" | "BACKGROUND_BLUR";
  color?: RGBA;
  offset?: { x: number; y: number };
  radius: number;
  spread?: number;
  visible?: boolean;
}

/**
 * Set effects parameters
 */
export interface SetEffectsParams extends ParamsBase {
  nodeId: string;
  effects: EffectConfig[];
}

/**
 * Gradient stop definition
 */
export interface GradientStop {
  position: number;
  color: RGBA;
}

/**
 * Set gradient fill parameters
 */
export interface SetGradientFillParams extends ParamsBase {
  nodeId: string;
  gradientType: "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "GRADIENT_DIAMOND";
  stops: GradientStop[];
  angle?: number;
}

/**
 * Set blend mode parameters
 */
export interface SetBlendModeParams extends ParamsBase {
  nodeId: string;
  blendMode: "PASS_THROUGH" | "NORMAL" | "DARKEN" | "MULTIPLY" | "LINEAR_BURN" | "COLOR_BURN" |
    "LIGHTEN" | "SCREEN" | "LINEAR_DODGE" | "COLOR_DODGE" | "OVERLAY" | "SOFT_LIGHT" |
    "HARD_LIGHT" | "DIFFERENCE" | "EXCLUSION" | "HUE" | "SATURATION" | "COLOR" | "LUMINOSITY";
}

/**
 * Set stroke style parameters
 */
export interface SetStrokeStyleParams extends ParamsBase {
  nodeId: string;
  strokeAlign?: "INSIDE" | "OUTSIDE" | "CENTER";
  strokeCap?: "NONE" | "ROUND" | "SQUARE" | "ARROW_LINES" | "ARROW_EQUILATERAL";
  strokeJoin?: "MITER" | "BEVEL" | "ROUND";
  dashPattern?: number[];
}
