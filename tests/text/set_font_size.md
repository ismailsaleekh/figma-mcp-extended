# Test Case: set_font_size

## Command
`set_font_size`

## Description
Sets the font size on a text node in pixels.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of text node to modify |
| `fontSize` | number | **Yes** | - | Font size in pixels (must be positive) |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Text",
  "fontSize": 24,
  "characters": "Hello World"
}
```

---

## Test Scenarios

### Test 1: Set Font Size to 24px

**Purpose:** Verify basic font size change.

**Prerequisites:**
- Create a text node, note its ID

**Command:**
```javascript
{
  command: "set_font_size",
  params: {
    nodeId: "TEXT_NODE_ID",
    fontSize: 24
  }
}
```

**Expected Result:**
- Text is 24 pixels
- `fontSize` equals 24

---

### Test 2: Set Small Font Size (12px)

**Purpose:** Verify small font size.

**Command:**
```javascript
{
  command: "set_font_size",
  params: {
    nodeId: "TEXT_NODE_ID",
    fontSize: 12
  }
}
```

**Expected Result:**
- Text is 12 pixels

---

### Test 3: Set Large Font Size (72px)

**Purpose:** Verify large font size.

**Command:**
```javascript
{
  command: "set_font_size",
  params: {
    nodeId: "TEXT_NODE_ID",
    fontSize: 72
  }
}
```

**Expected Result:**
- Text is 72 pixels (large heading)

---

### Test 4: Set Very Large Font Size (200px)

**Purpose:** Verify extra large font size.

**Command:**
```javascript
{
  command: "set_font_size",
  params: {
    nodeId: "TEXT_NODE_ID",
    fontSize: 200
  }
}
```

**Expected Result:**
- Text is 200 pixels

---

### Test 5: Set Decimal Font Size

**Purpose:** Verify decimal font size support.

**Command:**
```javascript
{
  command: "set_font_size",
  params: {
    nodeId: "TEXT_NODE_ID",
    fontSize: 16.5
  }
}
```

**Expected Result:**
- Font size set to 16.5px

---

### Test 6: Change Font Size Multiple Times

**Purpose:** Verify sequential size changes.

**Commands (execute sequentially):**
```javascript
{ command: "set_font_size", params: { nodeId: "NODE_ID", fontSize: 12 } }
{ command: "set_font_size", params: { nodeId: "NODE_ID", fontSize: 24 } }
{ command: "set_font_size", params: { nodeId: "NODE_ID", fontSize: 48 } }
```

**Expected Result:**
- Each size applied correctly
- Final size is 48px

---

### Test 7: Zero Font Size (Error Case)

**Purpose:** Verify error for zero size.

**Command:**
```javascript
{
  command: "set_font_size",
  params: {
    nodeId: "TEXT_NODE_ID",
    fontSize: 0
  }
}
```

**Expected Result:**
- Error: "fontSize must be a positive number"

---

### Test 8: Negative Font Size (Error Case)

**Purpose:** Verify error for negative size.

**Command:**
```javascript
{
  command: "set_font_size",
  params: {
    nodeId: "TEXT_NODE_ID",
    fontSize: -10
  }
}
```

**Expected Result:**
- Error: "fontSize must be a positive number"

---

### Test 9: Non-Text Node (Error Case)

**Purpose:** Verify error when applied to non-text node.

**Command:**
```javascript
{
  command: "set_font_size",
  params: {
    nodeId: "RECTANGLE_ID",
    fontSize: 24
  }
}
```

**Expected Result:**
- Error: "Node is not a TEXT node"

---

### Test 10: Missing fontSize (Error Case)

**Purpose:** Verify error for missing required parameter.

**Command:**
```javascript
{
  command: "set_font_size",
  params: {
    nodeId: "TEXT_NODE_ID"
  }
}
```

**Expected Result:**
- Error: "fontSize must be a positive number"

---

## Sample Test Script

```javascript
/**
 * Test: set_font_size command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdNodeId = null;
let phase = 'create';

const sizeTests = [
  { name: "12px (small)", fontSize: 12 },
  { name: "16px (body)", fontSize: 16 },
  { name: "24px (heading)", fontSize: 24 },
  { name: "48px (large)", fontSize: 48 },
  { name: "72px (display)", fontSize: 72 }
];

let currentTest = 0;

ws.on('open', () => {
  console.log('Connected');
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  setTimeout(() => {
    console.log('Creating test text node...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_text",
        params: { text: "Font Size Test", x: 0, y: 0 },
        commandId: "create_node"
      }
    }));
  }, 2000);
});

function runSizeTest() {
  if (currentTest >= sizeTests.length) {
    console.log('\n=== All font size tests complete ===');

    // Test error case
    console.log('\nTesting error case (invalid size)...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "set_font_size",
        params: { nodeId: createdNodeId, fontSize: -10 },
        commandId: "error_test"
      }
    }));

    setTimeout(() => ws.close(), 3000);
    return;
  }

  const test = sizeTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_font_size",
      params: { nodeId: createdNodeId, fontSize: test.fontSize },
      commandId: `size_${currentTest}`
    }
  }));
}

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;
    const error = parsed.message.error;

    if (result && phase === 'create') {
      createdNodeId = result.id;
      console.log('Created text node:', createdNodeId);
      phase = 'size';
      setTimeout(() => runSizeTest(), 500);
    } else if (result && phase === 'size') {
      console.log('  Font size:', result.fontSize);
      console.log('  ✓ Font size set successfully');

      currentTest++;
      setTimeout(() => runSizeTest(), 500);
    }

    if (error) {
      console.log('Error:', error);
    }
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 60000);
```

---

## Validation Checklist

- [ ] Small font size (12px) works
- [ ] Standard font size (16px) works
- [ ] Heading font size (24px) works
- [ ] Large font size (48px+) works
- [ ] Decimal font sizes work
- [ ] Font size can be changed multiple times
- [ ] Error for zero font size
- [ ] Error for negative font size
- [ ] Error for non-text node
- [ ] Error for missing fontSize
- [ ] Response contains `fontSize` value
- [ ] Text content preserved after size change
- [ ] Font size visible and correct in Figma
