// src/commands/connections.ts

import type { SetDefaultConnectorParams, CreateConnectionsParams, GetReactionsParams } from "../types";
import { generateCommandId, sendProgressUpdate } from "../helpers/progress";

/**
 * Node with reactions info
 */
interface NodeWithReactions {
  id: string;
  name: string;
  type: string;
  depth: number;
  hasReactions: boolean;
  reactions: Reaction[];
  path: string;
}

/**
 * Get hierarchical path of a node (local helper for reactions)
 */
function getNodePath(node: BaseNode): string {
  const path: string[] = [];
  let current: BaseNode | null = node;

  while (current && current.parent) {
    path.unshift(current.name);
    current = current.parent;
  }

  return path.join(" > ");
}

/**
 * Apply animated highlight effect to a node (orange border)
 */
async function highlightNodeWithAnimation(node: SceneNode): Promise<void> {
  if (!("strokes" in node) || !("strokeWeight" in node)) return;

  const geometryNode = node as GeometryMixin;
  const originalStrokeWeight = geometryNode.strokeWeight;
  const originalStrokes = geometryNode.strokes ? [...geometryNode.strokes] : [];

  try {
    geometryNode.strokeWeight = 4;
    geometryNode.strokes = [
      {
        type: "SOLID",
        color: { r: 1, g: 0.5, b: 0 }, // Orange color
        opacity: 0.8,
      },
    ];

    // Set timeout for animation effect (restore to original after 1.5 seconds)
    setTimeout(() => {
      try {
        geometryNode.strokeWeight = originalStrokeWeight;
        geometryNode.strokes = originalStrokes;
      } catch (restoreError) {
        console.error(`Error restoring node stroke: ${(restoreError as Error).message}`);
      }
    }, 1500);
  } catch (highlightError) {
    console.error(`Error highlighting node: ${(highlightError as Error).message}`);
  }
}

/**
 * Find nodes with reactions from the node and all its children
 */
async function findNodesWithReactions(
  node: SceneNode,
  processedNodes: Set<string> = new Set(),
  depth: number = 0,
  results: NodeWithReactions[] = []
): Promise<NodeWithReactions[]> {
  // Skip already processed nodes (prevent circular references)
  if (processedNodes.has(node.id)) {
    return results;
  }

  processedNodes.add(node.id);

  // Check if the current node has reactions
  let filteredReactions: Reaction[] = [];
  if ("reactions" in node && node.reactions && node.reactions.length > 0) {
    // Filter out reactions with navigation === 'CHANGE_TO'
    filteredReactions = node.reactions.filter((r) => {
      // Some reactions may have action or actions array
      if (r.action && "navigation" in r.action && r.action.navigation === "CHANGE_TO") return false;
      if (r.actions && Array.isArray(r.actions)) {
        // If any action in actions array is CHANGE_TO, exclude
        return !r.actions.some((a) => "navigation" in a && a.navigation === "CHANGE_TO");
      }
      return true;
    });
  }
  const hasFilteredReactions = filteredReactions.length > 0;

  // If the node has filtered reactions, add it to results and apply highlight effect
  if (hasFilteredReactions) {
    results.push({
      id: node.id,
      name: node.name,
      type: node.type,
      depth: depth,
      hasReactions: true,
      reactions: filteredReactions,
      path: getNodePath(node),
    });
    // Apply highlight effect (orange border)
    await highlightNodeWithAnimation(node);
  }

  // If node has children, recursively search them
  if ("children" in node) {
    for (const child of node.children) {
      await findNodesWithReactions(child, processedNodes, depth + 1, results);
    }
  }

  return results;
}

/**
 * Get reactions for multiple nodes with deep search
 */
export async function getReactions(params: GetReactionsParams) {
  const { nodeIds } = params;

  if (!nodeIds || !Array.isArray(nodeIds) || nodeIds.length === 0) {
    throw new Error("Missing or invalid nodeIds parameter");
  }

  const commandId = generateCommandId();
  sendProgressUpdate(
    commandId,
    "get_reactions",
    "started",
    0,
    nodeIds.length,
    0,
    `Starting deep search for reactions in ${nodeIds.length} nodes and their children`
  );

  // Array to store all results
  let allResults: NodeWithReactions[] = [];
  let processedCount = 0;
  const totalCount = nodeIds.length;

  // Iterate through each node and its children to search for reactions
  for (let i = 0; i < nodeIds.length; i++) {
    try {
      const nodeId = nodeIds[i];
      const node = await figma.getNodeByIdAsync(nodeId);

      if (!node) {
        processedCount++;
        sendProgressUpdate(
          commandId,
          "get_reactions",
          "in_progress",
          processedCount / totalCount,
          totalCount,
          processedCount,
          `Node not found: ${nodeId}`
        );
        continue;
      }

      // Search for reactions in the node and its children
      const processedNodes = new Set<string>();
      const nodeResults = await findNodesWithReactions(node as SceneNode, processedNodes);

      // Add results
      allResults = allResults.concat(nodeResults);

      // Update progress
      processedCount++;
      sendProgressUpdate(
        commandId,
        "get_reactions",
        "in_progress",
        processedCount / totalCount,
        totalCount,
        processedCount,
        `Processed node ${processedCount}/${totalCount}, found ${nodeResults.length} nodes with reactions`
      );
    } catch (error) {
      processedCount++;
      sendProgressUpdate(
        commandId,
        "get_reactions",
        "in_progress",
        processedCount / totalCount,
        totalCount,
        processedCount,
        `Error processing node: ${(error as Error).message}`
      );
    }
  }

  // Completion update
  sendProgressUpdate(
    commandId,
    "get_reactions",
    "completed",
    1,
    totalCount,
    totalCount,
    `Completed deep search: found ${allResults.length} nodes with reactions.`
  );

  return {
    nodesCount: nodeIds.length,
    nodesWithReactions: allResults.length,
    nodes: allResults,
  };
}

export async function setDefaultConnector(params: SetDefaultConnectorParams) {
  const { connectorId } = params;

  if (connectorId) {
    const node = await figma.getNodeByIdAsync(connectorId);
    if (!node) throw new Error(`Connector node not found with ID: ${connectorId}`);
    if (node.type !== "CONNECTOR") throw new Error(`Node is not a connector: ${connectorId}`);

    await figma.clientStorage.setAsync("defaultConnectorId", connectorId);

    return {
      success: true,
      message: `Default connector set to: ${connectorId}`,
      connectorId,
    };
  }

  // Check existing storage
  const existingConnectorId = await figma.clientStorage.getAsync("defaultConnectorId");

  if (existingConnectorId) {
    const existingConnector = await figma.getNodeByIdAsync(existingConnectorId);
    if (existingConnector && existingConnector.type === "CONNECTOR") {
      return {
        success: true,
        message: `Default connector is already set to: ${existingConnectorId}`,
        connectorId: existingConnectorId,
        exists: true,
      };
    }
  }

  // Find connector in current page
  const currentPageConnectors = figma.currentPage.findAllWithCriteria({ types: ["CONNECTOR"] });

  if (currentPageConnectors && currentPageConnectors.length > 0) {
    const foundConnector = currentPageConnectors[0];
    await figma.clientStorage.setAsync("defaultConnectorId", foundConnector.id);

    return {
      success: true,
      message: `Automatically found and set default connector to: ${foundConnector.id}`,
      connectorId: foundConnector.id,
      autoSelected: true,
    };
  }

  throw new Error("No connector found in the current page. Please create a connector in FigJam first.");
}

async function createCursorNode(targetNodeId: string) {
  const svgString = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 8V35.2419L22 28.4315L27 39.7823C27 39.7823 28.3526 40.2722 29 39.7823C29.6474 39.2924 30.2913 38.3057 30 37.5121C28.6247 33.7654 25 26.1613 25 26.1613H32L16 8Z" fill="#202125" />
  </svg>`;

  const targetNode = await figma.getNodeByIdAsync(targetNodeId);
  if (!targetNode) throw new Error("Target node not found");

  let parentNodeId = targetNodeId.includes(";") ? targetNodeId.split(";")[0] : targetNodeId;
  let parentNode = await figma.getNodeByIdAsync(parentNodeId);
  if (!parentNode) throw new Error("Parent node not found");

  if (parentNode.type === "INSTANCE" || parentNode.type === "COMPONENT" || parentNode.type === "COMPONENT_SET") {
    parentNode = parentNode.parent;
    if (!parentNode) throw new Error("Parent node not found");
  }

  const importedNode = await figma.createNodeFromSvg(svgString);
  importedNode.name = "TTF_Connector / Mouse Cursor";
  importedNode.resize(48, 48);

  (parentNode as FrameNode).appendChild(importedNode);

  if ("layoutMode" in parentNode && (parentNode as FrameNode).layoutMode !== "NONE") {
    importedNode.layoutPositioning = "ABSOLUTE";
  }

  if ((targetNode as SceneNode).absoluteBoundingBox && (parentNode as SceneNode).absoluteBoundingBox) {
    const targetBounds = (targetNode as SceneNode).absoluteBoundingBox!;
    const parentBounds = (parentNode as SceneNode).absoluteBoundingBox!;
    importedNode.x = targetBounds.x - parentBounds.x + targetBounds.width / 2 - 24;
    importedNode.y = targetBounds.y - parentBounds.y + targetBounds.height / 2 - 24;
  }

  return { id: importedNode.id, node: importedNode };
}

export async function createConnections(params: CreateConnectionsParams) {
  if (!params?.connections || !Array.isArray(params.connections)) {
    throw new Error("Missing or invalid connections parameter");
  }

  const { connections } = params;
  const commandId = generateCommandId();

  sendProgressUpdate(commandId, "create_connections", "started", 0, connections.length, 0, `Starting to create ${connections.length} connections`);

  const defaultConnectorId = await figma.clientStorage.getAsync("defaultConnectorId");
  if (!defaultConnectorId) {
    throw new Error("No default connector set. Please run set_default_connector first.");
  }

  const defaultConnector = await figma.getNodeByIdAsync(defaultConnectorId);
  if (!defaultConnector || defaultConnector.type !== "CONNECTOR") {
    throw new Error(`Default connector not found or invalid: ${defaultConnectorId}`);
  }

  const results: Array<{
    id?: string;
    originalStartNodeId: string;
    originalEndNodeId: string;
    usedStartNodeId: string;
    usedEndNodeId: string;
    text: string;
    error?: string;
  }> = [];
  let processedCount = 0;

  for (const connection of connections) {
    try {
      const { startNodeId: originalStartId, endNodeId: originalEndId, text } = connection;
      let startId = originalStartId;
      let endId = originalEndId;

      if (startId.includes(";")) {
        const cursorResult = await createCursorNode(startId);
        if (cursorResult?.id) startId = cursorResult.id;
      }

      if (endId.includes(";")) {
        const cursorResult = await createCursorNode(endId);
        if (cursorResult?.id) endId = cursorResult.id;
      }

      const clonedConnector = (defaultConnector as ConnectorNode).clone();
      clonedConnector.name = `TTF_Connector/${startId}/${endId}`;
      clonedConnector.connectorStart = { endpointNodeId: startId, magnet: "AUTO" };
      clonedConnector.connectorEnd = { endpointNodeId: endId, magnet: "AUTO" };

      if (text) {
        try {
          await figma.loadFontAsync({ family: "Inter", style: "Regular" });
          clonedConnector.text.characters = text;
        } catch (fontError) {
          console.error("Error setting text:", fontError);
        }
      }

      results.push({
        id: clonedConnector.id,
        originalStartNodeId: originalStartId,
        originalEndNodeId: originalEndId,
        usedStartNodeId: startId,
        usedEndNodeId: endId,
        text: text || "",
      });

      processedCount++;
      sendProgressUpdate(commandId, "create_connections", "in_progress", processedCount / connections.length, connections.length, processedCount, `Created connection ${processedCount}/${connections.length}`);
    } catch (error) {
      processedCount++;
      results.push({
        originalStartNodeId: connection.startNodeId,
        originalEndNodeId: connection.endNodeId,
        usedStartNodeId: connection.startNodeId,
        usedEndNodeId: connection.endNodeId,
        text: connection.text || "",
        error: (error as Error).message,
      });
    }
  }

  sendProgressUpdate(commandId, "create_connections", "completed", 1, connections.length, connections.length, `Completed creating ${results.length} connections`);

  return { success: true, count: results.length, connections: results };
}
