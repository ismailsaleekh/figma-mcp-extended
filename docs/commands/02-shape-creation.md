# Shape Creation

Commands for creating shapes, frames, and grouping nodes.

---

## `create_rectangle`

Create a rectangle node.

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `x` | number | No | 0 | X position |
| `y` | number | No | 0 | Y position |
| `width` | number | No | 100 | Width in pixels |
| `height` | number | No | 100 | Height in pixels |
| `name` | string | No | "Rectangle" | Node name |
| `parentId` | string | No | current page | Parent node ID |

**Returns**: `{ id, name, x, y, width, height, parentId }`

---

## `create_frame`

Create a frame with optional auto-layout settings.

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `x` | number | No | 0 | X position |
| `y` | number | No | 0 | Y position |
| `width` | number | No | 100 | Width in pixels |
| `height` | number | No | 100 | Height in pixels |
| `name` | string | No | "Frame" | Node name |
| `parentId` | string | No | current page | Parent node ID |
| `fillColor` | object | No | - | `{ r, g, b, a }` (0-1 range) |
| `strokeColor` | object | No | - | `{ r, g, b, a }` (0-1 range) |
| `strokeWeight` | number | No | - | Stroke width |
| `layoutMode` | string | No | "NONE" | "NONE", "HORIZONTAL", "VERTICAL" |
| `layoutWrap` | string | No | "NO_WRAP" | "NO_WRAP", "WRAP" |
| `paddingTop` | number | No | 10 | Top padding |
| `paddingRight` | number | No | 10 | Right padding |
| `paddingBottom` | number | No | 10 | Bottom padding |
| `paddingLeft` | number | No | 10 | Left padding |
| `primaryAxisAlignItems` | string | No | "MIN" | "MIN", "MAX", "CENTER", "SPACE_BETWEEN" |
| `counterAxisAlignItems` | string | No | "MIN" | "MIN", "MAX", "CENTER", "BASELINE" |
| `layoutSizingHorizontal` | string | No | "FIXED" | "FIXED", "HUG", "FILL" |
| `layoutSizingVertical` | string | No | "FIXED" | "FIXED", "HUG", "FILL" |
| `itemSpacing` | number | No | 0 | Gap between children |

**Returns**: `{ id, name, x, y, width, height, fills, strokes, strokeWeight, layoutMode, layoutWrap, parentId }`

---

## `create_ellipse`

Create an ellipse or circle.

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `x` | number | No | 0 | X position |
| `y` | number | No | 0 | Y position |
| `width` | number | No | 100 | Width in pixels |
| `height` | number | No | 100 | Height in pixels (same as width for circle) |
| `name` | string | No | "Ellipse" | Node name |
| `parentId` | string | No | current page | Parent node ID |
| `fillColor` | object | No | - | `{ r, g, b, a }` (0-1 range) |

**Returns**: `{ id, name, x, y, width, height, parentId }`

---

## `create_line`

Create a line between two points.

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `startX` | number | No | 0 | Start X position |
| `startY` | number | No | 0 | Start Y position |
| `endX` | number | No | 100 | End X position |
| `endY` | number | No | 0 | End Y position |
| `name` | string | No | "Line" | Node name |
| `parentId` | string | No | current page | Parent node ID |
| `strokeColor` | object | No | black | `{ r, g, b, a }` (0-1 range) |
| `strokeWeight` | number | No | 1 | Stroke weight in pixels |

**Returns**: `{ id, name, x, y, width, height, rotation, parentId }`

---

## `create_polygon`

Create a polygon with specified number of sides.

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `x` | number | No | 0 | X position |
| `y` | number | No | 0 | Y position |
| `width` | number | No | 100 | Width in pixels |
| `height` | number | No | 100 | Height in pixels |
| `pointCount` | number | No | 3 | Number of sides (3-100) |
| `name` | string | No | "Polygon" | Node name |
| `parentId` | string | No | current page | Parent node ID |
| `fillColor` | object | No | - | `{ r, g, b, a }` (0-1 range) |

**Returns**: `{ id, name, x, y, width, height, pointCount, parentId }`

**Examples**:
- `pointCount: 3` = Triangle
- `pointCount: 5` = Pentagon
- `pointCount: 6` = Hexagon

---

## `create_vector`

Create a vector from SVG path data.

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `vectorPaths` | array | Yes | - | Array of path objects |
| `x` | number | No | 0 | X position |
| `y` | number | No | 0 | Y position |
| `name` | string | No | "Vector" | Node name |
| `parentId` | string | No | current page | Parent node ID |
| `fillColor` | object | No | - | `{ r, g, b, a }` (0-1 range) |
| `strokeColor` | object | No | - | `{ r, g, b, a }` (0-1 range) |
| `strokeWeight` | number | No | - | Stroke weight in pixels |

**vectorPaths format**:
```json
[
  {
    "windingRule": "EVENODD",
    "data": "M 0 0 L 100 0 L 50 100 Z"
  }
]
```

**Returns**: `{ id, name, x, y, width, height, parentId }`

**Example**:
```json
{
  "command": "create_vector",
  "params": {
    "vectorPaths": [
      { "windingRule": "EVENODD", "data": "M 0 0 L 100 0 L 50 100 Z" }
    ],
    "fillColor": { "r": 1, "g": 0, "b": 0, "a": 1 }
  }
}
```

> **Note**: `create_vector` only supports simple SVG commands (M, L, Z). For complex SVG paths with curves, use [`create_svg`](#create_svg) instead.

---

## `create_svg`

Create a vector from SVG path data or full SVG content. Supports complex paths including cubic bezier curves (C, S), quadratic curves (Q, T), and arcs (A).

**Use Cases**:
- Import SVG icons from Heroicons, Feather Icons, etc.
- Create complex vector shapes with curves
- Render SVG path data from external sources

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `svg` | string | Yes | - | SVG path data (d attribute) OR full SVG content |
| `x` | number | No | 0 | X position |
| `y` | number | No | 0 | Y position |
| `width` | number | No | auto | Target width (scales proportionally) |
| `height` | number | No | auto | Target height (scales proportionally) |
| `name` | string | No | "SVG" | Node name |
| `parentId` | string | No | current page | Parent node ID |
| `fillColor` | object | No | - | `{ r, g, b, a }` (0-1 range) |
| `strokeColor` | object | No | - | `{ r, g, b, a }` (0-1 range) |
| `strokeWeight` | number | No | 1.5 | Stroke weight in pixels |
| `windingRule` | string | No | "EVENODD" | "EVENODD" or "NONZERO" |

**Returns**: `{ id, name, x, y, width, height, parentId }`

**Supported SVG Commands**:
| Command | Description |
|---------|-------------|
| M | MoveTo - start a new subpath |
| L | LineTo - straight line |
| H | Horizontal line |
| V | Vertical line |
| C | Cubic Bezier curve |
| S | Smooth cubic Bezier |
| Q | Quadratic Bezier curve |
| T | Smooth quadratic Bezier |
| A | Arc (approximated) |
| Z | ClosePath |

**Example - Path data only**:
```json
{
  "command": "create_svg",
  "params": {
    "svg": "M21 21L15.8033 15.8033C17.1605 14.4461 18 12.5711 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18C12.5711 18 14.4461 17.1605 15.8033 15.8033Z",
    "x": 100,
    "y": 100,
    "strokeColor": { "r": 0.4, "g": 0.4, "b": 0.4, "a": 1 },
    "strokeWeight": 1.5,
    "name": "Search Icon"
  }
}
```

**Example - Full SVG content (Heroicons)**:
```json
{
  "command": "create_svg",
  "params": {
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z\"/></svg>",
    "width": 24,
    "height": 24,
    "strokeColor": { "r": 0.06, "g": 0.09, "b": 0.16, "a": 1 },
    "name": "Search Icon"
  }
}
```

**Example - Filled SVG**:
```json
{
  "command": "create_svg",
  "params": {
    "svg": "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z\"/></svg>",
    "width": 24,
    "height": 24,
    "fillColor": { "r": 0.86, "g": 0.15, "b": 0.15, "a": 1 },
    "name": "Heart Icon"
  }
}
```

**Style Detection**:
- Stroke SVGs (like Heroicons outline) → automatic stroke styling
- Fill SVGs (like Heroicons solid) → automatic fill styling
- Mixed → both stroke and fill applied

---

## `create_text`

Create a text node.

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `x` | number | No | 0 | X position |
| `y` | number | No | 0 | Y position |
| `width` | number | No | auto | Fixed width (enables text wrapping) |
| `text` | string | No | "Text" | Text content |
| `fontSize` | number | No | 14 | Font size in pixels |
| `fontWeight` | number | No | 400 | Font weight (100-900) |
| `fontColor` | object | No | black | `{ r, g, b, a }` (0-1 range) |
| `textAlignHorizontal` | string | No | "LEFT" | "LEFT", "CENTER", "RIGHT", "JUSTIFIED" |
| `name` | string | No | text value | Node name |
| `parentId` | string | No | current page | Parent node ID |

**Font Weight Mapping**:
| Weight | Style |
|--------|-------|
| 100 | Thin |
| 200 | Extra Light |
| 300 | Light |
| 400 | Regular |
| 500 | Medium |
| 600 | Semi Bold |
| 700 | Bold |
| 800 | Extra Bold |
| 900 | Black |

**Centered Text Example**:
```json
{
  "command": "create_text",
  "params": {
    "x": 0,
    "y": 50,
    "width": 100,
    "text": "Centered",
    "textAlignHorizontal": "CENTER",
    "parentId": "123:456"
  }
}
```

**Returns**: `{ id, name, x, y, width, height, characters, fontSize, fontWeight, fontColor, fontName, fills, parentId }`

---

## `clone_node`

Clone an existing node.

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | Yes | - | Node ID to clone |
| `x` | number | No | Same as original | New X position |
| `y` | number | No | Same as original | New Y position |

**Returns**: `{ id, name, x, y, width, height }`

---

## `group_nodes`

Group multiple nodes together.

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeIds` | string[] | Yes | - | Array of node IDs to group |
| `name` | string | No | "Group" | Name for the group |

**Returns**:
```json
{
  "id": "123:456",
  "name": "Group",
  "type": "GROUP",
  "childCount": 3,
  "children": [
    { "id": "123:457", "name": "Rectangle 1" },
    { "id": "123:458", "name": "Rectangle 2" }
  ]
}
```

**Note**: All nodes must have the same parent to be grouped.

---

## `ungroup_nodes`

Ungroup a group node, moving children to the parent.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | ID of the group to ungroup |

**Returns**:
```json
{
  "success": true,
  "ungroupedChildren": [
    { "id": "123:457", "name": "Rectangle 1", "type": "RECTANGLE" },
    { "id": "123:458", "name": "Rectangle 2", "type": "RECTANGLE" }
  ]
}
```

---

## `create_image_rectangle`

Create a rectangle with an image fill.

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `imageUrl` | string | No* | - | URL of image to load |
| `imageBase64` | string | No* | - | Base64-encoded image data |
| `x` | number | No | 0 | X position |
| `y` | number | No | 0 | Y position |
| `width` | number | No | 100 | Width in pixels |
| `height` | number | No | 100 | Height in pixels |
| `name` | string | No | "Image" | Node name |
| `parentId` | string | No | current page | Parent node ID |
| `scaleMode` | string | No | "FILL" | "FILL", "FIT", "CROP", "TILE" |
| `cornerRadius` | number | No | 0 | Corner radius |

*One of `imageUrl` or `imageBase64` is required

**Returns**: `{ id, name, x, y, width, height, imageHash, parentId }`
