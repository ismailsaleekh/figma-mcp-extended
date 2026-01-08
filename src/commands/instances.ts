// src/commands/instances.ts

/**
 * Type-safe property copying between nodes
 * This handles the dynamic property assignment in a type-safe way
 */
function copyNodeProperty(source: BaseNode, target: BaseNode, field: string): void {
  // Handle common overridable properties
  switch (field) {
    case "fills":
      if ("fills" in source && "fills" in target) {
        (target as GeometryMixin).fills = (source as GeometryMixin).fills;
      }
      break;
    case "strokes":
      if ("strokes" in source && "strokes" in target) {
        (target as GeometryMixin).strokes = (source as GeometryMixin).strokes;
      }
      break;
    case "opacity":
      if ("opacity" in source && "opacity" in target) {
        (target as BlendMixin).opacity = (source as BlendMixin).opacity;
      }
      break;
    case "visible":
      if ("visible" in source && "visible" in target) {
        (target as SceneNode).visible = (source as SceneNode).visible;
      }
      break;
    case "cornerRadius":
      if ("cornerRadius" in source && "cornerRadius" in target) {
        (target as CornerMixin).cornerRadius = (source as CornerMixin).cornerRadius;
      }
      break;
    case "strokeWeight":
      if ("strokeWeight" in source && "strokeWeight" in target) {
        (target as GeometryMixin).strokeWeight = (source as GeometryMixin).strokeWeight;
      }
      break;
    default:
      // For unknown fields, we skip to maintain type safety
      console.log(`Skipping unknown override field: ${field}`);
  }
}

export async function getInstanceOverrides(instanceNode: InstanceNode | null = null) {
  let sourceInstance: InstanceNode | null = null;

  if (instanceNode) {
    if (instanceNode.type !== "INSTANCE") {
      figma.notify("Provided node is not a component instance");
      return { success: false, message: "Provided node is not a component instance" };
    }
    sourceInstance = instanceNode;
  } else {
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
      figma.notify("Please select at least one instance");
      return { success: false, message: "No nodes selected" };
    }

    const instances = selection.filter((node): node is InstanceNode => node.type === "INSTANCE");
    if (instances.length === 0) {
      figma.notify("Please select at least one component instance");
      return { success: false, message: "No instances found in selection" };
    }

    sourceInstance = instances[0];
  }

  const overrides = sourceInstance.overrides || [];
  const mainComponent = await sourceInstance.getMainComponentAsync();

  if (!mainComponent) {
    figma.notify("Failed to get main component");
    return { success: false, message: "Failed to get main component" };
  }

  return {
    success: true,
    message: `Got component information from "${sourceInstance.name}"`,
    sourceInstanceId: sourceInstance.id,
    mainComponentId: mainComponent.id,
    overridesCount: overrides.length,
  };
}

async function getValidTargetInstances(targetNodeIds: string[]) {
  const targetInstances: InstanceNode[] = [];

  if (!Array.isArray(targetNodeIds) || targetNodeIds.length === 0) {
    return { success: false, message: "No instances provided", targetInstances: [] };
  }

  for (const targetNodeId of targetNodeIds) {
    const targetNode = await figma.getNodeByIdAsync(targetNodeId);
    if (targetNode && targetNode.type === "INSTANCE") {
      targetInstances.push(targetNode as InstanceNode);
    }
  }

  if (targetInstances.length === 0) {
    return { success: false, message: "No valid instances provided", targetInstances: [] };
  }

  return { success: true, message: "Valid target instances provided", targetInstances };
}

async function getSourceInstanceData(sourceInstanceId: string) {
  if (!sourceInstanceId) {
    return { success: false, message: "Missing source instance ID" };
  }

  const sourceInstance = await figma.getNodeByIdAsync(sourceInstanceId);
  if (!sourceInstance) {
    return { success: false, message: "Source instance not found" };
  }

  if (sourceInstance.type !== "INSTANCE") {
    return { success: false, message: "Source node is not a component instance" };
  }

  const mainComponent = await (sourceInstance as InstanceNode).getMainComponentAsync();
  if (!mainComponent) {
    return { success: false, message: "Failed to get main component from source instance" };
  }

  return {
    success: true,
    sourceInstance: sourceInstance as InstanceNode,
    mainComponent,
    overrides: (sourceInstance as InstanceNode).overrides || [],
  };
}

export async function setInstanceOverrides(params: {
  sourceInstanceId: string;
  targetNodeIds: string[];
}) {
  const { sourceInstanceId, targetNodeIds } = params;

  const targetResult = await getValidTargetInstances(targetNodeIds);
  if (!targetResult.success) return targetResult;

  const sourceResult = await getSourceInstanceData(sourceInstanceId);
  if (!sourceResult.success) return sourceResult;

  const { sourceInstance, mainComponent, overrides } = sourceResult;
  const { targetInstances } = targetResult;

  if (!sourceInstance || !mainComponent) {
    return { success: false, message: "Source instance or main component not available" };
  }

  const results: Array<{
    success: boolean;
    instanceId: string;
    instanceName: string;
    appliedCount?: number;
    message?: string;
  }> = [];
  let totalAppliedCount = 0;

  for (const targetInstance of targetInstances) {
    try {
      targetInstance.swapComponent(mainComponent);

      let appliedCount = 0;

      const overridesList = overrides ?? [];
      for (const override of overridesList) {
        if (!override.id || !override.overriddenFields || override.overriddenFields.length === 0) {
          continue;
        }

        const overrideNodeId = override.id.replace(sourceInstance.id, targetInstance.id);
        const overrideNode = await figma.getNodeByIdAsync(overrideNodeId);
        if (!overrideNode) continue;

        const sourceNode = await figma.getNodeByIdAsync(override.id);
        if (!sourceNode) continue;

        for (const field of override.overriddenFields) {
          try {
            if (field === "characters" && overrideNode.type === "TEXT" && sourceNode.type === "TEXT") {
              const textOverrideNode = overrideNode as TextNode;
              const textSourceNode = sourceNode as TextNode;
              const fontName = textOverrideNode.fontName;
              if (fontName !== figma.mixed) {
                await figma.loadFontAsync(fontName);
              }
              textOverrideNode.characters = textSourceNode.characters;
              appliedCount++;
            } else if (field in overrideNode && field in sourceNode) {
              // Use type-safe property copying for known fields
              copyNodeProperty(sourceNode, overrideNode, field);
              appliedCount++;
            }
          } catch (fieldError) {
            console.error(`Error applying field ${field}:`, fieldError);
          }
        }
      }

      if (appliedCount > 0) {
        totalAppliedCount += appliedCount;
        results.push({ success: true, instanceId: targetInstance.id, instanceName: targetInstance.name, appliedCount });
      } else {
        results.push({ success: false, instanceId: targetInstance.id, instanceName: targetInstance.name, message: "No overrides applied" });
      }
    } catch (instanceError) {
      results.push({ success: false, instanceId: targetInstance.id, instanceName: targetInstance.name, message: (instanceError as Error).message });
    }
  }

  if (totalAppliedCount > 0) {
    const message = `Applied ${totalAppliedCount} overrides to ${results.filter((r) => r.success).length} instances`;
    figma.notify(message);
    return { success: true, message, totalCount: totalAppliedCount, results };
  }

  return { success: false, message: "No overrides applied to any instance", results };
}
