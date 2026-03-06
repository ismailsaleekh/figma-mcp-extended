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

Filter these out — they are not results. Check `sender === "You"` to skip.

### 2. Result Message (the actual response)

```json
{
  "type": "broadcast",
  "sender": "User",
  "channel": "channel_name",
  "message": {
    "commandId": "unique_identifier",
    "result": { ... }
  }
}
```

The `commandId` in the response matches the `commandId` you sent in the request. Use this to correlate requests with responses.

---

## Parallel Commands

Multiple commands can be in-flight simultaneously. Each response includes the `commandId` from the original request, so clients can match them correctly regardless of arrival order.

Commands are executed **serially** inside the plugin (a queue ensures each command completes before the next starts), but multiple clients can send commands in parallel — they pipeline through the queue and each response is routed back by its `commandId`.

```javascript
// Example: two commands in parallel using the websocket.cjs utility
const [frameInfo, textInfo] = await Promise.all([
  sendCommand('get_node_info', { nodeId: '1:2' }),
  sendCommand('get_node_info', { nodeId: '3:4' }),
]);
```

---

## Error Handling

Errors are returned in the result message:

```json
{
  "type": "broadcast",
  "sender": "User",
  "channel": "channel_name",
  "message": {
    "commandId": "unique_identifier",
    "error": "Error description",
    "result": {}
  }
}
```

Common errors:
- `"Missing nodeId parameter"` - Required parameter not provided
- `"Node not found with ID: ..."` - Invalid or deleted node ID
- `"Node is not a ..."` - Wrong node type for operation
