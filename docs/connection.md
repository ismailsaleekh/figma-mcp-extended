# Connection Guide

How to connect to the Figma MCP Extended Plugin via WebSocket.

---

## WebSocket Connection

```javascript
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:3055');
```

**Specifications**:
- **Protocol**: WebSocket
- **Host**: localhost
- **Port**: 3055 (default)
- **Architecture**: Channel-based messaging

---

## Channel Join

After connecting, join a channel:

```json
{
  "type": "join",
  "channel": "CHANNEL_ID"
}
```

**Note**: Channel IDs are session-specific (e.g., "aenui0jn", "dfsqjj1j"). Obtain the current channel ID from the plugin UI before connecting.

---

## Command Message Structure

```json
{
  "type": "message",
  "channel": "channel_name",
  "message": {
    "command": "command_name",
    "commandId": "unique_identifier",
    "params": {
      "nodeId": "node_id_or_empty_for_selection"
    }
  }
}
```

| Field | Description |
|-------|-------------|
| `type` | Always `"message"` for commands |
| `channel` | The channel you joined |
| `message.command` | Command name (e.g., `"create_rectangle"`) |
| `message.commandId` | Unique ID to match response |
| `message.params` | Command parameters |

---

## Response Pattern

When you send a command, you receive **two broadcast messages**:

### 1. Echo Message (your command echoed back)

```json
{
  "type": "broadcast",
  "sender": "You",
  "channel": "channel_name",
  "message": { ... }
}
```

### 2. Result Message (the actual response)

```json
{
  "type": "broadcast",
  "sender": "User",
  "channel": "channel_name",
  "message": {
    "result": { ... }
  }
}
```

**Tip**: Use the `commandId` to correlate requests with responses when sending multiple commands.

---

## Error Handling

Errors are returned in the result message:

```json
{
  "type": "broadcast",
  "sender": "User",
  "channel": "channel_name",
  "message": {
    "result": {
      "error": "Error description"
    }
  }
}
```

Common errors:
- `"Missing nodeId parameter"` - Required parameter not provided
- `"Node not found with ID: ..."` - Invalid or deleted node ID
- `"Node is not a ..."` - Wrong node type for operation
