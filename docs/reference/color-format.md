# Color Format

All colors in the Figma MCP Extended API use the **0-1 range** (not 0-255).

## Format

```json
{
  "r": 0.2,    // Red (0-1)
  "g": 0.4,    // Green (0-1)
  "b": 0.8,    // Blue (0-1)
  "a": 1.0     // Alpha (0-1)
}
```

## Conversion

To convert from hex or 0-255 values:

```javascript
// From 0-255 to 0-1
r = red / 255
g = green / 255
b = blue / 255

// Examples:
// White (255, 255, 255) → { r: 1, g: 1, b: 1, a: 1 }
// Black (0, 0, 0) → { r: 0, g: 0, b: 0, a: 1 }
// Red (255, 0, 0) → { r: 1, g: 0, b: 0, a: 1 }
// Blue (#0066FF) → { r: 0, g: 0.4, b: 1, a: 1 }
```

## Common Colors

| Color | Hex | RGBA (0-1) |
|-------|-----|------------|
| White | #FFFFFF | `{ r: 1, g: 1, b: 1, a: 1 }` |
| Black | #000000 | `{ r: 0, g: 0, b: 0, a: 1 }` |
| Red | #FF0000 | `{ r: 1, g: 0, b: 0, a: 1 }` |
| Green | #00FF00 | `{ r: 0, g: 1, b: 0, a: 1 }` |
| Blue | #0000FF | `{ r: 0, g: 0, b: 1, a: 1 }` |
| 50% Gray | #808080 | `{ r: 0.5, g: 0.5, b: 0.5, a: 1 }` |
| Transparent | - | `{ r: 0, g: 0, b: 0, a: 0 }` |
