// src/types/extraction.ts

import type { ParamsBase } from "./common";

/**
 * Get complete file data parameters
 */
export interface GetCompleteFileDataParams extends ParamsBase {
  useChunking?: boolean;
  chunkSize?: number;
}

/**
 * Get layout constraints parameters
 */
export interface GetLayoutConstraintsParams extends ParamsBase {
  nodeId?: string;
}

/**
 * Get responsive layouts parameters
 */
export interface GetResponsiveLayoutsParams extends ParamsBase {
  nodeId?: string;
}

/**
 * Get style inheritance parameters
 */
export interface GetStyleInheritanceParams extends ParamsBase {
  nodeId?: string;
}
