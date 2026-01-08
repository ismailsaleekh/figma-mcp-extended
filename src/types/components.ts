// src/types/components.ts

import type { ParamsBase } from "./common";

/**
 * Component instance parameters
 * Use componentId for local components, componentKey for published library components
 */
export interface CreateComponentInstanceParams extends ParamsBase {
  /** Component key for published library components */
  componentKey?: string;
  /** Component ID for local components in the same file */
  componentId?: string;
  x?: number;
  y?: number;
  /** Parent node ID to append instance to */
  parentId?: string;
}

/**
 * Create component from node parameters
 */
export interface CreateComponentFromNodeParams extends ParamsBase {
  nodeId: string;
  name?: string;
}

/**
 * Detach instance parameters
 */
export interface DetachInstanceParams extends ParamsBase {
  nodeId: string;
}
