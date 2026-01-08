// src/helpers/colors.ts

import type { RGBA } from "../types";

/**
 * Convert RGBA (0-1 range) to hex string
 */
export function rgbaToHex(color: RGBA): string {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  const a = color.a !== undefined ? Math.round(color.a * 255) : 255;

  if (a === 255) {
    return (
      "#" +
      [r, g, b]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")
    );
  }

  return (
    "#" +
    [r, g, b, a]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
  );
}

/**
 * Create a solid paint style from RGBA object
 */
export function createSolidPaint(color: RGBA): SolidPaint {
  return {
    type: "SOLID",
    color: {
      r: parseFloat(String(color.r)) || 0,
      g: parseFloat(String(color.g)) || 0,
      b: parseFloat(String(color.b)) || 0,
    },
    opacity: parseFloat(String(color.a)) || 1,
  };
}
