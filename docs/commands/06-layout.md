# Layout & Auto Layout

Commands for configuring auto-layout on frames.

---

## `set_layout_mode`

Set auto-layout mode on a frame.

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | Yes | - | Target frame ID |
| `layoutMode` | string | No | "NONE" | "NONE", "HORIZONTAL", "VERTICAL" |
| `layoutWrap` | string | No | "NO_WRAP" | "NO_WRAP", "WRAP" |

**Returns**: `{ id, name, layoutMode, layoutWrap }`

---

## `set_padding`

Set padding on an auto-layout frame.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Target frame ID |
| `paddingTop` | number | No | Top padding |
| `paddingRight` | number | No | Right padding |
| `paddingBottom` | number | No | Bottom padding |
| `paddingLeft` | number | No | Left padding |

**Note**: Frame must have auto-layout enabled (layoutMode !== "NONE")

**Returns**: `{ id, name, paddingTop, paddingRight, paddingBottom, paddingLeft }`

---

## `set_axis_align`

Set alignment on an auto-layout frame.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Target frame ID |
| `primaryAxisAlignItems` | string | No | "MIN", "MAX", "CENTER", "SPACE_BETWEEN" |
| `counterAxisAlignItems` | string | No | "MIN", "MAX", "CENTER", "BASELINE" |

**Note**: BASELINE only valid for horizontal layouts

**Returns**: `{ id, name, primaryAxisAlignItems, counterAxisAlignItems, layoutMode }`

---

## `set_layout_sizing`

Set sizing behavior on an auto-layout frame **or any child node** (including TEXT) of an auto-layout frame.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Target node ID (auto-layout frame, or child of one) |
| `layoutSizingHorizontal` | string | No | "FIXED", "HUG", "FILL" |
| `layoutSizingVertical` | string | No | "FIXED", "HUG", "FILL" |

**Sizing Modes**:
- `HUG` - Content determines size
- `FILL` - Expand to fill parent (only valid as child of auto-layout)
- `FIXED` - Explicit dimensions

**Supported Node Types**:
- Auto-layout frames (FRAME, COMPONENT with `layoutMode !== "NONE"`)
- Any child of an active auto-layout frame that exposes `layoutSizingHorizontal` — this includes TEXT nodes, which need FILL sizing to wrap text within a parent's width

**Returns**: `{ id, name, layoutSizingHorizontal, layoutSizingVertical, layoutMode }`

`layoutMode` is the frame's layout mode for auto-layout frames, or `"CHILD"` for non-frame nodes.

---

## `set_item_spacing`

Set spacing between children in auto-layout.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Target frame ID |
| `itemSpacing` | number | No | Gap between items |
| `counterAxisSpacing` | number | No | Gap for wrapped items (requires layoutWrap: "WRAP") |

**Returns**: `{ id, name, itemSpacing, counterAxisSpacing, layoutMode, layoutWrap }`

---

## `set_min_max_size`

Set min/max size constraints on an auto-layout frame.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Target frame ID |
| `minWidth` | number | No | Minimum width constraint |
| `maxWidth` | number | No | Maximum width constraint |
| `minHeight` | number | No | Minimum height constraint |
| `maxHeight` | number | No | Maximum height constraint |

**Note**: At least one of the four constraint values must be provided. Frame must have auto-layout enabled (layoutMode !== "NONE").

**Example**:
```json
{
  "command": "set_min_max_size",
  "params": {
    "nodeId": "4371:50004",
    "minWidth": 280,
    "maxWidth": 360
  }
}
```

**Returns**: `{ id, name, minWidth, maxWidth, minHeight, maxHeight, layoutMode }`

---

## `set_layout_positioning`

Set a node to absolute positioning within its auto-layout parent, removing it from the layout flow. Used for FABs, badges, overlays, pagination dots, and other floating elements.

Supports two positioning modes:
- **Offset-based** (preferred): pass `top`/`left`/`right`/`bottom` offsets — the plugin computes `x`/`y` using the actual parent dimensions at runtime. Also sets Figma constraints (`MIN`/`MAX`) to match the positioning edge.
- **Legacy**: pass `x`/`y` directly.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Target node ID (must be a child of an auto-layout frame) |
| `positioning` | string | Yes | "ABSOLUTE" or "AUTO" |
| `top` | number | No | Offset from parent top edge (px) |
| `left` | number | No | Offset from parent left edge (px) |
| `right` | number | No | Offset from parent right edge (px) |
| `bottom` | number | No | Offset from parent bottom edge (px) |
| `x` | number | No | Legacy: direct horizontal position within parent |
| `y` | number | No | Legacy: direct vertical position within parent |

**Note**: The target node must be a direct child of a frame with auto-layout enabled (layoutMode !== "NONE"). Setting to "AUTO" returns the node to normal layout flow. When offsets are provided, they take priority over `x`/`y`.

**Offset computation**:
- `left` → `x = left`
- `right` → `x = parent.width - node.width - right`
- `top` → `y = top`
- `bottom` → `y = parent.height - node.height - bottom`

**Constraints** (auto-set when using offsets):
- `horizontal`: `"MAX"` when `right` is provided, `"MIN"` otherwise
- `vertical`: `"MAX"` when `bottom` is provided, `"MIN"` otherwise

**Example — FAB positioned bottom-right with offsets** (preferred):
```json
{
  "command": "set_layout_positioning",
  "params": {
    "nodeId": "4371:60001",
    "positioning": "ABSOLUTE",
    "right": 16,
    "bottom": 83
  }
}
```

**Example — Badge positioned top-left with offsets**:
```json
{
  "command": "set_layout_positioning",
  "params": {
    "nodeId": "4371:60002",
    "positioning": "ABSOLUTE",
    "top": 8,
    "left": 8
  }
}
```

**Example — Legacy x/y positioning**:
```json
{
  "command": "set_layout_positioning",
  "params": {
    "nodeId": "4371:60001",
    "positioning": "ABSOLUTE",
    "x": 313,
    "y": 720
  }
}
```

**Example — Return to auto-layout flow**:
```json
{
  "command": "set_layout_positioning",
  "params": {
    "nodeId": "4371:60001",
    "positioning": "AUTO"
  }
}
```

**Returns**: `{ id, name, layoutPositioning, x, y, parentId, parentName, parentLayoutMode }`
