// src/types/common.ts

/**
 * Base interface for command params that need to work with Record<string, unknown>
 */
export interface ParamsBase {
  [key: string]: unknown;
}

/**
 * RGBA color with values in 0-1 range
 */
export interface RGBA {
  r: number;
  g: number;
  b: number;
  a?: number;
}

/**
 * Progress update payload for chunked operations
 */
export interface ProgressPayload {
  currentChunk?: number;
  totalChunks?: number;
  chunkSize?: number;
  [key: string]: unknown;
}

/**
 * Progress update message sent to UI
 */
export interface ProgressUpdate {
  type: "command_progress";
  commandId: string;
  commandType: string;
  status: "started" | "in_progress" | "completed" | "error";
  progress: number;
  totalItems: number;
  processedItems: number;
  message: string;
  timestamp: number;
  currentChunk?: number;
  totalChunks?: number;
  chunkSize?: number;
  payload?: ProgressPayload;
}

/**
 * Font options for text operations
 */
export interface FontOptions {
  fallbackFont?: FontName;
  smartStrategy?: "prevail" | "strict" | "experimental";
}

/**
 * Basic node info returned from queries
 */
export interface BasicNodeInfo {
  id: string;
  name: string;
  type: string;
  visible?: boolean;
}

/**
 * UI message types
 */
export interface UIMessage {
  type: string;
  id?: string;
  command?: string;
  params?: Record<string, unknown>;
  message?: string;
  serverPort?: number;
}

/**
 * Plugin state
 */
export interface PluginState {
  serverPort: number;
}

/**
 * Filtered node for serialization
 */
export interface FilteredNode {
  id: string;
  name: string;
  type: string;
  visible?: boolean;
  fills?: unknown[];
  strokes?: unknown[];
  cornerRadius?: number;
  absoluteBoundingBox?: { x: number; y: number; width: number; height: number };
  characters?: string;
  style?: {
    fontFamily?: string;
    fontStyle?: string;
    fontWeight?: number;
    fontSize?: number;
    textAlignHorizontal?: string;
    letterSpacing?: number;
    lineHeightPx?: number;
  };
  children?: FilteredNode[];
}
