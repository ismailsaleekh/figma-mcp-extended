// src/types/nodes.ts

import type { ParamsBase } from "./common";

/**
 * Group nodes parameters
 */
export interface GroupNodesParams extends ParamsBase {
  nodeIds: string[];
  name?: string;
}

/**
 * Ungroup nodes parameters
 */
export interface UngroupNodesParams extends ParamsBase {
  nodeId: string;
}

/**
 * Set rotation parameters
 */
export interface SetRotationParams extends ParamsBase {
  nodeId: string;
  rotation: number;
}

/**
 * Set z-index (layer order) parameters
 */
export interface SetZIndexParams extends ParamsBase {
  nodeId: string;
  position: "front" | "back" | "forward" | "backward" | number;
}

/**
 * Rename node parameters
 */
export interface RenameNodeParams extends ParamsBase {
  nodeId: string;
  name: string;
}

/**
 * Set visibility parameters
 */
export interface SetVisibilityParams extends ParamsBase {
  nodeId: string;
  visible: boolean;
}

/**
 * Set constraints parameters
 */
export interface SetConstraintsParams extends ParamsBase {
  nodeId: string;
  horizontal?: "MIN" | "CENTER" | "MAX" | "STRETCH" | "SCALE";
  vertical?: "MIN" | "CENTER" | "MAX" | "STRETCH" | "SCALE";
}

/**
 * Lock node parameters
 */
export interface LockNodeParams extends ParamsBase {
  nodeId: string;
  locked: boolean;
}
