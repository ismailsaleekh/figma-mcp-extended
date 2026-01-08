// src/commands/styling.ts

import type {
  SetFillColorParams,
  SetStrokeColorParams,
  SetCornerRadiusParams,
  SetOpacityParams,
  SetEffectsParams,
  SetGradientFillParams,
  SetBlendModeParams,
  SetStrokeStyleParams,
  EffectConfig,
} from "../types";

export async function setFillColor(params: SetFillColorParams) {
  const { nodeId, color: rgbColor } = params;

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (!("fills" in node)) {
    throw new Error(`Node does not support fills: ${nodeId}`);
  }

  const paintStyle: SolidPaint = {
    type: "SOLID",
    color: {
      r: parseFloat(String(rgbColor.r)),
      g: parseFloat(String(rgbColor.g)),
      b: parseFloat(String(rgbColor.b)),
    },
    opacity: rgbColor.a !== undefined ? parseFloat(String(rgbColor.a)) : 1,
  };

  (node as GeometryMixin).fills = [paintStyle];

  return {
    id: node.id,
    name: node.name,
    fills: [paintStyle],
  };
}

export async function setStrokeColor(params: SetStrokeColorParams) {
  const { nodeId, color, weight = 1 } = params;

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (!("strokes" in node)) {
    throw new Error(`Node does not support strokes: ${nodeId}`);
  }

  const rgbColor = {
    r: color.r !== undefined ? color.r : 0,
    g: color.g !== undefined ? color.g : 0,
    b: color.b !== undefined ? color.b : 0,
    a: color.a !== undefined ? color.a : 1,
  };

  const paintStyle: SolidPaint = {
    type: "SOLID",
    color: {
      r: rgbColor.r,
      g: rgbColor.g,
      b: rgbColor.b,
    },
    opacity: rgbColor.a,
  };

  (node as GeometryMixin).strokes = [paintStyle];

  if ("strokeWeight" in node) {
    (node as GeometryMixin).strokeWeight = weight;
  }

  return {
    id: node.id,
    name: node.name,
    strokes: (node as GeometryMixin).strokes,
    strokeWeight: "strokeWeight" in node ? (node as GeometryMixin).strokeWeight : undefined,
  };
}

export async function setCornerRadius(params: SetCornerRadiusParams) {
  const { nodeId, radius, corners } = params;

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  if (radius === undefined) {
    throw new Error("Missing radius parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (!("cornerRadius" in node)) {
    throw new Error(`Node does not support corner radius: ${nodeId}`);
  }

  const rectNode = node as RectangleNode;

  if (corners && Array.isArray(corners) && corners.length === 4) {
    if ("topLeftRadius" in node) {
      if (corners[0]) rectNode.topLeftRadius = radius;
      if (corners[1]) rectNode.topRightRadius = radius;
      if (corners[2]) rectNode.bottomRightRadius = radius;
      if (corners[3]) rectNode.bottomLeftRadius = radius;
    } else {
      rectNode.cornerRadius = radius;
    }
  } else {
    rectNode.cornerRadius = radius;
  }

  return {
    id: node.id,
    name: node.name,
    cornerRadius: rectNode.cornerRadius,
    topLeftRadius: "topLeftRadius" in rectNode ? rectNode.topLeftRadius : undefined,
    topRightRadius: "topRightRadius" in rectNode ? rectNode.topRightRadius : undefined,
    bottomRightRadius: "bottomRightRadius" in rectNode ? rectNode.bottomRightRadius : undefined,
    bottomLeftRadius: "bottomLeftRadius" in rectNode ? rectNode.bottomLeftRadius : undefined,
  };
}

interface SetOpacityResult {
  id: string;
  name: string;
  opacity: number;
}

/**
 * Set opacity on a node
 */
export async function setOpacity(params: SetOpacityParams): Promise<SetOpacityResult> {
  const { nodeId, opacity } = params;

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  if (opacity === undefined || opacity < 0 || opacity > 1) {
    throw new Error("opacity must be a number between 0 and 1");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (!("opacity" in node)) {
    throw new Error(`Node does not support opacity: ${nodeId}`);
  }

  const blendNode = node as SceneNode & BlendMixin;
  blendNode.opacity = opacity;

  return {
    id: node.id,
    name: node.name,
    opacity: blendNode.opacity,
  };
}

interface SetEffectsResult {
  id: string;
  name: string;
  effects: readonly Effect[];
}

/**
 * Set effects (shadows, blur) on a node
 */
export async function setEffects(params: SetEffectsParams): Promise<SetEffectsResult> {
  const { nodeId, effects } = params;

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  if (!effects || !Array.isArray(effects)) {
    throw new Error("effects must be an array");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (!("effects" in node)) {
    throw new Error(`Node does not support effects: ${nodeId}`);
  }

  const figmaEffects: Effect[] = effects.map((effect: EffectConfig) => {
    if (effect.type === "DROP_SHADOW" || effect.type === "INNER_SHADOW") {
      const shadowEffect: DropShadowEffect | InnerShadowEffect = {
        type: effect.type,
        visible: effect.visible !== false,
        radius: effect.radius,
        color: effect.color
          ? { r: effect.color.r, g: effect.color.g, b: effect.color.b, a: effect.color.a ?? 1 }
          : { r: 0, g: 0, b: 0, a: 0.25 },
        offset: effect.offset ?? { x: 0, y: 4 },
        spread: effect.spread ?? 0,
        blendMode: "NORMAL",
      };
      return shadowEffect;
    } else {
      // Handle blur effects (LAYER_BLUR and BACKGROUND_BLUR)
      const blurEffect = {
        type: effect.type,
        visible: effect.visible !== false,
        radius: effect.radius,
      } as Effect;
      return blurEffect;
    }
  });

  const blendNode = node as SceneNode & BlendMixin;
  blendNode.effects = figmaEffects;

  return {
    id: node.id,
    name: node.name,
    effects: blendNode.effects,
  };
}

interface SetGradientFillResult {
  id: string;
  name: string;
  fills: readonly Paint[];
}

/**
 * Set gradient fill on a node
 */
export async function setGradientFill(params: SetGradientFillParams): Promise<SetGradientFillResult> {
  const { nodeId, gradientType, stops, angle = 0 } = params;

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  if (!stops || !Array.isArray(stops) || stops.length < 2) {
    throw new Error("stops must be an array with at least 2 color stops");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (!("fills" in node)) {
    throw new Error(`Node does not support fills: ${nodeId}`);
  }

  // Convert angle to gradient transform
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  const gradientPaint: GradientPaint = {
    type: gradientType,
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

  const geometryNode = node as GeometryMixin;
  geometryNode.fills = [gradientPaint];

  return {
    id: node.id,
    name: node.name,
    fills: geometryNode.fills as readonly Paint[],
  };
}

interface SetBlendModeResult {
  id: string;
  name: string;
  blendMode: BlendMode;
}

/**
 * Set blend mode on a node
 */
export async function setBlendMode(params: SetBlendModeParams): Promise<SetBlendModeResult> {
  const { nodeId, blendMode } = params;

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  if (!blendMode) {
    throw new Error("Missing blendMode parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (!("blendMode" in node)) {
    throw new Error(`Node does not support blend mode: ${nodeId}`);
  }

  const blendNode = node as SceneNode & BlendMixin;
  blendNode.blendMode = blendMode;

  return {
    id: node.id,
    name: node.name,
    blendMode: blendNode.blendMode,
  };
}

interface SetStrokeStyleResult {
  id: string;
  name: string;
  strokeAlign?: "INSIDE" | "OUTSIDE" | "CENTER";
  strokeCap?: StrokeCap;
  strokeJoin?: StrokeJoin;
  dashPattern?: readonly number[];
}

/**
 * Set stroke style on a node
 */
export async function setStrokeStyle(params: SetStrokeStyleParams): Promise<SetStrokeStyleResult> {
  const { nodeId, strokeAlign, strokeCap, strokeJoin, dashPattern } = params;

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (!("strokes" in node)) {
    throw new Error(`Node does not support strokes: ${nodeId}`);
  }

  const geometryNode = node as GeometryMixin;

  if (strokeAlign !== undefined && "strokeAlign" in geometryNode) {
    geometryNode.strokeAlign = strokeAlign;
  }

  if (strokeCap !== undefined && "strokeCap" in geometryNode) {
    (geometryNode as GeometryMixin & { strokeCap: StrokeCap }).strokeCap = strokeCap;
  }

  if (strokeJoin !== undefined && "strokeJoin" in geometryNode) {
    (geometryNode as GeometryMixin & { strokeJoin: StrokeJoin }).strokeJoin = strokeJoin;
  }

  if (dashPattern !== undefined && "dashPattern" in geometryNode) {
    geometryNode.dashPattern = dashPattern;
  }

  return {
    id: node.id,
    name: node.name,
    strokeAlign: "strokeAlign" in geometryNode ? geometryNode.strokeAlign : undefined,
    strokeCap: "strokeCap" in geometryNode ? (geometryNode as GeometryMixin & { strokeCap: StrokeCap }).strokeCap : undefined,
    strokeJoin: "strokeJoin" in geometryNode ? (geometryNode as GeometryMixin & { strokeJoin: StrokeJoin }).strokeJoin : undefined,
    dashPattern: "dashPattern" in geometryNode ? geometryNode.dashPattern : undefined,
  };
}
