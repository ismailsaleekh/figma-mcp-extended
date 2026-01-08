// src/commands/scanning.ts

import type { ScanNodesByTypesParams, DeleteMultipleNodesParams } from "../types";
import { generateCommandId, sendProgressUpdate, delay } from "../helpers/progress";
import { findNodesByTypes } from "../helpers/nodes";

export async function scanNodesByTypes(params: ScanNodesByTypesParams) {
  const { nodeId, types = [] } = params;

  if (!types || types.length === 0) {
    throw new Error("No types specified to search for");
  }

  // If nodeId is provided, search within that node; otherwise search entire current page
  let node: SceneNode | PageNode;
  if (nodeId) {
    const foundNode = await figma.getNodeByIdAsync(nodeId);
    if (!foundNode) {
      throw new Error(`Node with ID ${nodeId} not found`);
    }
    node = foundNode as SceneNode;
  } else {
    node = figma.currentPage;
  }

  const matchingNodes: Array<{
    id: string;
    name: string;
    type: string;
    bbox: { x: number; y: number; width: number; height: number };
  }> = [];

  const commandId = generateCommandId();
  sendProgressUpdate(commandId, "scan_nodes_by_types", "started", 0, 1, 0, `Starting scan for types: ${types.join(", ")}`);

  await findNodesByTypes(node, types, matchingNodes);

  sendProgressUpdate(commandId, "scan_nodes_by_types", "completed", 100, matchingNodes.length, matchingNodes.length, `Found ${matchingNodes.length} matching nodes`);

  return {
    success: true,
    message: `Found ${matchingNodes.length} matching nodes.`,
    count: matchingNodes.length,
    matchingNodes,
    searchedTypes: types,
  };
}

export async function deleteMultipleNodes(params: DeleteMultipleNodesParams) {
  const { nodeIds } = params;
  const commandId = generateCommandId();

  if (!nodeIds || !Array.isArray(nodeIds) || nodeIds.length === 0) {
    throw new Error("Missing or invalid nodeIds parameter");
  }

  sendProgressUpdate(commandId, "delete_multiple_nodes", "started", 0, nodeIds.length, 0, `Starting deletion of ${nodeIds.length} nodes`);

  const results: Array<{
    success: boolean;
    nodeId: string;
    error?: string;
    nodeInfo?: { id: string; name: string; type: string };
  }> = [];
  let successCount = 0;
  let failureCount = 0;

  const CHUNK_SIZE = 5;
  const chunks: string[][] = [];

  for (let i = 0; i < nodeIds.length; i += CHUNK_SIZE) {
    chunks.push(nodeIds.slice(i, i + CHUNK_SIZE));
  }

  for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
    const chunk = chunks[chunkIndex];

    sendProgressUpdate(commandId, "delete_multiple_nodes", "in_progress", Math.round((chunkIndex / chunks.length) * 90) + 5, nodeIds.length, successCount + failureCount, `Processing chunk ${chunkIndex + 1}/${chunks.length}`);

    const chunkPromises = chunk.map(async (nodeId) => {
      try {
        const node = await figma.getNodeByIdAsync(nodeId);
        if (!node) {
          return { success: false, nodeId, error: `Node not found: ${nodeId}` };
        }

        const nodeInfo = { id: node.id, name: node.name, type: node.type };
        node.remove();

        return { success: true, nodeId, nodeInfo };
      } catch (error) {
        return { success: false, nodeId, error: (error as Error).message };
      }
    });

    const chunkResults = await Promise.all(chunkPromises);

    chunkResults.forEach((result) => {
      if (result.success) successCount++;
      else failureCount++;
      results.push(result);
    });

    if (chunkIndex < chunks.length - 1) {
      await delay(1000);
    }
  }

  sendProgressUpdate(commandId, "delete_multiple_nodes", "completed", 100, nodeIds.length, successCount + failureCount, `Deletion complete: ${successCount} successful, ${failureCount} failed`);

  return {
    success: successCount > 0,
    nodesDeleted: successCount,
    nodesFailed: failureCount,
    totalNodes: nodeIds.length,
    results,
    completedInChunks: chunks.length,
    commandId,
  };
}
