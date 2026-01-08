# Connections & Reactions

Commands for working with interactive connections and reactions.

---

## `get_reactions`

Get interactive reactions from nodes (deep search).

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeIds` | string[] | Yes | Array of node IDs to search |

**Returns**:
```json
{
  "nodesCount": 5,
  "nodesWithReactions": 3,
  "nodes": [
    {
      "id": "...",
      "name": "Button",
      "type": "INSTANCE",
      "hasReactions": true,
      "reactions": [...],
      "path": "Frame > Card > Button"
    }
  ]
}
```

---

## `set_default_connector`

Set or find the default connector for creating connections.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `connectorId` | string | No | Connector ID (or auto-find) |

**Returns**: `{ success, message, connectorId }`

---

## `create_connections`

Create connector lines between nodes.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `connections` | array | Yes | Array of `{ startNodeId, endNodeId, text }` |

**Returns**: `{ success, count, connections }`
