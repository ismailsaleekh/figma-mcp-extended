# Components

Commands for working with styles, components, and instances.

---

## `get_styles`

Get all local styles from the document.

**Parameters**: None

**Returns**:
```json
{
  "colors": [{ "id": "...", "name": "Primary", "key": "...", "paint": {...} }],
  "texts": [{ "id": "...", "name": "Heading 1", "fontSize": 32, "fontName": {...} }],
  "effects": [{ "id": "...", "name": "Shadow", "key": "..." }],
  "grids": [{ "id": "...", "name": "12 Column", "key": "..." }]
}
```

---

## `get_local_components`

Get all local components in the document.

**Parameters**: None

**Returns**:
```json
{
  "count": 15,
  "components": [
    { "id": "...", "name": "Button/Primary", "key": "component_key" }
  ]
}
```

---

## `create_component`

Convert a node to a component.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Node ID to convert |
| `name` | string | No | Name for the component (uses existing name if not provided) |

**Returns**:
```json
{
  "id": "123:456",
  "name": "Button",
  "key": "abc123...",
  "type": "COMPONENT"
}
```

**Note**: Cannot convert nodes that are already components, documents, or pages.

---

## `create_component_instance`

Create an instance of a component.

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `componentKey` | string | No* | - | Component key for published library components |
| `componentId` | string | No* | - | Component ID for local components in same file |
| `x` | number | No | 0 | X position |
| `y` | number | No | 0 | Y position |
| `parentId` | string | No | current page | Parent node ID |

*One of `componentKey` or `componentId` is required.

**Returns**: `{ id, name, x, y, width, height, componentId, componentKey, parentId }`

**Usage**:
- Use `componentId` for local components created in the same file (get the ID from `create_component`)
- Use `componentKey` for components published to a team library (requires library access)
- Use `parentId` to place the instance inside a specific frame or group

---

## `detach_instance`

Detach an instance from its component.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Instance node ID |

**Returns**:
```json
{
  "id": "123:456",
  "name": "Button",
  "type": "FRAME"
}
```

**Note**: Converts the instance to a regular frame, breaking the link to the main component.
