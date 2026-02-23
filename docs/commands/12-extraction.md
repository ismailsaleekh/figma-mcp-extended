# Extraction & Analysis

Commands for extracting design data and analyzing patterns.

---

## `get_complete_file_data`

Extract complete document with full hierarchy.

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `useChunking` | boolean | No | true | Enable chunked processing |
| `chunkSize` | number | No | 50 | Nodes per chunk |

**Returns**: Complete document structure with styles, components, variables, metadata

---

## `get_design_tokens`

Extract design tokens organized by type.

**Parameters**: None

**Returns**:
```json
{
  "colors": { "Primary/500": { "id": "...", "paints": [...] } },
  "typography": { "Heading/H1": { "fontSize": 32, "fontFamily": "Inter" } },
  "effects": { "Shadow/Medium": { "effects": [...] } },
  "variables": { "collections": {...}, "tokens": {...} }
}
```

---

## `get_layout_constraints`

Analyze auto-layout with CSS recommendations.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | No | Node ID or "" for selection |

**Returns**: Layout properties + `responsiveBehavior` with CSS recommendations

---

## `get_component_hierarchy`

Analyze component relationships.

**Parameters**: None

**Returns**:
```json
{
  "components": [...],
  "componentSets": [...],
  "instances": [...],
  "relationships": {...}
}
```

---

## `get_responsive_layouts`

Analyze responsive design patterns.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | No | Node ID to analyze |

**Returns**: Breakpoint recommendations and responsive element analysis

---

## `get_style_inheritance`

Analyze style inheritance chains.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | No | Node ID or "" for selection |

**Returns**:
```json
{
  "nodeId": "...",
  "computedStyles": { "typography": {...}, "fills": [...] },
  "inheritedStyles": {...},
  "localStyles": {...},
  "recommendations": [
    { "property": "font-family", "value": "'Inter'", "description": "Set font family" }
  ]
}
```

---

## `get_validation_tree`

Get complete property tree for validation. Reads Figma node properties **directly** via Plugin API (no `exportAsync`), returning all properties for all node types including VECTOR and invisible nodes.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Root node ID (colon format, e.g., "849:4034") |

**Returns**: Recursive `ValidationNode` tree with complete property set:

```json
{
  "id": "849:4034",
  "name": "Frame",
  "type": "FRAME",
  "visible": true,
  "parentId": null,
  "x": 0, "y": 0,
  "width": 393, "height": 852,
  "absoluteX": 0, "absoluteY": 0,
  "layoutMode": "VERTICAL",
  "layoutSizingHorizontal": "FIXED",
  "layoutSizingVertical": "FIXED",
  "primaryAxisAlignItems": "MIN",
  "counterAxisAlignItems": "MIN",
  "paddingTop": 0, "paddingRight": 0, "paddingBottom": 0, "paddingLeft": 0,
  "itemSpacing": 0,
  "layoutPositioning": "AUTO",
  "clipsContent": true,
  "opacity": 1,
  "cornerRadius": 0,
  "fills": [{ "type": "SOLID", "visible": true, "color": { "r": 1, "g": 1, "b": 1, "a": 1 } }],
  "strokes": [],
  "effects": [],
  "characters": null,
  "fontSize": null, "fontWeight": null, "fontFamily": null,
  "textAlignHorizontal": null,
  "lineHeightPx": null, "letterSpacing": null,
  "textTruncation": null, "maxLines": null,
  "children": [...]
}
```

**Key differences from `get_node_info`**:
- Does NOT use `exportAsync` — accesses Plugin API properties directly
- Includes layout properties (layoutMode, padding, spacing, alignment)
- Includes VECTOR nodes (not filtered out)
- Includes invisible nodes (`visible: false`)
- Colors in RGBA 0-1 range (not hex)
- Both parent-relative (x, y) and absolute (absoluteX, absoluteY) positions
- Handles mixed text styles with safe fallbacks
