// src/commands/extraction.ts

import type { GetLayoutConstraintsParams, GetStyleInheritanceParams } from "../types";
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

  completeData.styles = await getDocumentStyles();
  completeData.components = await getDocumentComponents();
  completeData.variables = await getDocumentVariables();

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
