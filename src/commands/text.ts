// src/commands/text.ts

import type {
  ScanTextNodesParams,
  SetTextContentParams,
  SetMultipleTextContentsParams,
  TextNodeInfo,
  SetFontFamilyParams,
  SetFontSizeParams,
  SetFontWeightParams,
  SetTextAlignmentParams,
  SetLineHeightParams,
  SetLetterSpacingParams,
} from "../types";
import { generateCommandId, sendProgressUpdate, delay } from "../helpers/progress";
import { setCharacters, getFontStyle } from "../helpers/fonts";
import { collectNodesToProcess, highlightNodeWithFill } from "../helpers/nodes";

async function processTextNode(
  node: TextNode,
  parentPath: string[],
  depth: number
): Promise<TextNodeInfo | null> {
  if (node.type !== "TEXT") return null;

  try {
    let fontFamily = "";
    let fontStyle = "";

    if (node.fontName && typeof node.fontName === "object") {
      if ("family" in node.fontName) fontFamily = node.fontName.family;
      if ("style" in node.fontName) fontStyle = node.fontName.style;
    }

    const safeTextNode: TextNodeInfo = {
      id: node.id,
      name: node.name || "Text",
      type: node.type,
      characters: node.characters,
      fontSize: typeof node.fontSize === "number" ? node.fontSize : 0,
      fontFamily: fontFamily,
      fontStyle: fontStyle,
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height,
      path: parentPath.join(" > "),
      depth: depth,
    };

    await highlightNodeWithFill(node, 100);

    return safeTextNode;
  } catch (nodeErr) {
    console.error("Error processing text node:", nodeErr);
    return null;
  }
}

async function findTextNodes(
  node: SceneNode,
  parentPath: string[] = [],
  depth: number = 0,
  textNodes: TextNodeInfo[] = []
): Promise<void> {
  if (node.visible === false) return;

  const nodePath = [...parentPath, node.name || `Unnamed ${node.type}`];

  if (node.type === "TEXT") {
    const result = await processTextNode(node, nodePath, depth);
    if (result) textNodes.push(result);
  }

  if ("children" in node) {
    for (const child of node.children) {
      await findTextNodes(child, nodePath, depth + 1, textNodes);
    }
  }
}

export async function scanTextNodes(params: ScanTextNodesParams & { commandId?: string }) {
  const {
    nodeId,
    useChunking = true,
    chunkSize = 10,
    commandId = generateCommandId(),
  } = params;

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node with ID ${nodeId} not found`);
  }

  if (!useChunking) {
    const textNodes: TextNodeInfo[] = [];
    sendProgressUpdate(commandId, "scan_text_nodes", "started", 0, 1, 0, "Starting scan");
    await findTextNodes(node as SceneNode, [], 0, textNodes);
    sendProgressUpdate(commandId, "scan_text_nodes", "completed", 100, textNodes.length, textNodes.length, "Scan complete");
    return { success: true, count: textNodes.length, textNodes, commandId };
  }

  // Chunked implementation
  const nodesToProcess: Array<{ node: SceneNode; parentPath: string[]; depth: number }> = [];
  sendProgressUpdate(commandId, "scan_text_nodes", "started", 0, 0, 0, "Starting chunked scan");
  await collectNodesToProcess(node as SceneNode, [], 0, nodesToProcess);

  const totalNodes = nodesToProcess.length;
  const totalChunks = Math.ceil(totalNodes / chunkSize);
  const allTextNodes: TextNodeInfo[] = [];
  let processedNodes = 0;

  for (let i = 0; i < totalNodes; i += chunkSize) {
    const chunkEnd = Math.min(i + chunkSize, totalNodes);
    const chunkNodes = nodesToProcess.slice(i, chunkEnd);

    for (const nodeInfo of chunkNodes) {
      if (nodeInfo.node.type === "TEXT") {
        const result = await processTextNode(nodeInfo.node as TextNode, nodeInfo.parentPath, nodeInfo.depth);
        if (result) allTextNodes.push(result);
      }
      await delay(5);
    }

    processedNodes += chunkNodes.length;
    sendProgressUpdate(commandId, "scan_text_nodes", "in_progress", Math.round((processedNodes / totalNodes) * 100), totalNodes, processedNodes, `Processed ${processedNodes}/${totalNodes}`);
  }

  sendProgressUpdate(commandId, "scan_text_nodes", "completed", 100, totalNodes, processedNodes, `Found ${allTextNodes.length} text nodes`);

  return {
    success: true,
    totalNodes: allTextNodes.length,
    processedNodes,
    chunks: totalChunks,
    textNodes: allTextNodes,
    commandId,
  };
}

export async function setTextContent(params: SetTextContentParams) {
  const { nodeId, text } = params;

  if (!nodeId) throw new Error("Missing nodeId parameter");
  if (text === undefined) throw new Error("Missing text parameter");

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) throw new Error(`Node not found with ID: ${nodeId}`);
  if (node.type !== "TEXT") throw new Error(`Node is not a text node: ${nodeId}`);

  const textNode = node as TextNode;
  await figma.loadFontAsync(textNode.fontName as FontName);
  await setCharacters(textNode, text);

  return {
    id: textNode.id,
    name: textNode.name,
    characters: textNode.characters,
    fontName: textNode.fontName,
  };
}

export async function setMultipleTextContents(params: SetMultipleTextContentsParams & { commandId?: string }) {
  const { nodeId, text, commandId = generateCommandId() } = params;

  if (!nodeId || !text || !Array.isArray(text)) {
    throw new Error("Missing required parameters");
  }

  sendProgressUpdate(commandId, "set_multiple_text_contents", "started", 0, text.length, 0, "Starting text replacement");

  const results: Array<{ success: boolean; nodeId: string; originalText?: string; translatedText?: string; error?: string }> = [];
  let successCount = 0;
  let failureCount = 0;
  const CHUNK_SIZE = 5;

  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    const chunk = text.slice(i, i + CHUNK_SIZE);

    const chunkPromises = chunk.map(async (replacement) => {
      if (!replacement.nodeId || replacement.text === undefined) {
        return { success: false, nodeId: replacement.nodeId || "unknown", error: "Missing parameters" };
      }

      try {
        const textNode = await figma.getNodeByIdAsync(replacement.nodeId);
        if (!textNode || textNode.type !== "TEXT") {
          return { success: false, nodeId: replacement.nodeId, error: "Node not found or not a text node" };
        }

        const originalText = (textNode as TextNode).characters;
        await setTextContent({ nodeId: replacement.nodeId, text: replacement.text });

        return { success: true, nodeId: replacement.nodeId, originalText, translatedText: replacement.text };
      } catch (error) {
        return { success: false, nodeId: replacement.nodeId, error: (error as Error).message };
      }
    });

    const chunkResults = await Promise.all(chunkPromises);
    chunkResults.forEach((result) => {
      if (result.success) successCount++;
      else failureCount++;
      results.push(result);
    });

    sendProgressUpdate(commandId, "set_multiple_text_contents", "in_progress", Math.round(((i + chunk.length) / text.length) * 100), text.length, successCount + failureCount, `Processed ${successCount + failureCount}/${text.length}`);

    if (i + CHUNK_SIZE < text.length) await delay(1000);
  }

  sendProgressUpdate(commandId, "set_multiple_text_contents", "completed", 100, text.length, successCount + failureCount, `Complete: ${successCount} successful, ${failureCount} failed`);

  return {
    success: successCount > 0,
    nodeId,
    replacementsApplied: successCount,
    replacementsFailed: failureCount,
    totalReplacements: text.length,
    results,
    commandId,
  };
}

interface SetFontFamilyResult {
  id: string;
  name: string;
  fontName: FontName;
  characters: string;
}

/**
 * Set font family on a text node
 */
export async function setFontFamily(params: SetFontFamilyParams): Promise<SetFontFamilyResult> {
  const { nodeId, fontFamily, fontStyle = "Regular" } = params;

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  if (!fontFamily) {
    throw new Error("Missing fontFamily parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (node.type !== "TEXT") {
    throw new Error(`Node is not a TEXT node: ${nodeId}`);
  }

  const textNode = node as TextNode;

  try {
    await figma.loadFontAsync({ family: fontFamily, style: fontStyle });
    textNode.fontName = { family: fontFamily, style: fontStyle };
  } catch (error) {
    const err = error as Error;
    throw new Error(`Failed to load font "${fontFamily}" with style "${fontStyle}": ${err.message}`);
  }

  return {
    id: textNode.id,
    name: textNode.name,
    fontName: textNode.fontName as FontName,
    characters: textNode.characters,
  };
}

interface SetFontSizeResult {
  id: string;
  name: string;
  fontSize: number;
  characters: string;
}

/**
 * Set font size on a text node
 */
export async function setFontSize(params: SetFontSizeParams): Promise<SetFontSizeResult> {
  const { nodeId, fontSize } = params;

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  if (fontSize === undefined || fontSize <= 0) {
    throw new Error("fontSize must be a positive number");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (node.type !== "TEXT") {
    throw new Error(`Node is not a TEXT node: ${nodeId}`);
  }

  const textNode = node as TextNode;

  // Load current font before changing size
  const currentFont = textNode.fontName;
  if (currentFont !== figma.mixed) {
    await figma.loadFontAsync(currentFont);
  } else {
    throw new Error("Cannot set font size on text with mixed fonts");
  }

  textNode.fontSize = fontSize;

  return {
    id: textNode.id,
    name: textNode.name,
    fontSize: textNode.fontSize as number,
    characters: textNode.characters,
  };
}

interface SetFontWeightResult {
  id: string;
  name: string;
  fontName: FontName;
  fontWeight: number;
  characters: string;
}

/**
 * Set font weight on a text node
 */
export async function setFontWeight(params: SetFontWeightParams): Promise<SetFontWeightResult> {
  const { nodeId, fontWeight } = params;

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  if (fontWeight === undefined || fontWeight < 100 || fontWeight > 900) {
    throw new Error("fontWeight must be between 100 and 900");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (node.type !== "TEXT") {
    throw new Error(`Node is not a TEXT node: ${nodeId}`);
  }

  const textNode = node as TextNode;
  const currentFont = textNode.fontName;

  if (currentFont === figma.mixed) {
    throw new Error("Cannot set font weight on text with mixed fonts");
  }

  const newFontStyle = getFontStyle(fontWeight);

  try {
    await figma.loadFontAsync({ family: currentFont.family, style: newFontStyle });
    textNode.fontName = { family: currentFont.family, style: newFontStyle };
  } catch (error) {
    const err = error as Error;
    throw new Error(`Failed to load font "${currentFont.family}" with weight ${fontWeight}: ${err.message}`);
  }

  return {
    id: textNode.id,
    name: textNode.name,
    fontName: textNode.fontName as FontName,
    fontWeight: fontWeight,
    characters: textNode.characters,
  };
}

interface SetTextAlignmentResult {
  id: string;
  name: string;
  textAlignHorizontal: string;
  textAlignVertical: string;
}

/**
 * Set text alignment on a text node
 */
export async function setTextAlignment(params: SetTextAlignmentParams): Promise<SetTextAlignmentResult> {
  const { nodeId, horizontalAlign, verticalAlign } = params;

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (node.type !== "TEXT") {
    throw new Error(`Node is not a TEXT node: ${nodeId}`);
  }

  const textNode = node as TextNode;

  // Load font before modifying
  const currentFont = textNode.fontName;
  if (currentFont !== figma.mixed) {
    await figma.loadFontAsync(currentFont);
  }

  if (horizontalAlign) {
    textNode.textAlignHorizontal = horizontalAlign;
  }

  if (verticalAlign) {
    textNode.textAlignVertical = verticalAlign;
  }

  return {
    id: textNode.id,
    name: textNode.name,
    textAlignHorizontal: textNode.textAlignHorizontal,
    textAlignVertical: textNode.textAlignVertical,
  };
}

interface SetLineHeightResult {
  id: string;
  name: string;
  lineHeight: LineHeight;
}

/**
 * Set line height on a text node
 */
export async function setLineHeight(params: SetLineHeightParams): Promise<SetLineHeightResult> {
  const { nodeId, lineHeight, unit = "PIXELS" } = params;

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  if (lineHeight === undefined) {
    throw new Error("Missing lineHeight parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (node.type !== "TEXT") {
    throw new Error(`Node is not a TEXT node: ${nodeId}`);
  }

  const textNode = node as TextNode;

  // Load font before modifying
  const currentFont = textNode.fontName;
  if (currentFont !== figma.mixed) {
    await figma.loadFontAsync(currentFont);
  }

  if (lineHeight === "AUTO") {
    textNode.lineHeight = { unit: "AUTO" };
  } else {
    textNode.lineHeight = { value: lineHeight, unit: unit };
  }

  return {
    id: textNode.id,
    name: textNode.name,
    lineHeight: textNode.lineHeight as LineHeight,
  };
}

interface SetLetterSpacingResult {
  id: string;
  name: string;
  letterSpacing: LetterSpacing;
}

/**
 * Set letter spacing on a text node
 */
export async function setLetterSpacing(params: SetLetterSpacingParams): Promise<SetLetterSpacingResult> {
  const { nodeId, letterSpacing, unit = "PIXELS" } = params;

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  if (letterSpacing === undefined) {
    throw new Error("Missing letterSpacing parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (node.type !== "TEXT") {
    throw new Error(`Node is not a TEXT node: ${nodeId}`);
  }

  const textNode = node as TextNode;

  // Load font before modifying
  const currentFont = textNode.fontName;
  if (currentFont !== figma.mixed) {
    await figma.loadFontAsync(currentFont);
  }

  textNode.letterSpacing = { value: letterSpacing, unit: unit };

  return {
    id: textNode.id,
    name: textNode.name,
    letterSpacing: textNode.letterSpacing as LetterSpacing,
  };
}
