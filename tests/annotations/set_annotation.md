# Test Case: set_annotation

## Command
`set_annotation`

## Description
Sets an annotation on a specific node. Supports markdown labels, optional category assignment, and custom properties.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of node to annotate (colon format) |
| `labelMarkdown` | string | **Yes** | - | Annotation text (supports markdown) |
| `categoryId` | string | No | - | Category ID to assign annotation to |
| `properties` | array | No | - | Custom properties: `[{ name, value }]` |

### Properties Format
```javascript
properties: [
  { name: "Status", value: "In Progress" },
  { name: "Designer", value: "John" }
]
```

## Expected Response

```json
{
  "success": true,
  "nodeId": "123:456",
  "name": "Button",
  "annotations": [
    {
      "label": "Primary action button",
      "categoryId": "category-id",
      "properties": [...]
    }
  ]
}
```

### Error Response
```json
{
  "success": false,
  "error": "Missing nodeId"
}
```

---

## Test Scenarios

### Test 1: Set Basic Annotation

**Purpose:** Verify basic annotation creation.

**Prerequisites:**
1. Create a frame or shape
2. Note the node ID

**Command:**
```javascript
{
  command: "set_annotation",
  params: {
    nodeId: "TARGET_NODE_ID",
    labelMarkdown: "This is a test annotation"
  }
}
```

**Expected Result:**
- `success: true`
- Annotation visible on node in Figma
- `annotations` array contains the new annotation

**Verification Steps:**
1. Check `success` is `true`
2. Verify `nodeId` matches input
3. Check annotation label in response

---

### Test 2: Set Annotation with Markdown

**Purpose:** Verify markdown formatting support.

**Command:**
```javascript
{
  command: "set_annotation",
  params: {
    nodeId: "NODE_ID",
    labelMarkdown: "**Bold text** and *italic* with `code`"
  }
}
```

**Expected Result:**
- Annotation created with markdown content
- Formatting preserved in label

---

### Test 3: Set Annotation with Category

**Purpose:** Verify category assignment.

**Prerequisites:**
- Get available categories using `get_annotations` first

**Command:**
```javascript
{
  command: "set_annotation",
  params: {
    nodeId: "NODE_ID",
    labelMarkdown: "Development note",
    categoryId: "VALID_CATEGORY_ID"
  }
}
```

**Expected Result:**
- Annotation assigned to specified category
- `categoryId` present in response annotation

---

### Test 4: Set Annotation with Properties

**Purpose:** Verify custom properties.

**Command:**
```javascript
{
  command: "set_annotation",
  params: {
    nodeId: "NODE_ID",
    labelMarkdown: "Component specification",
    properties: [
      { name: "Status", value: "Ready for dev" },
      { name: "Priority", value: "High" }
    ]
  }
}
```

**Expected Result:**
- Annotation created with properties
- Properties accessible in response

---

### Test 5: Set Annotation with All Options

**Purpose:** Verify all parameters together.

**Command:**
```javascript
{
  command: "set_annotation",
  params: {
    nodeId: "NODE_ID",
    labelMarkdown: "# Full Annotation\n\nWith **markdown** support",
    categoryId: "CATEGORY_ID",
    properties: [
      { name: "Author", value: "Designer" },
      { name: "Date", value: "2025-01-15" }
    ]
  }
}
```

**Expected Result:**
- All options applied correctly
- Response contains full annotation data

---

### Test 6: Update Existing Annotation

**Purpose:** Verify annotation replacement behavior.

**Prerequisites:**
- Node already has an annotation

**Command:**
```javascript
{
  command: "set_annotation",
  params: {
    nodeId: "ALREADY_ANNOTATED_NODE_ID",
    labelMarkdown: "Updated annotation text"
  }
}
```

**Expected Result:**
- Previous annotation replaced
- Only new annotation present
- `annotations` array has length 1

---

### Test 7: Set Annotation on Different Node Types

**Purpose:** Verify support across node types.

**Commands:**
```javascript
// On Frame
{ command: "set_annotation", params: { nodeId: "FRAME_ID", labelMarkdown: "Frame note" } }

// On Rectangle
{ command: "set_annotation", params: { nodeId: "RECTANGLE_ID", labelMarkdown: "Shape note" } }

// On Text
{ command: "set_annotation", params: { nodeId: "TEXT_ID", labelMarkdown: "Text note" } }

// On Group
{ command: "set_annotation", params: { nodeId: "GROUP_ID", labelMarkdown: "Group note" } }
```

**Expected Result:**
- All node types accept annotations
- Each returns `success: true`

---

### Test 8: Missing nodeId (Error Case)

**Purpose:** Verify required parameter validation.

**Command:**
```javascript
{
  command: "set_annotation",
  params: {
    labelMarkdown: "Test annotation"
  }
}
```

**Expected Result:**
- `success: false`
- `error: "Missing nodeId"`

---

### Test 9: Missing labelMarkdown (Error Case)

**Purpose:** Verify required parameter validation.

**Command:**
```javascript
{
  command: "set_annotation",
  params: {
    nodeId: "NODE_ID"
  }
}
```

**Expected Result:**
- `success: false`
- `error: "Missing labelMarkdown"`

---

### Test 10: Non-Existent Node (Error Case)

**Purpose:** Verify error for invalid node ID.

**Command:**
```javascript
{
  command: "set_annotation",
  params: {
    nodeId: "999:999",
    labelMarkdown: "Test annotation"
  }
}
```

**Expected Result:**
- `success: false`
- `error: "Node not found: 999:999"`

---

### Test 11: Non-Annotatable Node Type (Error Case)

**Purpose:** Verify error for unsupported node types.

**Command:**
```javascript
{
  command: "set_annotation",
  params: {
    nodeId: "NON_ANNOTATABLE_NODE_ID",
    labelMarkdown: "Test"
  }
}
```

**Expected Result:**
- `success: false`
- `error: "Node type X does not support annotations"`

---

### Test 12: Empty Label

**Purpose:** Verify handling of empty string label.

**Command:**
```javascript
{
  command: "set_annotation",
  params: {
    nodeId: "NODE_ID",
    labelMarkdown: ""
  }
}
```

**Expected Result:**
- May succeed with empty label or validation error
- Behavior should be consistent

---

### Test 13: Long Label Text

**Purpose:** Verify handling of long annotation text.

**Command:**
```javascript
{
  command: "set_annotation",
  params: {
    nodeId: "NODE_ID",
    labelMarkdown: "A".repeat(5000)  // Very long text
  }
}
```

**Expected Result:**
- Either succeeds or returns meaningful error
- No crash or timeout

---

### Test 14: Special Characters in Label

**Purpose:** Verify handling of special characters.

**Command:**
```javascript
{
  command: "set_annotation",
  params: {
    nodeId: "NODE_ID",
    labelMarkdown: "Test <script>alert('xss')</script> & \"quotes\" and émojis 🎉"
  }
}
```

**Expected Result:**
- Characters handled safely
- Content preserved in annotation

---

## Sample Test Script

```javascript
/**
 * Test: set_annotation command
 * Prerequisites: Figma plugin connected, channel ID obtained
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdFrameId = null;
let phase = 'create';
let currentTest = 0;

ws.on('open', () => {
  console.log('Connected to Figma MCP Extended');

  // Join channel
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  // Wait for join, then create a test frame
  setTimeout(() => {
    console.log('Creating test frame...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_frame",
        params: {
          x: 0, y: 0, width: 200, height: 100,
          name: "Set Annotation Test"
        },
        commandId: "create_frame"
      }
    }));
  }, 2000);
});

const annotationTests = [
  {
    name: "Basic annotation",
    params: { labelMarkdown: "Basic test annotation" }
  },
  {
    name: "Markdown annotation",
    params: { labelMarkdown: "**Bold** and *italic* text with `code`" }
  },
  {
    name: "Annotation with properties",
    params: {
      labelMarkdown: "With properties",
      properties: [
        { name: "Status", value: "Testing" },
        { name: "Author", value: "Test Script" }
      ]
    }
  },
  {
    name: "Update annotation",
    params: { labelMarkdown: "Updated annotation content" }
  }
];

function runAnnotationTest() {
  if (currentTest >= annotationTests.length) {
    console.log('\n=== All annotation tests complete ===');

    // Test error cases
    console.log('\nTesting error case (missing labelMarkdown)...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "set_annotation",
        params: { nodeId: createdFrameId },
        commandId: "error_test_no_label"
      }
    }));

    setTimeout(() => {
      console.log('\nTesting error case (invalid nodeId)...');
      ws.send(JSON.stringify({
        type: "message",
        channel: CHANNEL_ID,
        message: {
          command: "set_annotation",
          params: { nodeId: "999:999", labelMarkdown: "Test" },
          commandId: "error_test_invalid_id"
        }
      }));
    }, 1000);

    setTimeout(() => ws.close(), 3000);
    return;
  }

  const test = annotationTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  const params = { nodeId: createdFrameId, ...test.params };

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_annotation",
      params,
      commandId: `annotation_${currentTest}`
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
        createdFrameId = result.id;
        console.log('Created frame:', createdFrameId);
        phase = 'annotation';
        setTimeout(() => runAnnotationTest(), 500);
      } else if (phase === 'annotation') {
        console.log('Result:');
        console.log('  Success:', result.success);
        console.log('  Node ID:', result.nodeId);
        console.log('  Name:', result.name);
        console.log('  Annotations:', result.annotations?.length || 0);

        if (result.success) {
          console.log('  ✓ Annotation set successfully');
        } else {
          console.log('  ✗ Error:', result.error);
        }

        currentTest++;
        setTimeout(() => runAnnotationTest(), 500);
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

- [ ] Basic annotation creation works
- [ ] Markdown formatting preserved
- [ ] Category assignment works
- [ ] Custom properties work
- [ ] All parameters together work
- [ ] Annotation replacement works
- [ ] Works on Frame nodes
- [ ] Works on Rectangle nodes
- [ ] Works on Text nodes
- [ ] Works on Group nodes
- [ ] Missing nodeId returns error
- [ ] Missing labelMarkdown returns error
- [ ] Non-existent node returns error
- [ ] Non-annotatable node returns error
- [ ] Empty label handled correctly
- [ ] Long text handled correctly
- [ ] Special characters handled safely
- [ ] Response contains `success`, `nodeId`, `name`, `annotations`
