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

Set sizing behavior on an auto-layout frame.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Target frame ID |
| `layoutSizingHorizontal` | string | No | "FIXED", "HUG", "FILL" |
| `layoutSizingVertical` | string | No | "FIXED", "HUG", "FILL" |

**Sizing Modes**:
- `HUG` - Content determines size
- `FILL` - Expand to fill parent (only valid as child of auto-layout)
- `FIXED` - Explicit dimensions

**Returns**: `{ id, name, layoutSizingHorizontal, layoutSizingVertical, layoutMode }`

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
