# Test Case: set_image_fill

## Command
`set_image_fill`

## Description
Sets an image fill on an existing node. Supports both URL and base64 image sources. Replaces any existing fills with the image fill.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of node to apply image fill (colon format) |
| `imageUrl` | string | No* | - | URL to fetch image from |
| `imageBase64` | string | No* | - | Base64-encoded image data |
| `scaleMode` | string | No | "FILL" | Image scaling: "FILL", "FIT", "CROP", or "TILE" |

**Note:** Either `imageUrl` OR `imageBase64` must be provided (not both required, but at least one).

## Expected Response

```json
{
  "id": "123:456",
  "name": "Rectangle",
  "imageHash": "a1b2c3d4e5f6...",
  "scaleMode": "FILL"
}
```

---

## Test Scenarios

### Test 1: Set Image Fill from URL

**Purpose:** Verify setting image from a URL.

**Prerequisites:**
1. Create a rectangle or frame node
2. Note the node's ID

**Command:**
```javascript
{
  command: "set_image_fill",
  params: {
    nodeId: "RECTANGLE_ID",
    imageUrl: "https://picsum.photos/200/200"
  }
}
```

**Expected Result:**
- Node fills replaced with image
- `imageHash` is a non-empty string
- `scaleMode` equals "FILL" (default)

**Verification Steps:**
1. Check response contains `imageHash`
2. Visually confirm image appears on node

---

### Test 2: Set Image Fill from Base64

**Purpose:** Verify setting image from base64 data.

**Command:**
```javascript
{
  command: "set_image_fill",
  params: {
    nodeId: "NODE_ID",
    imageBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  }
}
```

**Expected Result:**
- Image decoded and applied as fill
- `imageHash` returned

---

### Test 3: Set Image Fill with FILL Scale Mode

**Purpose:** Verify FILL scale mode (default).

**Command:**
```javascript
{
  command: "set_image_fill",
  params: {
    nodeId: "NODE_ID",
    imageUrl: "https://picsum.photos/400/300",
    scaleMode: "FILL"
  }
}
```

**Expected Result:**
- Image fills entire node, may crop edges
- `scaleMode` equals "FILL"

---

### Test 4: Set Image Fill with FIT Scale Mode

**Purpose:** Verify FIT scale mode.

**Command:**
```javascript
{
  command: "set_image_fill",
  params: {
    nodeId: "NODE_ID",
    imageUrl: "https://picsum.photos/400/300",
    scaleMode: "FIT"
  }
}
```

**Expected Result:**
- Image fits within node, may have empty space
- `scaleMode` equals "FIT"

---

### Test 5: Set Image Fill with CROP Scale Mode

**Purpose:** Verify CROP scale mode.

**Command:**
```javascript
{
  command: "set_image_fill",
  params: {
    nodeId: "NODE_ID",
    imageUrl: "https://picsum.photos/400/300",
    scaleMode: "CROP"
  }
}
```

**Expected Result:**
- Image cropped to fit node
- `scaleMode` equals "CROP"

---

### Test 6: Set Image Fill with TILE Scale Mode

**Purpose:** Verify TILE scale mode.

**Command:**
```javascript
{
  command: "set_image_fill",
  params: {
    nodeId: "NODE_ID",
    imageUrl: "https://picsum.photos/50/50",
    scaleMode: "TILE"
  }
}
```

**Expected Result:**
- Image tiled/repeated across node
- `scaleMode` equals "TILE"

---

### Test 7: Set Image Fill on Frame

**Purpose:** Verify image fill works on frame nodes.

**Prerequisites:**
- Create a frame node

**Command:**
```javascript
{
  command: "set_image_fill",
  params: {
    nodeId: "FRAME_ID",
    imageUrl: "https://picsum.photos/300/200"
  }
}
```

**Expected Result:**
- Frame background shows image
- Returns frame ID and imageHash

---

### Test 8: Replace Existing Image Fill

**Purpose:** Verify existing fills are replaced.

**Prerequisites:**
- Node with existing solid color fill

**Commands (execute sequentially):**
```javascript
// First set a color fill
{ command: "set_fill_color", params: { nodeId: "NODE_ID", r: 1, g: 0, b: 0, a: 1 } }

// Then set image fill
{ command: "set_image_fill", params: { nodeId: "NODE_ID", imageUrl: "https://picsum.photos/200/200" } }
```

**Expected Result:**
- Solid color replaced by image
- Only image fill remains

---

### Test 9: Missing nodeId (Error Case)

**Purpose:** Verify error when nodeId is missing.

**Command:**
```javascript
{
  command: "set_image_fill",
  params: {
    imageUrl: "https://picsum.photos/200/200"
  }
}
```

**Expected Result:**
- Error: "Missing nodeId parameter"

---

### Test 10: Missing Image Source (Error Case)

**Purpose:** Verify error when neither imageUrl nor imageBase64 provided.

**Command:**
```javascript
{
  command: "set_image_fill",
  params: {
    nodeId: "NODE_ID"
  }
}
```

**Expected Result:**
- Error: "Either imageUrl or imageBase64 must be provided"

---

### Test 11: Non-Existent Node (Error Case)

**Purpose:** Verify error handling for invalid node ID.

**Command:**
```javascript
{
  command: "set_image_fill",
  params: {
    nodeId: "999:999",
    imageUrl: "https://picsum.photos/200/200"
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 999:999"

---

### Test 12: Node Without Fills Support (Error Case)

**Purpose:** Verify error for nodes that don't support fills.

**Prerequisites:**
- Get ID of a node type that doesn't support fills (e.g., PAGE)

**Command:**
```javascript
{
  command: "set_image_fill",
  params: {
    nodeId: "PAGE_NODE_ID",
    imageUrl: "https://picsum.photos/200/200"
  }
}
```

**Expected Result:**
- Error: "Node does not support fills: PAGE_NODE_ID"

---

### Test 13: Invalid Image URL (Error Case)

**Purpose:** Verify error for unreachable image URL.

**Command:**
```javascript
{
  command: "set_image_fill",
  params: {
    nodeId: "NODE_ID",
    imageUrl: "https://invalid-domain-12345.com/image.png"
  }
}
```

**Expected Result:**
- Error related to image fetch failure

---

### Test 14: Base64 Without Data URI Prefix

**Purpose:** Verify base64 works with or without data URI prefix.

**Command:**
```javascript
{
  command: "set_image_fill",
  params: {
    nodeId: "NODE_ID",
    imageBase64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  }
}
```

**Expected Result:**
- Image applied successfully
- Prefix stripping handled correctly

---

## Sample Test Script

```javascript
/**
 * Test: set_image_fill command
 * Prerequisites: Figma plugin connected, channel ID obtained
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdRectId = null;
let phase = 'create';
let currentTest = 0;

ws.on('open', () => {
  console.log('Connected to Figma MCP Extended');

  // Join channel
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  // Wait for join, then create rectangle
  setTimeout(() => {
    console.log('Creating rectangle for image fill test...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_rectangle",
        params: {
          x: 0, y: 0, width: 200, height: 200,
          name: "Image Fill Test"
        },
        commandId: "create_rect"
      }
    }));
  }, 2000);
});

const scaleModes = ["FILL", "FIT", "CROP", "TILE"];

function runImageFillTest() {
  if (currentTest >= scaleModes.length) {
    console.log('\n=== All image fill tests complete ===');

    // Test error case
    console.log('\nTesting error case (missing image source)...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "set_image_fill",
        params: { nodeId: createdRectId },
        commandId: "error_test"
      }
    }));

    setTimeout(() => ws.close(), 5000);
    return;
  }

  const scaleMode = scaleModes[currentTest];
  console.log(`\nTest ${currentTest + 1}: Scale mode ${scaleMode}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_image_fill",
      params: {
        nodeId: createdRectId,
        imageUrl: `https://picsum.photos/200/200?random=${currentTest}`,
        scaleMode: scaleMode
      },
      commandId: `image_fill_${currentTest}`
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
        createdRectId = result.id;
        console.log('Created rectangle:', createdRectId);
        phase = 'image_fill';
        setTimeout(() => runImageFillTest(), 500);
      } else if (phase === 'image_fill') {
        console.log('Image fill result:');
        console.log('  ID:', result.id);
        console.log('  Image Hash:', result.imageHash);
        console.log('  Scale Mode:', result.scaleMode);

        if (result.imageHash) {
          console.log('  ✓ Image fill applied');
        } else {
          console.log('  ✗ No image hash returned');
        }

        currentTest++;
        setTimeout(() => runImageFillTest(), 1000);
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

- [ ] Image fill from URL works
- [ ] Image fill from base64 works
- [ ] FILL scale mode works
- [ ] FIT scale mode works
- [ ] CROP scale mode works
- [ ] TILE scale mode works
- [ ] Works on rectangle nodes
- [ ] Works on frame nodes
- [ ] Replaces existing fills
- [ ] Base64 with data URI prefix works
- [ ] Base64 without prefix works
- [ ] Error for missing nodeId
- [ ] Error for missing image source
- [ ] Error for non-existent node
- [ ] Error for node without fills support
- [ ] Response contains imageHash
- [ ] Response contains scaleMode
