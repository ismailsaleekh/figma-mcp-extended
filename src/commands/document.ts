// src/commands/document.ts

import { filterFigmaNode } from "../helpers/nodes";
import type { BasicNodeInfo, FilteredNode, CreatePageParams, SetCurrentPageParams } from "../types";

interface DocumentInfo {
  name: string;
  id: string;
  type: string;
  children: BasicNodeInfo[];
  currentPage: {
    id: string;
    name: string;
    childCount: number;
  };
  pages: Array<{
    id: string;
    name: string;
    childCount: number;
  }>;
}

interface AllPagesInfo {
  documentName: string;
  documentId: string;
  totalPages: number;
  currentPage: {
    id: string;
    name: string;
    childCount: number;
  };
  pages: Array<{
    id: string;
    name: string;
    type: string;
    childCount: number;
    isCurrentPage: boolean;
  }>;
  error?: string;
}

interface SelectionInfo {
  selectionCount: number;
  selection: BasicNodeInfo[];
}

interface NodeInfoResponse {
  nodeId: string;
  document: FilteredNode | null;
}

/**
 * Get current page/document info
 */
export async function getDocumentInfo(): Promise<DocumentInfo> {
  await figma.currentPage.loadAsync();
  const page = figma.currentPage;

  return {
    name: page.name,
    id: page.id,
    type: page.type,
    children: page.children.map((node) => ({
      id: node.id,
      name: node.name,
      type: node.type,
    })),
    currentPage: {
      id: page.id,
      name: page.name,
      childCount: page.children.length,
    },
    pages: [
      {
        id: page.id,
        name: page.name,
        childCount: page.children.length,
      },
    ],
  };
}

/**
 * Get all pages in document
 */
export async function getAllPagesInfo(): Promise<AllPagesInfo> {
  try {
    await figma.loadAllPagesAsync();
    const root = figma.root;

    return {
      documentName: root.name || "Unknown Document",
      documentId: root.id,
      totalPages: root.children.length,
      currentPage: {
        id: figma.currentPage.id,
        name: figma.currentPage.name,
        childCount: figma.currentPage.children.length,
      },
      pages: root.children.map((page) => ({
        id: page.id,
        name: page.name,
        type: page.type,
        childCount: page.children ? page.children.length : 0,
        isCurrentPage: page.id === figma.currentPage.id,
      })),
    };
  } catch (error) {
    const err = error as Error;
    console.error("Error in getAllPagesInfo:", err);
    return {
      error: err.message,
      documentName: "Error loading",
      documentId: "",
      totalPages: 0,
      currentPage: {
        id: "",
        name: "",
        childCount: 0,
      },
      pages: [],
    };
  }
}

/**
 * Get current selection
 */
export async function getSelection(): Promise<SelectionInfo> {
  return {
    selectionCount: figma.currentPage.selection.length,
    selection: figma.currentPage.selection.map((node) => ({
      id: node.id,
      name: node.name,
      type: node.type,
      visible: node.visible,
    })),
  };
}

/**
 * Get info for a single node
 */
export async function getNodeInfo(nodeId: string): Promise<FilteredNode | null> {
  const node = await figma.getNodeByIdAsync(nodeId);

  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  const response = await (node as SceneNode).exportAsync({
    format: "JSON_REST_V1",
  });

  return filterFigmaNode((response as { document: Parameters<typeof filterFigmaNode>[0] }).document);
}

/**
 * Get info for multiple nodes
 */
export async function getNodesInfo(nodeIds: string[]): Promise<NodeInfoResponse[]> {
  try {
    const nodes = await Promise.all(
      nodeIds.map((id) => figma.getNodeByIdAsync(id))
    );

    const validNodes = nodes.filter((node): node is SceneNode => node !== null);

    const responses = await Promise.all(
      validNodes.map(async (node) => {
        const response = await node.exportAsync({
          format: "JSON_REST_V1",
        });
        return {
          nodeId: node.id,
          document: filterFigmaNode((response as { document: Parameters<typeof filterFigmaNode>[0] }).document),
        };
      })
    );

    return responses;
  } catch (error) {
    const err = error as Error;
    throw new Error(`Error getting nodes info: ${err.message}`);
  }
}

/**
 * Read selected design elements
 */
export async function readMyDesign(): Promise<NodeInfoResponse[]> {
  try {
    const nodes = await Promise.all(
      figma.currentPage.selection.map((node) => figma.getNodeByIdAsync(node.id))
    );

    const validNodes = nodes.filter((node): node is SceneNode => node !== null);

    const responses = await Promise.all(
      validNodes.map(async (node) => {
        const response = await node.exportAsync({
          format: "JSON_REST_V1",
        });
        return {
          nodeId: node.id,
          document: filterFigmaNode((response as { document: Parameters<typeof filterFigmaNode>[0] }).document),
        };
      })
    );

    return responses;
  } catch (error) {
    const err = error as Error;
    throw new Error(`Error getting nodes info: ${err.message}`);
  }
}

interface CreatePageResult {
  id: string;
  name: string;
  type: string;
  childCount: number;
  isCurrentPage: boolean;
}

/**
 * Create a new page in the document
 */
export async function createPage(params?: CreatePageParams): Promise<CreatePageResult> {
  const { name = "New Page", setAsCurrent = false } = params || {};

  const page = figma.createPage();
  page.name = name;

  if (setAsCurrent) {
    await figma.setCurrentPageAsync(page);
  }

  return {
    id: page.id,
    name: page.name,
    type: page.type,
    childCount: page.children.length,
    isCurrentPage: figma.currentPage.id === page.id,
  };
}

interface SetCurrentPageResult {
  success: boolean;
  previousPageId: string;
  previousPageName: string;
  currentPageId: string;
  currentPageName: string;
}

/**
 * Switch to a different page
 */
export async function setCurrentPage(params: SetCurrentPageParams): Promise<SetCurrentPageResult> {
  const { pageId } = params;

  if (!pageId) {
    throw new Error("Missing pageId parameter");
  }

  const previousPage = figma.currentPage;

  await figma.loadAllPagesAsync();
  const targetPage = figma.root.children.find((p) => p.id === pageId);

  if (!targetPage) {
    throw new Error(`Page not found with ID: ${pageId}`);
  }

  await figma.setCurrentPageAsync(targetPage);

  return {
    success: true,
    previousPageId: previousPage.id,
    previousPageName: previousPage.name,
    currentPageId: targetPage.id,
    currentPageName: targetPage.name,
  };
}
