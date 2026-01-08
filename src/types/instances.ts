// src/types/instances.ts

/**
 * Instance overrides parameters
 */
export interface GetInstanceOverridesParams {
  instanceNodeId?: string;
}

/**
 * Set instance overrides parameters
 */
export interface SetInstanceOverridesParams {
  targetNodeIds: string[];
  sourceInstanceId: string;
}
