# Text

Commands for creating and styling text nodes.

---

## `scan_text_nodes`

Scan and extract all text nodes from a node hierarchy.

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | Yes | - | Node ID to scan |
| `useChunking` | boolean | No | true | Enable chunked processing |
| `chunkSize` | number | No | 10 | Nodes per chunk |

**Returns**:
```json
{
  "success": true,
  "count": 15,
  "textNodes": [
    {
      "id": "123:456",
      "name": "Label",
      "characters": "Hello World",
      "fontSize": 16,
      "fontFamily": "Inter",
      "fontStyle": "Regular",
      "x": 100, "y": 200,
      "path": "Frame > Container > Label",
      "depth": 2
    }
  ]
}
```

---

## `set_text_content`

Set text content of a text node.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Text node ID |
| `text` | string | Yes | New text content |

**Returns**: `{ id, name, characters, fontName }`

---

## `set_multiple_text_contents`

Batch update multiple text nodes with progress tracking.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Parent node ID |
| `text` | array | Yes | Array of `{ nodeId, text }` objects |

**Returns**:
```json
{
  "success": true,
  "replacementsApplied": 10,
  "replacementsFailed": 0,
  "totalReplacements": 10,
  "results": [...]
}
```

---

## `set_font_family`

Set font family on a text node.

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | Yes | - | Text node ID |
| `fontFamily` | string | Yes | - | Font family name (e.g., "Inter", "Arial") |
| `fontStyle` | string | No | "Regular" | Font style (e.g., "Regular", "Bold", "Italic") |

**Returns**: `{ id, name, fontName, characters }`

**Note**: Font must be available in Figma. Common fonts: Inter, Roboto, Arial, Helvetica.

---

## `set_font_size`

Set font size on a text node.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Text node ID |
| `fontSize` | number | Yes | Font size in pixels (must be positive) |

**Returns**: `{ id, name, fontSize, characters }`

---

## `set_font_weight`

Set font weight on a text node.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Text node ID |
| `fontWeight` | number | Yes | Font weight (100-900) |

**Weight Mapping**:
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

**Returns**: `{ id, name, fontName, fontWeight, characters }`

---

## `set_text_alignment`

Set text alignment on a text node.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Text node ID |
| `horizontalAlign` | string | No | "LEFT", "CENTER", "RIGHT", "JUSTIFIED" |
| `verticalAlign` | string | No | "TOP", "CENTER", "BOTTOM" |

**Returns**: `{ id, name, textAlignHorizontal, textAlignVertical }`

---

## `set_line_height`

Set line height on a text node.

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | Yes | - | Text node ID |
| `lineHeight` | number or "AUTO" | Yes | - | Line height value |
| `unit` | string | No | "PIXELS" | "PIXELS" or "PERCENT" |

**Returns**: `{ id, name, lineHeight }`

**Example**:
```json
{
  "command": "set_line_height",
  "params": {
    "nodeId": "123:456",
    "lineHeight": 150,
    "unit": "PERCENT"
  }
}
```

---

## `set_letter_spacing`

Set letter spacing on a text node.

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | Yes | - | Text node ID |
| `letterSpacing` | number | Yes | - | Letter spacing value |
| `unit` | string | No | "PIXELS" | "PIXELS" or "PERCENT" |

**Returns**: `{ id, name, letterSpacing }`
