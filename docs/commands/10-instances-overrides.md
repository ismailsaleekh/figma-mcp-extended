# Instances & Overrides

Commands for working with component instance overrides.

---

## `get_instance_overrides`

Get override information from a component instance.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `instanceNodeId` | string | No | Instance ID (or use selection) |

**Returns**: `{ success, sourceInstanceId, mainComponentId, overridesCount }`

---

## `set_instance_overrides`

Apply overrides from one instance to others.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `targetNodeIds` | string[] | Yes | Array of target instance IDs |
| `sourceInstanceId` | string | Yes | Source instance to copy from |

**Returns**: `{ success, message, totalCount, results }`
