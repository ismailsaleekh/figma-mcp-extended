// src/types/text.ts

import type { ParamsBase } from "./common";

/**
 * Text content parameters
 */
export interface SetTextContentParams extends ParamsBase {
  nodeId: string;
  text: string;
}

/**
 * Multiple text contents parameters
 */
export interface SetMultipleTextContentsParams extends ParamsBase {
  nodeId: string;
  text: Array<{ nodeId: string; text: string }>;
}

/**
 * Scan text nodes parameters
 */
export interface ScanTextNodesParams extends ParamsBase {
  nodeId: string;
  useChunking?: boolean;
  chunkSize?: number;
}

/**
 * Text node info from scan_text_nodes
 */
export interface TextNodeInfo {
  id: string;
  name: string;
  type: string;
  characters: string;
  fontSize: number;
  fontFamily: string;
  fontStyle: string;
  x: number;
  y: number;
  width: number;
  height: number;
  path: string;
  depth: number;
}

/**
 * Result from scan_text_nodes command
 */
export interface ScanTextNodesResult {
  success: boolean;
  message?: string;
  count: number;
  textNodes: TextNodeInfo[];
  commandId: string;
  totalNodes?: number;
  processedNodes?: number;
  chunks?: number;
}

/**
 * Set font family parameters
 */
export interface SetFontFamilyParams extends ParamsBase {
  nodeId: string;
  fontFamily: string;
  fontStyle?: string;
}

/**
 * Set font size parameters
 */
export interface SetFontSizeParams extends ParamsBase {
  nodeId: string;
  fontSize: number;
}

/**
 * Set font weight parameters
 */
export interface SetFontWeightParams extends ParamsBase {
  nodeId: string;
  fontWeight: number;
}

/**
 * Set text alignment parameters
 */
export interface SetTextAlignmentParams extends ParamsBase {
  nodeId: string;
  horizontalAlign?: "LEFT" | "CENTER" | "RIGHT" | "JUSTIFIED";
  verticalAlign?: "TOP" | "CENTER" | "BOTTOM";
}

/**
 * Set line height parameters
 */
export interface SetLineHeightParams extends ParamsBase {
  nodeId: string;
  lineHeight: number | "AUTO";
  unit?: "PIXELS" | "PERCENT";
}

/**
 * Set letter spacing parameters
 */
export interface SetLetterSpacingParams extends ParamsBase {
  nodeId: string;
  letterSpacing: number;
  unit?: "PIXELS" | "PERCENT";
}
