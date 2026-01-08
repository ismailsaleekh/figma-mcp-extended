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
