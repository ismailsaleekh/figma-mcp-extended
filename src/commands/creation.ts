// src/commands/creation.ts

import { createSolidPaint } from "../helpers/colors";
import { setCharacters, getFontStyle } from "../helpers/fonts";
import {
  svgPathToVectorNetwork,
  parseSvgPaths,
  parseSvgViewBox,
  detectSvgStyle,
  extractStrokeWidth,
} from "../helpers/svg";
import type {
  CreateRectangleParams,
  CreateFrameParams,
  CreateTextParams,
  MoveNodeParams,
  ResizeNodeParams,
  DeleteNodeParams,
  CloneNodeParams,
  CreateEllipseParams,
  CreateLineParams,
  CreatePolygonParams,
  CreateVectorParams,
  CreateSvgParams,
} from "../types";

interface RectangleResult {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  parentId?: string;
}

interface FrameResult {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fills: readonly Paint[] | typeof figma.mixed;
  strokes: readonly Paint[];
  strokeWeight: number;
  layoutMode: "NONE" | "HORIZONTAL" | "VERTICAL";
  layoutWrap: "NO_WRAP" | "WRAP";
  parentId?: string;
}

interface TextResult {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  characters: string;
  fontSize: number | typeof figma.mixed;
  fontWeight: number;
  fontColor: { r: number; g: number; b: number; a?: number };
  fontName: FontName | typeof figma.mixed;
  fills: readonly Paint[] | typeof figma.mixed;
  parentId?: string;
}

interface MoveResult {
  id: string;
  name: string;
  x: number;
  y: number;
}

interface ResizeResult {
  id: string;
  name: string;
  width: number;
  height: number;
}

interface DeleteResult {
  id: string;
  name: string;
  type: string;
}

interface CloneResult {
  id: string;
  name: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

type ChildrenMixin = { appendChild(child: SceneNode): void };

/**
 * Create a rectangle
 */
export async function createRectangle(
  params?: CreateRectangleParams
): Promise<RectangleResult> {
  const {
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    name = "Rectangle",
    parentId,
  } = params || {};

  const rect = figma.createRectangle();
  rect.x = x;
  rect.y = y;
  rect.resize(width, height);
  rect.name = name;

  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (!parentNode) {
      throw new Error(`Parent node not found with ID: ${parentId}`);
    }
    if (!("appendChild" in parentNode)) {
      throw new Error(`Parent node does not support children: ${parentId}`);
    }
    (parentNode as ChildrenMixin).appendChild(rect);
  } else {
    figma.currentPage.appendChild(rect);
  }

  return {
    id: rect.id,
    name: rect.name,
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    parentId: rect.parent ? rect.parent.id : undefined,
  };
}

/**
 * Create a frame with optional auto-layout
 */
export async function createFrame(
  params?: CreateFrameParams
): Promise<FrameResult> {
  const {
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    name = "Frame",
    parentId,
    fillColor,
    strokeColor,
    strokeWeight,
    layoutMode = "NONE",
    layoutWrap = "NO_WRAP",
    paddingTop = 10,
    paddingRight = 10,
    paddingBottom = 10,
    paddingLeft = 10,
    primaryAxisAlignItems = "MIN",
    counterAxisAlignItems = "MIN",
    layoutSizingHorizontal = "FIXED",
    layoutSizingVertical = "FIXED",
    itemSpacing = 0,
  } = params || {};

  const frame = figma.createFrame();
  frame.x = x;
  frame.y = y;
  frame.resize(width, height);
  frame.name = name;

  // Set layout mode if provided
  if (layoutMode !== "NONE") {
    frame.layoutMode = layoutMode;
    frame.layoutWrap = layoutWrap;
    frame.paddingTop = paddingTop;
    frame.paddingRight = paddingRight;
    frame.paddingBottom = paddingBottom;
    frame.paddingLeft = paddingLeft;
    frame.primaryAxisAlignItems = primaryAxisAlignItems;
    frame.counterAxisAlignItems = counterAxisAlignItems;
    frame.layoutSizingHorizontal = layoutSizingHorizontal;
    frame.layoutSizingVertical = layoutSizingVertical;
    frame.itemSpacing = itemSpacing;
  }

  // Set fill color if provided
  if (fillColor) {
    frame.fills = [createSolidPaint(fillColor)];
  }

  // Set stroke if provided
  if (strokeColor) {
    frame.strokes = [createSolidPaint(strokeColor)];
  }

  if (strokeWeight !== undefined) {
    frame.strokeWeight = strokeWeight;
  }

  // Append to parent
  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (!parentNode) {
      throw new Error(`Parent node not found with ID: ${parentId}`);
    }
    if (!("appendChild" in parentNode)) {
      throw new Error(`Parent node does not support children: ${parentId}`);
    }
    (parentNode as ChildrenMixin).appendChild(frame);
  } else {
    figma.currentPage.appendChild(frame);
  }

  return {
    id: frame.id,
    name: frame.name,
    x: frame.x,
    y: frame.y,
    width: frame.width,
    height: frame.height,
    fills: frame.fills,
    strokes: frame.strokes,
    strokeWeight: typeof frame.strokeWeight === "number" ? frame.strokeWeight : 0,
    layoutMode: frame.layoutMode as "NONE" | "HORIZONTAL" | "VERTICAL",
    layoutWrap: frame.layoutWrap,
    parentId: frame.parent ? frame.parent.id : undefined,
  };
}

/**
 * Create a text node
 */
export async function createText(
  params?: CreateTextParams
): Promise<TextResult> {
  const {
    x = 0,
    y = 0,
    width,
    text = "Text",
    fontSize = 14,
    fontWeight = 400,
    fontColor = { r: 0, g: 0, b: 0, a: 1 },
    textAlignHorizontal = "LEFT",
    name = "",
    parentId,
  } = params || {};

  const textNode = figma.createText();
  textNode.x = x;
  textNode.y = y;
  textNode.name = name || text;

  try {
    await figma.loadFontAsync({
      family: "Inter",
      style: getFontStyle(fontWeight),
    });
    textNode.fontName = { family: "Inter", style: getFontStyle(fontWeight) };
    textNode.fontSize = fontSize;
  } catch (error) {
    console.error("Error setting font size", error);
  }

  await setCharacters(textNode, text);

  // Set text color
  textNode.fills = [createSolidPaint(fontColor)];

  // Set width and alignment (for centered/right-aligned text)
  if (width !== undefined) {
    textNode.textAutoResize = "HEIGHT";
    textNode.resize(width, textNode.height);
  }
  textNode.textAlignHorizontal = textAlignHorizontal;

  // Append to parent
  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (!parentNode) {
      throw new Error(`Parent node not found with ID: ${parentId}`);
    }
    if (!("appendChild" in parentNode)) {
      throw new Error(`Parent node does not support children: ${parentId}`);
    }
    (parentNode as ChildrenMixin).appendChild(textNode);
  } else {
    figma.currentPage.appendChild(textNode);
  }

  return {
    id: textNode.id,
    name: textNode.name,
    x: textNode.x,
    y: textNode.y,
    width: textNode.width,
    height: textNode.height,
    characters: textNode.characters,
    fontSize: textNode.fontSize,
    fontWeight: fontWeight,
    fontColor: fontColor,
    fontName: textNode.fontName,
    fills: textNode.fills,
    parentId: textNode.parent ? textNode.parent.id : undefined,
  };
}

/**
 * Move a node
 */
export async function moveNode(params: MoveNodeParams): Promise<MoveResult> {
  const { nodeId, x, y } = params;

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  if (x === undefined || y === undefined) {
    throw new Error("Missing x or y parameters");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (!("x" in node) || !("y" in node)) {
    throw new Error(`Node does not support position: ${nodeId}`);
  }

  const sceneNode = node as SceneNode & { x: number; y: number };
  sceneNode.x = x;
  sceneNode.y = y;

  return {
    id: node.id,
    name: node.name,
    x: sceneNode.x,
    y: sceneNode.y,
  };
}

/**
 * Resize a node
 */
export async function resizeNode(params: ResizeNodeParams): Promise<ResizeResult> {
  const { nodeId, width, height } = params;

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  if (width === undefined || height === undefined) {
    throw new Error("Missing width or height parameters");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (!("resize" in node)) {
    throw new Error(`Node does not support resizing: ${nodeId}`);
  }

  const resizableNode = node as SceneNode & { resize(w: number, h: number): void; width: number; height: number };
  resizableNode.resize(width, height);

  return {
    id: node.id,
    name: node.name,
    width: resizableNode.width,
    height: resizableNode.height,
  };
}

/**
 * Delete a node
 */
export async function deleteNode(params: DeleteNodeParams): Promise<DeleteResult> {
  const { nodeId } = params;

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  const nodeInfo: DeleteResult = {
    id: node.id,
    name: node.name,
    type: node.type,
  };

  node.remove();

  return nodeInfo;
}

/**
 * Clone a node
 */
export async function cloneNode(params: CloneNodeParams): Promise<CloneResult> {
  const { nodeId, x, y } = params;

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  const clone = (node as SceneNode).clone();

  if (x !== undefined && y !== undefined) {
    if (!("x" in clone) || !("y" in clone)) {
      throw new Error(`Cloned node does not support position: ${nodeId}`);
    }
    const positionedClone = clone as SceneNode & { x: number; y: number };
    positionedClone.x = x;
    positionedClone.y = y;
  }

  if (node.parent && "appendChild" in node.parent) {
    (node.parent as ChildrenMixin).appendChild(clone);
  } else {
    figma.currentPage.appendChild(clone);
  }

  return {
    id: clone.id,
    name: clone.name,
    x: "x" in clone ? (clone as { x: number }).x : undefined,
    y: "y" in clone ? (clone as { y: number }).y : undefined,
    width: "width" in clone ? (clone as { width: number }).width : undefined,
    height: "height" in clone ? (clone as { height: number }).height : undefined,
  };
}

interface EllipseResult {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  parentId?: string;
}

/**
 * Create an ellipse
 */
export async function createEllipse(
  params?: CreateEllipseParams
): Promise<EllipseResult> {
  const {
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    name = "Ellipse",
    parentId,
    fillColor,
  } = params || {};

  const ellipse = figma.createEllipse();
  ellipse.x = x;
  ellipse.y = y;
  ellipse.resize(width, height);
  ellipse.name = name;

  if (fillColor) {
    ellipse.fills = [createSolidPaint(fillColor)];
  }

  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (!parentNode) {
      throw new Error(`Parent node not found with ID: ${parentId}`);
    }
    if (!("appendChild" in parentNode)) {
      throw new Error(`Parent node does not support children: ${parentId}`);
    }
    (parentNode as ChildrenMixin).appendChild(ellipse);
  } else {
    figma.currentPage.appendChild(ellipse);
  }

  return {
    id: ellipse.id,
    name: ellipse.name,
    x: ellipse.x,
    y: ellipse.y,
    width: ellipse.width,
    height: ellipse.height,
    parentId: ellipse.parent ? ellipse.parent.id : undefined,
  };
}

interface LineResult {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  parentId?: string;
}

/**
 * Create a line
 */
export async function createLine(
  params?: CreateLineParams
): Promise<LineResult> {
  const {
    startX = 0,
    startY = 0,
    endX = 100,
    endY = 0,
    name = "Line",
    parentId,
    strokeColor = { r: 0, g: 0, b: 0, a: 1 },
    strokeWeight = 1,
  } = params || {};

  const line = figma.createLine();

  // Calculate length and rotation
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const rotation = Math.atan2(dy, dx) * (180 / Math.PI);

  line.x = startX;
  line.y = startY;
  line.resize(length, 0);
  line.rotation = rotation;
  line.name = name;
  line.strokes = [createSolidPaint(strokeColor)];
  line.strokeWeight = strokeWeight;

  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (!parentNode) {
      throw new Error(`Parent node not found with ID: ${parentId}`);
    }
    if (!("appendChild" in parentNode)) {
      throw new Error(`Parent node does not support children: ${parentId}`);
    }
    (parentNode as ChildrenMixin).appendChild(line);
  } else {
    figma.currentPage.appendChild(line);
  }

  return {
    id: line.id,
    name: line.name,
    x: line.x,
    y: line.y,
    width: line.width,
    height: line.height,
    rotation: line.rotation,
    parentId: line.parent ? line.parent.id : undefined,
  };
}

interface PolygonResult {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pointCount: number;
  parentId?: string;
}

/**
 * Create a polygon/star shape
 */
export async function createPolygon(
  params?: CreatePolygonParams
): Promise<PolygonResult> {
  const {
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    pointCount = 3,
    name = "Polygon",
    parentId,
    fillColor,
  } = params || {};

  const polygon = figma.createPolygon();
  polygon.x = x;
  polygon.y = y;
  polygon.resize(width, height);
  polygon.pointCount = Math.max(3, Math.min(100, pointCount));
  polygon.name = name;

  if (fillColor) {
    polygon.fills = [createSolidPaint(fillColor)];
  }

  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (!parentNode) {
      throw new Error(`Parent node not found with ID: ${parentId}`);
    }
    if (!("appendChild" in parentNode)) {
      throw new Error(`Parent node does not support children: ${parentId}`);
    }
    (parentNode as ChildrenMixin).appendChild(polygon);
  } else {
    figma.currentPage.appendChild(polygon);
  }

  return {
    id: polygon.id,
    name: polygon.name,
    x: polygon.x,
    y: polygon.y,
    width: polygon.width,
    height: polygon.height,
    pointCount: polygon.pointCount,
    parentId: polygon.parent ? polygon.parent.id : undefined,
  };
}

interface VectorResult {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  parentId?: string;
}

/**
 * Create a vector from SVG path data
 */
export async function createVector(
  params: CreateVectorParams
): Promise<VectorResult> {
  const {
    vectorPaths,
    x = 0,
    y = 0,
    name = "Vector",
    parentId,
    fillColor,
    strokeColor,
    strokeWeight,
  } = params;

  if (!vectorPaths || !Array.isArray(vectorPaths) || vectorPaths.length === 0) {
    throw new Error("vectorPaths must be a non-empty array");
  }

  const vector = figma.createVector();
  vector.x = x;
  vector.y = y;
  vector.name = name;

  // Set vector paths
  vector.vectorPaths = vectorPaths.map((path) => ({
    windingRule: path.windingRule,
    data: path.data,
  }));

  if (fillColor) {
    vector.fills = [createSolidPaint(fillColor)];
  }

  if (strokeColor) {
    vector.strokes = [createSolidPaint(strokeColor)];
  }

  if (strokeWeight !== undefined) {
    vector.strokeWeight = strokeWeight;
  }

  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (!parentNode) {
      throw new Error(`Parent node not found with ID: ${parentId}`);
    }
    if (!("appendChild" in parentNode)) {
      throw new Error(`Parent node does not support children: ${parentId}`);
    }
    (parentNode as ChildrenMixin).appendChild(vector);
  } else {
    figma.currentPage.appendChild(vector);
  }

  return {
    id: vector.id,
    name: vector.name,
    x: vector.x,
    y: vector.y,
    width: vector.width,
    height: vector.height,
    parentId: vector.parent ? vector.parent.id : undefined,
  };
}

interface SvgResult {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  parentId?: string;
}

/**
 * Create a vector from SVG path data or full SVG content
 * Supports complex paths with curves (C, S, Q, A commands)
 */
export async function createSvg(params: CreateSvgParams): Promise<SvgResult> {
  const {
    svg,
    x = 0,
    y = 0,
    width,
    height,
    name = "SVG",
    parentId,
    fillColor,
    strokeColor,
    strokeWeight,
    windingRule = "EVENODD",
  } = params;

  if (!svg || typeof svg !== "string") {
    throw new Error("svg parameter is required and must be a string");
  }

  // Determine if input is full SVG or just path data
  const isSvgContent = svg.trim().startsWith("<");
  let pathsData: string[];
  let originalSize = { width: 24, height: 24 };
  let detectedStyle: "stroke" | "fill" | "both" = "stroke";
  let detectedStrokeWeight: number | null = null;

  if (isSvgContent) {
    // Parse full SVG content
    pathsData = parseSvgPaths(svg);
    const viewBox = parseSvgViewBox(svg);
    if (viewBox) {
      originalSize = viewBox;
    }
    detectedStyle = detectSvgStyle(svg);
    detectedStrokeWeight = extractStrokeWidth(svg);
  } else {
    // Treat as single path data
    pathsData = [svg];
  }

  if (pathsData.length === 0) {
    throw new Error("No valid path data found in SVG");
  }

  // Create the vector node
  const vector = figma.createVector();
  vector.name = name;

  // Convert all paths and merge into single network
  const allVertices: VectorVertex[] = [];
  const allSegments: VectorSegment[] = [];
  const allLoops: number[][] = [];

  for (const pathData of pathsData) {
    const network = svgPathToVectorNetwork(pathData, windingRule);

    // Offset indices for merged network
    const vertexOffset = allVertices.length;
    const segmentOffset = allSegments.length;

    // Add vertices
    allVertices.push(...network.vertices);

    // Add segments with offset indices
    for (const seg of network.segments) {
      allSegments.push({
        start: seg.start + vertexOffset,
        end: seg.end + vertexOffset,
        tangentStart: seg.tangentStart,
        tangentEnd: seg.tangentEnd,
      });
    }

    // Add loops with offset indices
    for (const region of network.regions) {
      for (const loop of region.loops) {
        allLoops.push(loop.map((idx) => idx + segmentOffset));
      }
    }
  }

  // Set vector network
  await vector.setVectorNetworkAsync({
    vertices: allVertices,
    segments: allSegments,
    regions: allLoops.length > 0 ? [{ windingRule, loops: allLoops }] : undefined,
  });

  // Apply styling based on detected style or explicit params
  const finalStrokeWeight = strokeWeight ?? detectedStrokeWeight ?? 1.5;

  if (detectedStyle === "fill" || detectedStyle === "both") {
    if (fillColor) {
      vector.fills = [createSolidPaint(fillColor)];
    } else if (!strokeColor && detectedStyle === "fill") {
      // Default fill for fill-only SVGs
      vector.fills = [createSolidPaint({ r: 0, g: 0, b: 0, a: 1 })];
    }
  }

  if (detectedStyle === "stroke" || detectedStyle === "both" || strokeColor) {
    if (strokeColor) {
      vector.strokes = [createSolidPaint(strokeColor)];
    } else if (detectedStyle === "stroke") {
      // Default stroke for stroke-only SVGs
      vector.strokes = [createSolidPaint({ r: 0, g: 0, b: 0, a: 1 })];
    }
    vector.strokeWeight = finalStrokeWeight;
    vector.strokeCap = "ROUND";
    vector.strokeJoin = "ROUND";

    // Clear fills for stroke-only SVGs
    if (detectedStyle === "stroke" && !fillColor) {
      vector.fills = [];
    }
  }

  // Scale to target size if specified
  const targetWidth = width ?? originalSize.width;
  const targetHeight = height ?? originalSize.height;

  if (vector.width > 0 && vector.height > 0) {
    vector.resize(targetWidth, targetHeight);
  }

  // Position
  vector.x = x;
  vector.y = y;

  // Parent
  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (!parentNode) {
      throw new Error(`Parent node not found: ${parentId}`);
    }
    if (!("appendChild" in parentNode)) {
      throw new Error(`Parent does not support children: ${parentId}`);
    }
    (parentNode as ChildrenMixin).appendChild(vector);
  } else {
    figma.currentPage.appendChild(vector);
  }

  return {
    id: vector.id,
    name: vector.name,
    x: vector.x,
    y: vector.y,
    width: vector.width,
    height: vector.height,
    parentId: vector.parent ? vector.parent.id : undefined,
  };
}
