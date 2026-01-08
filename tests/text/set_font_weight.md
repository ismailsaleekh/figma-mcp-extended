# Test Case: set_font_weight

## Command
`set_font_weight`

## Description
Sets the font weight on a text node. Maps numeric weight values to font style names.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of text node to modify |
| `fontWeight` | number | **Yes** | - | Font weight (100-900) |

### Weight to Style Mapping

| Weight | Typical Style |
|--------|---------------|
| 100 | Thin |
| 200 | Extra Light |
| 300 | Light |
| 400 | Regular |
| 500 | Medium |
| 600 | Semi Bold |
| 700 | Bold |
| 800 | Extra Bold |
| 900 | Black |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Text",
  "fontName": {
    "family": "Inter",
    "style": "Bold"
  },
  "fontWeight": 700,
  "characters": "Hello World"
}
```

---

## Test Scenarios

### Test 1: Set Regular Weight (400)

**Purpose:** Verify regular weight.

**Prerequisites:**
- Create a text node, note its ID

**Command:**
```javascript
{
  command: "set_font_weight",
  params: {
    nodeId: "TEXT_NODE_ID",
    fontWeight: 400
  }
}
```

**Expected Result:**
- Text uses Regular weight
- `fontWeight` equals 400

---

### Test 2: Set Bold Weight (700)

**Purpose:** Verify bold weight.

**Command:**
```javascript
{
  command: "set_font_weight",
  params: {
    nodeId: "TEXT_NODE_ID",
    fontWeight: 700
  }
}
```

**Expected Result:**
- Text uses Bold weight
- `fontWeight` equals 700

---

### Test 3: Set Light Weight (300)

**Purpose:** Verify light weight.

**Command:**
```javascript
{
  command: "set_font_weight",
  params: {
    nodeId: "TEXT_NODE_ID",
    fontWeight: 300
  }
}
```

**Expected Result:**
- Text uses Light weight

---

### Test 4: Set Medium Weight (500)

**Purpose:** Verify medium weight.

**Command:**
```javascript
{
  command: "set_font_weight",
  params: {
    nodeId: "TEXT_NODE_ID",
    fontWeight: 500
  }
}
```

**Expected Result:**
- Text uses Medium weight

---

### Test 5: Set Semi Bold Weight (600)

**Purpose:** Verify semi-bold weight.

**Command:**
```javascript
{
  command: "set_font_weight",
  params: {
    nodeId: "TEXT_NODE_ID",
    fontWeight: 600
  }
}
```

**Expected Result:**
- Text uses Semi Bold weight

---

### Test 6: Set Extra Bold Weight (800)

**Purpose:** Verify extra bold weight.

**Command:**
```javascript
{
  command: "set_font_weight",
  params: {
    nodeId: "TEXT_NODE_ID",
    fontWeight: 800
  }
}
```

**Expected Result:**
- Text uses Extra Bold weight

---

### Test 7: Set Black Weight (900)

**Purpose:** Verify black/heavy weight.

**Command:**
```javascript
{
  command: "set_font_weight",
  params: {
    nodeId: "TEXT_NODE_ID",
    fontWeight: 900
  }
}
```

**Expected Result:**
- Text uses Black weight

---

### Test 8: Set Thin Weight (100)

**Purpose:** Verify thin weight.

**Command:**
```javascript
{
  command: "set_font_weight",
  params: {
    nodeId: "TEXT_NODE_ID",
    fontWeight: 100
  }
}
```

**Expected Result:**
- Text uses Thin weight

---

### Test 9: Weight Below 100 (Error Case)

**Purpose:** Verify error for weight too low.

**Command:**
```javascript
{
  command: "set_font_weight",
  params: {
    nodeId: "TEXT_NODE_ID",
    fontWeight: 50
  }
}
```

**Expected Result:**
- Error: "fontWeight must be between 100 and 900"

---

### Test 10: Weight Above 900 (Error Case)

**Purpose:** Verify error for weight too high.

**Command:**
```javascript
{
  command: "set_font_weight",
  params: {
    nodeId: "TEXT_NODE_ID",
    fontWeight: 1000
  }
}
```

**Expected Result:**
- Error: "fontWeight must be between 100 and 900"

---

### Test 11: Non-Text Node (Error Case)

**Purpose:** Verify error when applied to non-text node.

**Command:**
```javascript
{
  command: "set_font_weight",
  params: {
    nodeId: "RECTANGLE_ID",
    fontWeight: 700
  }
}
```

**Expected Result:**
- Error: "Node is not a TEXT node"

---

## Sample Test Script

```javascript
/**
 * Test: set_font_weight command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdNodeId = null;
let phase = 'create';

const weightTests = [
  { name: "Regular (400)", fontWeight: 400 },
  { name: "Medium (500)", fontWeight: 500 },
  { name: "Semi Bold (600)", fontWeight: 600 },
  { name: "Bold (700)", fontWeight: 700 },
  { name: "Light (300)", fontWeight: 300 }
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
        params: { text: "Font Weight Test", x: 0, y: 0 },
        commandId: "create_node"
      }
    }));
  }, 2000);
});

function runWeightTest() {
  if (currentTest >= weightTests.length) {
    console.log('\n=== All font weight tests complete ===');

    // Test error case
    console.log('\nTesting error case (weight > 900)...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "set_font_weight",
        params: { nodeId: createdNodeId, fontWeight: 1000 },
        commandId: "error_test"
      }
    }));

    setTimeout(() => ws.close(), 3000);
    return;
  }

  const test = weightTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_font_weight",
      params: { nodeId: createdNodeId, fontWeight: test.fontWeight },
      commandId: `weight_${currentTest}`
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
      phase = 'weight';
      setTimeout(() => runWeightTest(), 500);
    } else if (result && phase === 'weight') {
      console.log('  Font weight:', result.fontWeight);
      console.log('  Font style:', result.fontName?.style);
      console.log('  ✓ Font weight set successfully');

      currentTest++;
      setTimeout(() => runWeightTest(), 500);
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

- [ ] Thin weight (100) works
- [ ] Light weight (300) works
- [ ] Regular weight (400) works
- [ ] Medium weight (500) works
- [ ] Semi Bold weight (600) works
- [ ] Bold weight (700) works
- [ ] Extra Bold weight (800) works
- [ ] Black weight (900) works
- [ ] Error for weight below 100
- [ ] Error for weight above 900
- [ ] Error for non-text node
- [ ] Response contains `fontWeight` value
- [ ] Response contains updated `fontName`
- [ ] Font weight visible and correct in Figma
