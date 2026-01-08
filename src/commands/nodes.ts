// src/commands/nodes.ts

import type {
  GroupNodesParams,
  UngroupNodesParams,
  SetRotationParams,
  SetZIndexParams,
  RenameNodeParams,
  SetVisibilityParams,
  SetConstraintsParams,
  LockNodeParams,
} from "../types";

interface GroupResult {
  id: string;
  name: string;
  type: string;
  childCount: number;
  children: Array<{ id: string; name: string }>;
}

/**
 * Group nodes together
 */
export async function groupNodes(params: GroupNodesParams): Promise<GroupResult> {
  const { nodeIds, name = "Group" } = params;

  if (!nodeIds || !Array.isArray(nodeIds) || nodeIds.length < 1) {
    throw new Error("nodeIds must be an array with at least 1 node ID");
  }

  const nodes: SceneNode[] = [];
  for (const nodeId of nodeIds) {
    const node = await figma.getNodeByIdAsync(nodeId);
    if (!node) {
      throw new Error(`Node not found with ID: ${nodeId}`);
    }
    if (!("parent" in node)) {
      throw new Error(`Node cannot be grouped: ${nodeId}`);
    }
    nodes.push(node as SceneNode);
  }

  // All nodes must have the same parent
  const parent = nodes[0].parent;
  for (const node of nodes) {
    if (node.parent !== parent) {
      throw new Error("All nodes must have the same parent to be grouped");
    }
  }

  if (!parent || !("appendChild" in parent)) {
    throw new Error("Parent does not support children");
  }

  const group = figma.group(nodes, parent as PageNode | FrameNode | GroupNode);
  group.name = name;

  return {
    id: group.id,
    name: group.name,
    type: group.type,
    childCount: group.children.length,
    children: group.children.map((c) => ({ id: c.id, name: c.name })),
  };
}

interface UngroupResult {
  success: boolean;
  ungroupedChildren: Array<{ id: string; name: string; type: string }>;
}

/**
 * Ungroup a group node
 */
export async function ungroupNodes(params: UngroupNodesParams): Promise<UngroupResult> {
  const { nodeId } = params;

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (node.type !== "GROUP") {
    throw new Error(`Node is not a GROUP: ${nodeId}`);
  }

  const group = node as GroupNode;
  const parent = group.parent;
  const children = [...group.children];

  if (!parent || !("appendChild" in parent)) {
    throw new Error("Parent does not support children");
  }

  // Move children to parent and record their info
  const ungroupedChildren = children.map((child) => {
    const info = { id: child.id, name: child.name, type: child.type };
    (parent as FrameNode | PageNode | GroupNode).appendChild(child);
    return info;
  });

  // Note: When all children are removed from a group, Figma auto-deletes it
  // So we don't need to call group.remove() - it would throw an error

  return {
    success: true,
    ungroupedChildren,
  };
}

interface SetRotationResult {
  id: string;
  name: string;
  rotation: number;
}

/**
 * Set rotation on a node
 */
export async function setRotation(params: SetRotationParams): Promise<SetRotationResult> {
  const { nodeId, rotation } = params;

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  if (rotation === undefined) {
    throw new Error("Missing rotation parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (!("rotation" in node)) {
    throw new Error(`Node does not support rotation: ${nodeId}`);
  }

  const rotatable = node as SceneNode & { rotation: number };
  rotatable.rotation = rotation;

  return {
    id: node.id,
    name: node.name,
    rotation: rotatable.rotation,
  };
}

interface SetZIndexResult {
  id: string;
  name: string;
  index: number;
}

/**
 * Reorder node in layer stack
 */
export async function setZIndex(params: SetZIndexParams): Promise<SetZIndexResult> {
  const { nodeId, position } = params;

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  if (position === undefined) {
    throw new Error("Missing position parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  const parent = node.parent;
  if (!parent || !("children" in parent)) {
    throw new Error("Node has no parent with children");
  }

  const parentWithChildren = parent as FrameNode | PageNode | GroupNode;
  const sceneNode = node as SceneNode;
  const currentIndex = parentWithChildren.children.indexOf(sceneNode);
  const maxIndex = parentWithChildren.children.length - 1;

  let newIndex: number;

  if (position === "front") {
    // Move to top (last in array = front in Figma)
    parentWithChildren.insertChild(maxIndex, sceneNode);
    newIndex = maxIndex;
  } else if (position === "back") {
    // Move to bottom (first in array = back in Figma)
    parentWithChildren.insertChild(0, sceneNode);
    newIndex = 0;
  } else if (position === "forward") {
    // Move one step forward
    newIndex = Math.min(currentIndex + 1, maxIndex);
    parentWithChildren.insertChild(newIndex, sceneNode);
  } else if (position === "backward") {
    // Move one step backward
    newIndex = Math.max(currentIndex - 1, 0);
    parentWithChildren.insertChild(newIndex, sceneNode);
  } else if (typeof position === "number") {
    // Move to specific index
    newIndex = Math.max(0, Math.min(position, maxIndex));
    parentWithChildren.insertChild(newIndex, sceneNode);
  } else {
    throw new Error("Invalid position parameter");
  }

  return {
    id: node.id,
    name: node.name,
    index: parentWithChildren.children.indexOf(sceneNode),
  };
}

interface RenameResult {
  id: string;
  oldName: string;
  newName: string;
}

/**
 * Rename a node
 */
export async function renameNode(params: RenameNodeParams): Promise<RenameResult> {
  const { nodeId, name } = params;

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  if (name === undefined) {
    throw new Error("Missing name parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  const oldName = node.name;
  node.name = name;

  return {
    id: node.id,
    oldName,
    newName: node.name,
  };
}

interface SetVisibilityResult {
  id: string;
  name: string;
  visible: boolean;
}

/**
 * Set node visibility
 */
export async function setVisibility(params: SetVisibilityParams): Promise<SetVisibilityResult> {
  const { nodeId, visible } = params;

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  if (visible === undefined) {
    throw new Error("Missing visible parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (!("visible" in node)) {
    throw new Error(`Node does not support visibility: ${nodeId}`);
  }

  const sceneNode = node as SceneNode;
  sceneNode.visible = visible;

  return {
    id: node.id,
    name: node.name,
    visible: sceneNode.visible,
  };
}

interface SetConstraintsResult {
  id: string;
  name: string;
  constraints: Constraints;
}

/**
 * Set resize constraints on a node
 */
export async function setConstraints(params: SetConstraintsParams): Promise<SetConstraintsResult> {
  const { nodeId, horizontal, vertical } = params;

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (!("constraints" in node)) {
    throw new Error(`Node does not support constraints: ${nodeId}`);
  }

  const constrainedNode = node as ConstraintMixin & BaseNode;

  const newConstraints: Constraints = {
    horizontal: horizontal ?? constrainedNode.constraints.horizontal,
    vertical: vertical ?? constrainedNode.constraints.vertical,
  };

  constrainedNode.constraints = newConstraints;

  return {
    id: node.id,
    name: node.name,
    constraints: constrainedNode.constraints,
  };
}

interface LockResult {
  id: string;
  name: string;
  locked: boolean;
}

/**
 * Lock or unlock a node
 */
export async function lockNode(params: LockNodeParams): Promise<LockResult> {
  const { nodeId, locked } = params;

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  if (locked === undefined) {
    throw new Error("Missing locked parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (!("locked" in node)) {
    throw new Error(`Node does not support locking: ${nodeId}`);
  }

  const sceneNode = node as SceneNode;
  sceneNode.locked = locked;

  return {
    id: node.id,
    name: node.name,
    locked: sceneNode.locked,
  };
}
