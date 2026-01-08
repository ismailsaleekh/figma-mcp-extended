# Test Case: scan_text_nodes

## Command
`scan_text_nodes`

## Description
Scans a node hierarchy for text nodes, extracting detailed text information with optional chunked processing for large structures.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of node to scan (colon format) |
| `useChunking` | boolean | No | `true` | Enable chunked processing for large structures |
| `chunkSize` | number | No | `10` | Number of nodes per chunk |

## Expected Response (Chunked)

```json
{
  "success": true,
  "totalNodes": 25,
  "processedNodes": 25,
  "chunks": 3,
  "textNodes": [
    {
      "id": "123:456",
      "name": "Heading",
      "type": "TEXT",
      "characters": "Welcome",
      "fontSize": 24,
      "fontFamily": "Inter",
      "fontStyle": "Bold",
      "x": 100,
      "y": 50,
      "width": 200,
      "height": 30,
      "path": "Frame > Card > Heading",
      "depth": 2
    }
  ],
  "commandId": "cmd_123"
}
```

## Expected Response (Non-Chunked)

```json
{
  "success": true,
  "count": 5,
  "textNodes": [...],
  "commandId": "cmd_123"
}
```

## TextNodeInfo Structure

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Node ID |
| `name` | string | Node name |
| `type` | string | Always "TEXT" |
| `characters` | string | Text content |
| `fontSize` | number | Font size in pixels |
| `fontFamily` | string | Font family name |
| `fontStyle` | string | Font style (Regular, Bold, etc.) |
| `x` | number | X position |
| `y` | number | Y position |
| `width` | number | Node width |
| `height` | number | Node height |
| `path` | string | Hierarchy path (e.g., "Frame > Card > Text") |
| `depth` | number | Nesting depth level |

---

## Test Scenarios

### Test 1: Basic Text Node Scan

**Purpose:** Verify scanning a frame with text nodes.

**Prerequisites:**
1. Create a frame with several text nodes
2. Note the frame ID

**Command:**
```javascript
{
  command: "scan_text_nodes",
  params: {
    nodeId: "FRAME_ID"
  }
}
```

**Expected Result:**
- Returns array of TextNodeInfo objects
- Each text node has characters, fontSize, fontFamily
- `success` is true

---

### Test 2: Scan Without Chunking

**Purpose:** Verify non-chunked mode returns simpler response.

**Command:**
```javascript
{
  command: "scan_text_nodes",
  params: {
    nodeId: "FRAME_ID",
    useChunking: false
  }
}
```

**Expected Result:**
- Response has `count` instead of `totalNodes`
- No `chunks` or `processedNodes` fields
- All text nodes returned in single batch

---

### Test 3: Scan with Custom Chunk Size

**Purpose:** Verify custom chunk size is respected.

**Command:**
```javascript
{
  command: "scan_text_nodes",
  params: {
    nodeId: "FRAME_ID",
    useChunking: true,
    chunkSize: 5
  }
}
```

**Expected Result:**
- Nodes processed in chunks of 5
- `chunks` count reflects chunk size

---

### Test 4: Scan Empty Frame

**Purpose:** Verify scanning frame with no text nodes.

**Prerequisites:**
- Frame containing only rectangles or shapes

**Command:**
```javascript
{
  command: "scan_text_nodes",
  params: {
    nodeId: "EMPTY_FRAME_ID"
  }
}
```

**Expected Result:**
- `success` is true
- `textNodes` is empty array
- `totalNodes` or `count` is 0

---

### Test 5: Scan Nested Structure

**Purpose:** Verify deep hierarchy scanning.

**Prerequisites:**
- Frame with nested frames containing text at various depths

**Command:**
```javascript
{
  command: "scan_text_nodes",
  params: {
    nodeId: "NESTED_FRAME_ID"
  }
}
```

**Expected Result:**
- All text nodes found at all depths
- `path` reflects full hierarchy
- `depth` values vary by nesting level

---

### Test 6: Scan Single Text Node

**Purpose:** Verify scanning a text node directly.

**Command:**
```javascript
{
  command: "scan_text_nodes",
  params: {
    nodeId: "TEXT_NODE_ID"
  }
}
```

**Expected Result:**
- Returns single text node info
- `count` or `totalNodes` is 1

---

### Test 7: Verify Text Content Extraction

**Purpose:** Verify characters field contains actual text.

**Prerequisites:**
- Text node with known content "Hello World"

**Command:**
```javascript
{
  command: "scan_text_nodes",
  params: {
    nodeId: "TEXT_NODE_ID"
  }
}
```

**Expected Result:**
- `characters` equals "Hello World"
- Content matches Figma text

---

### Test 8: Verify Font Information

**Purpose:** Verify font details are extracted.

**Prerequisites:**
- Text node with Inter Bold 24px

**Command:**
```javascript
{
  command: "scan_text_nodes",
  params: {
    nodeId: "STYLED_TEXT_ID"
  }
}
```

**Expected Result:**
- `fontFamily` equals "Inter"
- `fontStyle` equals "Bold"
- `fontSize` equals 24

---

### Test 9: Verify Position and Size

**Purpose:** Verify x, y, width, height are correct.

**Command:**
```javascript
{
  command: "scan_text_nodes",
  params: {
    nodeId: "TEXT_NODE_ID"
  }
}
```

**Expected Result:**
- `x` and `y` match node position
- `width` and `height` match node dimensions

---

### Test 10: Hidden Text Nodes Skipped

**Purpose:** Verify hidden nodes are not scanned.

**Prerequisites:**
- Frame with visible and hidden text nodes

**Command:**
```javascript
{
  command: "scan_text_nodes",
  params: {
    nodeId: "FRAME_WITH_HIDDEN_ID"
  }
}
```

**Expected Result:**
- Only visible text nodes returned
- Hidden text nodes not in results

---

### Test 11: Large Structure Scan

**Purpose:** Verify chunked processing for large structures.

**Prerequisites:**
- Frame with 50+ text nodes

**Command:**
```javascript
{
  command: "scan_text_nodes",
  params: {
    nodeId: "LARGE_FRAME_ID",
    useChunking: true,
    chunkSize: 10
  }
}
```

**Expected Result:**
- All text nodes found
- `chunks` equals ceil(totalNodes/10)
- Progress updates sent during scan

---

### Test 12: Scan Non-Existent Node (Error Case)

**Purpose:** Verify error for invalid node ID.

**Command:**
```javascript
{
  command: "scan_text_nodes",
  params: {
    nodeId: "999:999"
  }
}
```

**Expected Result:**
- Error: "Node with ID 999:999 not found"

---

### Test 13: Scan Entire Page

**Purpose:** Verify scanning current page for all text.

**Prerequisites:**
- Get page node ID from get_document_info

**Command:**
```javascript
{
  command: "scan_text_nodes",
  params: {
    nodeId: "PAGE_ID",
    useChunking: true,
    chunkSize: 20
  }
}
```

**Expected Result:**
- All text nodes on page found
- May return large array

---

## Sample Test Script

```javascript
/**
 * Test: scan_text_nodes command
 * Prerequisites: Figma plugin connected, channel ID obtained
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdFrameId = null;
let textNodeIds = [];
let phase = 'create_frame';

ws.on('open', () => {
  console.log('Connected to Figma MCP Extended');

  // Join channel
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  // Create frame with text nodes
  setTimeout(() => {
    console.log('Creating frame with text nodes...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_frame",
        params: {
          x: 0, y: 0, width: 400, height: 300,
          name: "Text Scan Test",
          layoutMode: "VERTICAL"
        },
        commandId: "create_frame"
      }
    }));
  }, 2000);
});

function createTextNodes() {
  const texts = ["Heading", "Subtitle", "Body text", "Footer"];
  let created = 0;

  texts.forEach((text, i) => {
    setTimeout(() => {
      ws.send(JSON.stringify({
        type: "message",
        channel: CHANNEL_ID,
        message: {
          command: "create_text",
          params: {
            text: text,
            x: 20, y: 20 + (i * 50),
            parentId: createdFrameId
          },
          commandId: `create_text_${i}`
        }
      }));
    }, i * 500);
  });
}

function runScanTest(useChunking) {
  console.log(`\nScanning with chunking=${useChunking}...`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "scan_text_nodes",
      params: {
        nodeId: createdFrameId,
        useChunking: useChunking,
        chunkSize: 2
      },
      commandId: `scan_${useChunking}`
    }
  }));
}

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  if (parsed.type === 'system') {
    if (parsed.message && parsed.message.includes('Joined')) {
      console.log('Channel joined successfully');
    }
    return;
  }

  if (parsed.sender === 'You') return;

  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;
    const commandId = parsed.message.commandId;

    if (result) {
      if (phase === 'create_frame') {
        createdFrameId = result.id;
        console.log('Created frame:', createdFrameId);
        phase = 'create_text';
        createTextNodes();

        setTimeout(() => {
          phase = 'scan_chunked';
          runScanTest(true);
        }, 3000);
      } else if (phase === 'scan_chunked') {
        console.log('Chunked scan result:');
        console.log('  Total Nodes:', result.totalNodes);
        console.log('  Processed:', result.processedNodes);
        console.log('  Chunks:', result.chunks);
        console.log('  Text Nodes Found:', result.textNodes?.length);

        if (result.textNodes) {
          result.textNodes.forEach(tn => {
            console.log(`    - "${tn.characters}" (${tn.fontFamily} ${tn.fontSize}px)`);
          });
        }

        phase = 'scan_no_chunk';
        runScanTest(false);
      } else if (phase === 'scan_no_chunk') {
        console.log('\nNon-chunked scan result:');
        console.log('  Count:', result.count);
        console.log('  Text Nodes:', result.textNodes?.length);

        console.log('\n=== Scan tests complete ===');
        ws.close();
      }
    }

    if (parsed.message.error) {
      console.log('Error:', parsed.message.error);
    }
  }
});

ws.on('close', () => {
  console.log('\nConnection closed');
});

ws.on('error', (err) => {
  console.error('WebSocket error:', err);
});

// Timeout safety
setTimeout(() => {
  ws.close();
}, 60000);
```

---

## Validation Checklist

- [ ] Basic scan returns text nodes
- [ ] Non-chunked mode works (useChunking: false)
- [ ] Custom chunk size respected
- [ ] Empty frame returns empty array
- [ ] Nested structures fully scanned
- [ ] Single text node can be scanned
- [ ] Characters field contains actual text
- [ ] Font family extracted correctly
- [ ] Font style extracted correctly
- [ ] Font size extracted correctly
- [ ] Position (x, y) correct
- [ ] Dimensions (width, height) correct
- [ ] Path shows hierarchy
- [ ] Depth reflects nesting level
- [ ] Hidden nodes are skipped
- [ ] Large structures handled with chunking
- [ ] Progress updates sent during chunked scan
- [ ] Error for non-existent node ID
- [ ] Response contains commandId
