// src/commands/layout.ts

import type {
  SetLayoutModeParams,
  SetPaddingParams,
  SetAxisAlignParams,
  SetLayoutSizingParams,
  SetItemSpacingParams,
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

  if (!isAutoLayoutFrame(node)) {
    throw new Error(`Node type ${node.type} does not support layout sizing`);
  }

  if (node.layoutMode === "NONE") {
    throw new Error("Layout sizing can only be set on auto-layout frames");
  }

  if (layoutSizingHorizontal !== undefined) {
    if (!["FIXED", "HUG", "FILL"].includes(layoutSizingHorizontal)) {
      throw new Error("Invalid layoutSizingHorizontal value");
    }
    node.layoutSizingHorizontal = layoutSizingHorizontal;
  }

  if (layoutSizingVertical !== undefined) {
    if (!["FIXED", "HUG", "FILL"].includes(layoutSizingVertical)) {
      throw new Error("Invalid layoutSizingVertical value");
    }
    node.layoutSizingVertical = layoutSizingVertical;
  }

  return {
    id: node.id,
    name: node.name,
    layoutSizingHorizontal: node.layoutSizingHorizontal,
    layoutSizingVertical: node.layoutSizingVertical,
    layoutMode: node.layoutMode,
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
