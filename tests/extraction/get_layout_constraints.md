# Test Case: get_layout_constraints

## Command
`get_layout_constraints`

## Description
Gets the layout constraints and auto-layout properties for a specific node or the current selection.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | No | - | ID of node (colon format). If omitted, uses current selection |

## Expected Response

```json
{
  "id": "123:456",
  "name": "Card Frame",
  "type": "FRAME",
  "layoutMode": "VERTICAL",
  "layoutSizingHorizontal": "FIXED",
  "layoutSizingVertical": "HUG",
  "paddingLeft": 16,
  "paddingRight": 16,
  "paddingTop": 16,
  "paddingBottom": 16,
  "itemSpacing": 8,
  "constraints": {
    "horizontal": "MIN",
    "vertical": "MIN"
  },
  "absoluteBoundingBox": {
    "x": 100,
    "y": 200,
    "width": 300,
    "height": 400
  }
}
```

---

## Test Scenarios

### Test 1: Get Constraints by Node ID

**Purpose:** Verify retrieving constraints for specific node.

**Command:**
```javascript
{
  command: "get_layout_constraints",
  params: {
    nodeId: "AUTO_LAYOUT_FRAME_ID"
  }
}
```

**Expected Result:**
- All layout properties returned
- `id` and `name` match node

---

### Test 2: Get Constraints from Selection

**Purpose:** Verify using current selection.

**Prerequisites:**
- Node selected in Figma

**Command:**
```javascript
{
  command: "get_layout_constraints",
  params: {}
}
```

**Expected Result:**
- Returns constraints for selected node

---

### Test 3: Auto-Layout Frame Properties

**Purpose:** Verify auto-layout specific properties.

**Prerequisites:**
- Frame with auto-layout enabled

**Expected Result:**
- `layoutMode` is "HORIZONTAL" or "VERTICAL"
- `layoutSizingHorizontal` and `layoutSizingVertical` present
- Padding values present
- `itemSpacing` present

---

### Test 4: Non-Auto-Layout Frame

**Purpose:** Verify handling of regular frame.

**Prerequisites:**
- Frame without auto-layout

**Expected Result:**
- `layoutMode` is null or "NONE"
- Other properties may be null or defaults

---

### Test 5: Constraints Property

**Purpose:** Verify constraint information.

**Expected Result:**
- `constraints` object with horizontal and vertical
- Values like "MIN", "MAX", "CENTER", "STRETCH", "SCALE"

---

### Test 6: Bounding Box Information

**Purpose:** Verify position and size data.

**Expected Result:**
- `absoluteBoundingBox` with x, y, width, height

---

### Test 7: No Selection (Error Case)

**Purpose:** Verify error when no selection and no nodeId.

**Prerequisites:**
- Clear selection in Figma

**Command:**
```javascript
{
  command: "get_layout_constraints",
  params: {}
}
```

**Expected Result:**
- Error: "No node selected or found"

---

### Test 8: Non-Existent Node (Error Case)

**Purpose:** Verify error for invalid ID.

**Command:**
```javascript
{
  command: "get_layout_constraints",
  params: {
    nodeId: "999:999"
  }
}
```

**Expected Result:**
- Error: "No node selected or found"

---

## Sample Test Script

```javascript
/**
 * Test: get_layout_constraints command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const NODE_ID = "REPLACE_WITH_NODE_ID";

const ws = new WebSocket(WS_URL);

ws.on('open', () => {
  console.log('Connected to Figma MCP Extended');

  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  setTimeout(() => {
    console.log('Getting layout constraints...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "get_layout_constraints",
        params: { nodeId: NODE_ID },
        commandId: "constraints"
      }
    }));
  }, 2000);
});

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  if (parsed.type === 'system') return;
  if (parsed.sender === 'You') return;

  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;

    if (result) {
      console.log('\n=== Layout Constraints ===');
      console.log('Node:', result.name, `(${result.type})`);
      console.log('Layout Mode:', result.layoutMode);
      console.log('Sizing H:', result.layoutSizingHorizontal);
      console.log('Sizing V:', result.layoutSizingVertical);
      console.log('Padding:', `${result.paddingTop}/${result.paddingRight}/${result.paddingBottom}/${result.paddingLeft}`);
      console.log('Item Spacing:', result.itemSpacing);
      console.log('Constraints:', JSON.stringify(result.constraints));
      console.log('Bounds:', JSON.stringify(result.absoluteBoundingBox));

      ws.close();
    }

    if (parsed.message.error) {
      console.log('Error:', parsed.message.error);
      ws.close();
    }
  }
});

ws.on('close', () => console.log('Connection closed'));
ws.on('error', (err) => console.error('WebSocket error:', err));

setTimeout(() => ws.close(), 60000);
```

---

## Validation Checklist

- [ ] Get constraints by nodeId works
- [ ] Get constraints from selection works
- [ ] layoutMode extracted correctly
- [ ] layoutSizingHorizontal extracted
- [ ] layoutSizingVertical extracted
- [ ] All padding values present
- [ ] itemSpacing present
- [ ] constraints object present
- [ ] absoluteBoundingBox present
- [ ] Non-auto-layout frames handled
- [ ] No selection returns error
- [ ] Non-existent node returns error
