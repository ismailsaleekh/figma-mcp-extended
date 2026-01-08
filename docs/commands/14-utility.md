# Utility

Utility commands for notifications and general operations.

---

## `notify`

Display a notification message in Figma.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message` | string | Yes | Message to display |

**Returns**: None (displays notification in Figma UI)

**Example**:
```json
{
  "command": "notify",
  "params": {
    "message": "Operation completed successfully!"
  }
}
```
