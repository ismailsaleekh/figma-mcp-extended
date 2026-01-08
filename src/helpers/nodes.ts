// src/helpers/nodes.ts

import { rgbaToHex } from "./colors";
import type { FilteredNode, RGBA } from "../types";

interface ExportedNode {
  id: string;
  name: string;
  type: string;
  visible?: boolean;
  fills?: Array<{
    type: string;
    color?: RGBA;
    gradientStops?: Array<{
      color?: RGBA;
      boundVariables?: unknown;
      [key: string]: unknown;
    }>;
    boundVariables?: unknown;
    imageRef?: unknown;
    [key: string]: unknown;
  }>;
  strokes?: Array<{
    type: string;
    color?: RGBA;
    boundVariables?: unknown;
    [key: string]: unknown;
  }>;
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
  children?: ExportedNode[];
}

/**
 * Filter Figma node to serializable format
 */
export function filterFigmaNode(node: ExportedNode): FilteredNode | null {
  if (node.type === "VECTOR") {
    return null;
  }

  const filtered: FilteredNode = {
    id: node.id,
    name: node.name,
    type: node.type,
  };

  if (node.visible !== undefined) {
    filtered.visible = node.visible;
  }

  if (node.fills && node.fills.length > 0) {
    filtered.fills = node.fills.map((fill) => {
      const processedFill = { ...fill };
      delete processedFill.boundVariables;
      delete processedFill.imageRef;

      if (processedFill.gradientStops) {
        processedFill.gradientStops = processedFill.gradientStops.map(
          (stop) => {
            const processedStop = { ...stop };
            if (processedStop.color) {
              (processedStop as Record<string, unknown>).color = rgbaToHex(
                processedStop.color as RGBA
              );
            }
            delete processedStop.boundVariables;
            return processedStop;
          }
        );
      }

      if (processedFill.color) {
        (processedFill as Record<string, unknown>).color = rgbaToHex(
          processedFill.color as RGBA
        );
      }

      return processedFill;
    });
  }

  if (node.strokes && node.strokes.length > 0) {
    filtered.strokes = node.strokes.map((stroke) => {
      const processedStroke = { ...stroke };
      delete processedStroke.boundVariables;
      if (processedStroke.color) {
        (processedStroke as Record<string, unknown>).color = rgbaToHex(
          processedStroke.color as RGBA
        );
      }
      return processedStroke;
    });
  }

  if (node.cornerRadius !== undefined) {
    filtered.cornerRadius = node.cornerRadius;
  }

  if (node.absoluteBoundingBox) {
    filtered.absoluteBoundingBox = node.absoluteBoundingBox;
  }

  if (node.characters) {
    filtered.characters = node.characters;
  }

  if (node.style) {
    filtered.style = {
      fontFamily: node.style.fontFamily,
      fontStyle: node.style.fontStyle,
      fontWeight: node.style.fontWeight,
      fontSize: node.style.fontSize,
      textAlignHorizontal: node.style.textAlignHorizontal,
      letterSpacing: node.style.letterSpacing,
      lineHeightPx: node.style.lineHeightPx,
    };
  }

  if (node.children) {
    filtered.children = node.children
      .map((child) => filterFigmaNode(child))
      .filter((child): child is FilteredNode => child !== null);
  }

  return filtered;
}

/**
 * Custom base64 encoding for image export
 */
export function customBase64Encode(bytes: Uint8Array): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let base64 = "";

  const byteLength = bytes.byteLength;
  const byteRemainder = byteLength % 3;
  const mainLength = byteLength - byteRemainder;

  let a: number, b: number, c: number, d: number;
  let chunk: number;

  for (let i = 0; i < mainLength; i = i + 3) {
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    a = (chunk & 16515072) >> 18;
    b = (chunk & 258048) >> 12;
    c = (chunk & 4032) >> 6;
    d = chunk & 63;
    base64 += chars[a] + chars[b] + chars[c] + chars[d];
  }

  if (byteRemainder === 1) {
    chunk = bytes[mainLength];
    a = (chunk & 252) >> 2;
    b = (chunk & 3) << 4;
    base64 += chars[a] + chars[b] + "==";
  } else if (byteRemainder === 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
    a = (chunk & 64512) >> 10;
    b = (chunk & 1008) >> 4;
    c = (chunk & 15) << 2;
    base64 += chars[a] + chars[b] + chars[c] + "=";
  }

  return base64;
}

/**
 * Get hierarchical path of a node
 */
export function getNodePath(node: BaseNode): string {
  const parts: string[] = [];
  let current: BaseNode | null = node;

  while (current && current.type !== "PAGE" && current.type !== "DOCUMENT") {
    parts.unshift(current.name);
    current = current.parent;
  }

  return parts.join(" > ");
}

/**
 * Delay helper function
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Highlight node with temporary fill color (for visual feedback)
 */
export async function highlightNodeWithFill(
  node: SceneNode,
  durationMs: number = 500
): Promise<void> {
  if (!("fills" in node)) return;

  try {
    const originalFills = JSON.parse(JSON.stringify(node.fills));
    (node as GeometryMixin).fills = [
      {
        type: "SOLID",
        color: { r: 1, g: 0.5, b: 0 },
        opacity: 0.3,
      },
    ];

    await delay(durationMs);

    try {
      (node as GeometryMixin).fills = originalFills;
    } catch (err) {
      console.error("Error resetting fills:", err);
    }
  } catch (highlightErr) {
    console.error("Error highlighting node:", highlightErr);
  }
}

/**
 * Collect all nodes to process for chunked operations
 */
export async function collectNodesToProcess(
  node: SceneNode,
  parentPath: string[] = [],
  depth: number = 0,
  nodesToProcess: Array<{ node: SceneNode; parentPath: string[]; depth: number }> = []
): Promise<void> {
  // Skip invisible nodes
  if (node.visible === false) return;

  // Get the path to this node
  const nodePath = [...parentPath, node.name || `Unnamed ${node.type}`];

  // Add this node to the processing list
  nodesToProcess.push({
    node: node,
    parentPath: nodePath,
    depth: depth,
  });

  // Recursively add children
  if ("children" in node) {
    for (const child of node.children) {
      await collectNodesToProcess(child, nodePath, depth + 1, nodesToProcess);
    }
  }
}

/**
 * Find nodes by types recursively
 * Accepts SceneNode or PageNode for document-wide search
 */
export async function findNodesByTypes(
  node: SceneNode | PageNode,
  types: string[],
  matchingNodes: Array<{
    id: string;
    name: string;
    type: string;
    bbox: { x: number; y: number; width: number; height: number };
  }> = []
): Promise<void> {
  // Skip invisible nodes (PageNode doesn't have visible property)
  if ("visible" in node && node.visible === false) return;

  // Check if this node is one of the specified types (skip PageNode itself)
  if (node.type !== "PAGE" && types.includes(node.type)) {
    const sceneNode = node as SceneNode;
    matchingNodes.push({
      id: sceneNode.id,
      name: sceneNode.name || `Unnamed ${sceneNode.type}`,
      type: sceneNode.type,
      bbox: {
        x: "x" in sceneNode ? sceneNode.x : 0,
        y: "y" in sceneNode ? sceneNode.y : 0,
        width: "width" in sceneNode ? sceneNode.width : 0,
        height: "height" in sceneNode ? sceneNode.height : 0,
      },
    });
  }

  // Recursively process children
  if ("children" in node) {
    for (const child of node.children) {
      await findNodesByTypes(child, types, matchingNodes);
    }
  }
}
