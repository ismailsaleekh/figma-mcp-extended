# Node ID Format

Node IDs in Figma have two formats. The API uses the **colon-separated** format.

## Formats

| Context | Format | Example |
|---------|--------|---------|
| URL (browser) | Dash-separated | `node-id=4371-50004` |
| API (commands) | Colon-separated | `"nodeId": "4371:50004"` |

## Critical

Always use **colon format** when sending commands:

```json
{
  "command": "get_node_info",
  "params": {
    "nodeId": "4371:50004"
  }
}
```

## Converting from URL

When copying a node ID from Figma's URL:

```
https://www.figma.com/file/abc123/My-File?node-id=4371-50004
                                                    ↓
                                          "nodeId": "4371:50004"
```

Replace the dash (`-`) with a colon (`:`).
