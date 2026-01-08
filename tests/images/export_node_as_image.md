# Test Case: export_node_as_image

## Command
`export_node_as_image`

## Description
Exports a node as a PNG image and returns the base64-encoded image data. Supports scale factor for higher resolution exports.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of node to export (colon format) |
| `scale` | number | No | 1 | Export scale factor (1 = 100%, 2 = 200%, etc.) |

**Note:** Format is always PNG. Scale values less than 1 will reduce resolution.

## Expected Response

```json
{
  "nodeId": "123:456",
  "format": "PNG",
  "scale": 2,
  "mimeType": "image/png",
  "imageData": "iVBORw0KGgoAAAANSUhEUgAA..."
}
```

---

## Test Scenarios

### Test 1: Export Node at Default Scale (1x)

**Purpose:** Verify basic export at default scale.

**Prerequisites:**
1. Create a rectangle or frame with some content
2. Note the node's ID

**Command:**
```javascript
{
  command: "export_node_as_image",
  params: {
    nodeId: "NODE_ID"
  }
}
```

**Expected Result:**
- `format` equals "PNG"
- `scale` equals 1
- `mimeType` equals "image/png"
- `imageData` is a valid base64 string

**Verification Steps:**
1. Check response contains all fields
2. Verify `imageData` is non-empty base64
3. Optionally decode and verify image

---

### Test 2: Export Node at 2x Scale

**Purpose:** Verify higher resolution export.

**Command:**
```javascript
{
  command: "export_node_as_image",
  params: {
    nodeId: "NODE_ID",
    scale: 2
  }
}
```

**Expected Result:**
- `scale` equals 2
- Image dimensions doubled (compared to 1x)
- `imageData` is larger than 1x export

---

### Test 3: Export Node at 3x Scale

**Purpose:** Verify 3x scale export.

**Command:**
```javascript
{
  command: "export_node_as_image",
  params: {
    nodeId: "NODE_ID",
    scale: 3
  }
}
```

**Expected Result:**
- `scale` equals 3
- Image dimensions tripled

---

### Test 4: Export Node at 0.5x Scale

**Purpose:** Verify reduced resolution export.

**Command:**
```javascript
{
  command: "export_node_as_image",
  params: {
    nodeId: "NODE_ID",
    scale: 0.5
  }
}
```

**Expected Result:**
- `scale` equals 0.5
- Image dimensions halved
- Smaller file size

---

### Test 5: Export Rectangle Node

**Purpose:** Verify export of simple rectangle.

**Prerequisites:**
- Create a rectangle with solid fill

**Command:**
```javascript
{
  command: "export_node_as_image",
  params: {
    nodeId: "RECTANGLE_ID",
    scale: 1
  }
}
```

**Expected Result:**
- PNG export of rectangle
- Dimensions match rectangle size

---

### Test 6: Export Frame Node

**Purpose:** Verify export of frame with children.

**Prerequisites:**
- Create a frame with multiple child elements

**Command:**
```javascript
{
  command: "export_node_as_image",
  params: {
    nodeId: "FRAME_ID",
    scale: 1
  }
}
```

**Expected Result:**
- PNG includes all frame contents
- Children visible in export

---

### Test 7: Export Text Node

**Purpose:** Verify export of text element.

**Prerequisites:**
- Create a text node

**Command:**
```javascript
{
  command: "export_node_as_image",
  params: {
    nodeId: "TEXT_NODE_ID",
    scale: 2
  }
}
```

**Expected Result:**
- Text rendered as PNG
- Text crisp at 2x scale

---

### Test 8: Export Node with Transparency

**Purpose:** Verify PNG alpha channel.

**Prerequisites:**
- Create a node with semi-transparent fill

**Command:**
```javascript
{
  command: "export_node_as_image",
  params: {
    nodeId: "TRANSPARENT_NODE_ID",
    scale: 1
  }
}
```

**Expected Result:**
- PNG preserves transparency
- Alpha channel intact

---

### Test 9: Export Node with Effects

**Purpose:** Verify effects are included in export.

**Prerequisites:**
- Create a node with drop shadow or blur

**Command:**
```javascript
{
  command: "export_node_as_image",
  params: {
    nodeId: "NODE_WITH_EFFECTS_ID",
    scale: 1
  }
}
```

**Expected Result:**
- Effects visible in exported image
- Shadow/blur rendered correctly

---

### Test 10: Export Large Node

**Purpose:** Verify export of large dimensions.

**Prerequisites:**
- Create a large frame (e.g., 1920x1080)

**Command:**
```javascript
{
  command: "export_node_as_image",
  params: {
    nodeId: "LARGE_FRAME_ID",
    scale: 1
  }
}
```

**Expected Result:**
- Large image exported successfully
- `imageData` is substantial size

---

### Test 11: Export Node at Very High Scale

**Purpose:** Verify high resolution export.

**Command:**
```javascript
{
  command: "export_node_as_image",
  params: {
    nodeId: "NODE_ID",
    scale: 4
  }
}
```

**Expected Result:**
- 4x resolution export
- Very large base64 string

---

### Test 12: Compare Different Scale Outputs

**Purpose:** Verify scale affects output size.

**Commands (execute sequentially):**
```javascript
{ command: "export_node_as_image", params: { nodeId: "NODE_ID", scale: 1 } }
{ command: "export_node_as_image", params: { nodeId: "NODE_ID", scale: 2 } }
{ command: "export_node_as_image", params: { nodeId: "NODE_ID", scale: 3 } }
```

**Expected Result:**
- Each scale produces different size output
- 2x should be ~4x larger than 1x (quadratic)
- 3x should be ~9x larger than 1x

---

### Test 13: Missing nodeId (Error Case)

**Purpose:** Verify error when nodeId is missing.

**Command:**
```javascript
{
  command: "export_node_as_image",
  params: {
    scale: 2
  }
}
```

**Expected Result:**
- Error: "Missing nodeId parameter"

---

### Test 14: Non-Existent Node (Error Case)

**Purpose:** Verify error for invalid node ID.

**Command:**
```javascript
{
  command: "export_node_as_image",
  params: {
    nodeId: "999:999"
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 999:999"

---

### Test 15: Node Without Export Support (Error Case)

**Purpose:** Verify error for non-exportable nodes.

**Prerequisites:**
- Get ID of a PAGE node (pages can't be exported directly)

**Command:**
```javascript
{
  command: "export_node_as_image",
  params: {
    nodeId: "PAGE_NODE_ID"
  }
}
```

**Expected Result:**
- Error: "Node does not support exporting: PAGE_NODE_ID"

---

### Test 16: Export and Verify Base64 Format

**Purpose:** Verify base64 can be decoded.

**Command:**
```javascript
{
  command: "export_node_as_image",
  params: {
    nodeId: "NODE_ID",
    scale: 1
  }
}
```

**Verification (in test script):**
```javascript
// Verify base64 is valid
const buffer = Buffer.from(result.imageData, 'base64');
// Check PNG signature (first 8 bytes)
const pngSignature = buffer.slice(0, 8).toString('hex');
// Should be: 89504e470d0a1a0a
console.log('PNG signature valid:', pngSignature === '89504e470d0a1a0a');
```

---

## Sample Test Script

```javascript
/**
 * Test: export_node_as_image command
 * Prerequisites: Figma plugin connected, channel ID obtained
 */

const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdNodeId = null;
let phase = 'create';
let currentTest = 0;

ws.on('open', () => {
  console.log('Connected to Figma MCP Extended');

  // Join channel
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  // Wait for join, then create a test node
  setTimeout(() => {
    console.log('Creating frame for export test...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_frame",
        params: {
          x: 0, y: 0, width: 200, height: 100,
          name: "Export Test Frame",
          fillColor: { r: 0.2, g: 0.4, b: 0.8, a: 1 }
        },
        commandId: "create_frame"
      }
    }));
  }, 2000);
});

const scaleTests = [
  { name: "Default scale (1x)", scale: 1 },
  { name: "2x scale", scale: 2 },
  { name: "3x scale", scale: 3 },
  { name: "0.5x scale", scale: 0.5 },
  { name: "4x scale", scale: 4 }
];

const exportResults = [];

function runExportTest() {
  if (currentTest >= scaleTests.length) {
    console.log('\n=== All export tests complete ===');

    // Compare sizes
    console.log('\nExport size comparison:');
    exportResults.forEach(r => {
      console.log(`  ${r.name}: ${r.dataLength} bytes`);
    });

    // Test error case
    console.log('\nTesting error case (invalid node ID)...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "export_node_as_image",
        params: { nodeId: "999:999" },
        commandId: "error_test"
      }
    }));

    setTimeout(() => ws.close(), 3000);
    return;
  }

  const test = scaleTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "export_node_as_image",
      params: {
        nodeId: createdNodeId,
        scale: test.scale
      },
      commandId: `export_${currentTest}`
    }
  }));
}

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  // Skip system messages and echo
  if (parsed.type === 'system') {
    if (parsed.message && parsed.message.includes('Joined')) {
      console.log('Channel joined successfully');
    }
    return;
  }

  if (parsed.sender === 'You') return;

  // Handle result
  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;

    if (result) {
      if (phase === 'create') {
        createdNodeId = result.id;
        console.log('Created frame:', createdNodeId);
        phase = 'export';
        setTimeout(() => runExportTest(), 500);
      } else if (phase === 'export') {
        console.log('Export result:');
        console.log('  Node ID:', result.nodeId);
        console.log('  Format:', result.format);
        console.log('  Scale:', result.scale);
        console.log('  MIME Type:', result.mimeType);
        console.log('  Data length:', result.imageData ? result.imageData.length : 0, 'chars');

        // Verify PNG signature
        if (result.imageData) {
          const buffer = Buffer.from(result.imageData, 'base64');
          const signature = buffer.slice(0, 8).toString('hex');
          const isValidPng = signature === '89504e470d0a1a0a';
          console.log('  Valid PNG:', isValidPng ? '✓' : '✗');

          exportResults.push({
            name: scaleTests[currentTest].name,
            scale: result.scale,
            dataLength: result.imageData.length
          });

          // Optionally save first export to file
          if (currentTest === 0) {
            const outputPath = path.join(__dirname, 'export_test_output.png');
            fs.writeFileSync(outputPath, buffer);
            console.log('  Saved to:', outputPath);
          }
        }

        currentTest++;
        setTimeout(() => runExportTest(), 500);
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

- [ ] Export at default scale (1x) works
- [ ] Export at 2x scale works
- [ ] Export at 3x scale works
- [ ] Export at fractional scale (0.5x) works
- [ ] Export at high scale (4x) works
- [ ] Export rectangle nodes works
- [ ] Export frame nodes works (includes children)
- [ ] Export text nodes works
- [ ] Transparency preserved in PNG
- [ ] Effects (shadows, blur) included
- [ ] Large node export works
- [ ] Scale affects output dimensions correctly
- [ ] Response contains nodeId
- [ ] Response contains format "PNG"
- [ ] Response contains scale value
- [ ] Response contains mimeType "image/png"
- [ ] Response contains valid base64 imageData
- [ ] Base64 decodes to valid PNG (correct signature)
- [ ] Error for missing nodeId
- [ ] Error for non-existent node
- [ ] Error for non-exportable node types
