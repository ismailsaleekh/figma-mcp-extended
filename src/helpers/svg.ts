// src/helpers/svg.ts

import { parseSVG, makeAbsolute } from "svg-path-parser";

/**
 * SVG path command from parser
 */
interface PathCommand {
  code: string;
  command: string;
  x?: number;
  y?: number;
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  // Arc parameters
  rx?: number;
  ry?: number;
  xAxisRotation?: number;
  largeArc?: boolean;
  sweep?: boolean;
}

/**
 * Figma VectorVertex
 */
interface Vertex {
  x: number;
  y: number;
  strokeCap?: StrokeCap;
  strokeJoin?: StrokeJoin;
  cornerRadius?: number;
  handleMirroring?: HandleMirroring;
}

/**
 * Figma VectorSegment
 */
interface Segment {
  start: number;
  end: number;
  tangentStart?: { x: number; y: number };
  tangentEnd?: { x: number; y: number };
}

/**
 * Figma VectorRegion
 */
interface Region {
  windingRule: "NONZERO" | "EVENODD";
  loops: number[][];
}

/**
 * Result of SVG path conversion
 */
export interface VectorNetworkData {
  vertices: Vertex[];
  segments: Segment[];
  regions: Region[];
}

/**
 * Convert SVG path string to Figma VectorNetwork format
 */
export function svgPathToVectorNetwork(
  pathData: string,
  windingRule: "NONZERO" | "EVENODD" = "EVENODD"
): VectorNetworkData {
  // Parse SVG path and convert to absolute coordinates
  const commands = makeAbsolute(parseSVG(pathData)) as PathCommand[];

  const vertices: Vertex[] = [];
  const segments: Segment[] = [];
  const loops: number[][] = [];

  let currentLoop: number[] = [];
  let currentX = 0;
  let currentY = 0;
  let startX = 0;
  let startY = 0;
  let startVertexIndex = 0;
  let lastControlX = 0;
  let lastControlY = 0;
  let lastCommand = "";

  // Helper: add vertex if not duplicate
  function addVertex(x: number, y: number): number {
    // Check if vertex already exists at this position
    const existing = vertices.findIndex(
      (v) => Math.abs(v.x - x) < 0.001 && Math.abs(v.y - y) < 0.001
    );
    if (existing >= 0) return existing;

    vertices.push({ x, y });
    return vertices.length - 1;
  }

  // Helper: add segment
  function addSegment(
    startIdx: number,
    endIdx: number,
    tangentStart?: { x: number; y: number },
    tangentEnd?: { x: number; y: number }
  ): void {
    const segmentIndex = segments.length;
    segments.push({
      start: startIdx,
      end: endIdx,
      tangentStart,
      tangentEnd,
    });
    currentLoop.push(segmentIndex);
  }

  for (const cmd of commands) {
    switch (cmd.code) {
      case "M": {
        // MoveTo - start new subpath
        if (currentLoop.length > 0) {
          loops.push([...currentLoop]);
          currentLoop = [];
        }
        currentX = cmd.x!;
        currentY = cmd.y!;
        startX = currentX;
        startY = currentY;
        startVertexIndex = addVertex(currentX, currentY);
        lastCommand = "M";
        break;
      }

      case "L": {
        // LineTo - straight line
        const fromIdx = addVertex(currentX, currentY);
        currentX = cmd.x!;
        currentY = cmd.y!;
        const toIdx = addVertex(currentX, currentY);
        addSegment(fromIdx, toIdx);
        lastCommand = "L";
        break;
      }

      case "H": {
        // Horizontal line
        const fromIdx = addVertex(currentX, currentY);
        currentX = cmd.x!;
        const toIdx = addVertex(currentX, currentY);
        addSegment(fromIdx, toIdx);
        lastCommand = "H";
        break;
      }

      case "V": {
        // Vertical line
        const fromIdx = addVertex(currentX, currentY);
        currentY = cmd.y!;
        const toIdx = addVertex(currentX, currentY);
        addSegment(fromIdx, toIdx);
        lastCommand = "V";
        break;
      }

      case "C": {
        // Cubic Bezier curve
        const fromIdx = addVertex(currentX, currentY);
        const toX = cmd.x!;
        const toY = cmd.y!;
        const toIdx = addVertex(toX, toY);

        // Control points become tangents (relative to vertices)
        const tangentStart = {
          x: cmd.x1! - currentX,
          y: cmd.y1! - currentY,
        };
        const tangentEnd = {
          x: cmd.x2! - toX,
          y: cmd.y2! - toY,
        };

        addSegment(fromIdx, toIdx, tangentStart, tangentEnd);

        // Store last control point for smooth curves
        lastControlX = cmd.x2!;
        lastControlY = cmd.y2!;
        currentX = toX;
        currentY = toY;
        lastCommand = "C";
        break;
      }

      case "S": {
        // Smooth cubic Bezier (reflects previous control point)
        const fromIdx = addVertex(currentX, currentY);
        const toX = cmd.x!;
        const toY = cmd.y!;
        const toIdx = addVertex(toX, toY);

        // Reflect previous control point for smooth connection
        let cp1x = currentX;
        let cp1y = currentY;
        if (lastCommand === "C" || lastCommand === "S") {
          cp1x = 2 * currentX - lastControlX;
          cp1y = 2 * currentY - lastControlY;
        }

        const tangentStart = {
          x: cp1x - currentX,
          y: cp1y - currentY,
        };
        const tangentEnd = {
          x: cmd.x2! - toX,
          y: cmd.y2! - toY,
        };

        addSegment(fromIdx, toIdx, tangentStart, tangentEnd);

        lastControlX = cmd.x2!;
        lastControlY = cmd.y2!;
        currentX = toX;
        currentY = toY;
        lastCommand = "S";
        break;
      }

      case "Q": {
        // Quadratic Bezier - convert to cubic approximation
        const fromIdx = addVertex(currentX, currentY);
        const toX = cmd.x!;
        const toY = cmd.y!;
        const toIdx = addVertex(toX, toY);

        // Convert quadratic control point to cubic tangents
        const cp1x = currentX + (2 / 3) * (cmd.x1! - currentX);
        const cp1y = currentY + (2 / 3) * (cmd.y1! - currentY);
        const cp2x = toX + (2 / 3) * (cmd.x1! - toX);
        const cp2y = toY + (2 / 3) * (cmd.y1! - toY);

        const tangentStart = { x: cp1x - currentX, y: cp1y - currentY };
        const tangentEnd = { x: cp2x - toX, y: cp2y - toY };

        addSegment(fromIdx, toIdx, tangentStart, tangentEnd);

        lastControlX = cmd.x1!;
        lastControlY = cmd.y1!;
        currentX = toX;
        currentY = toY;
        lastCommand = "Q";
        break;
      }

      case "T": {
        // Smooth quadratic - reflects previous control point
        const fromIdx = addVertex(currentX, currentY);
        const toX = cmd.x!;
        const toY = cmd.y!;
        const toIdx = addVertex(toX, toY);

        // Reflect previous control point
        let cpx = currentX;
        let cpy = currentY;
        if (lastCommand === "Q" || lastCommand === "T") {
          cpx = 2 * currentX - lastControlX;
          cpy = 2 * currentY - lastControlY;
        }

        // Convert to cubic
        const cp1x = currentX + (2 / 3) * (cpx - currentX);
        const cp1y = currentY + (2 / 3) * (cpy - currentY);
        const cp2x = toX + (2 / 3) * (cpx - toX);
        const cp2y = toY + (2 / 3) * (cpy - toY);

        const tangentStart = { x: cp1x - currentX, y: cp1y - currentY };
        const tangentEnd = { x: cp2x - toX, y: cp2y - toY };

        addSegment(fromIdx, toIdx, tangentStart, tangentEnd);

        lastControlX = cpx;
        lastControlY = cpy;
        currentX = toX;
        currentY = toY;
        lastCommand = "T";
        break;
      }

      case "A": {
        // Arc - approximate with cubic bezier segments
        const fromIdx = addVertex(currentX, currentY);
        const toX = cmd.x!;
        const toY = cmd.y!;
        const toIdx = addVertex(toX, toY);

        // Calculate control points for arc approximation
        const rx = cmd.rx || 0;
        const ry = cmd.ry || 0;

        if (rx > 0 && ry > 0) {
          // Create bezier approximation of arc
          const dx = toX - currentX;
          const dy = toY - currentY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Perpendicular offset for control points
          const perpX = -dy / dist;
          const perpY = dx / dist;

          // Approximate arc bulge based on radii
          const bulge = Math.min(rx, ry) * 0.5;
          const sign = cmd.sweep ? 1 : -1;

          const cp1x = currentX + dx * 0.25 + perpX * bulge * sign;
          const cp1y = currentY + dy * 0.25 + perpY * bulge * sign;
          const cp2x = currentX + dx * 0.75 + perpX * bulge * sign;
          const cp2y = currentY + dy * 0.75 + perpY * bulge * sign;

          const tangentStart = { x: cp1x - currentX, y: cp1y - currentY };
          const tangentEnd = { x: cp2x - toX, y: cp2y - toY };

          addSegment(fromIdx, toIdx, tangentStart, tangentEnd);
        } else {
          // Fallback to straight line
          addSegment(fromIdx, toIdx);
        }

        currentX = toX;
        currentY = toY;
        lastCommand = "A";
        break;
      }

      case "Z":
      case "z": {
        // ClosePath - connect back to start
        if (Math.abs(currentX - startX) > 0.001 || Math.abs(currentY - startY) > 0.001) {
          const fromIdx = addVertex(currentX, currentY);
          addSegment(fromIdx, startVertexIndex);
        }
        if (currentLoop.length > 0) {
          loops.push([...currentLoop]);
          currentLoop = [];
        }
        currentX = startX;
        currentY = startY;
        lastCommand = "Z";
        break;
      }
    }
  }

  // Close any remaining loop
  if (currentLoop.length > 0) {
    loops.push([...currentLoop]);
  }

  return {
    vertices,
    segments,
    regions: loops.length > 0 ? [{ windingRule, loops }] : [],
  };
}

/**
 * Parse multiple paths from SVG content
 */
export function parseSvgPaths(svgContent: string): string[] {
  const paths: string[] = [];
  // Match path d attribute, handling both single and double quotes
  const pathRegex = /<path[^>]*\sd=["']([^"']+)["'][^>]*\/?>/gi;
  let match;
  while ((match = pathRegex.exec(svgContent)) !== null) {
    paths.push(match[1]);
  }
  return paths;
}

/**
 * Extract viewBox dimensions from SVG
 */
export function parseSvgViewBox(
  svgContent: string
): { width: number; height: number } | null {
  const viewBoxMatch = svgContent.match(/viewBox=["']([^"']+)["']/i);
  if (viewBoxMatch) {
    const parts = viewBoxMatch[1].split(/[\s,]+/).map(Number);
    if (parts.length >= 4 && !isNaN(parts[2]) && !isNaN(parts[3])) {
      return { width: parts[2], height: parts[3] };
    }
  }

  const widthMatch = svgContent.match(/width=["'](\d+(?:\.\d+)?)["']/i);
  const heightMatch = svgContent.match(/height=["'](\d+(?:\.\d+)?)["']/i);
  if (widthMatch && heightMatch) {
    return { width: Number(widthMatch[1]), height: Number(heightMatch[1]) };
  }

  return null;
}

/**
 * Check if SVG uses stroke (outline) or fill
 */
export function detectSvgStyle(
  svgContent: string
): "stroke" | "fill" | "both" {
  const hasStroke = /stroke=["'](?!none)[^"']*["']/i.test(svgContent);
  const hasFillNone = /fill=["']none["']/i.test(svgContent);
  const hasFill = /fill=["'](?!none)[^"']*["']/i.test(svgContent);

  if (hasStroke && (hasFill || !hasFillNone)) return "both";
  if (hasStroke) return "stroke";
  return "fill";
}

/**
 * Extract stroke width from SVG content
 */
export function extractStrokeWidth(svgContent: string): number | null {
  const match = svgContent.match(/stroke-width=["']([^"']+)["']/i);
  if (match) {
    const value = parseFloat(match[1]);
    if (!isNaN(value)) return value;
  }
  return null;
}
