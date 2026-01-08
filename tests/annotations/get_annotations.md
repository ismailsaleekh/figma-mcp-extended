# Test Case: get_annotations

## Command
`get_annotations`

## Description
Gets annotations from a specific node (and its children) or from all nodes on the current page. Can optionally include annotation category definitions.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | No | - | ID of node to get annotations from (colon format). If omitted, gets all annotations on current page |
| `includeCategories` | boolean | No | `true` | Include annotation category definitions in response |

## Expected Response

### When nodeId is provided:
```json
{
  "nodeId": "123:456",
  "name": "Button",
  "annotations": [
    {
      "nodeId": "123:456",
      "annotation": {
        "label": "Primary action button",
        "categoryId": "category-id",
        "properties": []
      }
    }
  ],
  "categories": [
    {
      "id": "category-id",
      "label": "Development",
      "color": { "r": 0.2, "g": 0.6, "b": 1 },
      "isPreset": true
    }
  ]
}
```

### When nodeId is omitted (page-wide):
```json
{
  "annotatedNodes": [
    {
      "nodeId": "123:456",
      "name": "Button",
      "annotations": [
        {
          "label": "Primary action",
          "categoryId": "category-id"
        }
      ]
    }
  ],
  "categories": [...]
}
```

---

## Test Scenarios

### Test 1: Get Annotations from Specific Node

**Purpose:** Verify retrieving annotations from a single node.

**Prerequisites:**
1. Create a frame or shape with an annotation attached
2. Note the node ID

**Command:**
```javascript
{
  command: "get_annotations",
  params: {
    nodeId: "ANNOTATED_NODE_ID"
  }
}
```

**Expected Result:**
- Response contains `nodeId` and `name`
- `annotations` array includes the annotation data
- `categories` included by default

**Verification Steps:**
1. Check `nodeId` matches input
2. Verify annotations array is populated
3. Confirm categories are present

---

### Test 2: Get Annotations from Node with Children

**Purpose:** Verify recursive collection of annotations from children.

**Prerequisites:**
- Frame with multiple annotated children

**Command:**
```javascript
{
  command: "get_annotations",
  params: {
    nodeId: "PARENT_FRAME_ID"
  }
}
```

**Expected Result:**
- All annotations from parent and children collected
- Each annotation entry includes its source `nodeId`

---

### Test 3: Get All Page Annotations (No nodeId)

**Purpose:** Verify page-wide annotation scanning.

**Prerequisites:**
- Multiple annotated nodes on current page

**Command:**
```javascript
{
  command: "get_annotations",
  params: {}
}
```

**Expected Result:**
- `annotatedNodes` array with all annotated nodes
- Each entry has `nodeId`, `name`, and `annotations`
- Categories included

---

### Test 4: Get Annotations Without Categories

**Purpose:** Verify excluding categories from response.

**Command:**
```javascript
{
  command: "get_annotations",
  params: {
    nodeId: "ANNOTATED_NODE_ID",
    includeCategories: false
  }
}
```

**Expected Result:**
- `categories` is `undefined` or not present
- Annotations still returned

---

### Test 5: Get Annotations from Node with No Annotations

**Purpose:** Verify handling of unannotated nodes.

**Command:**
```javascript
{
  command: "get_annotations",
  params: {
    nodeId: "UNANNOTATED_NODE_ID"
  }
}
```

**Expected Result:**
- `annotations` array is empty `[]`
- No error thrown

---

### Test 6: Get Page Annotations When None Exist

**Purpose:** Verify empty page handling.

**Prerequisites:**
- Page with no annotated nodes

**Command:**
```javascript
{
  command: "get_annotations",
  params: {}
}
```

**Expected Result:**
- `annotatedNodes` is empty array `[]`
- Categories still returned (from Figma presets)

---

### Test 7: Get Annotations from Non-Existent Node (Error Case)

**Purpose:** Verify error handling for invalid node ID.

**Command:**
```javascript
{
  command: "get_annotations",
  params: {
    nodeId: "999:999"
  }
}
```

**Expected Result:**
- Error: "Node not found: 999:999"

---

### Test 8: Get Annotations from Non-Annotatable Node Type (Error Case)

**Purpose:** Verify error for nodes that don't support annotations.

**Prerequisites:**
- Identify a node type that doesn't support annotations (if any)

**Command:**
```javascript
{
  command: "get_annotations",
  params: {
    nodeId: "NON_ANNOTATABLE_NODE_ID"
  }
}
```

**Expected Result:**
- Error: "Node type X does not support annotations"

---

### Test 9: Verify Category Properties

**Purpose:** Verify all category properties are returned.

**Command:**
```javascript
{
  command: "get_annotations",
  params: {
    includeCategories: true
  }
}
```

**Expected Result:**
- Categories contain `id`, `label`, `color`, `isPreset`
- Preset categories from Figma are present

---

### Test 10: Get Annotations with Multiple Annotations per Node

**Purpose:** Verify nodes with multiple annotations.

**Prerequisites:**
- Node with multiple annotations attached

**Command:**
```javascript
{
  command: "get_annotations",
  params: {
    nodeId: "MULTI_ANNOTATED_NODE_ID"
  }
}
```

**Expected Result:**
- All annotations returned in array
- Each annotation has its own entry

---

## Sample Test Script

```javascript
/**
 * Test: get_annotations command
 * Prerequisites: Figma plugin connected, channel ID obtained
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdFrameId = null;
let phase = 'create';

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
          name: "Annotation Test Frame"
        },
        commandId: "create_frame"
      }
    }));
  }, 2000);
});

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
        phase = 'set_annotation';

        // First set an annotation on the frame
        setTimeout(() => {
          console.log('Setting annotation on frame...');
          ws.send(JSON.stringify({
            type: "message",
            channel: CHANNEL_ID,
            message: {
              command: "set_annotation",
              params: {
                nodeId: createdFrameId,
                labelMarkdown: "Test annotation for get_annotations"
              },
              commandId: "set_annotation"
            }
          }));
        }, 500);

      } else if (phase === 'set_annotation') {
        console.log('Annotation set, now getting annotations...');
        phase = 'get_annotations';

        // Test 1: Get from specific node
        setTimeout(() => {
          ws.send(JSON.stringify({
            type: "message",
            channel: CHANNEL_ID,
            message: {
              command: "get_annotations",
              params: { nodeId: createdFrameId },
              commandId: "get_from_node"
            }
          }));
        }, 500);

      } else if (phase === 'get_annotations') {
        console.log('\n=== get_annotations Result ===');
        console.log('Node ID:', result.nodeId);
        console.log('Name:', result.name);
        console.log('Annotations count:', result.annotations?.length || 0);
        console.log('Annotations:', JSON.stringify(result.annotations, null, 2));
        console.log('Categories count:', result.categories?.length || 0);

        phase = 'get_page';

        // Test 2: Get all page annotations
        setTimeout(() => {
          console.log('\nGetting all page annotations...');
          ws.send(JSON.stringify({
            type: "message",
            channel: CHANNEL_ID,
            message: {
              command: "get_annotations",
              params: {},
              commandId: "get_all_page"
            }
          }));
        }, 500);

      } else if (phase === 'get_page') {
        console.log('\n=== Page Annotations Result ===');
        console.log('Annotated nodes:', result.annotatedNodes?.length || 0);
        if (result.annotatedNodes && result.annotatedNodes.length > 0) {
          result.annotatedNodes.forEach(n => {
            console.log(`  - ${n.name} (${n.nodeId}): ${n.annotations?.length || 0} annotations`);
          });
        }

        phase = 'get_no_categories';

        // Test 3: Without categories
        setTimeout(() => {
          console.log('\nGetting without categories...');
          ws.send(JSON.stringify({
            type: "message",
            channel: CHANNEL_ID,
            message: {
              command: "get_annotations",
              params: { nodeId: createdFrameId, includeCategories: false },
              commandId: "no_categories"
            }
          }));
        }, 500);

      } else if (phase === 'get_no_categories') {
        console.log('\n=== Without Categories Result ===');
        console.log('Categories:', result.categories);
        console.log('Categories undefined:', result.categories === undefined);

        console.log('\n=== All tests complete ===');
        ws.close();
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

- [ ] Get annotations from specific node works
- [ ] Recursive child annotation collection works
- [ ] Page-wide annotation scan works
- [ ] `includeCategories: false` excludes categories
- [ ] Empty annotations handled correctly
- [ ] Empty page handled correctly
- [ ] Non-existent node throws error
- [ ] Non-annotatable node throws error
- [ ] Category properties returned correctly
- [ ] Multiple annotations per node handled
- [ ] Response format matches documentation
