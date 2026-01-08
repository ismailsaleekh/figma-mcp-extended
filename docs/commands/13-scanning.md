# Scanning

Commands for finding nodes by type.

---

## `scan_nodes_by_types`

Find all nodes of specific types within a hierarchy.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Root node ID to scan |
| `types` | string[] | Yes | Node types to find |

**Node Types**:
- `FRAME`, `GROUP`, `SECTION`
- `RECTANGLE`, `ELLIPSE`, `POLYGON`, `LINE`, `VECTOR`, `STAR`
- `TEXT`
- `COMPONENT`, `COMPONENT_SET`, `INSTANCE`
- `BOOLEAN_OPERATION`
- `SLICE`

**Returns**:
```json
{
  "success": true,
  "count": 25,
  "matchingNodes": [
    {
      "id": "...",
      "name": "...",
      "type": "FRAME",
      "bbox": { "x": 0, "y": 0, "width": 100, "height": 50 }
    }
  ],
  "searchedTypes": ["FRAME", "TEXT"]
}
```

**Example**:
```json
{
  "command": "scan_nodes_by_types",
  "params": {
    "nodeId": "123:456",
    "types": ["FRAME", "TEXT", "COMPONENT"]
  }
}
```
