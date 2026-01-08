# Icon Not Visible on Product Images

## Issue
Outline icons (e.g., heart icon) are not visible when placed over product images.

## Cause
Stroke-based outline icons have thin lines that get lost against varied image backgrounds.

## Solutions

### Option 1: Use Filled Icon with Contrasting Color
```javascript
// White filled heart visible on any image
await createIcon(
  '/icons/actions/heart-solid.svg',
  x, y, 24,
  { r: 1, g: 1, b: 1, a: 1 },  // White
  parentId,
  "Heart",
  true  // isFilled = true
);
```

### Option 2: Add Background Circle (if outline preferred)
```javascript
// Semi-transparent background
await sendCommand("create_ellipse", {
  x: x - 2, y: y - 2,
  width: 28, height: 28,
  fillColor: { r: 1, g: 1, b: 1, a: 0.85 },
  parentId
});

// Outline icon on top
await createIcon(
  '/icons/actions/heart-outline.svg',
  x, y, 24,
  { r: 0.5, g: 0.5, b: 0.5, a: 1 },
  parentId,
  "Heart"
);
```

## Recommendation
Use **filled icons with white color** for overlays on images - cleaner look, no alignment issues with background shapes.
