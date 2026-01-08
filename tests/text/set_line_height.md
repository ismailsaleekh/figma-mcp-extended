# Test Case: set_line_height

## Command
`set_line_height`

## Description
Sets the line height on a text node. Supports automatic, pixel, and percentage values.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of text node to modify |
| `lineHeight` | number/string | **Yes** | - | Line height value or "AUTO" |
| `unit` | string | No | "PIXELS" | "PIXELS" or "PERCENT" |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Text",
  "lineHeight": {
    "unit": "PIXELS",
    "value": 24
  }
}
```

---

## Test Scenarios

### Test 1: Set Line Height in Pixels

**Purpose:** Verify pixel line height.

**Prerequisites:**
- Create a text node with multiple lines, note its ID

**Command:**
```javascript
{
  command: "set_line_height",
  params: {
    nodeId: "TEXT_NODE_ID",
    lineHeight: 24
  }
}
```

**Expected Result:**
- Line height is 24 pixels
- `lineHeight.unit` equals "PIXELS"

---

### Test 2: Set Line Height in Percent

**Purpose:** Verify percentage line height.

**Command:**
```javascript
{
  command: "set_line_height",
  params: {
    nodeId: "TEXT_NODE_ID",
    lineHeight: 150,
    unit: "PERCENT"
  }
}
```

**Expected Result:**
- Line height is 150%
- `lineHeight.unit` equals "PERCENT"

---

### Test 3: Set Auto Line Height

**Purpose:** Verify automatic line height.

**Command:**
```javascript
{
  command: "set_line_height",
  params: {
    nodeId: "TEXT_NODE_ID",
    lineHeight: "AUTO"
  }
}
```

**Expected Result:**
- Line height is automatic
- `lineHeight.unit` equals "AUTO"

---

### Test 4: Set Tight Line Height (16px)

**Purpose:** Verify tight spacing.

**Command:**
```javascript
{
  command: "set_line_height",
  params: {
    nodeId: "TEXT_NODE_ID",
    lineHeight: 16
  }
}
```

**Expected Result:**
- Lines are tightly spaced

---

### Test 5: Set Loose Line Height (40px)

**Purpose:** Verify loose spacing.

**Command:**
```javascript
{
  command: "set_line_height",
  params: {
    nodeId: "TEXT_NODE_ID",
    lineHeight: 40
  }
}
```

**Expected Result:**
- Lines have wide spacing

---

### Test 6: Set 100% Line Height

**Purpose:** Verify 100% (same as font size).

**Command:**
```javascript
{
  command: "set_line_height",
  params: {
    nodeId: "TEXT_NODE_ID",
    lineHeight: 100,
    unit: "PERCENT"
  }
}
```

**Expected Result:**
- Line height equals font size

---

### Test 7: Set 200% Line Height

**Purpose:** Verify double line height.

**Command:**
```javascript
{
  command: "set_line_height",
  params: {
    nodeId: "TEXT_NODE_ID",
    lineHeight: 200,
    unit: "PERCENT"
  }
}
```

**Expected Result:**
- Line height is double the font size

---

### Test 8: Set Decimal Line Height

**Purpose:** Verify decimal pixel value.

**Command:**
```javascript
{
  command: "set_line_height",
  params: {
    nodeId: "TEXT_NODE_ID",
    lineHeight: 28.5
  }
}
```

**Expected Result:**
- Line height is 28.5 pixels

---

### Test 9: Missing lineHeight (Error Case)

**Purpose:** Verify error for missing parameter.

**Command:**
```javascript
{
  command: "set_line_height",
  params: {
    nodeId: "TEXT_NODE_ID"
  }
}
```

**Expected Result:**
- Error: "Missing lineHeight parameter"

---

### Test 10: Non-Text Node (Error Case)

**Purpose:** Verify error when applied to non-text node.

**Command:**
```javascript
{
  command: "set_line_height",
  params: {
    nodeId: "RECTANGLE_ID",
    lineHeight: 24
  }
}
```

**Expected Result:**
- Error: "Node is not a TEXT node"

---

## Sample Test Script

```javascript
/**
 * Test: set_line_height command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdNodeId = null;
let phase = 'create';

const lineHeightTests = [
  { name: "24 pixels", params: { lineHeight: 24 } },
  { name: "32 pixels", params: { lineHeight: 32 } },
  { name: "150%", params: { lineHeight: 150, unit: "PERCENT" } },
  { name: "200%", params: { lineHeight: 200, unit: "PERCENT" } },
  { name: "Auto", params: { lineHeight: "AUTO" } }
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
        params: { text: "Line Height Test\nSecond Line\nThird Line", x: 0, y: 0 },
        commandId: "create_node"
      }
    }));
  }, 2000);
});

function runLineHeightTest() {
  if (currentTest >= lineHeightTests.length) {
    console.log('\n=== All line height tests complete ===');
    ws.close();
    return;
  }

  const test = lineHeightTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_line_height",
      params: { nodeId: createdNodeId, ...test.params },
      commandId: `lineheight_${currentTest}`
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
      phase = 'lineheight';
      setTimeout(() => runLineHeightTest(), 500);
    } else if (result && phase === 'lineheight') {
      console.log('  Line height:', JSON.stringify(result.lineHeight));
      console.log('  ✓ Line height set successfully');

      currentTest++;
      setTimeout(() => runLineHeightTest(), 500);
    }
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 60000);
```

---

## Validation Checklist

- [ ] Pixel line height works
- [ ] Percentage line height works
- [ ] AUTO line height works
- [ ] Tight spacing (small value) works
- [ ] Loose spacing (large value) works
- [ ] Decimal values work
- [ ] 100% equals font size
- [ ] 200% doubles line height
- [ ] Error for missing lineHeight
- [ ] Error for non-text node
- [ ] Response contains `lineHeight` object
- [ ] Line height visible and correct in Figma
