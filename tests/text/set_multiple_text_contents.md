# Test Case: set_multiple_text_contents

## Command
`set_multiple_text_contents`

## Description
Batch text replacement across multiple text nodes with progress tracking. Processes in chunks of 5 with delays for stability.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | Parent context ID (colon format) |
| `text` | array | **Yes** | - | Array of replacement objects |

### Text Array Item Structure

```json
{
  "nodeId": "123:456",
  "text": "New content"
}
```

## Expected Response

```json
{
  "success": true,
  "nodeId": "parent:123",
  "replacementsApplied": 8,
  "replacementsFailed": 2,
  "totalReplacements": 10,
  "results": [
    {
      "success": true,
      "nodeId": "123:456",
      "originalText": "Old text",
      "translatedText": "New text"
    },
    {
      "success": false,
      "nodeId": "789:012",
      "error": "Node not found or not a text node"
    }
  ],
  "commandId": "cmd_123"
}
```

---

## Test Scenarios

### Test 1: Replace Multiple Text Nodes

**Purpose:** Verify batch replacement works.

**Prerequisites:**
1. Create multiple text nodes
2. Note all text node IDs

**Command:**
```javascript
{
  command: "set_multiple_text_contents",
  params: {
    nodeId: "PARENT_ID",
    text: [
      { nodeId: "TEXT_1", text: "First replacement" },
      { nodeId: "TEXT_2", text: "Second replacement" },
      { nodeId: "TEXT_3", text: "Third replacement" }
    ]
  }
}
```

**Expected Result:**
- `success` is true
- `replacementsApplied` equals 3
- `replacementsFailed` equals 0
- All text nodes updated

---

### Test 2: Single Text Replacement

**Purpose:** Verify works with single item array.

**Command:**
```javascript
{
  command: "set_multiple_text_contents",
  params: {
    nodeId: "PARENT_ID",
    text: [
      { nodeId: "TEXT_NODE_ID", text: "Single replacement" }
    ]
  }
}
```

**Expected Result:**
- `replacementsApplied` equals 1
- `totalReplacements` equals 1

---

### Test 3: Large Batch (Chunking Test)

**Purpose:** Verify chunked processing for many items.

**Prerequisites:**
- 15+ text nodes

**Command:**
```javascript
{
  command: "set_multiple_text_contents",
  params: {
    nodeId: "PARENT_ID",
    text: [
      { nodeId: "TEXT_1", text: "Text 1" },
      { nodeId: "TEXT_2", text: "Text 2" },
      // ... 15 items total
      { nodeId: "TEXT_15", text: "Text 15" }
    ]
  }
}
```

**Expected Result:**
- All 15 replacements applied
- Processed in 3 chunks of 5
- Progress updates sent

---

### Test 4: Partial Failure

**Purpose:** Verify some succeed while others fail.

**Command:**
```javascript
{
  command: "set_multiple_text_contents",
  params: {
    nodeId: "PARENT_ID",
    text: [
      { nodeId: "VALID_TEXT_1", text: "Valid 1" },
      { nodeId: "999:999", text: "Invalid" },
      { nodeId: "VALID_TEXT_2", text: "Valid 2" }
    ]
  }
}
```

**Expected Result:**
- `success` is true (some succeeded)
- `replacementsApplied` equals 2
- `replacementsFailed` equals 1
- Results array shows which failed

---

### Test 5: All Replacements Fail

**Purpose:** Verify handling when all fail.

**Command:**
```javascript
{
  command: "set_multiple_text_contents",
  params: {
    nodeId: "PARENT_ID",
    text: [
      { nodeId: "999:999", text: "Invalid 1" },
      { nodeId: "888:888", text: "Invalid 2" }
    ]
  }
}
```

**Expected Result:**
- `success` is false (none succeeded)
- `replacementsApplied` equals 0
- `replacementsFailed` equals 2

---

### Test 6: Verify Original Text Captured

**Purpose:** Verify originalText is stored in results.

**Prerequisites:**
- Text node with content "Original Content"

**Command:**
```javascript
{
  command: "set_multiple_text_contents",
  params: {
    nodeId: "PARENT_ID",
    text: [
      { nodeId: "TEXT_ID", text: "New Content" }
    ]
  }
}
```

**Expected Result:**
- `results[0].originalText` equals "Original Content"
- `results[0].translatedText` equals "New Content"

---

### Test 7: Empty Text Array (Error Case)

**Purpose:** Verify error for empty array.

**Command:**
```javascript
{
  command: "set_multiple_text_contents",
  params: {
    nodeId: "PARENT_ID",
    text: []
  }
}
```

**Expected Result:**
- Error: "Missing required parameters"

---

### Test 8: Missing text Parameter (Error Case)

**Purpose:** Verify error when text array missing.

**Command:**
```javascript
{
  command: "set_multiple_text_contents",
  params: {
    nodeId: "PARENT_ID"
  }
}
```

**Expected Result:**
- Error: "Missing required parameters"

---

### Test 9: Missing nodeId in Array Item

**Purpose:** Verify handling of malformed array items.

**Command:**
```javascript
{
  command: "set_multiple_text_contents",
  params: {
    nodeId: "PARENT_ID",
    text: [
      { text: "No nodeId provided" }
    ]
  }
}
```

**Expected Result:**
- `results[0].success` equals false
- `results[0].error` equals "Missing parameters"

---

### Test 10: Missing text in Array Item

**Purpose:** Verify handling when text missing in item.

**Command:**
```javascript
{
  command: "set_multiple_text_contents",
  params: {
    nodeId: "PARENT_ID",
    text: [
      { nodeId: "TEXT_ID" }
    ]
  }
}
```

**Expected Result:**
- `results[0].success` equals false
- `results[0].error` equals "Missing parameters"

---

### Test 11: Replace with Empty Strings

**Purpose:** Verify empty text values work.

**Command:**
```javascript
{
  command: "set_multiple_text_contents",
  params: {
    nodeId: "PARENT_ID",
    text: [
      { nodeId: "TEXT_1", text: "" },
      { nodeId: "TEXT_2", text: "" }
    ]
  }
}
```

**Expected Result:**
- Both replacements succeed
- Text nodes become blank

---

### Test 12: Targeting Non-Text Nodes

**Purpose:** Verify non-text nodes fail gracefully.

**Command:**
```javascript
{
  command: "set_multiple_text_contents",
  params: {
    nodeId: "PARENT_ID",
    text: [
      { nodeId: "RECTANGLE_ID", text: "Should fail" },
      { nodeId: "FRAME_ID", text: "Should fail" }
    ]
  }
}
```

**Expected Result:**
- Both fail
- `error` contains "not a text node"

---

### Test 13: Unicode and Special Characters

**Purpose:** Verify batch supports unicode.

**Command:**
```javascript
{
  command: "set_multiple_text_contents",
  params: {
    nodeId: "PARENT_ID",
    text: [
      { nodeId: "TEXT_1", text: "Hello 世界" },
      { nodeId: "TEXT_2", text: "Price: $99.99" },
      { nodeId: "TEXT_3", text: "Line1\nLine2" }
    ]
  }
}
```

**Expected Result:**
- All special characters preserved
- Unicode handled correctly

---

### Test 14: Response Contains commandId

**Purpose:** Verify commandId returned for tracking.

**Command:**
```javascript
{
  command: "set_multiple_text_contents",
  params: {
    nodeId: "PARENT_ID",
    text: [{ nodeId: "TEXT_ID", text: "Test" }]
  },
  commandId: "my_custom_id"
}
```

**Expected Result:**
- `commandId` in response
- Can be used for progress tracking

---

## Sample Test Script

```javascript
/**
 * Test: set_multiple_text_contents command
 * Prerequisites: Figma plugin connected, channel ID obtained
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let frameId = null;
let textNodeIds = [];
let phase = 'create_frame';

ws.on('open', () => {
  console.log('Connected to Figma MCP Extended');

  // Join channel
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  // Create frame first
  setTimeout(() => {
    console.log('Creating frame...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_frame",
        params: {
          x: 0, y: 0, width: 400, height: 300,
          name: "Multi Text Test",
          layoutMode: "VERTICAL"
        },
        commandId: "create_frame"
      }
    }));
  }, 2000);
});

function createTextNodes() {
  const texts = ["Text One", "Text Two", "Text Three", "Text Four", "Text Five"];
  let created = 0;

  texts.forEach((text, i) => {
    setTimeout(() => {
      ws.send(JSON.stringify({
        type: "message",
        channel: CHANNEL_ID,
        message: {
          command: "create_text",
          params: {
            text: text,
            x: 20, y: 20 + (i * 40),
            parentId: frameId
          },
          commandId: `create_text_${i}`
        }
      }));
    }, i * 500);
  });

  // After creating all, run batch test
  setTimeout(() => {
    phase = 'batch_replace';
    runBatchTest();
  }, texts.length * 500 + 1000);
}

function runBatchTest() {
  console.log('\nRunning batch text replacement...');
  console.log('Text node IDs:', textNodeIds);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "set_multiple_text_contents",
      params: {
        nodeId: frameId,
        text: textNodeIds.map((id, i) => ({
          nodeId: id,
          text: `Replaced ${i + 1}`
        }))
      },
      commandId: "batch_replace"
    }
  }));
}

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  if (parsed.type === 'system') {
    if (parsed.message && parsed.message.includes('Joined')) {
      console.log('Channel joined successfully');
    }
    return;
  }

  if (parsed.sender === 'You') return;

  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;
    const commandId = parsed.message.commandId;

    if (result) {
      if (phase === 'create_frame') {
        frameId = result.id;
        console.log('Created frame:', frameId);
        phase = 'create_text';
        createTextNodes();
      } else if (phase === 'create_text' && commandId?.startsWith('create_text_')) {
        textNodeIds.push(result.id);
        console.log(`Created text node ${textNodeIds.length}:`, result.id);
      } else if (phase === 'batch_replace') {
        console.log('\nBatch replacement result:');
        console.log('  Success:', result.success);
        console.log('  Applied:', result.replacementsApplied);
        console.log('  Failed:', result.replacementsFailed);
        console.log('  Total:', result.totalReplacements);

        if (result.results) {
          console.log('\n  Individual results:');
          result.results.forEach((r, i) => {
            if (r.success) {
              console.log(`    ${i + 1}. ✓ "${r.originalText}" → "${r.translatedText}"`);
            } else {
              console.log(`    ${i + 1}. ✗ Error: ${r.error}`);
            }
          });
        }

        console.log('\n=== Batch test complete ===');

        // Test partial failure
        console.log('\nTesting partial failure...');
        ws.send(JSON.stringify({
          type: "message",
          channel: CHANNEL_ID,
          message: {
            command: "set_multiple_text_contents",
            params: {
              nodeId: frameId,
              text: [
                { nodeId: textNodeIds[0], text: "Valid" },
                { nodeId: "999:999", text: "Invalid" }
              ]
            },
            commandId: "partial_fail"
          }
        }));

        phase = 'partial_fail';
      } else if (phase === 'partial_fail') {
        console.log('Partial failure result:');
        console.log('  Applied:', result.replacementsApplied);
        console.log('  Failed:', result.replacementsFailed);
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
}, 90000);
```

---

## Validation Checklist

- [ ] Multiple text nodes replaced successfully
- [ ] Single item array works
- [ ] Large batches processed in chunks
- [ ] Partial failures handled (some succeed, some fail)
- [ ] All failures result in success: false
- [ ] Original text captured in results
- [ ] Translated text captured in results
- [ ] Empty array throws error
- [ ] Missing text parameter throws error
- [ ] Missing nodeId in array item fails gracefully
- [ ] Missing text in array item fails gracefully
- [ ] Empty string replacements work
- [ ] Non-text nodes fail gracefully
- [ ] Unicode and special characters preserved
- [ ] commandId returned in response
- [ ] Progress updates sent during processing
- [ ] Response contains replacementsApplied count
- [ ] Response contains replacementsFailed count
- [ ] Response contains totalReplacements count
- [ ] Individual results array present
