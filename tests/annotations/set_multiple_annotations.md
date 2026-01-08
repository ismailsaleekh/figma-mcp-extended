# Test Case: set_multiple_annotations

## Command
`set_multiple_annotations`

## Description
Batch sets annotations on multiple nodes in a single operation. Processes each annotation sequentially and reports success/failure for each.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `annotations` | array | **Yes** | - | Array of annotation objects to apply |

### Annotation Object Format
```javascript
{
  nodeId: "123:456",           // Required: target node ID (colon format)
  labelMarkdown: "Note text",  // Required: annotation text
  categoryId: "category-id",   // Optional: category assignment
  properties: [                // Optional: custom properties
    { name: "Status", value: "Done" }
  ]
}
```

## Expected Response

```json
{
  "success": true,
  "annotationsApplied": 3,
  "annotationsFailed": 1,
  "totalAnnotations": 4,
  "results": [
    { "success": true, "nodeId": "123:456" },
    { "success": true, "nodeId": "123:457" },
    { "success": true, "nodeId": "123:458" },
    { "success": false, "nodeId": "999:999", "error": "Node not found: 999:999" }
  ]
}
```

---

## Test Scenarios

### Test 1: Set Multiple Annotations Successfully

**Purpose:** Verify batch annotation on multiple nodes.

**Prerequisites:**
1. Create 3 frames or shapes
2. Note all node IDs

**Command:**
```javascript
{
  command: "set_multiple_annotations",
  params: {
    annotations: [
      { nodeId: "NODE_1_ID", labelMarkdown: "First annotation" },
      { nodeId: "NODE_2_ID", labelMarkdown: "Second annotation" },
      { nodeId: "NODE_3_ID", labelMarkdown: "Third annotation" }
    ]
  }
}
```

**Expected Result:**
- `success: true`
- `annotationsApplied: 3`
- `annotationsFailed: 0`
- All results have `success: true`

**Verification Steps:**
1. Check all counters match
2. Verify each result entry
3. Confirm annotations visible on nodes

---

### Test 2: Partial Success (Mixed Results)

**Purpose:** Verify handling of mixed success/failure.

**Command:**
```javascript
{
  command: "set_multiple_annotations",
  params: {
    annotations: [
      { nodeId: "VALID_NODE_ID", labelMarkdown: "Valid annotation" },
      { nodeId: "999:999", labelMarkdown: "Invalid node" },
      { nodeId: "ANOTHER_VALID_ID", labelMarkdown: "Another valid" }
    ]
  }
}
```

**Expected Result:**
- `success: true` (at least one succeeded)
- `annotationsApplied: 2`
- `annotationsFailed: 1`
- Results array shows individual statuses

---

### Test 3: All Annotations Fail

**Purpose:** Verify handling when all fail.

**Command:**
```javascript
{
  command: "set_multiple_annotations",
  params: {
    annotations: [
      { nodeId: "999:991", labelMarkdown: "Invalid 1" },
      { nodeId: "999:992", labelMarkdown: "Invalid 2" }
    ]
  }
}
```

**Expected Result:**
- `success: false` (none succeeded)
- `annotationsApplied: 0`
- `annotationsFailed: 2`
- All results have `success: false` with errors

---

### Test 4: Single Annotation in Array

**Purpose:** Verify handling of single-item array.

**Command:**
```javascript
{
  command: "set_multiple_annotations",
  params: {
    annotations: [
      { nodeId: "NODE_ID", labelMarkdown: "Single annotation" }
    ]
  }
}
```

**Expected Result:**
- Works like `set_annotation` but with batch response format
- `totalAnnotations: 1`

---

### Test 5: Annotations with Categories

**Purpose:** Verify batch with category assignments.

**Command:**
```javascript
{
  command: "set_multiple_annotations",
  params: {
    annotations: [
      { nodeId: "NODE_1_ID", labelMarkdown: "Dev note", categoryId: "CAT_ID_1" },
      { nodeId: "NODE_2_ID", labelMarkdown: "Design note", categoryId: "CAT_ID_2" }
    ]
  }
}
```

**Expected Result:**
- Categories assigned to respective annotations
- All succeed if categories valid

---

### Test 6: Annotations with Properties

**Purpose:** Verify batch with custom properties.

**Command:**
```javascript
{
  command: "set_multiple_annotations",
  params: {
    annotations: [
      {
        nodeId: "NODE_1_ID",
        labelMarkdown: "Task 1",
        properties: [{ name: "Priority", value: "High" }]
      },
      {
        nodeId: "NODE_2_ID",
        labelMarkdown: "Task 2",
        properties: [{ name: "Priority", value: "Low" }]
      }
    ]
  }
}
```

**Expected Result:**
- Properties attached to each annotation
- All succeed

---

### Test 7: Large Batch of Annotations

**Purpose:** Verify handling of many annotations.

**Prerequisites:**
- Create 10+ nodes

**Command:**
```javascript
{
  command: "set_multiple_annotations",
  params: {
    annotations: [
      { nodeId: "NODE_1", labelMarkdown: "Annotation 1" },
      { nodeId: "NODE_2", labelMarkdown: "Annotation 2" },
      // ... 8 more
      { nodeId: "NODE_10", labelMarkdown: "Annotation 10" }
    ]
  }
}
```

**Expected Result:**
- All annotations processed
- Counters accurate
- No timeout

---

### Test 8: Empty Annotations Array (Error Case)

**Purpose:** Verify error for empty array.

**Command:**
```javascript
{
  command: "set_multiple_annotations",
  params: {
    annotations: []
  }
}
```

**Expected Result:**
- `success: false`
- `error: "No annotations provided"`

---

### Test 9: Missing Annotations Parameter (Error Case)

**Purpose:** Verify error for missing required parameter.

**Command:**
```javascript
{
  command: "set_multiple_annotations",
  params: {}
}
```

**Expected Result:**
- `success: false`
- `error: "No annotations provided"`

---

### Test 10: Annotation Missing nodeId (Error Case)

**Purpose:** Verify handling of incomplete annotation objects.

**Command:**
```javascript
{
  command: "set_multiple_annotations",
  params: {
    annotations: [
      { labelMarkdown: "Missing nodeId" },
      { nodeId: "VALID_ID", labelMarkdown: "Valid one" }
    ]
  }
}
```

**Expected Result:**
- First annotation fails with "Missing nodeId"
- Second annotation succeeds
- `annotationsApplied: 1`, `annotationsFailed: 1`

---

### Test 11: Annotation Missing labelMarkdown (Error Case)

**Purpose:** Verify handling of missing label.

**Command:**
```javascript
{
  command: "set_multiple_annotations",
  params: {
    annotations: [
      { nodeId: "NODE_ID" },
      { nodeId: "NODE_2_ID", labelMarkdown: "Has label" }
    ]
  }
}
```

**Expected Result:**
- First annotation fails with "Missing labelMarkdown"
- Second annotation succeeds

---

### Test 12: Same Node Multiple Times

**Purpose:** Verify annotating same node multiple times in batch.

**Command:**
```javascript
{
  command: "set_multiple_annotations",
  params: {
    annotations: [
      { nodeId: "SAME_NODE_ID", labelMarkdown: "First version" },
      { nodeId: "SAME_NODE_ID", labelMarkdown: "Second version" }
    ]
  }
}
```

**Expected Result:**
- Both operations succeed
- Final annotation on node is "Second version" (last one wins)

---

### Test 13: Mixed Valid and Invalid Node Types

**Purpose:** Verify batch across different node types.

**Command:**
```javascript
{
  command: "set_multiple_annotations",
  params: {
    annotations: [
      { nodeId: "FRAME_ID", labelMarkdown: "Frame annotation" },
      { nodeId: "RECTANGLE_ID", labelMarkdown: "Rectangle annotation" },
      { nodeId: "TEXT_ID", labelMarkdown: "Text annotation" }
    ]
  }
}
```

**Expected Result:**
- All annotatable types succeed
- Results reflect individual outcomes

---

## Sample Test Script

```javascript
/**
 * Test: set_multiple_annotations command
 * Prerequisites: Figma plugin connected, channel ID obtained
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdNodeIds = [];
let phase = 'create';
let createCount = 0;
const NODES_TO_CREATE = 5;

ws.on('open', () => {
  console.log('Connected to Figma MCP Extended');

  // Join channel
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  // Wait for join, then create multiple test frames
  setTimeout(() => {
    createTestNodes();
  }, 2000);
});

function createTestNodes() {
  if (createCount >= NODES_TO_CREATE) {
    console.log('All test nodes created:', createdNodeIds);
    phase = 'test_batch';
    setTimeout(() => runBatchTest(), 500);
    return;
  }

  console.log(`Creating test frame ${createCount + 1}...`);
  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "create_frame",
      params: {
        x: createCount * 220, y: 0, width: 200, height: 100,
        name: `Batch Test Frame ${createCount + 1}`
      },
      commandId: `create_frame_${createCount}`
    }
  }));
}

function runBatchTest() {
  console.log('\n=== Running batch annotation test ===');

  // Test with mix of valid and one invalid node
  const annotations = createdNodeIds.map((id, index) => ({
    nodeId: id,
    labelMarkdown: `Batch annotation #${index + 1}`,
    properties: [{ name: "Index", value: String(index + 1) }]
  }));

  // Add one invalid node to test error handling
  annotations.push({
    nodeId: "999:999",
    labelMarkdown: "This should fail"
  });

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_multiple_annotations",
      params: { annotations },
      commandId: "batch_test"
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
        createdNodeIds.push(result.id);
        console.log(`Created frame ${createCount + 1}:`, result.id);
        createCount++;
        setTimeout(() => createTestNodes(), 300);

      } else if (phase === 'test_batch') {
        console.log('\n=== Batch Annotation Results ===');
        console.log('Success:', result.success);
        console.log('Applied:', result.annotationsApplied);
        console.log('Failed:', result.annotationsFailed);
        console.log('Total:', result.totalAnnotations);

        console.log('\nIndividual results:');
        if (result.results) {
          result.results.forEach((r, i) => {
            if (r.success) {
              console.log(`  ${i + 1}. ✓ ${r.nodeId}`);
            } else {
              console.log(`  ${i + 1}. ✗ ${r.nodeId}: ${r.error}`);
            }
          });
        }

        // Test empty array error
        phase = 'test_empty';
        setTimeout(() => {
          console.log('\n=== Testing empty array ===');
          ws.send(JSON.stringify({
            type: "message",
            channel: CHANNEL_ID,
            message: {
              command: "set_multiple_annotations",
              params: { annotations: [] },
              commandId: "empty_test"
            }
          }));
        }, 500);

      } else if (phase === 'test_empty') {
        console.log('Empty array result:');
        console.log('  Success:', result.success);
        console.log('  Error:', result.error);

        console.log('\n=== All batch tests complete ===');
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
}, 120000);
```

---

## Validation Checklist

- [ ] Multiple annotations applied successfully
- [ ] Partial success handled correctly
- [ ] All failures handled correctly
- [ ] Single annotation in array works
- [ ] Categories in batch work
- [ ] Properties in batch work
- [ ] Large batch (10+) works without timeout
- [ ] Empty array returns error
- [ ] Missing annotations parameter returns error
- [ ] Missing nodeId in annotation handled
- [ ] Missing labelMarkdown in annotation handled
- [ ] Same node multiple times in batch works
- [ ] Mixed node types work
- [ ] `annotationsApplied` count accurate
- [ ] `annotationsFailed` count accurate
- [ ] `totalAnnotations` count accurate
- [ ] Individual `results` array populated correctly
- [ ] Error messages in results are descriptive
