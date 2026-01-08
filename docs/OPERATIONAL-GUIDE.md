# Operational Guide

Mandatory procedures for working with Figma designs via the Figma MCP Extended WebSocket.

---

## Rules

1. **WebSocket Only** - No MCP tools, no Figma REST API, no manual selection
2. **Use Node IDs** - Always target nodes by ID, never rely on UI selection
3. **Convert Node IDs** - URL uses dash (`4371-50004`), API uses colon (`4371:50004`) → [See format](reference/node-id-format.md)
4. **Save Scripts** - All `.cjs` files go in `/ai-context/figma-parse/`
5. **Cleanup** - Always close connections and clear timeouts

---

## Connection Template

```javascript
const WebSocket = require('ws');
const fs = require('fs');

const CHANNEL_ID = "REPLACE_WITH_CHANNEL_ID";
const ws = new WebSocket('ws://localhost:3055');
const results = [];

ws.on('open', () => {
  console.log('Connected');
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));
  setTimeout(startAnalysis, 2000);
});

function startAnalysis() {
  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "get_node_info",
      commandId: "cmd_" + Date.now(),
      params: { nodeId: "4371:50004" }  // Colon format!
    }
  }));
}

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  // Skip system/echo messages
  if (parsed.type === 'system' || parsed.sender === 'You') return;

  // Handle results
  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;
    if (result) {
      results.push(result);
      console.log('Result received');
      cleanup();
    }
  }
});

ws.on('error', (err) => { console.error('Error:', err); cleanup(); });

// Timeout safety
const timeout = setTimeout(cleanup, 20000);

function cleanup() {
  clearTimeout(timeout);
  if (results.length > 0) {
    fs.writeFileSync(`results_${Date.now()}.json`, JSON.stringify(results, null, 2));
  }
  ws.close();
  console.log('Done');
}
```

---

## Chunking

**When to use**: 50+ child nodes, 100+ components, deep nesting (5+ levels), or timeouts.

### Sequential Pattern

```javascript
const frameIds = ["123:456", "123:457", "123:458"];
let index = 0;

function analyzeNext() {
  if (index >= frameIds.length) { ws.close(); return; }

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "get_node_info",
      commandId: "frame_" + index,
      params: { nodeId: frameIds[index] }
    }
  }));
}

ws.on('message', (data) => {
  const parsed = JSON.parse(data);
  if (parsed.type === 'broadcast' && parsed.sender === 'User' && parsed.message.result) {
    results.push(parsed.message.result);
    index++;
    analyzeNext();
  }
});

analyzeNext();
```

**Other strategies**: Pagination (batch node IDs in groups of 10), Depth-limited traversal (stop at maxDepth).

---

## File Standards

| Item | Value |
|------|-------|
| **Naming** | `analyze_[purpose]_[timestamp].cjs` |
| **Location** | `/ai-context/figma-parse/` |
| **Results** | `/ai-context/figma-parse/results/` |

---

## Timeouts

| Query Type | Duration |
|------------|----------|
| Simple (single node) | 15-20s |
| Complex (multiple nodes) | 25-30s |
| Large (chunked) | 30-40s per chunk |
| **Maximum** | 40s |

**If timeout**: Reduce scope, use chunking, process sequentially. Don't just extend timeout.

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| `ECONNREFUSED 127.0.0.1:3055` | Plugin not running | Open Figma Desktop, run Figma MCP Extended plugin |
| No response to commands | Wrong channel ID | Get current channel ID from plugin UI |
| `Node not found` | Using dash format | Convert `4371-50004` → `4371:50004` |
| Query timeout | Too much data | Use chunking, reduce scope |

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `get_all_pages` | List all pages |
| `get_node_info` | Get node details |
| `get_nodes_info` | Get multiple nodes |
| `scan_text_nodes` | Extract text content |
| `scan_nodes_by_types` | Find nodes by type |
| `get_complete_file_data` | Full file export |
| `export_node_as_image` | Export as PNG |

### Workflow Checklist

1. ☐ Create `.cjs` in `/ai-context/figma-parse/`
2. ☐ Get channel ID from user
3. ☐ Connect and join channel
4. ☐ Convert node IDs (dash → colon)
5. ☐ Execute commands (chunk if needed)
6. ☐ Save results
7. ☐ Close connection

---

**API Reference**: [INDEX.md](INDEX.md)
