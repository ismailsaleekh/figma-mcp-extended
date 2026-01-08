# Test Case: get_reactions

## Command
`get_reactions`

## Description
Performs a deep search for reactions (interactions/prototyping actions) in specified nodes and all their children. Filters out `CHANGE_TO` navigation reactions and highlights found nodes with an orange border animation.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeIds` | string[] | **Yes** | - | Array of node IDs to search (colon format) |

## Expected Response

```json
{
  "nodesCount": 3,
  "nodesWithReactions": 5,
  "nodes": [
    {
      "id": "123:456",
      "name": "Button",
      "type": "FRAME",
      "depth": 2,
      "hasReactions": true,
      "reactions": [...],
      "path": "Page > Frame > Button"
    }
  ]
}
```

### Node with Reactions Object
```json
{
  "id": "123:456",
  "name": "Interactive Button",
  "type": "INSTANCE",
  "depth": 1,
  "hasReactions": true,
  "reactions": [
    {
      "trigger": { "type": "ON_CLICK" },
      "action": { "type": "NODE", "destinationId": "789:012" }
    }
  ],
  "path": "Frame > Interactive Button"
}
```

---

## Test Scenarios

### Test 1: Get Reactions from Single Node with Reactions

**Purpose:** Verify basic reaction retrieval.

**Prerequisites:**
1. Create a frame with a prototype interaction (e.g., on-click navigate)
2. Note the frame ID

**Command:**
```javascript
{
  command: "get_reactions",
  params: {
    nodeIds: ["INTERACTIVE_NODE_ID"]
  }
}
```

**Expected Result:**
- `nodesCount: 1`
- `nodesWithReactions: 1`
- `nodes` array contains the node with reactions
- Node gets orange highlight animation

**Verification Steps:**
1. Check counts are accurate
2. Verify reaction data is present
3. Confirm visual highlight on node

---

### Test 2: Deep Search with Children

**Purpose:** Verify recursive search through children.

**Prerequisites:**
- Parent frame containing multiple interactive children

**Command:**
```javascript
{
  command: "get_reactions",
  params: {
    nodeIds: ["PARENT_FRAME_ID"]
  }
}
```

**Expected Result:**
- Finds reactions in parent and all children
- `depth` property reflects nesting level
- `path` shows hierarchy

---

### Test 3: Multiple Root Nodes

**Purpose:** Verify searching multiple nodes.

**Command:**
```javascript
{
  command: "get_reactions",
  params: {
    nodeIds: ["FRAME_1_ID", "FRAME_2_ID", "FRAME_3_ID"]
  }
}
```

**Expected Result:**
- All nodes and their children searched
- Results combined in single response
- `nodesCount` equals input array length

---

### Test 4: Node with No Reactions

**Purpose:** Verify handling of non-interactive nodes.

**Command:**
```javascript
{
  command: "get_reactions",
  params: {
    nodeIds: ["STATIC_FRAME_ID"]
  }
}
```

**Expected Result:**
- `nodesWithReactions: 0`
- `nodes` array is empty

---

### Test 5: CHANGE_TO Reactions Filtered Out

**Purpose:** Verify CHANGE_TO navigation is excluded.

**Prerequisites:**
- Node with CHANGE_TO reaction (component swap)
- Node with other reaction types

**Command:**
```javascript
{
  command: "get_reactions",
  params: {
    nodeIds: ["MIXED_REACTIONS_NODE_ID"]
  }
}
```

**Expected Result:**
- CHANGE_TO reactions not included
- Other reaction types present
- May result in empty if only CHANGE_TO

---

### Test 6: Various Reaction Types

**Purpose:** Verify different reaction types are captured.

**Prerequisites:**
- Nodes with various triggers: ON_CLICK, ON_HOVER, ON_DRAG, etc.

**Command:**
```javascript
{
  command: "get_reactions",
  params: {
    nodeIds: ["VARIOUS_TRIGGERS_PARENT_ID"]
  }
}
```

**Expected Result:**
- All trigger types captured
- Reaction data complete for each

---

### Test 7: Deeply Nested Reactions

**Purpose:** Verify deep hierarchy traversal.

**Prerequisites:**
- Nested structure (5+ levels deep)
- Interactive element at deepest level

**Command:**
```javascript
{
  command: "get_reactions",
  params: {
    nodeIds: ["TOP_LEVEL_ID"]
  }
}
```

**Expected Result:**
- Deep reactions found
- `depth` property accurate
- `path` shows full hierarchy

---

### Test 8: Empty nodeIds Array (Error Case)

**Purpose:** Verify error for empty input.

**Command:**
```javascript
{
  command: "get_reactions",
  params: {
    nodeIds: []
  }
}
```

**Expected Result:**
- Error: "Missing or invalid nodeIds parameter"

---

### Test 9: Missing nodeIds Parameter (Error Case)

**Purpose:** Verify error for missing parameter.

**Command:**
```javascript
{
  command: "get_reactions",
  params: {}
}
```

**Expected Result:**
- Error: "Missing or invalid nodeIds parameter"

---

### Test 10: Non-Existent Node IDs

**Purpose:** Verify handling of invalid nodes.

**Command:**
```javascript
{
  command: "get_reactions",
  params: {
    nodeIds: ["999:999", "998:998"]
  }
}
```

**Expected Result:**
- No crash
- `nodesCount` reflects input
- `nodesWithReactions: 0`

---

### Test 11: Mixed Valid and Invalid Node IDs

**Purpose:** Verify partial success.

**Command:**
```javascript
{
  command: "get_reactions",
  params: {
    nodeIds: ["VALID_NODE_ID", "999:999", "ANOTHER_VALID_ID"]
  }
}
```

**Expected Result:**
- Valid nodes processed
- Invalid nodes skipped
- Results from valid nodes returned

---

### Test 12: Progress Updates

**Purpose:** Verify progress tracking.

**Prerequisites:**
- Multiple nodes to search

**Command:**
```javascript
{
  command: "get_reactions",
  params: {
    nodeIds: ["NODE_1", "NODE_2", "NODE_3"]
  }
}
```

**Expected Result:**
- Progress updates sent during processing
- Final result after all nodes processed

---

## Sample Test Script

```javascript
/**
 * Test: get_reactions command
 * Prerequisites: Figma plugin connected, channel ID obtained,
 *                document contains nodes with prototype interactions
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

// Replace with actual node IDs that have prototype interactions
const TEST_NODE_IDS = ["REPLACE_WITH_INTERACTIVE_NODE_ID"];

const ws = new WebSocket(WS_URL);

let phase = 'test';

ws.on('open', () => {
  console.log('Connected to Figma MCP Extended');

  // Join channel
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  // Wait for join, then run tests
  setTimeout(() => {
    runTests();
  }, 2000);
});

function runTests() {
  console.log('\n=== Testing get_reactions ===');

  // Test 1: Error case - empty array
  console.log('\nTest 1: Empty nodeIds array');
  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "get_reactions",
      params: { nodeIds: [] },
      commandId: "test_empty"
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

    if (phase === 'test') {
      if (parsed.message.error) {
        console.log('Expected error:', parsed.message.error);
      }

      phase = 'test_invalid';

      // Test 2: Invalid node IDs
      setTimeout(() => {
        console.log('\nTest 2: Invalid node IDs');
        ws.send(JSON.stringify({
          type: "message",
          channel: CHANNEL_ID,
          message: {
            command: "get_reactions",
            params: { nodeIds: ["999:999"] },
            commandId: "test_invalid"
          }
        }));
      }, 500);

    } else if (phase === 'test_invalid') {
      console.log('Invalid node result:');
      console.log('  Nodes Count:', result?.nodesCount);
      console.log('  Nodes With Reactions:', result?.nodesWithReactions);

      phase = 'test_actual';

      // Test 3: Actual search (if valid IDs provided)
      if (TEST_NODE_IDS[0] !== "REPLACE_WITH_INTERACTIVE_NODE_ID") {
        setTimeout(() => {
          console.log('\nTest 3: Actual reaction search');
          ws.send(JSON.stringify({
            type: "message",
            channel: CHANNEL_ID,
            message: {
              command: "get_reactions",
              params: { nodeIds: TEST_NODE_IDS },
              commandId: "test_actual"
            }
          }));
        }, 500);
      } else {
        console.log('\n=== Skipping actual test (replace node IDs first) ===');
        ws.close();
      }

    } else if (phase === 'test_actual') {
      console.log('\n=== Reaction Search Results ===');
      console.log('Nodes Count:', result?.nodesCount);
      console.log('Nodes With Reactions:', result?.nodesWithReactions);

      if (result?.nodes && result.nodes.length > 0) {
        console.log('\nFound reactions:');
        result.nodes.forEach((node, i) => {
          console.log(`  ${i + 1}. ${node.name} (${node.type})`);
          console.log(`     Path: ${node.path}`);
          console.log(`     Depth: ${node.depth}`);
          console.log(`     Reactions: ${node.reactions?.length || 0}`);
        });
      }

      console.log('\n=== All tests complete ===');
      ws.close();
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

- [ ] Single node with reactions works
- [ ] Deep search finds child reactions
- [ ] Multiple root nodes work
- [ ] Nodes without reactions return empty
- [ ] CHANGE_TO reactions filtered out
- [ ] Various reaction types captured
- [ ] Deep nesting traversed correctly
- [ ] Empty array returns error
- [ ] Missing parameter returns error
- [ ] Non-existent nodes handled gracefully
- [ ] Mixed valid/invalid nodes work
- [ ] Progress updates sent
- [ ] Orange highlight animation applied
- [ ] `depth` property accurate
- [ ] `path` property shows hierarchy
- [ ] Response contains `nodesCount`, `nodesWithReactions`, `nodes`
