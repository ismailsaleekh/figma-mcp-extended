# Styling

Commands for styling nodes with fills, strokes, effects, and gradients.

---

## `set_fill_color`

Set solid fill color on a node.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Target node ID |
| `color` | object | Yes | `{ r, g, b, a }` (0-1 range) |

**Returns**: `{ id, name, fills }`

---

## `set_stroke_color`

Set stroke color and weight on a node.

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | Yes | - | Target node ID |
| `color` | object | Yes | - | `{ r, g, b, a }` (0-1 range) |
| `weight` | number | No | 1 | Stroke weight in pixels |

**Returns**: `{ id, name, strokes, strokeWeight }`

---

## `set_opacity`

Set opacity on a node.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Target node ID |
| `opacity` | number | Yes | Opacity value (0-1) |

**Returns**: `{ id, name, opacity }`

---

## `set_effects`

Set effects (shadows, blur) on a node.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Target node ID |
| `effects` | array | Yes | Array of effect objects |

**Effect Types**:
- `DROP_SHADOW` - Drop shadow
- `INNER_SHADOW` - Inner shadow
- `LAYER_BLUR` - Layer blur
- `BACKGROUND_BLUR` - Background blur

**Shadow Effect Object**:
```json
{
  "type": "DROP_SHADOW",
  "visible": true,
  "radius": 8,
  "color": { "r": 0, "g": 0, "b": 0, "a": 0.25 },
  "offset": { "x": 0, "y": 4 },
  "spread": 0
}
```

**Blur Effect Object**:
```json
{
  "type": "LAYER_BLUR",
  "visible": true,
  "radius": 10
}
```

**Returns**: `{ id, name, effects }`

**Example**:
```json
{
  "command": "set_effects",
  "params": {
    "nodeId": "123:456",
    "effects": [
      {
        "type": "DROP_SHADOW",
        "visible": true,
        "radius": 8,
        "color": { "r": 0, "g": 0, "b": 0, "a": 0.25 },
        "offset": { "x": 0, "y": 4 },
        "spread": 0
      }
    ]
  }
}
```

---

## `set_gradient_fill`

Set a gradient fill on a node.

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | Yes | - | Target node ID |
| `gradientType` | string | Yes | - | Gradient type (see below) |
| `stops` | array | Yes | - | Array of color stops (minimum 2) |
| `angle` | number | No | 0 | Angle in degrees (for linear gradients) |

**Gradient Types**:
- `GRADIENT_LINEAR`
- `GRADIENT_RADIAL`
- `GRADIENT_ANGULAR`
- `GRADIENT_DIAMOND`

**Color Stop Format**:
```json
{
  "position": 0,
  "color": { "r": 1, "g": 0, "b": 0, "a": 1 }
}
```

**Returns**: `{ id, name, fills }`

**Example**:
```json
{
  "command": "set_gradient_fill",
  "params": {
    "nodeId": "123:456",
    "gradientType": "GRADIENT_LINEAR",
    "stops": [
      { "position": 0, "color": { "r": 1, "g": 0, "b": 0, "a": 1 } },
      { "position": 1, "color": { "r": 0, "g": 0, "b": 1, "a": 1 } }
    ],
    "angle": 45
  }
}
```

---

## `set_blend_mode`

Set blend mode on a node.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Target node ID |
| `blendMode` | string | Yes | Blend mode value |

**Blend Mode Values**:
- Normal: `PASS_THROUGH`, `NORMAL`
- Darken: `DARKEN`, `MULTIPLY`, `COLOR_BURN`, `LINEAR_BURN`
- Lighten: `LIGHTEN`, `SCREEN`, `COLOR_DODGE`, `LINEAR_DODGE`
- Contrast: `OVERLAY`, `SOFT_LIGHT`, `HARD_LIGHT`
- Inversion: `DIFFERENCE`, `EXCLUSION`
- Component: `HUE`, `SATURATION`, `COLOR`, `LUMINOSITY`

**Returns**: `{ id, name, blendMode }`

---

## `set_stroke_style`

Set stroke style properties on a node.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Target node ID |
| `strokeAlign` | string | No | "INSIDE", "OUTSIDE", "CENTER" |
| `strokeCap` | string | No | "NONE", "ROUND", "SQUARE", "ARROW_LINES", "ARROW_EQUILATERAL" |
| `strokeJoin` | string | No | "MITER", "BEVEL", "ROUND" |
| `dashPattern` | number[] | No | Array of dash lengths (e.g., [10, 5]) |

**Returns**: `{ id, name, strokeAlign, strokeCap, strokeJoin, dashPattern }`

**Example** (dashed stroke):
```json
{
  "command": "set_stroke_style",
  "params": {
    "nodeId": "123:456",
    "strokeAlign": "CENTER",
    "strokeCap": "ROUND",
    "dashPattern": [10, 5]
  }
}
```

---

## `set_corner_radius`

Set corner radius on a node.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Target node ID |
| `radius` | number | Yes | Corner radius in pixels |
| `corners` | boolean[] | No | [topLeft, topRight, bottomRight, bottomLeft] - which corners to apply |

**Returns**: `{ id, name, cornerRadius, topLeftRadius, topRightRadius, bottomRightRadius, bottomLeftRadius }`
