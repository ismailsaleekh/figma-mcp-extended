// src/commands/components.ts

import type {
  CreateComponentInstanceParams,
  CreateComponentFromNodeParams,
  DetachInstanceParams,
} from "../types";

export async function getStyles() {
  const styles = {
    colors: await figma.getLocalPaintStylesAsync(),
    texts: await figma.getLocalTextStylesAsync(),
    effects: await figma.getLocalEffectStylesAsync(),
    grids: await figma.getLocalGridStylesAsync(),
  };

  return {
    colors: styles.colors.map((style) => ({
      id: style.id,
      name: style.name,
      key: style.key,
      paint: style.paints[0],
    })),
    texts: styles.texts.map((style) => ({
      id: style.id,
      name: style.name,
      key: style.key,
      fontSize: style.fontSize,
      fontName: style.fontName,
    })),
    effects: styles.effects.map((style) => ({
      id: style.id,
      name: style.name,
      key: style.key,
    })),
    grids: styles.grids.map((style) => ({
      id: style.id,
      name: style.name,
      key: style.key,
    })),
  };
}

export async function getLocalComponents() {
  await figma.loadAllPagesAsync();

  const components = figma.root.findAllWithCriteria({
    types: ["COMPONENT"],
  });

  return {
    count: components.length,
    components: components.map((component) => ({
      id: component.id,
      name: component.name,
      key: "key" in component ? (component as ComponentNode).key : null,
    })),
  };
}

export async function createComponentInstance(params: CreateComponentInstanceParams) {
  const { componentKey, componentId, x = 0, y = 0, parentId } = params;

  if (!componentKey && !componentId) {
    throw new Error("Missing componentKey or componentId parameter");
  }

  let component: ComponentNode;

  if (componentId) {
    // Use local component by ID
    const node = await figma.getNodeByIdAsync(componentId);
    if (!node) {
      throw new Error(`Component not found with ID: ${componentId}`);
    }
    if (node.type !== "COMPONENT") {
      throw new Error(`Node is not a component: ${componentId}`);
    }
    component = node as ComponentNode;
  } else if (componentKey) {
    // Import from published library
    try {
      component = await figma.importComponentByKeyAsync(componentKey);
    } catch (error) {
      throw new Error(`Failed to import component with key "${componentKey}". Component must be published to a team library.`);
    }
  } else {
    throw new Error("Missing componentKey or componentId parameter");
  }

  const instance = component.createInstance();

  instance.x = x;
  instance.y = y;

  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (!parentNode) {
      throw new Error(`Parent node not found with ID: ${parentId}`);
    }
    if (!("appendChild" in parentNode)) {
      throw new Error(`Parent node does not support children: ${parentId}`);
    }
    (parentNode as FrameNode).appendChild(instance);
  } else {
    figma.currentPage.appendChild(instance);
  }

  return {
    id: instance.id,
    name: instance.name,
    x: instance.x,
    y: instance.y,
    width: instance.width,
    height: instance.height,
    componentId: instance.mainComponent?.id || null,
    componentKey: instance.mainComponent?.key || null,
    parentId: instance.parent?.id,
  };
}

interface CreateComponentResult {
  id: string;
  name: string;
  key: string;
  type: string;
}

/**
 * Convert a node to a component
 */
export async function createComponent(params: CreateComponentFromNodeParams): Promise<CreateComponentResult> {
  const { nodeId, name } = params;

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (node.type === "COMPONENT" || node.type === "COMPONENT_SET") {
    throw new Error("Node is already a component");
  }

  if (node.type === "DOCUMENT" || node.type === "PAGE") {
    throw new Error("Cannot convert this node type to a component");
  }

  const component = figma.createComponentFromNode(node as SceneNode);

  if (name) {
    component.name = name;
  }

  return {
    id: component.id,
    name: component.name,
    key: component.key,
    type: component.type,
  };
}

interface DetachInstanceResult {
  id: string;
  name: string;
  type: string;
}

/**
 * Detach an instance from its component
 */
export async function detachInstance(params: DetachInstanceParams): Promise<DetachInstanceResult> {
  const { nodeId } = params;

  if (!nodeId) {
    throw new Error("Missing nodeId parameter");
  }

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) {
    throw new Error(`Node not found with ID: ${nodeId}`);
  }

  if (node.type !== "INSTANCE") {
    throw new Error(`Node is not an instance: ${nodeId}`);
  }

  const instanceNode = node as InstanceNode;
  const detached = instanceNode.detachInstance();

  return {
    id: detached.id,
    name: detached.name,
    type: detached.type,
  };
}
