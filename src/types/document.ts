// src/types/document.ts

import type { ParamsBase } from "./common";

/**
 * Create page parameters
 */
export interface CreatePageParams extends ParamsBase {
  name?: string;
  setAsCurrent?: boolean;
}

/**
 * Set current page parameters
 */
export interface SetCurrentPageParams extends ParamsBase {
  pageId: string;
}

/**
 * Get direct children parameters
 */
export interface GetDirectChildrenParams extends ParamsBase {
  nodeId: string;
}
