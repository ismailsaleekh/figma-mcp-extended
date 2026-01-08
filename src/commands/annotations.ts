// src/commands/annotations.ts

import type { GetAnnotationsParams, SetAnnotationParams, SetMultipleAnnotationsParams } from "../types";

type AnnotatableNode = SceneNode & { annotations: Annotation[] };

function isAnnotatable(node: BaseNode): node is AnnotatableNode {
  return "annotations" in node;
}

export async function getAnnotations(params: GetAnnotationsParams) {
  const { nodeId, includeCategories = true } = params;

  let categoriesMap: Record<string, unknown> = {};
  if (includeCategories) {
    const categories = await figma.annotations.getAnnotationCategoriesAsync();
    categoriesMap = categories.reduce((map, category) => {
      map[category.id] = {
        id: category.id,
        label: category.label,
        color: category.color,
        isPreset: category.isPreset,
      };
      return map;
    }, {} as Record<string, unknown>);
  }

  if (nodeId) {
    const node = await figma.getNodeByIdAsync(nodeId);
    if (!node) throw new Error(`Node not found: ${nodeId}`);
    if (!isAnnotatable(node)) throw new Error(`Node type ${node.type} does not support annotations`);

    const mergedAnnotations: Array<{ nodeId: string; annotation: unknown }> = [];

    const collect = async (n: SceneNode) => {
      if (isAnnotatable(n) && n.annotations && n.annotations.length > 0) {
        for (const a of n.annotations) {
          mergedAnnotations.push({ nodeId: n.id, annotation: a });
        }
      }
      if ("children" in n) {
        for (const child of n.children) {
          await collect(child);
        }
      }
    };
    await collect(node as SceneNode);

    return {
      nodeId: node.id,
      name: node.name,
      annotations: mergedAnnotations,
      categories: includeCategories ? Object.values(categoriesMap) : undefined,
    };
  }

  // Get all annotations in current page
  const annotations: Array<{ nodeId: string; name: string; annotations: readonly Annotation[] }> = [];

  const processNode = async (n: SceneNode) => {
    if (isAnnotatable(n) && n.annotations && n.annotations.length > 0) {
      annotations.push({ nodeId: n.id, name: n.name, annotations: n.annotations });
    }
    if ("children" in n) {
      for (const child of n.children) {
        await processNode(child);
      }
    }
  };

  for (const child of figma.currentPage.children) {
    await processNode(child);
  }

  return {
    annotatedNodes: annotations,
    categories: includeCategories ? Object.values(categoriesMap) : undefined,
  };
}

export async function setAnnotation(params: SetAnnotationParams) {
  const { nodeId, labelMarkdown, categoryId, properties } = params;

  if (!nodeId) return { success: false, error: "Missing nodeId" };
  if (!labelMarkdown) return { success: false, error: "Missing labelMarkdown" };

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) return { success: false, error: `Node not found: ${nodeId}` };
  if (!isAnnotatable(node)) return { success: false, error: `Node type ${node.type} does not support annotations` };

  // Build annotation properties if provided
  const annotationProperties: AnnotationProperty[] | undefined = properties && properties.length > 0
    ? properties.map((p): AnnotationProperty => {
        // AnnotationProperty requires 'type' to be AnnotationPropertyType
        // Using the spread to dynamically set values
        return {
          type: "library-link" as AnnotationPropertyType, // Using a valid property type
          data: { name: p.name, value: p.value },
        } as AnnotationProperty;
      })
    : undefined;

  // Build annotation object - using object spread to avoid readonly assignment
  const annotationData: { label: string; categoryId?: string; properties?: AnnotationProperty[] } = {
    label: labelMarkdown,
  };

  if (categoryId) {
    annotationData.categoryId = categoryId;
  }

  if (annotationProperties) {
    annotationData.properties = annotationProperties;
  }

  const newAnnotation = annotationData as Annotation;

  node.annotations = [newAnnotation];

  return {
    success: true,
    nodeId: node.id,
    name: node.name,
    annotations: node.annotations,
  };
}

export async function setMultipleAnnotations(params: SetMultipleAnnotationsParams) {
  const { annotations } = params;

  if (!annotations || annotations.length === 0) {
    return { success: false, error: "No annotations provided" };
  }

  const results: Array<{ success: boolean; nodeId: string; error?: string }> = [];
  let successCount = 0;
  let failureCount = 0;

  for (const annotation of annotations) {
    const result = await setAnnotation({
      nodeId: annotation.nodeId,
      labelMarkdown: annotation.labelMarkdown,
      categoryId: annotation.categoryId,
      properties: annotation.properties,
    });

    if (result.success) {
      successCount++;
      results.push({ success: true, nodeId: annotation.nodeId });
    } else {
      failureCount++;
      results.push({ success: false, nodeId: annotation.nodeId, error: result.error });
    }
  }

  return {
    success: successCount > 0,
    annotationsApplied: successCount,
    annotationsFailed: failureCount,
    totalAnnotations: annotations.length,
    results,
  };
}
