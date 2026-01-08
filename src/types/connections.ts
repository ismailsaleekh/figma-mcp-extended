// src/types/connections.ts

import type { ParamsBase } from "./common";

/**
 * Get reactions parameters
 */
export interface GetReactionsParams extends ParamsBase {
  nodeIds: string[];
}

/**
 * Set default connector parameters
 */
export interface SetDefaultConnectorParams extends ParamsBase {
  connectorId?: string;
}

/**
 * Create connections parameters
 */
export interface CreateConnectionsParams extends ParamsBase {
  connections: Array<{
    startNodeId: string;
    endNodeId: string;
    text?: string;
  }>;
}

/**
 * Connection result from create_connections
 */
export interface ConnectionResult {
  id: string;
  originalStartNodeId: string;
  originalEndNodeId: string;
  usedStartNodeId: string;
  usedEndNodeId: string;
  text: string;
}
