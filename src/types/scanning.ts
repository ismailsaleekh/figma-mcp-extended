// src/types/scanning.ts

import type { ParamsBase } from "./common";

/**
 * Scan nodes by types parameters
 * nodeId is optional - if not provided, searches entire current page
 */
export interface ScanNodesByTypesParams extends ParamsBase {
  nodeId?: string;
  types: string[];
}

/**
 * Delete multiple nodes parameters
 */
export interface DeleteMultipleNodesParams extends ParamsBase {
  nodeIds: string[];
}

/**
 * Matching node from scan_nodes_by_types
 */
export interface MatchingNodeInfo {
  id: string;
  name: string;
  type: string;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

/**
 * Result from scan_nodes_by_types command
 */
export interface ScanNodesByTypesResult {
  success: boolean;
  message: string;
  count: number;
  matchingNodes: MatchingNodeInfo[];
  searchedTypes: string[];
}

/**
 * Result from delete_multiple_nodes command
 */
export interface DeleteMultipleResult {
  success: boolean;
  nodesDeleted: number;
  nodesFailed: number;
  totalNodes: number;
  results: Array<{
    success: boolean;
    nodeId: string;
    error?: string;
    nodeInfo?: { id: string; name: string; type: string };
  }>;
  completedInChunks: number;
  commandId: string;
}
