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
  CreateFrameFullParams,
  CreateTextFullParams,
  CreateSvgFullParams,
  CreateRectangleFullParams,
  MoveNodeParams,
  ResizeNodeParams,
  DeleteNodeParams,
  CloneNodeParams,
  CreateEllipseParams,
  CreateLineParams,
  CreatePolygonParams,
  CreateVectorParams,
  CreateSvgParams,
  EffectConfig,
  GradientStop,
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
  clipsContent: boolean;
  layoutMode: "NONE" | "HORIZONTAL" | "VERTICAL";
  layoutWrap: "NO_WRAP" | "WRAP";
  cornerRadius: number | typeof figma.mixed;
  opacity: number;
  effects: readonly Effect[];
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

function buildGradientPaint(
  gradientType: string,
  stops: GradientStop[],
  angle: number
): GradientPaint {
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return {
    type: gradientType as GradientPaint["type"],
    gradientTransform: [
      [cos, sin, 0.5 - 0.5 * cos - 0.5 * sin],
      [-sin, cos, 0.5 + 0.5 * sin - 0.5 * cos],
    ],
    gradientStops: stops.map((stop) => ({
      position: stop.position,
      color: {
        r: stop.color.r,
        g: stop.color.g,
        b: stop.color.b,
        a: stop.color.a ?? 1,
      },
    })),
  };
}

async function appendToParent(node: SceneNode, parentId?: string): Promise<void> {
  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (!parentNode) {
      throw new Error(`Parent node not found with ID: ${parentId}`);
    }
    if (!("appendChild" in parentNode)) {
      throw new Error(`Parent node does not support children: ${parentId}`);
    }
    (parentNode as ChildrenMixin).appendChild(node);
  } else {
    figma.currentPage.appendChild(node);
  }
}

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
    fillColor,
  } = params || {};

  const rect = figma.createRectangle();
  rect.x = x;
  rect.y = y;
  rect.resize(width, height);
  rect.name = name;

  if (fillColor) {
    rect.fills = [createSolidPaint(fillColor)];
  }

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
    clipsContent,
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
    counterAxisSpacing,
    cornerRadius,
    corners,
    opacity,
    effects,
  } = params || {};

  const frame = figma.createFrame();
  frame.x = x;
  frame.y = y;
  frame.resize(width, height);
  frame.name = name;

  // Set clipsContent if explicitly provided
  if (clipsContent !== undefined) {
    frame.clipsContent = clipsContent;
  }

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
    if (counterAxisSpacing !== undefined && layoutWrap === "WRAP") {
      frame.counterAxisSpacing = counterAxisSpacing;
    }
  }

  // Set corner radius if provided
  if (cornerRadius !== undefined) {
    if (corners) {
      if (corners[0]) frame.topLeftRadius = cornerRadius;
      if (corners[1]) frame.topRightRadius = cornerRadius;
      if (corners[2]) frame.bottomRightRadius = cornerRadius;
      if (corners[3]) frame.bottomLeftRadius = cornerRadius;
    } else {
      frame.cornerRadius = cornerRadius;
    }
  }

  // Set fill color if provided, or clear fills for transparent
  if (fillColor === '__none__') {
    frame.fills = [];
  } else if (fillColor) {
    frame.fills = [createSolidPaint(fillColor)];
  }

  // Set stroke if provided
  if (strokeColor) {
    frame.strokes = [createSolidPaint(strokeColor)];
  }

  if (strokeWeight !== undefined) {
    frame.strokeWeight = strokeWeight;
  }

  // Set opacity if provided
  if (opacity !== undefined) {
    frame.opacity = opacity;
  }

  // Set effects (shadows, blur) if provided
  if (effects && Array.isArray(effects) && effects.length > 0) {
    frame.effects = effects.map((effect: EffectConfig) => {
      if (effect.type === "DROP_SHADOW" || effect.type === "INNER_SHADOW") {
        return {
          type: effect.type,
          visible: effect.visible !== false,
          radius: effect.radius,
          color: effect.color
            ? { r: effect.color.r, g: effect.color.g, b: effect.color.b, a: effect.color.a ?? 1 }
            : { r: 0, g: 0, b: 0, a: 0.25 },
          offset: effect.offset ?? { x: 0, y: 4 },
          spread: effect.spread ?? 0,
          blendMode: "NORMAL" as const,
        };
      } else {
        return {
          type: effect.type,
          visible: effect.visible !== false,
          radius: effect.radius,
        } as Effect;
      }
    });
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
    clipsContent: frame.clipsContent,
    layoutMode: frame.layoutMode as "NONE" | "HORIZONTAL" | "VERTICAL",
    layoutWrap: frame.layoutWrap,
    cornerRadius: frame.cornerRadius,
    opacity: frame.opacity,
    effects: frame.effects,
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

// ==========================================================================
// Composite commands — collapse multiple round-trips into one
// ==========================================================================

/**
 * Create a frame with all properties in a single command.
 * Replaces: create_frame + set_layout_positioning + set_layout_sizing
 *           + set_gradient_fill + set_visibility
 */
export async function createFrameFull(
  params: CreateFrameFullParams
): Promise<{ id: string }> {
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
    clipsContent,
    layoutMode = "NONE",
    layoutWrap = "NO_WRAP",
    paddingTop = 10,
    paddingRight = 10,
    paddingBottom = 10,
    paddingLeft = 10,
    primaryAxisAlignItems = "MIN",
    counterAxisAlignItems = "MIN",
    itemSpacing = 0,
    counterAxisSpacing,
    cornerRadius,
    corners,
    opacity,
    effects,
    layoutSizingHorizontal = "FIXED",
    layoutSizingVertical = "FIXED",
    positioning,
    top,
    left,
    right,
    bottom,
    gradientType,
    gradientStops,
    gradientAngle = 0,
    visible,
  } = params;

  const frame = figma.createFrame();
  frame.x = x;
  frame.y = y;
  frame.resize(width, height);
  frame.name = name;

  if (clipsContent !== undefined) {
    frame.clipsContent = clipsContent;
  }

  // Layout — always create with FIXED sizing first (Figma API bug workaround)
  if (layoutMode !== "NONE") {
    frame.layoutMode = layoutMode;
    frame.layoutWrap = layoutWrap;
    frame.paddingTop = paddingTop;
    frame.paddingRight = paddingRight;
    frame.paddingBottom = paddingBottom;
    frame.paddingLeft = paddingLeft;
    frame.primaryAxisAlignItems = primaryAxisAlignItems;
    frame.counterAxisAlignItems = counterAxisAlignItems;
    frame.layoutSizingHorizontal = "FIXED";
    frame.layoutSizingVertical = "FIXED";
    frame.itemSpacing = itemSpacing;
    if (counterAxisSpacing !== undefined && layoutWrap === "WRAP") {
      frame.counterAxisSpacing = counterAxisSpacing;
    }
  }

  if (cornerRadius !== undefined) {
    if (corners) {
      if (corners[0]) frame.topLeftRadius = cornerRadius;
      if (corners[1]) frame.topRightRadius = cornerRadius;
      if (corners[2]) frame.bottomRightRadius = cornerRadius;
      if (corners[3]) frame.bottomLeftRadius = cornerRadius;
    } else {
      frame.cornerRadius = cornerRadius;
    }
  }

  if (fillColor === '__none__') {
    frame.fills = [];
  } else if (fillColor) {
    frame.fills = [createSolidPaint(fillColor)];
  }

  if (strokeColor) {
    frame.strokes = [createSolidPaint(strokeColor)];
  }
  if (strokeWeight !== undefined) {
    frame.strokeWeight = strokeWeight;
  }

  if (opacity !== undefined) {
    frame.opacity = opacity;
  }

  if (effects && Array.isArray(effects) && effects.length > 0) {
    frame.effects = effects.map((effect: EffectConfig) => {
      if (effect.type === "DROP_SHADOW" || effect.type === "INNER_SHADOW") {
        return {
          type: effect.type,
          visible: effect.visible !== false,
          radius: effect.radius,
          color: effect.color
            ? { r: effect.color.r, g: effect.color.g, b: effect.color.b, a: effect.color.a ?? 1 }
            : { r: 0, g: 0, b: 0, a: 0.25 },
          offset: effect.offset ?? { x: 0, y: 4 },
          spread: effect.spread ?? 0,
          blendMode: "NORMAL" as const,
        };
      } else {
        return {
          type: effect.type,
          visible: effect.visible !== false,
          radius: effect.radius,
        } as Effect;
      }
    });
  }

  // Append to parent (single async call)
  await appendToParent(frame, parentId);

  // Absolute positioning (must be after appending to auto-layout parent)
  if (positioning === "ABSOLUTE") {
    (frame as any).layoutPositioning = "ABSOLUTE";

    const hasOffsets = top !== undefined || left !== undefined || right !== undefined || bottom !== undefined;
    if (hasOffsets) {
      const parent = frame.parent as FrameNode;
      const parentWidth = parent.width;
      const parentHeight = parent.height;
      const nodeWidth = frame.width;
      const nodeHeight = frame.height;

      const hasBothLR = typeof left === "number" && typeof right === "number";
      const hasBothTB = typeof top === "number" && typeof bottom === "number";

      if (hasBothLR) {
        frame.x = left;
        const newWidth = parentWidth - left - right;
        if (newWidth > 0) frame.resize(newWidth, frame.height);
      } else if (typeof left === "number") {
        frame.x = left;
      } else if (typeof right === "number") {
        frame.x = parentWidth - nodeWidth - right;
      }

      if (hasBothTB) {
        frame.y = top;
        const newHeight = parentHeight - top - bottom;
        if (newHeight > 0) frame.resize(frame.width, newHeight);
      } else if (typeof top === "number") {
        frame.y = top;
      } else if (typeof bottom === "number") {
        frame.y = parentHeight - nodeHeight - bottom;
      }

      frame.constraints = {
        horizontal: hasBothLR ? "STRETCH" : (typeof right === "number" ? "MAX" : "MIN"),
        vertical: hasBothTB ? "STRETCH" : (typeof bottom === "number" ? "MAX" : "MIN"),
      };
    }
  }

  // Non-FIXED sizing (must be after appending to parent).
  // Applies to BOTH auto-layout frames AND non-auto-layout children
  // of auto-layout parents (e.g., StatusBar, SafeAreaBottom with width: fill).
  if (layoutSizingHorizontal !== "FIXED") {
    frame.layoutSizingHorizontal = layoutSizingHorizontal;
  }
  if (layoutSizingVertical !== "FIXED") {
    frame.layoutSizingVertical = layoutSizingVertical;
  }

  // Gradient fill
  if (gradientType && gradientStops && gradientStops.length >= 2) {
    (frame as GeometryMixin).fills = [buildGradientPaint(gradientType, gradientStops, gradientAngle)];
  }

  // Visibility — must be last
  if (visible === false) {
    frame.visible = false;
  }

  return { id: frame.id };
}

/**
 * Create a text node with all properties in a single command.
 * Replaces: create_text + set_opacity + set_line_height + set_letter_spacing
 *           + set_text_truncation + set_layout_sizing + set_gradient_fill + set_visibility
 */
export async function createTextFull(
  params: CreateTextFullParams
): Promise<{ id: string }> {
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
    opacity,
    lineHeight,
    lineHeightUnit = "PIXELS",
    letterSpacing,
    letterSpacingUnit = "PIXELS",
    maxLines,
    layoutSizingHorizontal,
    layoutSizingVertical,
    gradientType,
    gradientStops,
    gradientAngle = 0,
    visible,
  } = params;

  const textNode = figma.createText();
  textNode.x = x;
  textNode.y = y;
  textNode.name = name || text;

  // Single font load
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

  textNode.fills = [createSolidPaint(fontColor)];

  if (width !== undefined) {
    textNode.textAutoResize = "HEIGHT";
    textNode.resize(width, textNode.height);
  }
  textNode.textAlignHorizontal = textAlignHorizontal;

  // Line height (sync — no font load needed)
  if (lineHeight !== undefined) {
    if (lineHeight === "AUTO") {
      textNode.lineHeight = { unit: "AUTO" };
    } else {
      textNode.lineHeight = { value: lineHeight, unit: lineHeightUnit };
    }
  }

  // Letter spacing (sync)
  if (letterSpacing !== undefined) {
    textNode.letterSpacing = { value: letterSpacing, unit: letterSpacingUnit };
  }

  // Text truncation (sync)
  if (maxLines !== undefined) {
    textNode.textTruncation = "ENDING";
    textNode.maxLines = maxLines;
  }

  if (opacity !== undefined) {
    textNode.opacity = opacity;
  }

  await appendToParent(textNode, parentId);

  // Layout sizing (after appending)
  if (layoutSizingHorizontal && layoutSizingHorizontal !== "FIXED") {
    textNode.layoutSizingHorizontal = layoutSizingHorizontal;
  }
  if (layoutSizingVertical && layoutSizingVertical !== "FIXED") {
    textNode.layoutSizingVertical = layoutSizingVertical;
  }

  // Gradient fill
  if (gradientType && gradientStops && gradientStops.length >= 2) {
    (textNode as any as GeometryMixin).fills = [buildGradientPaint(gradientType, gradientStops, gradientAngle)];
  }

  // Visibility — must be last
  if (visible === false) {
    textNode.visible = false;
  }

  return { id: textNode.id };
}

/**
 * Create an SVG vector with all properties in a single command.
 * Replaces: create_svg + set_opacity + set_layout_sizing + set_visibility
 */
export async function createSvgFull(
  params: CreateSvgFullParams
): Promise<{ id: string }> {
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
    opacity,
    layoutSizingHorizontal,
    layoutSizingVertical,
    visible,
  } = params;

  if (!svg || typeof svg !== "string") {
    throw new Error("svg parameter is required and must be a string");
  }

  const isSvgContent = svg.trim().startsWith("<");
  let pathsData: string[];
  let originalSize = { width: 24, height: 24 };
  let detectedStyle: "stroke" | "fill" | "both" = "stroke";
  let detectedStrokeWeight: number | null = null;

  if (isSvgContent) {
    pathsData = parseSvgPaths(svg);
    const viewBox = parseSvgViewBox(svg);
    if (viewBox) originalSize = viewBox;
    detectedStyle = detectSvgStyle(svg);
    detectedStrokeWeight = extractStrokeWidth(svg);
  } else {
    pathsData = [svg];
  }

  if (pathsData.length === 0) {
    throw new Error("No valid path data found in SVG");
  }

  const vector = figma.createVector();
  vector.name = name;

  const allVertices: VectorVertex[] = [];
  const allSegments: VectorSegment[] = [];
  const allLoops: number[][] = [];

  for (const pathData of pathsData) {
    const network = svgPathToVectorNetwork(pathData, windingRule);
    const vertexOffset = allVertices.length;
    const segmentOffset = allSegments.length;
    allVertices.push(...network.vertices);
    for (const seg of network.segments) {
      allSegments.push({
        start: seg.start + vertexOffset,
        end: seg.end + vertexOffset,
        tangentStart: seg.tangentStart,
        tangentEnd: seg.tangentEnd,
      });
    }
    for (const region of network.regions) {
      for (const loop of region.loops) {
        allLoops.push(loop.map((idx) => idx + segmentOffset));
      }
    }
  }

  await vector.setVectorNetworkAsync({
    vertices: allVertices,
    segments: allSegments,
    regions: allLoops.length > 0 ? [{ windingRule, loops: allLoops }] : undefined,
  });

  const finalStrokeWeight = strokeWeight ?? detectedStrokeWeight ?? 1.5;

  if (detectedStyle === "fill" || detectedStyle === "both") {
    if (fillColor) {
      vector.fills = [createSolidPaint(fillColor)];
    } else if (!strokeColor && detectedStyle === "fill") {
      vector.fills = [createSolidPaint({ r: 0, g: 0, b: 0, a: 1 })];
    }
  }

  if (detectedStyle === "stroke" || detectedStyle === "both" || strokeColor) {
    if (strokeColor) {
      vector.strokes = [createSolidPaint(strokeColor)];
    } else if (detectedStyle === "stroke") {
      vector.strokes = [createSolidPaint({ r: 0, g: 0, b: 0, a: 1 })];
    }
    vector.strokeWeight = finalStrokeWeight;
    vector.strokeCap = "ROUND";
    vector.strokeJoin = "ROUND";
    if (detectedStyle === "stroke" && !fillColor) {
      vector.fills = [];
    }
  }

  const targetWidth = width ?? originalSize.width;
  const targetHeight = height ?? originalSize.height;
  if (vector.width > 0 && vector.height > 0) {
    vector.resize(targetWidth, targetHeight);
  }

  vector.x = x;
  vector.y = y;

  if (opacity !== undefined) {
    vector.opacity = opacity;
  }

  await appendToParent(vector, parentId);

  if (layoutSizingHorizontal && layoutSizingHorizontal !== "FIXED") {
    vector.layoutSizingHorizontal = layoutSizingHorizontal;
  }
  if (layoutSizingVertical && layoutSizingVertical !== "FIXED") {
    vector.layoutSizingVertical = layoutSizingVertical;
  }

  if (visible === false) {
    vector.visible = false;
  }

  return { id: vector.id };
}

/**
 * Create a rectangle with all properties in a single command.
 * Replaces: create_rectangle + set_corner_radius + set_opacity
 *           + set_layout_sizing + set_visibility
 */
export async function createRectangleFull(
  params: CreateRectangleFullParams
): Promise<{ id: string }> {
  const {
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    name = "Rectangle",
    parentId,
    fillColor,
    cornerRadius,
    opacity,
    layoutSizingHorizontal,
    layoutSizingVertical,
    visible,
  } = params;

  const rect = figma.createRectangle();
  rect.x = x;
  rect.y = y;
  rect.resize(width, height);
  rect.name = name;

  if (fillColor) {
    rect.fills = [createSolidPaint(fillColor)];
  }

  if (cornerRadius !== undefined && cornerRadius > 0) {
    rect.cornerRadius = cornerRadius;
  }

  if (opacity !== undefined) {
    rect.opacity = opacity;
  }

  await appendToParent(rect, parentId);

  if (layoutSizingHorizontal && layoutSizingHorizontal !== "FIXED") {
    rect.layoutSizingHorizontal = layoutSizingHorizontal;
  }
  if (layoutSizingVertical && layoutSizingVertical !== "FIXED") {
    rect.layoutSizingVertical = layoutSizingVertical;
  }

  if (visible === false) {
    rect.visible = false;
  }

  return { id: rect.id };
}
