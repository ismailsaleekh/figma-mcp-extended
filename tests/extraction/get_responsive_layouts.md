# Test Case: get_responsive_layouts

## Command
`get_responsive_layouts`

## Description
Analyzes responsive layout elements in a node and its children. Provides CSS recommendations and breakpoint suggestions for converting designs to responsive web layouts.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | No | - | ID of node to analyze (colon format). If omitted, uses current selection |

## Expected Response

```json
{
  "message": "Responsive layouts analysis completed",
  "timestamp": 1705329600000,
  "nodeId": "123:456",
  "nodeName": "Main Frame",
  "breakpoints": [
    {
      "name": "mobile",
      "minWidth": 0,
      "maxWidth": 767,
      "elementCount": 5,
      "suggestions": ["Consider responsive adjustments for 5 elements"]
    },
    {
      "name": "tablet",
      "minWidth": 768,
      "maxWidth": 1023,
      "elementCount": 3,
      "suggestions": [...]
    }
  ],
  "gridSystem": null,
  "responsiveElements": [
    {
      "id": "123:457",
      "name": "Header",
      "type": "FRAME",
      "layoutMode": "HORIZONTAL",
      "layoutSizingHorizontal": "FILL",
      "layoutSizingVertical": "HUG",
      "constraints": null,
      "width": 1440,
      "height": 80,
      "responsiveRecommendations": [
        {
          "css": "display: flex; flex-direction: row;",
          "description": "Horizontal auto-layout converted to flexbox row"
        },
        {
          "css": "width: 100%;",
          "description": "Fill container horizontally"
        }
      ]
    }
  ]
}
```

---

## Test Scenarios

### Test 1: Analyze by Node ID

**Purpose:** Verify responsive analysis for specific node.

**Command:**
```javascript
{
  command: "get_responsive_layouts",
  params: {
    nodeId: "FRAME_ID"
  }
}
```

**Expected Result:**
- `nodeName` matches frame
- `responsiveElements` populated for auto-layout frames

---

### Test 2: Analyze Current Selection

**Purpose:** Verify using selection.

**Prerequisites:**
- Select a frame in Figma

**Command:**
```javascript
{
  command: "get_responsive_layouts",
  params: {}
}
```

**Expected Result:**
- Analyzes selected node

---

### Test 3: Horizontal Auto-Layout CSS

**Purpose:** Verify CSS recommendations for horizontal layout.

**Prerequisites:**
- Horizontal auto-layout frame

**Expected Result:**
- CSS: `display: flex; flex-direction: row;`
- Description explains conversion

---

### Test 4: Vertical Auto-Layout CSS

**Purpose:** Verify CSS for vertical layout.

**Prerequisites:**
- Vertical auto-layout frame

**Expected Result:**
- CSS: `display: flex; flex-direction: column;`

---

### Test 5: Fill Container Recommendations

**Purpose:** Verify FILL sizing CSS.

**Prerequisites:**
- Frame with layoutSizingHorizontal: "FILL"

**Expected Result:**
- CSS: `width: 100%;`

---

### Test 6: Wrap Layout CSS

**Purpose:** Verify wrap recommendations.

**Prerequisites:**
- Frame with layoutWrap: "WRAP"

**Expected Result:**
- CSS: `flex-wrap: wrap;`

---

### Test 7: Breakpoint Analysis

**Purpose:** Verify breakpoint categorization.

**Expected Result:**
- Standard breakpoints: mobile, tablet, desktop, large
- Element counts per breakpoint

---

### Test 8: Complex Nested Layout

**Purpose:** Verify recursive analysis.

**Prerequisites:**
- Nested auto-layout frames

**Expected Result:**
- All nested layouts captured in responsiveElements

---

### Test 9: Non-Auto-Layout Node

**Purpose:** Verify handling of regular frames.

**Prerequisites:**
- Frame without auto-layout

**Expected Result:**
- Empty or minimal responsiveElements
- No errors

---

## Sample Test Script

```javascript
/**
 * Test: get_responsive_layouts command
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
    console.log('Analyzing responsive layouts...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "get_responsive_layouts",
        params: { nodeId: NODE_ID },
        commandId: "responsive"
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
      console.log('\n=== Responsive Layouts ===');
      console.log('Node:', result.nodeName);
      console.log('Responsive Elements:', result.responsiveElements?.length || 0);
      console.log('Breakpoints:', result.breakpoints?.length || 0);

      if (result.breakpoints?.length > 0) {
        console.log('\nBreakpoints:');
        result.breakpoints.forEach(bp => {
          console.log(`  ${bp.name}: ${bp.minWidth}-${bp.maxWidth || '∞'}px (${bp.elementCount} elements)`);
        });
      }

      if (result.responsiveElements?.length > 0) {
        console.log('\nResponsive Elements:');
        result.responsiveElements.slice(0, 5).forEach(el => {
          console.log(`  - ${el.name} (${el.layoutMode})`);
          el.responsiveRecommendations?.forEach(rec => {
            console.log(`    CSS: ${rec.css}`);
          });
        });
      }

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

- [ ] Analyze by nodeId works
- [ ] Analyze by selection works
- [ ] Horizontal auto-layout CSS generated
- [ ] Vertical auto-layout CSS generated
- [ ] FILL sizing CSS generated
- [ ] Wrap CSS generated
- [ ] Breakpoints array populated
- [ ] Element counts per breakpoint accurate
- [ ] Nested layouts analyzed recursively
- [ ] Non-auto-layout nodes handled
- [ ] Response contains message, timestamp, nodeId, nodeName
- [ ] responsiveElements have all properties
- [ ] responsiveRecommendations have css and description
