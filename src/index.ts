// src/index.ts - Main entry point

import type {
  PluginState,
  UIMessage,
  CreateRectangleParams,
  CreateFrameParams,
  CreateTextParams,
  MoveNodeParams,
  ResizeNodeParams,
  DeleteNodeParams,
  CloneNodeParams,
  CreateEllipseParams,
  CreateLineParams,
  CreatePolygonParams,
  CreateVectorParams,
  CreateSvgParams,
  SetFillColorParams,
  SetStrokeColorParams,
  SetCornerRadiusParams,
  SetOpacityParams,
  SetEffectsParams,
  SetGradientFillParams,
  SetBlendModeParams,
  SetStrokeStyleParams,
  SetLayoutModeParams,
  SetPaddingParams,
  SetAxisAlignParams,
  SetLayoutSizingParams,
  SetItemSpacingParams,
  ScanTextNodesParams,
  SetTextContentParams,
  SetMultipleTextContentsParams,
  SetFontFamilyParams,
  SetFontSizeParams,
  SetFontWeightParams,
  SetTextAlignmentParams,
  SetLineHeightParams,
  SetLetterSpacingParams,
  SetImageFillParams,
  ExportNodeAsImageParams,
  CreateComponentInstanceParams,
  CreateComponentFromNodeParams,
  DetachInstanceParams,
  GetAnnotationsParams,
  SetAnnotationParams,
  SetMultipleAnnotationsParams,
  GetReactionsParams,
  SetDefaultConnectorParams,
  CreateConnectionsParams,
  GetLayoutConstraintsParams,
  GetResponsiveLayoutsParams,
  GetStyleInheritanceParams,
  ScanNodesByTypesParams,
  DeleteMultipleNodesParams,
  CreatePageParams,
  SetCurrentPageParams,
  GroupNodesParams,
  UngroupNodesParams,
  SetRotationParams,
  SetZIndexParams,
  RenameNodeParams,
  SetVisibilityParams,
  SetConstraintsParams,
  LockNodeParams,
} from "./types";

// Import command modules
import * as documentCommands from "./commands/document";
import * as creationCommands from "./commands/creation";
import * as stylingCommands from "./commands/styling";
import * as layoutCommands from "./commands/layout";
import * as textCommands from "./commands/text";
import * as imageCommands from "./commands/images";
import * as componentCommands from "./commands/components";
import * as annotationCommands from "./commands/annotations";
import * as instanceCommands from "./commands/instances";
import * as connectionCommands from "./commands/connections";
import * as extractionCommands from "./commands/extraction";
import * as scanningCommands from "./commands/scanning";
import * as nodeCommands from "./commands/nodes";

// ============================================================================
// Type Guards for Parameter Validation
// ============================================================================

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasString(obj: Record<string, unknown>, key: string): boolean {
  return typeof obj[key] === "string";
}

function hasNumber(obj: Record<string, unknown>, key: string): boolean {
  return typeof obj[key] === "number";
}

function hasArray(obj: Record<string, unknown>, key: string): boolean {
  return Array.isArray(obj[key]);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

// Creation params
function isMoveNodeParams(params: Record<string, unknown>): params is MoveNodeParams {
  return hasString(params, "nodeId") && hasNumber(params, "x") && hasNumber(params, "y");
}

function isResizeNodeParams(params: Record<string, unknown>): params is ResizeNodeParams {
  return hasString(params, "nodeId") && hasNumber(params, "width") && hasNumber(params, "height");
}

function isDeleteNodeParams(params: Record<string, unknown>): params is DeleteNodeParams {
  return hasString(params, "nodeId");
}

function isCloneNodeParams(params: Record<string, unknown>): params is CloneNodeParams {
  return hasString(params, "nodeId");
}

// Styling params
function isSetFillColorParams(params: Record<string, unknown>): params is SetFillColorParams {
  return hasString(params, "nodeId") && isRecord(params.color);
}

function isSetStrokeColorParams(params: Record<string, unknown>): params is SetStrokeColorParams {
  return hasString(params, "nodeId") && isRecord(params.color);
}

function isSetCornerRadiusParams(params: Record<string, unknown>): params is SetCornerRadiusParams {
  return hasString(params, "nodeId") && hasNumber(params, "radius");
}

// Layout params
function isSetLayoutModeParams(params: Record<string, unknown>): params is SetLayoutModeParams {
  return hasString(params, "nodeId");
}

function isSetPaddingParams(params: Record<string, unknown>): params is SetPaddingParams {
  return hasString(params, "nodeId");
}

function isSetAxisAlignParams(params: Record<string, unknown>): params is SetAxisAlignParams {
  return hasString(params, "nodeId");
}

function isSetLayoutSizingParams(params: Record<string, unknown>): params is SetLayoutSizingParams {
  return hasString(params, "nodeId");
}

function isSetItemSpacingParams(params: Record<string, unknown>): params is SetItemSpacingParams {
  return hasString(params, "nodeId");
}

// Text params
function isScanTextNodesParams(params: Record<string, unknown>): params is ScanTextNodesParams {
  return hasString(params, "nodeId");
}

function isSetTextContentParams(params: Record<string, unknown>): params is SetTextContentParams {
  return hasString(params, "nodeId") && hasString(params, "text");
}

function isSetMultipleTextContentsParams(params: Record<string, unknown>): params is SetMultipleTextContentsParams {
  return hasString(params, "nodeId") && hasArray(params, "text");
}

// Image params
function isSetImageFillParams(params: Record<string, unknown>): params is SetImageFillParams {
  return hasString(params, "nodeId");
}

function isExportNodeAsImageParams(params: Record<string, unknown>): params is ExportNodeAsImageParams {
  return hasString(params, "nodeId");
}

// Component params
function isCreateComponentInstanceParams(params: Record<string, unknown>): params is CreateComponentInstanceParams {
  return hasString(params, "componentKey") || hasString(params, "componentId");
}

// Annotation params
function isSetAnnotationParams(params: Record<string, unknown>): params is SetAnnotationParams {
  return hasString(params, "nodeId") && hasString(params, "labelMarkdown");
}

function isSetMultipleAnnotationsParams(params: Record<string, unknown>): params is SetMultipleAnnotationsParams {
  return hasString(params, "nodeId") && hasArray(params, "annotations");
}

// Connection params
function isGetReactionsParams(params: Record<string, unknown>): params is GetReactionsParams {
  return hasArray(params, "nodeIds") && isStringArray(params.nodeIds);
}

function isCreateConnectionsParams(params: Record<string, unknown>): params is CreateConnectionsParams {
  return hasArray(params, "connections");
}

// Scanning params
function isScanNodesByTypesParams(params: Record<string, unknown>): params is ScanNodesByTypesParams {
  // nodeId is optional - if not provided, searches entire current page
  return hasArray(params, "types");
}

function isDeleteMultipleNodesParams(params: Record<string, unknown>): params is DeleteMultipleNodesParams {
  return hasArray(params, "nodeIds") && isStringArray(params.nodeIds);
}

// Instance params
function isSetInstanceOverridesParams(params: Record<string, unknown>): params is { sourceInstanceId: string; targetNodeIds: string[] } {
  return hasString(params, "sourceInstanceId") && hasArray(params, "targetNodeIds") && isStringArray(params.targetNodeIds);
}

// New styling params
function isSetOpacityParams(params: Record<string, unknown>): params is SetOpacityParams {
  return hasString(params, "nodeId") && hasNumber(params, "opacity");
}

function isSetEffectsParams(params: Record<string, unknown>): params is SetEffectsParams {
  return hasString(params, "nodeId") && hasArray(params, "effects");
}

function isSetGradientFillParams(params: Record<string, unknown>): params is SetGradientFillParams {
  return hasString(params, "nodeId") && hasArray(params, "stops");
}

function isSetBlendModeParams(params: Record<string, unknown>): params is SetBlendModeParams {
  return hasString(params, "nodeId") && hasString(params, "blendMode");
}

function isSetStrokeStyleParams(params: Record<string, unknown>): params is SetStrokeStyleParams {
  return hasString(params, "nodeId");
}

// New typography params
function isSetFontFamilyParams(params: Record<string, unknown>): params is SetFontFamilyParams {
  return hasString(params, "nodeId") && hasString(params, "fontFamily");
}

function isSetFontSizeParams(params: Record<string, unknown>): params is SetFontSizeParams {
  return hasString(params, "nodeId") && hasNumber(params, "fontSize");
}

function isSetFontWeightParams(params: Record<string, unknown>): params is SetFontWeightParams {
  return hasString(params, "nodeId") && hasNumber(params, "fontWeight");
}

function isSetTextAlignmentParams(params: Record<string, unknown>): params is SetTextAlignmentParams {
  return hasString(params, "nodeId");
}

function isSetLineHeightParams(params: Record<string, unknown>): params is SetLineHeightParams {
  return hasString(params, "nodeId");
}

function isSetLetterSpacingParams(params: Record<string, unknown>): params is SetLetterSpacingParams {
  return hasString(params, "nodeId") && hasNumber(params, "letterSpacing");
}

// New creation params
function isCreateVectorParams(params: Record<string, unknown>): params is CreateVectorParams {
  return hasArray(params, "vectorPaths");
}

function isCreateSvgParams(params: Record<string, unknown>): params is CreateSvgParams {
  return hasString(params, "svg");
}

// Document params
function isSetCurrentPageParams(params: Record<string, unknown>): params is SetCurrentPageParams {
  return hasString(params, "pageId");
}

// Node operation params
function isGroupNodesParams(params: Record<string, unknown>): params is GroupNodesParams {
  return hasArray(params, "nodeIds") && isStringArray(params.nodeIds);
}

function isUngroupNodesParams(params: Record<string, unknown>): params is UngroupNodesParams {
  return hasString(params, "nodeId");
}

function isSetRotationParams(params: Record<string, unknown>): params is SetRotationParams {
  return hasString(params, "nodeId") && hasNumber(params, "rotation");
}

function isSetZIndexParams(params: Record<string, unknown>): params is SetZIndexParams {
  return hasString(params, "nodeId") && (hasString(params, "position") || hasNumber(params, "position"));
}

function isRenameNodeParams(params: Record<string, unknown>): params is RenameNodeParams {
  return hasString(params, "nodeId") && hasString(params, "name");
}

function isSetVisibilityParams(params: Record<string, unknown>): params is SetVisibilityParams {
  return hasString(params, "nodeId") && typeof params.visible === "boolean";
}

function isSetConstraintsParams(params: Record<string, unknown>): params is SetConstraintsParams {
  return hasString(params, "nodeId");
}

function isLockNodeParams(params: Record<string, unknown>): params is LockNodeParams {
  return hasString(params, "nodeId") && typeof params.locked === "boolean";
}

// Component params
function isCreateComponentFromNodeParams(params: Record<string, unknown>): params is CreateComponentFromNodeParams {
  return hasString(params, "nodeId");
}

function isDetachInstanceParams(params: Record<string, unknown>): params is DetachInstanceParams {
  return hasString(params, "nodeId");
}

// ============================================================================
// Plugin State and Setup
// ============================================================================

const state: PluginState = {
  serverPort: 3055,
};

figma.showUI(__html__, { width: 350, height: 450 });

figma.ui.onmessage = async (msg: UIMessage) => {
  switch (msg.type) {
    case "update-settings":
      updateSettings(msg);
      break;
    case "notify":
      if (msg.message) {
        figma.notify(msg.message);
      }
      break;
    case "close-plugin":
      figma.closePlugin();
      break;
    case "execute-command":
      try {
        const result = await handleCommand(msg.command!, msg.params);
        figma.ui.postMessage({
          type: "command-result",
          id: msg.id,
          result,
        });
      } catch (error) {
        const err = error as Error;
        figma.ui.postMessage({
          type: "command-error",
          id: msg.id,
          error: err.message || "Error executing command",
        });
      }
      break;
  }
};

figma.on("run", () => {
  figma.ui.postMessage({ type: "auto-connect" });
});

function updateSettings(settings: UIMessage): void {
  if (settings.serverPort) {
    state.serverPort = settings.serverPort;
  }

  figma.clientStorage.setAsync("settings", {
    serverPort: state.serverPort,
  });
}

// ============================================================================
// Command Router with Strict Type Validation
// ============================================================================

async function handleCommand(
  command: string,
  params?: Record<string, unknown>
): Promise<unknown> {
  switch (command) {
    // Document commands (no params or simple params)
    case "get_document_info":
      return await documentCommands.getDocumentInfo();
    case "get_all_pages":
      return await documentCommands.getAllPagesInfo();
    case "get_selection":
      return await documentCommands.getSelection();
    case "get_node_info":
      if (!params || !hasString(params, "nodeId")) {
        throw new Error("Missing nodeId parameter");
      }
      return await documentCommands.getNodeInfo(params.nodeId as string);
    case "get_nodes_info":
      if (!params || !hasArray(params, "nodeIds") || !isStringArray(params.nodeIds)) {
        throw new Error("Missing or invalid nodeIds parameter");
      }
      return await documentCommands.getNodesInfo(params.nodeIds);
    case "read_my_design":
      return await documentCommands.readMyDesign();
    case "create_page":
      return await documentCommands.createPage(params as CreatePageParams | undefined);
    case "set_current_page":
      if (!params || !isSetCurrentPageParams(params)) {
        throw new Error("Missing required parameter: pageId");
      }
      return await documentCommands.setCurrentPage(params);

    // Creation commands
    case "create_rectangle":
      return await creationCommands.createRectangle(params as CreateRectangleParams | undefined);
    case "create_frame":
      return await creationCommands.createFrame(params as CreateFrameParams | undefined);
    case "create_text":
      return await creationCommands.createText(params as CreateTextParams | undefined);
    case "move_node":
      if (!params || !isMoveNodeParams(params)) {
        throw new Error("Missing required parameters: nodeId, x, y");
      }
      return await creationCommands.moveNode(params);
    case "resize_node":
      if (!params || !isResizeNodeParams(params)) {
        throw new Error("Missing required parameters: nodeId, width, height");
      }
      return await creationCommands.resizeNode(params);
    case "delete_node":
      if (!params || !isDeleteNodeParams(params)) {
        throw new Error("Missing required parameter: nodeId");
      }
      return await creationCommands.deleteNode(params);
    case "clone_node":
      if (!params || !isCloneNodeParams(params)) {
        throw new Error("Missing required parameter: nodeId");
      }
      return await creationCommands.cloneNode(params);
    case "create_ellipse":
      return await creationCommands.createEllipse(params as CreateEllipseParams | undefined);
    case "create_line":
      return await creationCommands.createLine(params as CreateLineParams | undefined);
    case "create_polygon":
      return await creationCommands.createPolygon(params as CreatePolygonParams | undefined);
    case "create_vector":
      if (!params || !isCreateVectorParams(params)) {
        throw new Error("Missing required parameter: vectorPaths");
      }
      return await creationCommands.createVector(params);
    case "create_svg":
      if (!params || !isCreateSvgParams(params)) {
        throw new Error("Missing required parameter: svg");
      }
      return await creationCommands.createSvg(params);

    // Styling commands
    case "set_fill_color":
      if (!params || !isSetFillColorParams(params)) {
        throw new Error("Missing required parameters: nodeId, color");
      }
      return await stylingCommands.setFillColor(params);
    case "set_stroke_color":
      if (!params || !isSetStrokeColorParams(params)) {
        throw new Error("Missing required parameters: nodeId, color");
      }
      return await stylingCommands.setStrokeColor(params);
    case "set_corner_radius":
      if (!params || !isSetCornerRadiusParams(params)) {
        throw new Error("Missing required parameters: nodeId, radius");
      }
      return await stylingCommands.setCornerRadius(params);
    case "set_opacity":
      if (!params || !isSetOpacityParams(params)) {
        throw new Error("Missing required parameters: nodeId, opacity");
      }
      return await stylingCommands.setOpacity(params);
    case "set_effects":
      if (!params || !isSetEffectsParams(params)) {
        throw new Error("Missing required parameters: nodeId, effects");
      }
      return await stylingCommands.setEffects(params);
    case "set_gradient_fill":
      if (!params || !isSetGradientFillParams(params)) {
        throw new Error("Missing required parameters: nodeId, stops");
      }
      return await stylingCommands.setGradientFill(params);
    case "set_blend_mode":
      if (!params || !isSetBlendModeParams(params)) {
        throw new Error("Missing required parameters: nodeId, blendMode");
      }
      return await stylingCommands.setBlendMode(params);
    case "set_stroke_style":
      if (!params || !isSetStrokeStyleParams(params)) {
        throw new Error("Missing required parameter: nodeId");
      }
      return await stylingCommands.setStrokeStyle(params);

    // Layout commands
    case "set_layout_mode":
      if (!params || !isSetLayoutModeParams(params)) {
        throw new Error("Missing required parameter: nodeId");
      }
      return await layoutCommands.setLayoutMode(params);
    case "set_padding":
      if (!params || !isSetPaddingParams(params)) {
        throw new Error("Missing required parameter: nodeId");
      }
      return await layoutCommands.setPadding(params);
    case "set_axis_align":
      if (!params || !isSetAxisAlignParams(params)) {
        throw new Error("Missing required parameter: nodeId");
      }
      return await layoutCommands.setAxisAlign(params);
    case "set_layout_sizing":
      if (!params || !isSetLayoutSizingParams(params)) {
        throw new Error("Missing required parameter: nodeId");
      }
      return await layoutCommands.setLayoutSizing(params);
    case "set_item_spacing":
      if (!params || !isSetItemSpacingParams(params)) {
        throw new Error("Missing required parameter: nodeId");
      }
      return await layoutCommands.setItemSpacing(params);

    // Text commands
    case "scan_text_nodes":
      if (!params || !isScanTextNodesParams(params)) {
        throw new Error("Missing required parameter: nodeId");
      }
      return await textCommands.scanTextNodes(params);
    case "set_text_content":
      if (!params || !isSetTextContentParams(params)) {
        throw new Error("Missing required parameters: nodeId, text");
      }
      return await textCommands.setTextContent(params);
    case "set_multiple_text_contents":
      if (!params || !isSetMultipleTextContentsParams(params)) {
        throw new Error("Missing required parameters: nodeId, text");
      }
      return await textCommands.setMultipleTextContents(params);
    case "set_font_family":
      if (!params || !isSetFontFamilyParams(params)) {
        throw new Error("Missing required parameters: nodeId, fontFamily");
      }
      return await textCommands.setFontFamily(params);
    case "set_font_size":
      if (!params || !isSetFontSizeParams(params)) {
        throw new Error("Missing required parameters: nodeId, fontSize");
      }
      return await textCommands.setFontSize(params);
    case "set_font_weight":
      if (!params || !isSetFontWeightParams(params)) {
        throw new Error("Missing required parameters: nodeId, fontWeight");
      }
      return await textCommands.setFontWeight(params);
    case "set_text_alignment":
      if (!params || !isSetTextAlignmentParams(params)) {
        throw new Error("Missing required parameter: nodeId");
      }
      return await textCommands.setTextAlignment(params);
    case "set_line_height":
      if (!params || !isSetLineHeightParams(params)) {
        throw new Error("Missing required parameter: nodeId");
      }
      return await textCommands.setLineHeight(params);
    case "set_letter_spacing":
      if (!params || !isSetLetterSpacingParams(params)) {
        throw new Error("Missing required parameters: nodeId, letterSpacing");
      }
      return await textCommands.setLetterSpacing(params);

    // Image commands
    case "set_image_fill":
      if (!params || !isSetImageFillParams(params)) {
        throw new Error("Missing required parameter: nodeId");
      }
      return await imageCommands.setImageFill(params);
    case "create_image_rectangle":
      return await imageCommands.createImageRectangle(params ?? {});
    case "export_node_as_image":
      if (!params || !isExportNodeAsImageParams(params)) {
        throw new Error("Missing required parameter: nodeId");
      }
      return await imageCommands.exportNodeAsImage(params);

    // Component commands
    case "get_styles":
      return await componentCommands.getStyles();
    case "get_local_components":
      return await componentCommands.getLocalComponents();
    case "create_component_instance":
      if (!params || !isCreateComponentInstanceParams(params)) {
        throw new Error("Missing required parameter: componentKey or componentId");
      }
      return await componentCommands.createComponentInstance(params);
    case "create_component":
      if (!params || !isCreateComponentFromNodeParams(params)) {
        throw new Error("Missing required parameter: nodeId");
      }
      return await componentCommands.createComponent(params);
    case "detach_instance":
      if (!params || !isDetachInstanceParams(params)) {
        throw new Error("Missing required parameter: nodeId");
      }
      return await componentCommands.detachInstance(params);

    // Annotation commands
    case "get_annotations":
      return await annotationCommands.getAnnotations((params as GetAnnotationsParams) || {});
    case "set_annotation":
      if (!params || !isSetAnnotationParams(params)) {
        throw new Error("Missing required parameters: nodeId, labelMarkdown");
      }
      return await annotationCommands.setAnnotation(params);
    case "set_multiple_annotations":
      if (!params || !isSetMultipleAnnotationsParams(params)) {
        throw new Error("Missing required parameters: nodeId, annotations");
      }
      return await annotationCommands.setMultipleAnnotations(params);

    // Instance commands
    case "get_instance_overrides":
      if (params && hasString(params, "instanceNodeId")) {
        const instanceNode = await figma.getNodeByIdAsync(params.instanceNodeId as string);
        if (!instanceNode) {
          throw new Error(`Instance node not found with ID: ${params.instanceNodeId}`);
        }
        return await instanceCommands.getInstanceOverrides(instanceNode as InstanceNode);
      }
      return await instanceCommands.getInstanceOverrides();
    case "set_instance_overrides":
      if (!params || !isSetInstanceOverridesParams(params)) {
        throw new Error("Missing required parameters: sourceInstanceId, targetNodeIds");
      }
      return await instanceCommands.setInstanceOverrides(params);

    // Connection commands
    case "get_reactions":
      if (!params || !isGetReactionsParams(params)) {
        throw new Error("Missing or invalid nodeIds parameter");
      }
      return await connectionCommands.getReactions(params);
    case "set_default_connector":
      return await connectionCommands.setDefaultConnector((params as SetDefaultConnectorParams) || {});
    case "create_connections":
      if (!params || !isCreateConnectionsParams(params)) {
        throw new Error("Missing required parameter: connections");
      }
      return await connectionCommands.createConnections(params);

    // Extraction commands
    case "get_complete_file_data":
      return await extractionCommands.getCompleteFileData();
    case "get_design_tokens":
      return await extractionCommands.getDesignTokens();
    case "get_layout_constraints":
      return await extractionCommands.getLayoutConstraints((params as GetLayoutConstraintsParams) || {});
    case "get_component_hierarchy":
      return await extractionCommands.getComponentHierarchy();
    case "get_responsive_layouts":
      return await extractionCommands.getResponsiveLayouts((params as GetResponsiveLayoutsParams) || {});
    case "get_style_inheritance":
      return await extractionCommands.getStyleInheritance((params as GetStyleInheritanceParams) || {});

    // Scanning commands
    case "scan_nodes_by_types":
      if (!params || !isScanNodesByTypesParams(params)) {
        throw new Error("Missing required parameter: types");
      }
      return await scanningCommands.scanNodesByTypes(params);
    case "delete_multiple_nodes":
      if (!params || !isDeleteMultipleNodesParams(params)) {
        throw new Error("Missing required parameter: nodeIds");
      }
      return await scanningCommands.deleteMultipleNodes(params);

    // Node operation commands
    case "group_nodes":
      if (!params || !isGroupNodesParams(params)) {
        throw new Error("Missing required parameter: nodeIds");
      }
      return await nodeCommands.groupNodes(params);
    case "ungroup_nodes":
      if (!params || !isUngroupNodesParams(params)) {
        throw new Error("Missing required parameter: nodeId");
      }
      return await nodeCommands.ungroupNodes(params);
    case "set_rotation":
      if (!params || !isSetRotationParams(params)) {
        throw new Error("Missing required parameters: nodeId, rotation");
      }
      return await nodeCommands.setRotation(params);
    case "set_z_index":
      if (!params || !isSetZIndexParams(params)) {
        throw new Error("Missing required parameters: nodeId, position");
      }
      return await nodeCommands.setZIndex(params);
    case "rename_node":
      if (!params || !isRenameNodeParams(params)) {
        throw new Error("Missing required parameters: nodeId, name");
      }
      return await nodeCommands.renameNode(params);
    case "set_visibility":
      if (!params || !isSetVisibilityParams(params)) {
        throw new Error("Missing required parameters: nodeId, visible");
      }
      return await nodeCommands.setVisibility(params);
    case "set_constraints":
      if (!params || !isSetConstraintsParams(params)) {
        throw new Error("Missing required parameter: nodeId");
      }
      return await nodeCommands.setConstraints(params);
    case "lock_node":
      if (!params || !isLockNodeParams(params)) {
        throw new Error("Missing required parameters: nodeId, locked");
      }
      return await nodeCommands.lockNode(params);

    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

// ============================================================================
// Plugin Initialization
// ============================================================================

(async function initializePlugin(): Promise<void> {
  try {
    const savedSettings = (await figma.clientStorage.getAsync("settings")) as Partial<PluginState> | undefined;
    if (savedSettings) {
      if (savedSettings.serverPort) {
        state.serverPort = savedSettings.serverPort;
      }
    }

    const defaultConnectorId = await figma.clientStorage.getAsync("defaultConnectorId");
    if (defaultConnectorId) {
      console.log("Loaded default connector ID:", defaultConnectorId);
    }

    figma.ui.postMessage({
      type: "init-settings",
      settings: {
        serverPort: state.serverPort,
        defaultConnectorId: defaultConnectorId || null,
      },
    });
  } catch (error) {
    console.error("Error loading settings:", error);
  }
})();
