// src/commands/extraction.ts

import type { GetLayoutConstraintsParams, GetStyleInheritanceParams, GetValidationTreeParams } from "../types";
import { generateCommandId, sendProgressUpdate } from "../helpers/progress";
import { rgbaToHex } from "../helpers/colors";

// Helper functions for extraction
function processEnhancedFills(fills: readonly Paint[]) {
  return fills.map((fill) => {
    const processedFill: Record<string, unknown> = {
      type: fill.type,
      visible: fill.visible,
      opacity: fill.opacity,
      blendMode: fill.blendMode,
    };

    if (fill.type === "SOLID" && fill.color) {
      processedFill.color = {
        r: fill.color.r,
        g: fill.color.g,
        b: fill.color.b,
        hex: rgbaToHex(fill.color),
      };
    }

    return processedFill;
  });
}

function processEnhancedStrokes(strokes: readonly Paint[]) {
  return strokes.map((stroke) => {
    const processedStroke: Record<string, unknown> = {
      type: stroke.type,
      visible: stroke.visible,
      opacity: stroke.opacity,
      blendMode: stroke.blendMode,
    };

    if (stroke.type === "SOLID" && stroke.color) {
      processedStroke.color = {
        r: stroke.color.r,
        g: stroke.color.g,
        b: stroke.color.b,
        hex: rgbaToHex(stroke.color),
      };
    }

    return processedStroke;
  });
}

async function processNodeRecursively(node: BaseNode, depth: number = 0): Promise<Record<string, unknown>> {
  const nodeData: Record<string, unknown> = {
    id: node.id,
    name: node.name,
    type: node.type,
    depth,
  };

  if ("absoluteBoundingBox" in node) nodeData.absoluteBoundingBox = node.absoluteBoundingBox;
  if ("layoutMode" in node) nodeData.layoutMode = node.layoutMode;
  if ("fills" in node && node.fills) nodeData.fills = processEnhancedFills(node.fills as readonly Paint[]);
  if ("strokes" in node && node.strokes) nodeData.strokes = processEnhancedStrokes(node.strokes as readonly Paint[]);
  if ("cornerRadius" in node) nodeData.cornerRadius = node.cornerRadius;
  if ("opacity" in node) nodeData.opacity = node.opacity;

  if (node.type === "TEXT") {
    const textNode = node as TextNode;
    nodeData.characters = textNode.characters;
    nodeData.fontSize = textNode.fontSize;
    nodeData.fontName = textNode.fontName;
  }

  if ("children" in node && node.children) {
    nodeData.children = [];
    for (const child of node.children) {
      const childData = await processNodeRecursively(child, depth + 1);
      (nodeData.children as unknown[]).push(childData);
    }
  }

  return nodeData;
}

async function getDocumentStyles() {
  // Use async methods if available, otherwise fall back to sync methods
  // Type assertions needed as sync methods may not be in type definitions
  const figmaApi = figma as typeof figma & {
    getLocalPaintStyles?: () => PaintStyle[];
    getLocalTextStyles?: () => TextStyle[];
    getLocalEffectStyles?: () => EffectStyle[];
    getLocalGridStyles?: () => GridStyle[];
  };

  const paintStyles: PaintStyle[] = typeof figma.getLocalPaintStylesAsync === "function"
    ? await figma.getLocalPaintStylesAsync()
    : (figmaApi.getLocalPaintStyles?.() ?? []);
  const textStyles: TextStyle[] = typeof figma.getLocalTextStylesAsync === "function"
    ? await figma.getLocalTextStylesAsync()
    : (figmaApi.getLocalTextStyles?.() ?? []);
  const effectStyles: EffectStyle[] = typeof figma.getLocalEffectStylesAsync === "function"
    ? await figma.getLocalEffectStylesAsync()
    : (figmaApi.getLocalEffectStyles?.() ?? []);
  const gridStyles: GridStyle[] = typeof figma.getLocalGridStylesAsync === "function"
    ? await figma.getLocalGridStylesAsync()
    : (figmaApi.getLocalGridStyles?.() ?? []);

  return {
    paint: paintStyles.map((s) => ({ id: s.id, name: s.name, paints: s.paints })),
    text: textStyles.map((s) => ({ id: s.id, name: s.name, fontSize: s.fontSize, fontName: s.fontName })),
    effect: effectStyles.map((s) => ({ id: s.id, name: s.name, effects: s.effects })),
    grid: gridStyles.map((s) => ({ id: s.id, name: s.name, layoutGrids: s.layoutGrids })),
  };
}

async function getDocumentComponents() {
  // Use async method if available, otherwise fall back to sync method
  // Type assertion needed as sync method may not be in type definitions
  const figmaApi = figma as typeof figma & {
    getLocalComponents?: () => ComponentNode[];
  };

  const components: ComponentNode[] = typeof figma.getLocalComponentsAsync === "function"
    ? await figma.getLocalComponentsAsync()
    : (figmaApi.getLocalComponents?.() ?? []);
  return components.map((c) => ({ id: c.id, name: c.name, description: c.description }));
}

async function getDocumentVariables() {
  // figma.variables API may not exist in older Figma versions
  if (!figma.variables) {
    return { variables: [], collections: [] };
  }

  // Use async methods if available
  const variables: Variable[] = typeof figma.variables.getLocalVariablesAsync === "function"
    ? await figma.variables.getLocalVariablesAsync()
    : [];
  const collections: VariableCollection[] = typeof figma.variables.getLocalVariableCollectionsAsync === "function"
    ? await figma.variables.getLocalVariableCollectionsAsync()
    : [];

  return {
    variables: variables.map((v) => ({ id: v.id, name: v.name, resolvedType: v.resolvedType })),
    collections: collections.map((c) => ({ id: c.id, name: c.name, modes: c.modes })),
  };
}

export async function getCompleteFileData() {
  const commandId = generateCommandId();
  sendProgressUpdate(commandId, "get_complete_file_data", "started", 0, 1, 0, "Starting extraction");

  const pages = figma.root.children;
  const completeData: Record<string, unknown> = {
    document: { id: figma.root.id, name: figma.root.name, type: figma.root.type, children: [] },
    styles: {},
    components: {},
    variables: {},
    metadata: { extractedAt: new Date().toISOString() },
  };

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    // loadAsync may not exist in all Figma versions
    if (typeof page.loadAsync === "function") {
      await page.loadAsync();
    }
    const pageData = await processNodeRecursively(page, 0);
    (completeData.document as { children: unknown[] }).children.push(pageData);
    sendProgressUpdate(commandId, "get_complete_file_data", "in_progress", Math.round(((i + 1) / pages.length) * 80), pages.length, i + 1, `Processed page: ${page.name}`);
  }

  const [styles, components, variables] = await Promise.all([
    getDocumentStyles(),
    getDocumentComponents(),
    getDocumentVariables(),
  ]);
  completeData.styles = styles;
  completeData.components = components;
  completeData.variables = variables;

  sendProgressUpdate(commandId, "get_complete_file_data", "completed", 100, 1, 1, "Extraction complete");

  return completeData;
}

export async function getDesignTokens() {
  const commandId = generateCommandId();
  sendProgressUpdate(commandId, "get_design_tokens", "started", 0, 1, 0, "Starting token extraction");

  const tokens: Record<string, unknown> = {
    colors: {},
    typography: {},
    effects: {},
    variables: {},
  };

  const paintStyles = await figma.getLocalPaintStylesAsync();
  tokens.colors = paintStyles.reduce((acc: Record<string, unknown>, style) => {
    acc[style.name] = {
      id: style.id,
      name: style.name,
      paints: style.paints.map((paint) => {
        if (paint.type === "SOLID" && paint.color) {
          return { type: paint.type, color: rgbaToHex(paint.color), opacity: paint.opacity || 1 };
        }
        return paint;
      }),
    };
    return acc;
  }, {});

  const textStyles = await figma.getLocalTextStylesAsync();
  tokens.typography = textStyles.reduce((acc: Record<string, unknown>, style) => {
    acc[style.name] = {
      id: style.id,
      fontFamily: style.fontName?.family,
      fontWeight: style.fontName?.style,
      fontSize: style.fontSize,
      lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing,
    };
    return acc;
  }, {});

  sendProgressUpdate(commandId, "get_design_tokens", "completed", 100, 1, 1, "Token extraction complete");

  return tokens;
}

export async function getLayoutConstraints(params: GetLayoutConstraintsParams) {
  const nodeId = params.nodeId || "";
  const node = nodeId ? await figma.getNodeByIdAsync(nodeId) : figma.currentPage.selection[0];

  if (!node) throw new Error("No node selected or found");

  const sceneNode = node as SceneNode;

  return {
    id: node.id,
    name: node.name,
    type: node.type,
    layoutMode: "layoutMode" in sceneNode ? sceneNode.layoutMode : null,
    layoutSizingHorizontal: "layoutSizingHorizontal" in sceneNode ? sceneNode.layoutSizingHorizontal : null,
    layoutSizingVertical: "layoutSizingVertical" in sceneNode ? sceneNode.layoutSizingVertical : null,
    paddingLeft: "paddingLeft" in sceneNode ? sceneNode.paddingLeft : 0,
    paddingRight: "paddingRight" in sceneNode ? sceneNode.paddingRight : 0,
    paddingTop: "paddingTop" in sceneNode ? sceneNode.paddingTop : 0,
    paddingBottom: "paddingBottom" in sceneNode ? sceneNode.paddingBottom : 0,
    itemSpacing: "itemSpacing" in sceneNode ? sceneNode.itemSpacing : 0,
    constraints: "constraints" in sceneNode ? sceneNode.constraints : null,
    absoluteBoundingBox: sceneNode.absoluteBoundingBox,
  };
}

/**
 * Instance info for component hierarchy
 */
interface InstanceInfo {
  id: string;
  name: string;
  mainComponentId: string | null;
  mainComponentName: string | null;
}

/**
 * Find instances in current selection
 */
function findInstancesInCurrentSelection(): InstanceInfo[] {
  const instances: InstanceInfo[] = [];

  try {
    // Check current selection for instances
    for (const node of figma.currentPage.selection) {
      if (node.type === "INSTANCE") {
        const instanceNode = node as InstanceNode;
        instances.push({
          id: instanceNode.id,
          name: instanceNode.name,
          mainComponentId: instanceNode.mainComponent ? instanceNode.mainComponent.id : null,
          mainComponentName: instanceNode.mainComponent ? instanceNode.mainComponent.name : null,
        });
      }

      // Check children if it's a frame or group
      if ("children" in node) {
        findInstancesInNodeLimited(node as FrameNode, instances, 3); // Limit depth to 3
      }
    }
  } catch (error) {
    console.log("Error finding instances:", (error as Error).message);
  }

  return instances;
}

/**
 * Find instances in node with depth limit
 */
function findInstancesInNodeLimited(node: SceneNode, instances: InstanceInfo[] = [], maxDepth: number = 3): InstanceInfo[] {
  if (maxDepth <= 0) return instances;

  try {
    if (node.type === "INSTANCE") {
      const instanceNode = node as InstanceNode;
      instances.push({
        id: instanceNode.id,
        name: instanceNode.name,
        mainComponentId: instanceNode.mainComponent ? instanceNode.mainComponent.id : null,
        mainComponentName: instanceNode.mainComponent ? instanceNode.mainComponent.name : null,
      });
    }

    if ("children" in node && node.children.length < 50) {
      // Limit to avoid deep trees
      for (const child of node.children) {
        findInstancesInNodeLimited(child, instances, maxDepth - 1);
      }
    }
  } catch (error) {
    console.log("Error in limited instance search:", (error as Error).message);
  }

  return instances;
}

export async function getComponentHierarchy() {
  try {
    console.log("Component hierarchy: Starting...");

    const hierarchy: Record<string, unknown> = {
      message: "Component hierarchy analysis completed",
      timestamp: Date.now(),
      components: [],
      componentSets: [],
      instances: [],
      relationships: {},
    };

    // Get local components and component sets
    try {
      const components = await figma.getLocalComponentsAsync();
      const componentSets = await figma.getLocalComponentSetNodesAsync();

      console.log(`Found ${components.length} components and ${componentSets.length} component sets`);

      // Process components
      for (const component of components) {
        (hierarchy.components as Array<Record<string, unknown>>).push({
          id: component.id,
          name: component.name,
          description: component.description || "",
          type: component.type,
        });
      }

      // Process component sets
      for (const componentSet of componentSets) {
        (hierarchy.componentSets as Array<Record<string, unknown>>).push({
          id: componentSet.id,
          name: componentSet.name,
          description: componentSet.description || "",
          childrenCount: componentSet.children ? componentSet.children.length : 0,
        });
      }

      // Find instances on current page only (to avoid timeout)
      const currentPage = figma.currentPage;
      if (currentPage) {
        hierarchy.instances = findInstancesInCurrentSelection();
      }
    } catch (apiError) {
      console.log("API error, returning basic structure:", (apiError as Error).message);
    }

    console.log("Component hierarchy: Analysis completed");
    return hierarchy;
  } catch (error) {
    console.error("Component hierarchy error:", error);
    throw new Error(`Error analyzing component hierarchy: ${(error as Error).message}`);
  }
}

/**
 * Responsive element info
 */
interface ResponsiveElement {
  id: string;
  name: string;
  type: string;
  layoutMode: string;
  layoutSizingHorizontal: string | null;
  layoutSizingVertical: string | null;
  constraints: Constraints | null;
  width: number;
  height: number;
  responsiveRecommendations: ResponsiveRecommendation[];
}

/**
 * Responsive recommendation
 */
interface ResponsiveRecommendation {
  css: string;
  description: string;
}

/**
 * Breakpoint recommendation
 */
interface BreakpointRecommendation {
  name: string;
  minWidth: number;
  maxWidth: number | null;
  elementCount: number;
  suggestions: string[];
}

/**
 * Generate responsive recommendations for a node
 */
function generateResponsiveRecommendations(node: SceneNode): ResponsiveRecommendation[] {
  const recommendations: ResponsiveRecommendation[] = [];

  if (!("layoutMode" in node)) return recommendations;

  const layoutNode = node as FrameNode;

  if (layoutNode.layoutMode === "HORIZONTAL") {
    recommendations.push({
      css: "display: flex; flex-direction: row;",
      description: "Horizontal auto-layout converted to flexbox row",
    });

    if (layoutNode.layoutWrap === "WRAP") {
      recommendations.push({
        css: "flex-wrap: wrap;",
        description: "Enable wrapping for responsive behavior",
      });
    }
  }

  if (layoutNode.layoutMode === "VERTICAL") {
    recommendations.push({
      css: "display: flex; flex-direction: column;",
      description: "Vertical auto-layout converted to flexbox column",
    });
  }

  if (layoutNode.layoutSizingHorizontal === "FILL") {
    recommendations.push({
      css: "width: 100%;",
      description: "Fill container horizontally",
    });
  }

  if (layoutNode.layoutSizingVertical === "FILL") {
    recommendations.push({
      css: "height: 100%;",
      description: "Fill container vertically",
    });
  }

  return recommendations;
}

/**
 * Analyze responsive elements in a node tree
 */
function analyzeResponsiveElements(node: SceneNode, elements: ResponsiveElement[] = []): ResponsiveElement[] {
  if ("layoutMode" in node) {
    const layoutNode = node as FrameNode;
    elements.push({
      id: node.id,
      name: node.name,
      type: node.type,
      layoutMode: layoutNode.layoutMode,
      layoutSizingHorizontal: layoutNode.layoutSizingHorizontal || null,
      layoutSizingVertical: layoutNode.layoutSizingVertical || null,
      constraints: "constraints" in node ? (node as ConstraintMixin).constraints : null,
      width: node.width,
      height: node.height,
      responsiveRecommendations: generateResponsiveRecommendations(node),
    });
  }

  if ("children" in node) {
    for (const child of node.children) {
      analyzeResponsiveElements(child, elements);
    }
  }

  return elements;
}

/**
 * Generate breakpoint recommendations based on elements
 */
function generateBreakpointRecommendations(elements: ResponsiveElement[]): BreakpointRecommendation[] {
  const breakpoints = [
    { name: "mobile", minWidth: 0, maxWidth: 767, description: "Mobile devices" },
    { name: "tablet", minWidth: 768, maxWidth: 1023, description: "Tablet devices" },
    { name: "desktop", minWidth: 1024, maxWidth: 1439, description: "Desktop screens" },
    { name: "large", minWidth: 1440, maxWidth: null, description: "Large screens" },
  ];

  // Analyze elements to refine breakpoint recommendations
  const recommendations = breakpoints.map((bp) => {
    const relevantElements = elements.filter((el) => {
      if (bp.maxWidth) {
        return el.width >= bp.minWidth && el.width <= bp.maxWidth;
      } else {
        return el.width >= bp.minWidth;
      }
    });

    return {
      name: bp.name,
      minWidth: bp.minWidth,
      maxWidth: bp.maxWidth,
      elementCount: relevantElements.length,
      suggestions:
        relevantElements.length > 0
          ? [`Consider responsive adjustments for ${relevantElements.length} elements`]
          : ["No specific adjustments needed"],
    };
  });

  return recommendations;
}

export async function getResponsiveLayouts(params: { nodeId?: string }) {
  try {
    console.log("Responsive layouts: Starting...");

    const nodeId = params.nodeId || "";
    const node = nodeId ? await figma.getNodeByIdAsync(nodeId) : figma.currentPage.selection[0];

    const layouts: Record<string, unknown> = {
      message: "Responsive layouts analysis completed",
      timestamp: Date.now(),
      nodeId: params.nodeId || "current-page",
      nodeName: node ? node.name : "Unknown",
      breakpoints: [],
      gridSystem: null,
      responsiveElements: [],
    };

    if (node && "children" in node) {
      // Analyze responsive elements
      const elements = analyzeResponsiveElements(node as SceneNode);
      layouts.responsiveElements = elements;

      // Generate breakpoint recommendations
      layouts.breakpoints = generateBreakpointRecommendations(elements);
    }

    console.log("Responsive layouts: Returning result");
    return layouts;
  } catch (error) {
    console.error("Responsive layouts error:", error);
    throw new Error(`Error analyzing responsive layouts: ${(error as Error).message}`);
  }
}

/**
 * CSS recommendation
 */
interface CSSRecommendation {
  property: string;
  value: string;
  description: string;
}

/**
 * Computed styles structure
 */
interface ComputedStyles {
  typography?: {
    fontFamily: string | null;
    fontWeight: string | null;
    fontSize: number | typeof figma.mixed;
    lineHeight: LineHeight | typeof figma.mixed;
    letterSpacing: LetterSpacing | typeof figma.mixed;
    textAlign: string | typeof figma.mixed;
    textDecoration: string | typeof figma.mixed;
    textCase: string | typeof figma.mixed;
  };
  fills?: Array<{
    type: string;
    color?: string;
    opacity?: number;
  }>;
  strokes?: {
    strokes: readonly Paint[];
    strokeWeight: number | typeof figma.mixed;
    strokeAlign: string;
  };
  cornerRadius?: number | typeof figma.mixed;
  effects?: readonly Effect[];
  opacity?: number;
}

/**
 * Extract computed styles from a node
 */
function extractComputedStyles(node: SceneNode): ComputedStyles {
  const styles: ComputedStyles = {};

  // Typography styles for text nodes
  if (node.type === "TEXT") {
    const textNode = node as TextNode;
    styles.typography = {
      fontFamily: textNode.fontName !== figma.mixed ? textNode.fontName.family : null,
      fontWeight: textNode.fontName !== figma.mixed ? textNode.fontName.style : null,
      fontSize: textNode.fontSize,
      lineHeight: textNode.lineHeight,
      letterSpacing: textNode.letterSpacing,
      textAlign: textNode.textAlignHorizontal,
      textDecoration: textNode.textDecoration,
      textCase: textNode.textCase,
    };
  }

  // Fill styles
  if ("fills" in node && node.fills && node.fills !== figma.mixed && node.fills.length > 0) {
    styles.fills = node.fills.map((fill) => {
      if (fill.type === "SOLID" && fill.color) {
        return {
          type: fill.type,
          color: rgbaToHex(fill.color),
          opacity: fill.opacity || 1,
        };
      }
      return { type: fill.type };
    });
  }

  // Border styles
  if ("strokes" in node && node.strokes && node.strokes.length > 0) {
    styles.strokes = {
      strokes: node.strokes,
      strokeWeight: (node as GeometryMixin).strokeWeight,
      strokeAlign: (node as GeometryMixin).strokeAlign,
    };
  }

  // Corner radius
  if ("cornerRadius" in node && node.cornerRadius !== undefined) {
    styles.cornerRadius = node.cornerRadius;
  }

  // Effects (shadows, blurs)
  if ("effects" in node && node.effects && node.effects.length > 0) {
    styles.effects = node.effects;
  }

  // Opacity
  if ("opacity" in node && node.opacity !== undefined && node.opacity !== 1) {
    styles.opacity = node.opacity;
  }

  return styles;
}

/**
 * Analyze style inheritance from parent
 */
function analyzeStyleInheritance(node: SceneNode, parent: BaseNode): Record<string, unknown> {
  const inherited: Record<string, unknown> = {};

  // Check what styles might be inherited from parent
  if ("fills" in parent && !("fills" in node && node.fills)) {
    inherited.fills = (parent as GeometryMixin).fills;
  }

  if ("opacity" in parent && !("opacity" in node && node.opacity)) {
    inherited.opacity = (parent as BlendMixin).opacity;
  }

  // For text nodes, check typography inheritance
  if (node.type === "TEXT" && parent.type === "TEXT") {
    const textNode = node as TextNode;
    const parentTextNode = parent as TextNode;
    const inheritableProps: Array<keyof TextNode> = ["fontName", "fontSize", "lineHeight", "letterSpacing"];
    inherited.typography = {};

    for (const prop of inheritableProps) {
      if (parentTextNode[prop] && !textNode[prop]) {
        (inherited.typography as Record<string, unknown>)[prop] = parentTextNode[prop];
      }
    }
  }

  return inherited;
}

/**
 * Extract local styles (non-inherited)
 */
function extractLocalStyles(node: SceneNode): ComputedStyles {
  // Extract only the styles defined directly on this node
  return extractComputedStyles(node);
}

/**
 * Generate CSS recommendations
 */
function generateCSSRecommendations(inheritance: {
  computedStyles: ComputedStyles;
  inheritedStyles: Record<string, unknown>;
  localStyles: ComputedStyles;
}): CSSRecommendation[] {
  const recommendations: CSSRecommendation[] = [];

  // Typography recommendations
  if (inheritance.computedStyles.typography) {
    const typo = inheritance.computedStyles.typography;
    if (typo.fontFamily) {
      recommendations.push({
        property: "font-family",
        value: `'${typo.fontFamily}'`,
        description: "Set font family",
      });
    }
    if (typo.fontSize && typo.fontSize !== figma.mixed) {
      recommendations.push({
        property: "font-size",
        value: `${typo.fontSize}px`,
        description: "Set font size",
      });
    }
    if (typo.lineHeight && typo.lineHeight !== figma.mixed) {
      const lineHeight = typo.lineHeight as LineHeight;
      if (lineHeight.unit === "PIXELS") {
        recommendations.push({
          property: "line-height",
          value: `${lineHeight.value}px`,
          description: "Set line height",
        });
      } else if (lineHeight.unit === "PERCENT") {
        recommendations.push({
          property: "line-height",
          value: `${lineHeight.value}%`,
          description: "Set line height",
        });
      }
    }
  }

  // Color recommendations
  if (inheritance.computedStyles.fills && inheritance.computedStyles.fills.length > 0) {
    const primaryFill = inheritance.computedStyles.fills[0];
    if (primaryFill.type === "SOLID" && primaryFill.color) {
      recommendations.push({
        property: "color",
        value: primaryFill.color,
        description: "Set text/fill color",
      });
    }
  }

  // Border recommendations
  if (inheritance.computedStyles.strokes) {
    const strokeWeight = inheritance.computedStyles.strokes.strokeWeight;
    if (strokeWeight !== figma.mixed) {
      recommendations.push({
        property: "border",
        value: `${strokeWeight}px solid`,
        description: "Set border width and style",
      });
    }
  }

  return recommendations;
}

export async function getStyleInheritance(params: GetStyleInheritanceParams) {
  try {
    const nodeId = params.nodeId || "";
    const node = nodeId ? await figma.getNodeByIdAsync(nodeId) : figma.currentPage.selection[0];

    if (!node) throw new Error("No node selected or found");

    const sceneNode = node as SceneNode;

    const inheritance = {
      nodeId: node.id,
      nodeName: node.name,
      nodeType: node.type,
      computedStyles: {} as ComputedStyles,
      inheritedStyles: {} as Record<string, unknown>,
      localStyles: {} as ComputedStyles,
      recommendations: [] as CSSRecommendation[],
    };

    // Extract computed styles
    inheritance.computedStyles = extractComputedStyles(sceneNode);

    // Analyze style inheritance from parent
    if (node.parent) {
      inheritance.inheritedStyles = analyzeStyleInheritance(sceneNode, node.parent);
    }

    // Extract local styles (non-inherited)
    inheritance.localStyles = extractLocalStyles(sceneNode);

    // Generate CSS recommendations
    inheritance.recommendations = generateCSSRecommendations(inheritance);

    return inheritance;
  } catch (error) {
    throw new Error(`Error analyzing style inheritance: ${(error as Error).message}`);
  }
}

// ============================================================================
// Validation Tree — direct Plugin API access (no exportAsync)
// ============================================================================

export async function getValidationTree(params: GetValidationTreeParams) {
  const node = await figma.getNodeByIdAsync(params.nodeId);
  if (!node) throw new Error(`Node not found: ${params.nodeId}`);

  return serializeForValidation(node as SceneNode, null);
}

// Guard against figma.mixed (Symbol) — non-serializable via postMessage
function safe(value: unknown, fallback: unknown): unknown {
  if (typeof value === "symbol" || value === undefined) return fallback;
  return value;
}

function serializeForValidation(
  node: SceneNode,
  parentId: string | null
): Record<string, unknown> {
  const bbox = node.absoluteBoundingBox || { x: 0, y: 0, width: 0, height: 0 };

  const relX = node.x;
  const relY = node.y;

  const result: Record<string, unknown> = {
    // Identity
    id: node.id,
    name: node.name,
    type: node.type,

    // Structure
    visible: node.visible,
    parentId: parentId,

    // Geometry
    x: relX,
    y: relY,
    width: bbox.width,
    height: bbox.height,
    absoluteX: bbox.x,
    absoluteY: bbox.y,

    // Layout — safe access with "in" checks
    layoutMode: "layoutMode" in node ? safe((node as any).layoutMode, null) : null,
    layoutSizingHorizontal: "layoutSizingHorizontal" in node
      ? safe((node as any).layoutSizingHorizontal, "FIXED") : "FIXED",
    layoutSizingVertical: "layoutSizingVertical" in node
      ? safe((node as any).layoutSizingVertical, "FIXED") : "FIXED",
    primaryAxisAlignItems: "primaryAxisAlignItems" in node
      ? safe((node as any).primaryAxisAlignItems, "MIN") : "MIN",
    counterAxisAlignItems: "counterAxisAlignItems" in node
      ? safe((node as any).counterAxisAlignItems, "MIN") : "MIN",
    paddingTop: "paddingTop" in node ? safe((node as any).paddingTop, 0) : 0,
    paddingRight: "paddingRight" in node ? safe((node as any).paddingRight, 0) : 0,
    paddingBottom: "paddingBottom" in node ? safe((node as any).paddingBottom, 0) : 0,
    paddingLeft: "paddingLeft" in node ? safe((node as any).paddingLeft, 0) : 0,
    itemSpacing: "itemSpacing" in node ? safe((node as any).itemSpacing, 0) : 0,
    layoutPositioning: "layoutPositioning" in node
      ? safe((node as any).layoutPositioning, "AUTO") : "AUTO",
    clipsContent: "clipsContent" in node ? safe((node as any).clipsContent, false) : false,

    // Styling
    opacity: "opacity" in node ? safe((node as any).opacity, 1) : 1,
    cornerRadius: "cornerRadius" in node
      ? (typeof (node as any).cornerRadius === "number"
        ? (node as any).cornerRadius
        : ("topLeftRadius" in node ? (node as any).topLeftRadius : 0))
      : 0,
    fills: validationSerializeFills(node),
    strokes: validationSerializeStrokes(node),
    effects: validationSerializeEffects(node),

    // Text
    characters: node.type === "TEXT" ? (node as TextNode).characters : null,
    fontSize: node.type === "TEXT" ? validationExtractFontSize(node as TextNode) : null,
    fontWeight: node.type === "TEXT" ? validationExtractFontWeight(node as TextNode) : null,
    fontFamily: node.type === "TEXT" ? validationExtractFontFamily(node as TextNode) : null,
    textAlignHorizontal: node.type === "TEXT"
      ? safe((node as TextNode).textAlignHorizontal, "LEFT") : null,
    lineHeightPx: node.type === "TEXT" ? validationExtractLineHeight(node as TextNode) : null,
    letterSpacing: node.type === "TEXT" ? validationExtractLetterSpacing(node as TextNode) : null,
    textTruncation: node.type === "TEXT"
      ? safe((node as TextNode).textTruncation, "DISABLED") : null,
    maxLines: node.type === "TEXT"
      ? safe((node as TextNode).maxLines, null) : null,

    // Children
    children: [],
  };

  // Recurse into children (includes VECTOR, GROUP, etc. — no filtering)
  if ("children" in node) {
    const children: Record<string, unknown>[] = [];
    for (const child of (node as any).children) {
      children.push(serializeForValidation(child as SceneNode, node.id));
    }
    result.children = children;
  }

  return result;
}

// ── Validation helpers: Serialize fills to RGBA ──

function validationSerializeFills(node: SceneNode): unknown[] {
  if (!("fills" in node)) return [];
  const fills = (node as any).fills;
  if (!Array.isArray(fills)) return [];

  return fills.map((fill: any) => {
    const result: Record<string, unknown> = {
      type: fill.type || "SOLID",
      visible: fill.visible !== false,
      color: fill.color
        ? { r: fill.color.r, g: fill.color.g, b: fill.color.b, a: fill.opacity ?? 1 }
        : null,
    };

    // Gradient fills — include stops for validation comparison
    if (fill.gradientStops && Array.isArray(fill.gradientStops)) {
      result.gradientStops = fill.gradientStops.map((stop: any) => ({
        position: stop.position,
        color: stop.color
          ? { r: stop.color.r, g: stop.color.g, b: stop.color.b, a: stop.color.a ?? 1 }
          : null,
      }));
    }

    return result;
  });
}

// ── Validation helpers: Serialize strokes to RGBA ──

function validationSerializeStrokes(node: SceneNode): unknown[] {
  if (!("strokes" in node)) return [];
  const strokes = (node as any).strokes;
  if (!Array.isArray(strokes)) return [];

  return strokes.map((stroke: any) => ({
    type: stroke.type || "SOLID",
    visible: stroke.visible !== false,
    color: stroke.color
      ? { r: stroke.color.r, g: stroke.color.g, b: stroke.color.b, a: stroke.opacity ?? 1 }
      : null,
    weight: "strokeWeight" in node
      ? (typeof (node as any).strokeWeight === "number"
        ? (node as any).strokeWeight
        : ("strokeTopWeight" in node ? (node as any).strokeTopWeight : 1))
      : 1,
  }));
}

// ── Validation helpers: Serialize effects ──

function validationSerializeEffects(node: SceneNode): unknown[] {
  if (!("effects" in node)) return [];
  const effects = (node as any).effects;
  if (!Array.isArray(effects)) return [];

  return effects.map((effect: any) => ({
    type: effect.type,
    visible: effect.visible !== false,
    color: effect.color
      ? { r: effect.color.r, g: effect.color.g, b: effect.color.b, a: effect.color.a ?? 1 }
      : null,
    offset: effect.offset ? { x: effect.offset.x, y: effect.offset.y } : null,
    radius: effect.radius || 0,
  }));
}

// ── Validation helpers: Extract text properties (handle mixed styles) ──

function validationExtractFontSize(node: TextNode): number {
  const size = node.fontSize;
  if (typeof size === "number") return size;
  // Mixed — resolve from first character
  if (node.characters.length > 0) {
    const rangeSize = node.getRangeFontSize(0, 1);
    if (typeof rangeSize === "number") return rangeSize;
  }
  return 14;
}

function validationFontNameToWeight(fontName: FontName): number {
  const style = fontName.style.toLowerCase();
  if (style.includes("thin")) return 100;
  if (style.includes("extralight") || style.includes("extra light")) return 200;
  if (style.includes("light")) return 300;
  if (style.includes("medium")) return 500;
  if (style.includes("semibold") || style.includes("semi bold")) return 600;
  if (style.includes("extrabold") || style.includes("extra bold")) return 800;
  if (style.includes("black")) return 900;
  if (style.includes("bold")) return 700;
  return 400;
}

function validationExtractFontWeight(node: TextNode): number {
  const fontName = node.fontName;
  if (fontName && typeof fontName === "object" && "style" in fontName) {
    return validationFontNameToWeight(fontName as FontName);
  }
  // Mixed — resolve from first character
  if (node.characters.length > 0) {
    const rangeName = node.getRangeFontName(0, 1);
    if (rangeName && typeof rangeName === "object" && "style" in rangeName) {
      return validationFontNameToWeight(rangeName as FontName);
    }
  }
  return 400;
}

function validationExtractFontFamily(node: TextNode): string {
  const fontName = node.fontName;
  if (fontName && typeof fontName === "object" && "family" in fontName) {
    return (fontName as FontName).family;
  }
  // Mixed — resolve from first character
  if (node.characters.length > 0) {
    const rangeName = node.getRangeFontName(0, 1);
    if (rangeName && typeof rangeName === "object" && "family" in rangeName) {
      return (rangeName as FontName).family;
    }
  }
  return "Inter";
}

function validationExtractLineHeight(node: TextNode): number | null {
  const lh = node.lineHeight;
  if (lh && typeof lh === "object" && "value" in lh) {
    return (lh as any).value;
  }
  // Mixed — resolve from first character
  if (typeof lh === "symbol" && node.characters.length > 0) {
    const rangeLh = node.getRangeLineHeight(0, 1);
    if (rangeLh && typeof rangeLh === "object" && "value" in rangeLh) {
      return (rangeLh as any).value;
    }
  }
  return null;
}

function validationExtractLetterSpacing(node: TextNode): number | null {
  const ls = node.letterSpacing;
  if (ls && typeof ls === "object" && "value" in ls) {
    return (ls as any).value;
  }
  // Mixed — resolve from first character
  if (typeof ls === "symbol" && node.characters.length > 0) {
    const rangeLs = node.getRangeLetterSpacing(0, 1);
    if (rangeLs && typeof rangeLs === "object" && "value" in rangeLs) {
      return (rangeLs as any).value;
    }
  }
  return null;
}
