// src/commands/images.ts

import type { SetImageFillParams, CreateImageRectangleParams, ExportNodeAsImageParams } from "../types";
import { customBase64Encode } from "../helpers/nodes";

export async function setImageFill(params: SetImageFillParams) {
  const { nodeId, imageUrl, imageBase64, scaleMode = "FILL" } = params;

  if (!nodeId) throw new Error("Missing nodeId parameter");
  if (!imageUrl && !imageBase64) throw new Error("Either imageUrl or imageBase64 must be provided");

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) throw new Error(`Node not found with ID: ${nodeId}`);
  if (!("fills" in node)) throw new Error(`Node does not support fills: ${nodeId}`);

  let image: Image;

  if (imageUrl) {
    image = await figma.createImageAsync(imageUrl);
  } else if (imageBase64) {
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const imageBytes = figma.base64Decode(base64Data);
    image = figma.createImage(imageBytes);
  } else {
    throw new Error("No image data provided");
  }

  const imageFill: ImagePaint = {
    type: "IMAGE",
    scaleMode: scaleMode as "FILL" | "FIT" | "CROP" | "TILE",
    imageHash: image.hash,
  };

  (node as GeometryMixin).fills = [imageFill];

  return {
    id: node.id,
    name: node.name,
    imageHash: image.hash,
    scaleMode,
  };
}

export async function createImageRectangle(params: CreateImageRectangleParams) {
  const {
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    name = "Image",
    parentId,
    imageUrl,
    imageBase64,
    scaleMode = "FILL",
    cornerRadius = 0,
  } = params;

  if (!imageUrl && !imageBase64) throw new Error("Either imageUrl or imageBase64 must be provided");

  const rect = figma.createRectangle();
  rect.x = x;
  rect.y = y;
  rect.resize(width, height);
  rect.name = name;

  if (cornerRadius > 0) rect.cornerRadius = cornerRadius;

  let image: Image;

  if (imageUrl) {
    image = await figma.createImageAsync(imageUrl);
  } else if (imageBase64) {
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const imageBytes = figma.base64Decode(base64Data);
    image = figma.createImage(imageBytes);
  } else {
    throw new Error("No image data provided");
  }

  rect.fills = [
    {
      type: "IMAGE",
      scaleMode: scaleMode as "FILL" | "FIT" | "CROP" | "TILE",
      imageHash: image.hash,
    },
  ];

  if (parentId) {
    const parentNode = await figma.getNodeByIdAsync(parentId);
    if (!parentNode) throw new Error(`Parent node not found with ID: ${parentId}`);
    if (!("appendChild" in parentNode)) throw new Error(`Parent node does not support children: ${parentId}`);
    (parentNode as FrameNode).appendChild(rect);
  } else {
    figma.currentPage.appendChild(rect);
  }

  return {
    id: rect.id,
    name: rect.name,
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    imageHash: image.hash,
    parentId: rect.parent?.id,
  };
}

export async function exportNodeAsImage(params: ExportNodeAsImageParams) {
  const { nodeId, scale = 1 } = params;
  const format = "PNG";

  if (!nodeId) throw new Error("Missing nodeId parameter");

  const node = await figma.getNodeByIdAsync(nodeId);
  if (!node) throw new Error(`Node not found with ID: ${nodeId}`);
  if (!("exportAsync" in node)) throw new Error(`Node does not support exporting: ${nodeId}`);

  const settings: ExportSettings = {
    format: format,
    constraint: { type: "SCALE", value: scale },
  };

  const bytes = await (node as SceneNode).exportAsync(settings);
  const base64 = customBase64Encode(bytes);

  return {
    nodeId,
    format,
    scale,
    mimeType: "image/png",
    imageData: base64,
  };
}
