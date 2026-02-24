// src/commands/layout.ts

import type {
  SetLayoutModeParams,
  SetPaddingParams,
  SetAxisAlignParams,
  SetLayoutSizingParams,
  SetItemSpacingParams,
  SetMinMaxSizeParams,
  SetLayoutPositioningParams,
} from "../types";

type AutoLayoutFrame = FrameNode | ComponentNode | ComponentSetNode | InstanceNode;

function isAutoLayoutFrame(node: BaseNode): node is AutoLayoutFrame {
  return (
    node.type === "FRAME" ||
    node.type === "COMPONENT" ||
    node.type === "COMPONENT_SET" ||
    node.type === "INSTANCE"
  );
}

export async function setLayoutMode(params: SetLayoutModeParams) {
  const { nodeId, layoutMode = "NONE", layoutWrap = "NO_WRAP" } = params;

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node with ID ${nodeId} not found`);
  }

  if (!isAutoLayoutFrame(node)) {
    throw new Error(`Node type ${node.type} does not support layoutMode`);
  }

  node.layoutMode = layoutMode;

  if (layoutMode !== "NONE") {
    node.layoutWrap = layoutWrap;
  }

  return {
    id: node.id,
    name: node.name,
    layoutMode: node.layoutMode,
    layoutWrap: node.layoutWrap,
  };
}

export async function setPadding(params: SetPaddingParams) {
  const { nodeId, paddingTop, paddingRight, paddingBottom, paddingLeft } = params;

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node with ID ${nodeId} not found`);
  }

  if (!isAutoLayoutFrame(node)) {
    throw new Error(`Node type ${node.type} does not support padding`);
  }

  if (node.layoutMode === "NONE") {
    throw new Error("Padding can only be set on auto-layout frames");
  }

  if (paddingTop !== undefined) node.paddingTop = paddingTop;
  if (paddingRight !== undefined) node.paddingRight = paddingRight;
  if (paddingBottom !== undefined) node.paddingBottom = paddingBottom;
  if (paddingLeft !== undefined) node.paddingLeft = paddingLeft;

  return {
    id: node.id,
    name: node.name,
    paddingTop: node.paddingTop,
    paddingRight: node.paddingRight,
    paddingBottom: node.paddingBottom,
    paddingLeft: node.paddingLeft,
  };
}

export async function setAxisAlign(params: SetAxisAlignParams) {
  const { nodeId, primaryAxisAlignItems, counterAxisAlignItems } = params;

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node with ID ${nodeId} not found`);
  }

  if (!isAutoLayoutFrame(node)) {
    throw new Error(`Node type ${node.type} does not support axis alignment`);
  }

  if (node.layoutMode === "NONE") {
    throw new Error("Axis alignment can only be set on auto-layout frames");
  }

  if (primaryAxisAlignItems !== undefined) {
    if (!["MIN", "MAX", "CENTER", "SPACE_BETWEEN"].includes(primaryAxisAlignItems)) {
      throw new Error("Invalid primaryAxisAlignItems value");
    }
    node.primaryAxisAlignItems = primaryAxisAlignItems;
  }

  if (counterAxisAlignItems !== undefined) {
    if (!["MIN", "MAX", "CENTER", "BASELINE"].includes(counterAxisAlignItems)) {
      throw new Error("Invalid counterAxisAlignItems value");
    }
    if (counterAxisAlignItems === "BASELINE" && node.layoutMode !== "HORIZONTAL") {
      throw new Error("BASELINE alignment is only valid for horizontal auto-layout frames");
    }
    node.counterAxisAlignItems = counterAxisAlignItems;
  }

  return {
    id: node.id,
    name: node.name,
    primaryAxisAlignItems: node.primaryAxisAlignItems,
    counterAxisAlignItems: node.counterAxisAlignItems,
    layoutMode: node.layoutMode,
  };
}

export async function setLayoutSizing(params: SetLayoutSizingParams) {
  const { nodeId, layoutSizingHorizontal, layoutSizingVertical } = params;

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node with ID ${nodeId} not found`);
  }

  // Accept three cases:
  // 1. Auto-layout frames (FRAME/COMPONENT with layoutMode !== "NONE")
  // 2. Non-frame nodes (TEXT, VECTOR, etc.) that are children of auto-layout frames
  // 3. Frames WITHOUT their own auto-layout that are children of auto-layout frames
  //    (e.g., StatusBar, SafeAreaBottom — plain frames that need FILL sizing)
  const isLayout = isAutoLayoutFrame(node);
  const parentIsAutoLayout =
    node.parent !== null &&
    isAutoLayoutFrame(node.parent) &&
    (node.parent as AutoLayoutFrame).layoutMode !== "NONE";

  const isChildOfAutoLayout =
    !isLayout &&
    "layoutSizingHorizontal" in node &&
    parentIsAutoLayout;

  // A frame without its own auto-layout can still have sizing set
  // if it's a child of an auto-layout parent
  const isNonLayoutFrameInAutoLayout =
    isLayout &&
    node.layoutMode === "NONE" &&
    parentIsAutoLayout;

  if (!isLayout && !isChildOfAutoLayout) {
    throw new Error(`Node type ${node.type} does not support layout sizing`);
  }

  if (isLayout && node.layoutMode === "NONE" && !parentIsAutoLayout) {
    throw new Error("Layout sizing can only be set on auto-layout frames or children of auto-layout frames");
  }

  const sizable = node as SceneNode & {
    layoutSizingHorizontal: "FIXED" | "HUG" | "FILL";
    layoutSizingVertical: "FIXED" | "HUG" | "FILL";
  };

  if (layoutSizingHorizontal !== undefined) {
    if (!["FIXED", "HUG", "FILL"].includes(layoutSizingHorizontal)) {
      throw new Error("Invalid layoutSizingHorizontal value");
    }
    sizable.layoutSizingHorizontal = layoutSizingHorizontal;
  }

  if (layoutSizingVertical !== undefined) {
    if (!["FIXED", "HUG", "FILL"].includes(layoutSizingVertical)) {
      throw new Error("Invalid layoutSizingVertical value");
    }
    sizable.layoutSizingVertical = layoutSizingVertical;
  }

  return {
    id: node.id,
    name: node.name,
    layoutSizingHorizontal: sizable.layoutSizingHorizontal,
    layoutSizingVertical: sizable.layoutSizingVertical,
    layoutMode: isNonLayoutFrameInAutoLayout ? "CHILD" : (isLayout ? node.layoutMode : "CHILD"),
  };
}

export async function setItemSpacing(params: SetItemSpacingParams) {
  const { nodeId, itemSpacing, counterAxisSpacing } = params;

  if (itemSpacing === undefined && counterAxisSpacing === undefined) {
    throw new Error("At least one of itemSpacing or counterAxisSpacing must be provided");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node with ID ${nodeId} not found`);
  }

  if (!isAutoLayoutFrame(node)) {
    throw new Error(`Node type ${node.type} does not support item spacing`);
  }

  if (node.layoutMode === "NONE") {
    throw new Error("Item spacing can only be set on auto-layout frames");
  }

  if (itemSpacing !== undefined) {
    node.itemSpacing = itemSpacing;
  }

  if (counterAxisSpacing !== undefined) {
    if (node.layoutWrap !== "WRAP") {
      throw new Error("Counter axis spacing can only be set on frames with layoutWrap set to WRAP");
    }
    node.counterAxisSpacing = counterAxisSpacing;
  }

  return {
    id: node.id,
    name: node.name,
    itemSpacing: node.itemSpacing,
    counterAxisSpacing: node.counterAxisSpacing,
    layoutMode: node.layoutMode,
    layoutWrap: node.layoutWrap,
  };
}

export async function setMinMaxSize(params: SetMinMaxSizeParams) {
  const { nodeId, minWidth, maxWidth, minHeight, maxHeight } = params;

  if (minWidth === undefined && maxWidth === undefined && minHeight === undefined && maxHeight === undefined) {
    throw new Error("At least one of minWidth, maxWidth, minHeight, or maxHeight must be provided");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node with ID ${nodeId} not found`);
  }

  if (!isAutoLayoutFrame(node)) {
    throw new Error(`Node type ${node.type} does not support min/max size constraints`);
  }

  if (node.layoutMode === "NONE") {
    throw new Error("Min/max size constraints can only be set on auto-layout frames");
  }

  if (minWidth !== undefined) node.minWidth = minWidth;
  if (maxWidth !== undefined) node.maxWidth = maxWidth;
  if (minHeight !== undefined) node.minHeight = minHeight;
  if (maxHeight !== undefined) node.maxHeight = maxHeight;

  return {
    id: node.id,
    name: node.name,
    minWidth: node.minWidth,
    maxWidth: node.maxWidth,
    minHeight: node.minHeight,
    maxHeight: node.maxHeight,
    layoutMode: node.layoutMode,
  };
}

export async function setLayoutPositioning(params: SetLayoutPositioningParams) {
  const { nodeId, positioning, x, y, top, left, right, bottom } = params;

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node with ID ${nodeId} not found`);
  }

  if (!("layoutPositioning" in node)) {
    throw new Error(`Node type ${node.type} does not support layoutPositioning`);
  }

  const sceneNode = node as SceneNode & {
    layoutPositioning: "AUTO" | "ABSOLUTE";
    constraints: Constraints;
  };

  // Validate parent is an auto-layout frame
  const parent = node.parent;
  if (!parent || !isAutoLayoutFrame(parent) || parent.layoutMode === "NONE") {
    throw new Error("layoutPositioning can only be set on children of auto-layout frames");
  }

  if (!["ABSOLUTE", "AUTO"].includes(positioning)) {
    throw new Error("Invalid positioning value. Must be 'ABSOLUTE' or 'AUTO'.");
  }

  sceneNode.layoutPositioning = positioning;

  if (positioning === "ABSOLUTE") {
    // Offset-based positioning — compute x/y from actual parent dimensions
    const hasOffsets = top !== undefined || left !== undefined || right !== undefined || bottom !== undefined;

    if (hasOffsets) {
      const parentWidth = parent.width;
      const parentHeight = parent.height;
      const nodeWidth = sceneNode.width;
      const nodeHeight = sceneNode.height;

      if (typeof left === "number") {
        sceneNode.x = left;
      } else if (typeof right === "number") {
        sceneNode.x = parentWidth - nodeWidth - right;
      }

      if (typeof top === "number") {
        sceneNode.y = top;
      } else if (typeof bottom === "number") {
        sceneNode.y = parentHeight - nodeHeight - bottom;
      }

      // Set constraints to match the positioning edge
      sceneNode.constraints = {
        horizontal: typeof right === "number" ? "MAX" : "MIN",
        vertical: typeof bottom === "number" ? "MAX" : "MIN",
      };
    } else if (x !== undefined || y !== undefined) {
      // Legacy x/y positioning
      if (x !== undefined) sceneNode.x = x;
      if (y !== undefined) sceneNode.y = y;
    }
  }

  return {
    id: node.id,
    name: node.name,
    layoutPositioning: sceneNode.layoutPositioning,
    x: sceneNode.x,
    y: sceneNode.y,
    parentId: parent.id,
    parentName: parent.name,
    parentLayoutMode: parent.layoutMode,
  };
}
