# Test Case: set_text_alignment

## Command
`set_text_alignment`

## Description
Sets horizontal and/or vertical text alignment on a text node.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of text node to modify |
| `horizontalAlign` | string | No | - | "LEFT", "CENTER", "RIGHT", or "JUSTIFIED" |
| `verticalAlign` | string | No | - | "TOP", "CENTER", or "BOTTOM" |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Text",
  "textAlignHorizontal": "CENTER",
  "textAlignVertical": "CENTER"
}
```

---

## Test Scenarios

### Test 1: Set Horizontal Align to Left

**Purpose:** Verify left alignment.

**Prerequisites:**
- Create a text node, note its ID

**Command:**
```javascript
{
  command: "set_text_alignment",
  params: {
    nodeId: "TEXT_NODE_ID",
    horizontalAlign: "LEFT"
  }
}
```

**Expected Result:**
- Text aligned to the left
- `textAlignHorizontal` equals "LEFT"

---

### Test 2: Set Horizontal Align to Center

**Purpose:** Verify center alignment.

**Command:**
```javascript
{
  command: "set_text_alignment",
  params: {
    nodeId: "TEXT_NODE_ID",
    horizontalAlign: "CENTER"
  }
}
```

**Expected Result:**
- Text centered horizontally

---

### Test 3: Set Horizontal Align to Right

**Purpose:** Verify right alignment.

**Command:**
```javascript
{
  command: "set_text_alignment",
  params: {
    nodeId: "TEXT_NODE_ID",
    horizontalAlign: "RIGHT"
  }
}
```

**Expected Result:**
- Text aligned to the right

---

### Test 4: Set Horizontal Align to Justified

**Purpose:** Verify justified alignment.

**Prerequisites:**
- Create a text node with multiple lines

**Command:**
```javascript
{
  command: "set_text_alignment",
  params: {
    nodeId: "TEXT_NODE_ID",
    horizontalAlign: "JUSTIFIED"
  }
}
```

**Expected Result:**
- Text justified on both sides

---

### Test 5: Set Vertical Align to Top

**Purpose:** Verify top vertical alignment.

**Command:**
```javascript
{
  command: "set_text_alignment",
  params: {
    nodeId: "TEXT_NODE_ID",
    verticalAlign: "TOP"
  }
}
```

**Expected Result:**
- Text aligned to top
- `textAlignVertical` equals "TOP"

---

### Test 6: Set Vertical Align to Center

**Purpose:** Verify center vertical alignment.

**Command:**
```javascript
{
  command: "set_text_alignment",
  params: {
    nodeId: "TEXT_NODE_ID",
    verticalAlign: "CENTER"
  }
}
```

**Expected Result:**
- Text centered vertically

---

### Test 7: Set Vertical Align to Bottom

**Purpose:** Verify bottom vertical alignment.

**Command:**
```javascript
{
  command: "set_text_alignment",
  params: {
    nodeId: "TEXT_NODE_ID",
    verticalAlign: "BOTTOM"
  }
}
```

**Expected Result:**
- Text aligned to bottom

---

### Test 8: Set Both Alignments

**Purpose:** Verify both alignments set together.

**Command:**
```javascript
{
  command: "set_text_alignment",
  params: {
    nodeId: "TEXT_NODE_ID",
    horizontalAlign: "CENTER",
    verticalAlign: "CENTER"
  }
}
```

**Expected Result:**
- Text centered both horizontally and vertically

---

### Test 9: Change Alignment Multiple Times

**Purpose:** Verify alignment can be changed.

**Commands (execute sequentially):**
```javascript
{ command: "set_text_alignment", params: { nodeId: "NODE_ID", horizontalAlign: "LEFT" } }
{ command: "set_text_alignment", params: { nodeId: "NODE_ID", horizontalAlign: "CENTER" } }
{ command: "set_text_alignment", params: { nodeId: "NODE_ID", horizontalAlign: "RIGHT" } }
```

**Expected Result:**
- Each alignment applied correctly
- Final alignment is right

---

### Test 10: Non-Text Node (Error Case)

**Purpose:** Verify error when applied to non-text node.

**Command:**
```javascript
{
  command: "set_text_alignment",
  params: {
    nodeId: "RECTANGLE_ID",
    horizontalAlign: "CENTER"
  }
}
```

**Expected Result:**
- Error: "Node is not a TEXT node"

---

### Test 11: Non-Existent Node (Error Case)

**Purpose:** Verify error for invalid node ID.

**Command:**
```javascript
{
  command: "set_text_alignment",
  params: {
    nodeId: "999:999",
    horizontalAlign: "CENTER"
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 999:999"

---

## Sample Test Script

```javascript
/**
 * Test: set_text_alignment command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdNodeId = null;
let phase = 'create';

const alignTests = [
  { name: "Left", params: { horizontalAlign: "LEFT" } },
  { name: "Center", params: { horizontalAlign: "CENTER" } },
  { name: "Right", params: { horizontalAlign: "RIGHT" } },
  { name: "Justified", params: { horizontalAlign: "JUSTIFIED" } },
  { name: "Vertical Top", params: { verticalAlign: "TOP" } },
  { name: "Vertical Center", params: { verticalAlign: "CENTER" } },
  { name: "Vertical Bottom", params: { verticalAlign: "BOTTOM" } },
  { name: "Both Center", params: { horizontalAlign: "CENTER", verticalAlign: "CENTER" } }
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
        params: { text: "Text Alignment Test\nMultiple Lines", x: 0, y: 0 },
        commandId: "create_node"
      }
    }));
  }, 2000);
});

function runAlignTest() {
  if (currentTest >= alignTests.length) {
    console.log('\n=== All text alignment tests complete ===');
    ws.close();
    return;
  }

  const test = alignTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_text_alignment",
      params: { nodeId: createdNodeId, ...test.params },
      commandId: `align_${currentTest}`
    }
  }));
}

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;

    if (result && phase === 'create') {
      createdNodeId = result.id;
      console.log('Created text node:', createdNodeId);
      phase = 'align';
      setTimeout(() => runAlignTest(), 500);
    } else if (result && phase === 'align') {
      console.log('  Horizontal:', result.textAlignHorizontal);
      console.log('  Vertical:', result.textAlignVertical);
      console.log('  ✓ Alignment set successfully');

      currentTest++;
      setTimeout(() => runAlignTest(), 500);
    }
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 60000);
```

---

## Validation Checklist

- [ ] LEFT horizontal alignment works
- [ ] CENTER horizontal alignment works
- [ ] RIGHT horizontal alignment works
- [ ] JUSTIFIED horizontal alignment works
- [ ] TOP vertical alignment works
- [ ] CENTER vertical alignment works
- [ ] BOTTOM vertical alignment works
- [ ] Both alignments can be set together
- [ ] Alignment can be changed multiple times
- [ ] Error for non-text node
- [ ] Error for non-existent node
- [ ] Response contains alignment values
- [ ] Alignment visible and correct in Figma
