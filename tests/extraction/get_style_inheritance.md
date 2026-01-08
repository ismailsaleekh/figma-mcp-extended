# Test Case: get_style_inheritance

## Command
`get_style_inheritance`

## Description
Analyzes styles applied to a node, distinguishing between computed styles, inherited styles from parent, and local styles. Provides CSS recommendations for implementation.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | No | - | ID of node to analyze (colon format). If omitted, uses current selection |

## Expected Response

```json
{
  "nodeId": "123:456",
  "nodeName": "Button Label",
  "nodeType": "TEXT",
  "computedStyles": {
    "typography": {
      "fontFamily": "Inter",
      "fontWeight": "Medium",
      "fontSize": 16,
      "lineHeight": { "unit": "PERCENT", "value": 150 },
      "letterSpacing": { "unit": "PERCENT", "value": 0 },
      "textAlign": "CENTER",
      "textDecoration": "NONE",
      "textCase": "ORIGINAL"
    },
    "fills": [
      {
        "type": "SOLID",
        "color": "#FFFFFF",
        "opacity": 1
      }
    ]
  },
  "inheritedStyles": {},
  "localStyles": {...},
  "recommendations": [
    {
      "property": "font-family",
      "value": "'Inter'",
      "description": "Set font family"
    },
    {
      "property": "font-size",
      "value": "16px",
      "description": "Set font size"
    }
  ]
}
```

---

## Test Scenarios

### Test 1: Analyze Text Node

**Purpose:** Verify typography extraction for text.

**Prerequisites:**
- Text node with styling

**Command:**
```javascript
{
  command: "get_style_inheritance",
  params: {
    nodeId: "TEXT_NODE_ID"
  }
}
```

**Expected Result:**
- `computedStyles.typography` populated
- Font properties extracted
- CSS recommendations for typography

---

### Test 2: Analyze Frame Node

**Purpose:** Verify fill/stroke extraction.

**Prerequisites:**
- Frame with fills and strokes

**Command:**
```javascript
{
  command: "get_style_inheritance",
  params: {
    nodeId: "FRAME_ID"
  }
}
```

**Expected Result:**
- `computedStyles.fills` with hex colors
- `computedStyles.strokes` if present

---

### Test 3: CSS Recommendations

**Purpose:** Verify CSS output generation.

**Expected Result:**
- `recommendations` array with property, value, description
- Font-family, font-size, line-height, color, border

---

### Test 4: Use Current Selection

**Purpose:** Verify selection mode.

**Prerequisites:**
- Node selected in Figma

**Command:**
```javascript
{
  command: "get_style_inheritance",
  params: {}
}
```

**Expected Result:**
- Analyzes selected node

---

### Test 5: Node with Opacity

**Purpose:** Verify opacity extraction.

**Prerequisites:**
- Node with opacity < 1

**Expected Result:**
- `computedStyles.opacity` present

---

### Test 6: Node with Effects

**Purpose:** Verify shadow/blur extraction.

**Prerequisites:**
- Node with drop shadow or blur

**Expected Result:**
- `computedStyles.effects` array populated

---

### Test 7: Node with Corner Radius

**Purpose:** Verify border radius extraction.

**Prerequisites:**
- Node with corner radius

**Expected Result:**
- `computedStyles.cornerRadius` present

---

### Test 8: Inherited Styles Analysis

**Purpose:** Verify parent style detection.

**Prerequisites:**
- Nested node with potential inherited styles

**Expected Result:**
- `inheritedStyles` shows what came from parent

---

### Test 9: No Selection (Error Case)

**Purpose:** Verify error handling.

**Command:**
```javascript
{
  command: "get_style_inheritance",
  params: {}
}
```

**Expected Result:**
- Error: "No node selected or found"

---

### Test 10: Non-Existent Node (Error Case)

**Purpose:** Verify invalid ID handling.

**Command:**
```javascript
{
  command: "get_style_inheritance",
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
 * Test: get_style_inheritance command
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
    console.log('Analyzing style inheritance...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "get_style_inheritance",
        params: { nodeId: NODE_ID },
        commandId: "styles"
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
      console.log('\n=== Style Inheritance ===');
      console.log('Node:', result.nodeName, `(${result.nodeType})`);

      if (result.computedStyles?.typography) {
        console.log('\nTypography:');
        const typo = result.computedStyles.typography;
        console.log(`  Font: ${typo.fontFamily} ${typo.fontWeight}`);
        console.log(`  Size: ${typo.fontSize}px`);
      }

      if (result.computedStyles?.fills?.length > 0) {
        console.log('\nFills:');
        result.computedStyles.fills.forEach(fill => {
          console.log(`  ${fill.type}: ${fill.color || 'N/A'}`);
        });
      }

      if (result.recommendations?.length > 0) {
        console.log('\nCSS Recommendations:');
        result.recommendations.forEach(rec => {
          console.log(`  ${rec.property}: ${rec.value}`);
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

- [ ] Text node typography extracted
- [ ] Font family extracted
- [ ] Font weight extracted
- [ ] Font size extracted
- [ ] Line height extracted
- [ ] Letter spacing extracted
- [ ] Text alignment extracted
- [ ] Fills extracted with hex colors
- [ ] Strokes extracted
- [ ] Corner radius extracted
- [ ] Effects extracted
- [ ] Opacity extracted
- [ ] CSS recommendations generated
- [ ] font-family recommendation
- [ ] font-size recommendation
- [ ] line-height recommendation
- [ ] color recommendation
- [ ] border recommendation
- [ ] Inherited styles analyzed
- [ ] Local styles extracted
- [ ] No selection returns error
- [ ] Invalid nodeId returns error
