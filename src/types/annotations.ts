// src/types/annotations.ts

import type { ParamsBase } from "./common";

/**
 * Annotation parameters
 */
export interface SetAnnotationParams extends ParamsBase {
  nodeId: string;
  labelMarkdown: string;
  categoryId?: string;
  properties?: Array<{ name: string; value: string }>;
}

/**
 * Multiple annotations parameters
 */
export interface SetMultipleAnnotationsParams extends ParamsBase {
  nodeId: string;
  annotations: Array<SetAnnotationParams>;
}

/**
 * Get annotations parameters
 */
export interface GetAnnotationsParams extends ParamsBase {
  nodeId?: string;
  includeCategories?: boolean;
}
