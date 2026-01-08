# SVG Icons Not Rendering

## Issue
SVG icons from files (e.g., Heroicons) appear as gray rectangles or don't render at all.

## Cause
- `create_vector` only supports simple SVG path commands (M, L, Z)
- Heroicons use complex curves (C, S, Q, A) which `create_vector` cannot parse
- Base64 image approach doesn't work for SVG files

## Solution
Use `create_svg` command which supports full SVG content including curves:

```javascript
const fs = require('fs');

async function createIcon(filePath, x, y, size, color, parentId, name, isFilled = false) {
  const svgContent = fs.readFileSync(filePath, 'utf8');

  const params = {
    svg: svgContent,
    x, y,
    width: size,
    height: size,
    name: name,
    parentId
  };

  // Set fill or stroke based on icon type
  if (isFilled) {
    params.fillColor = color;
  } else {
    params.strokeColor = color;
    params.strokeWeight = 1.5;
  }

  return await sendCommand("create_svg", params);
}

// Usage
await createIcon(
  '/path/to/icons/heart-outline.svg',
  100, 100, 24,
  { r: 0.5, g: 0.5, b: 0.5, a: 1 },
  frameId,
  "Heart Icon"
);
```

## Icon Types
- **Outline icons** (stroke): Use `strokeColor`
- **Solid icons** (fill): Use `fillColor` with `isFilled: true`
