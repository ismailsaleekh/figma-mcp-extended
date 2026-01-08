// src/helpers/progress.ts

import type { ProgressPayload, ProgressUpdate } from "../types";

/**
 * Generate a unique command ID for tracking
 */
export function generateCommandId(): string {
  return (
    "cmd_" +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

/**
 * Send progress update to UI
 */
export function sendProgressUpdate(
  commandId: string,
  commandType: string,
  status: "started" | "in_progress" | "completed" | "error",
  progress: number,
  totalItems: number,
  processedItems: number,
  message: string,
  payload: ProgressPayload | null = null
): ProgressUpdate {
  const update: ProgressUpdate = {
    type: "command_progress",
    commandId,
    commandType,
    status,
    progress,
    totalItems,
    processedItems,
    message,
    timestamp: Date.now(),
  };

  if (payload) {
    if (
      payload.currentChunk !== undefined &&
      payload.totalChunks !== undefined
    ) {
      update.currentChunk = payload.currentChunk;
      update.totalChunks = payload.totalChunks;
      update.chunkSize = payload.chunkSize;
    }
    update.payload = payload;
  }

  figma.ui.postMessage(update);
  console.log(`Progress update: ${status} - ${progress}% - ${message}`);

  return update;
}

/**
 * Promise-based delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
