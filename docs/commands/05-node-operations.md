# Node Operations

Commands for manipulating node position, size, and properties.

---

## `move_node`

Move a node to a new position.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Target node ID |
| `x` | number | Yes | New X position |
| `y` | number | Yes | New Y position |

**Returns**: `{ id, name, x, y }`

---

## `resize_node`

Resize a node.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Target node ID |
| `width` | number | Yes | New width |
| `height` | number | Yes | New height |

**Returns**: `{ id, name, width, height }`

---

## `delete_node`

Delete a single node.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Node ID to delete |

**Returns**: `{ id, name, type }` (of deleted node)

---

## `delete_multiple_nodes`

Delete multiple nodes with status tracking.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeIds` | string[] | Yes | Array of node IDs to delete |

**Returns**:
```json
{
  "success": true,
  "nodesDeleted": 5,
  "nodesFailed": 0,
  "totalNodes": 5,
  "results": [...]
}
```

---

## `set_rotation`

Set rotation on a node.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Target node ID |
| `rotation` | number | Yes | Rotation angle in degrees |

**Returns**: `{ id, name, rotation }`

---

## `set_z_index`

Reorder a node in the layer stack.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Target node ID |
| `position` | string or number | Yes | Position value |

**Position Values**:
- `"front"` - Move to top of stack
- `"back"` - Move to bottom of stack
- `"forward"` - Move one step forward
- `"backward"` - Move one step backward
- `number` - Move to specific index

**Returns**: `{ id, name, index }`

---

## `rename_node`

Rename a node.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Target node ID |
| `name` | string | Yes | New name for the node |

**Returns**: `{ id, oldName, newName }`

---

## `set_visibility`

Show or hide a node.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Target node ID |
| `visible` | boolean | Yes | true = visible, false = hidden |

**Returns**: `{ id, name, visible }`

---

## `set_constraints`

Set resize constraints on a node.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Target node ID |
| `horizontal` | string | No | "MIN", "MAX", "CENTER", "STRETCH", "SCALE" |
| `vertical` | string | No | "MIN", "MAX", "CENTER", "STRETCH", "SCALE" |

**Returns**: `{ id, name, constraints }`

---

## `lock_node`

Lock or unlock a node.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Target node ID |
| `locked` | boolean | Yes | true = locked, false = unlocked |

**Returns**: `{ id, name, locked }`
