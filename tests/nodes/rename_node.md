# Test Case: rename_node

## Command
`rename_node`

## Description
Renames a node to a new name.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of node to rename |
| `name` | string | **Yes** | - | New name for the node |

## Expected Response

```json
{
  "id": "123:456",
  "oldName": "Rectangle 1",
  "newName": "Button Background"
}
```

---

## Test Scenarios

### Test 1: Rename Rectangle

**Purpose:** Verify basic renaming.

**Prerequisites:**
- Create a rectangle, note its ID

**Command:**
```javascript
{
  command: "rename_node",
  params: {
    nodeId: "NODE_ID",
    name: "Button Background"
  }
}
```

**Expected Result:**
- Node renamed to "Button Background"
- `newName` equals "Button Background"

---

### Test 2: Rename Frame

**Purpose:** Verify frame renaming.

**Command:**
```javascript
{
  command: "rename_node",
  params: {
    nodeId: "FRAME_ID",
    name: "Card Container"
  }
}
```

**Expected Result:**
- Frame renamed

---

### Test 3: Rename Text Node

**Purpose:** Verify text node renaming.

**Command:**
```javascript
{
  command: "rename_node",
  params: {
    nodeId: "TEXT_ID",
    name: "Header Title"
  }
}
```

**Expected Result:**
- Text node renamed

---

### Test 4: Rename to Empty String

**Purpose:** Verify empty name handling.

**Command:**
```javascript
{
  command: "rename_node",
  params: {
    nodeId: "NODE_ID",
    name: ""
  }
}
```

**Expected Result:**
- Node has empty name (or default behavior)

---

### Test 5: Rename with Special Characters

**Purpose:** Verify special characters in name.

**Command:**
```javascript
{
  command: "rename_node",
  params: {
    nodeId: "NODE_ID",
    name: "Button - Primary (Hover)"
  }
}
```

**Expected Result:**
- Name includes special characters

---

### Test 6: Rename with Unicode

**Purpose:** Verify unicode support.

**Command:**
```javascript
{
  command: "rename_node",
  params: {
    nodeId: "NODE_ID",
    name: "Кнопка"
  }
}
```

**Expected Result:**
- Unicode name applied correctly

---

### Test 7: Rename Multiple Times

**Purpose:** Verify sequential renaming.

**Commands (execute sequentially):**
```javascript
{ command: "rename_node", params: { nodeId: "NODE_ID", name: "Name 1" } }
{ command: "rename_node", params: { nodeId: "NODE_ID", name: "Name 2" } }
{ command: "rename_node", params: { nodeId: "NODE_ID", name: "Final Name" } }
```

**Expected Result:**
- Each rename succeeds
- Final name is "Final Name"

---

### Test 8: Missing name (Error Case)

**Purpose:** Verify error for missing parameter.

**Command:**
```javascript
{
  command: "rename_node",
  params: {
    nodeId: "NODE_ID"
  }
}
```

**Expected Result:**
- Error: "Missing name parameter"

---

### Test 9: Non-Existent Node (Error Case)

**Purpose:** Verify error for invalid node ID.

**Command:**
```javascript
{
  command: "rename_node",
  params: {
    nodeId: "999:999",
    name: "New Name"
  }
}
```

**Expected Result:**
- Error: "Node not found with ID: 999:999"

---

### Test 10: Missing nodeId (Error Case)

**Purpose:** Verify error for missing nodeId.

**Command:**
```javascript
{
  command: "rename_node",
  params: {
    name: "New Name"
  }
}
```

**Expected Result:**
- Error: "Missing nodeId parameter"

---

## Sample Test Script

```javascript
/**
 * Test: rename_node command
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let createdNodeId = null;
let phase = 'create';

const renameTests = [
  { name: "Basic rename", newName: "My Rectangle" },
  { name: "With special chars", newName: "Button - Primary (Active)" },
  { name: "With numbers", newName: "Card 01" },
  { name: "With spaces", newName: "   Spaced Name   " },
  { name: "Long name", newName: "This is a very long name for testing purposes" }
];

let currentTest = 0;

ws.on('open', () => {
  console.log('Connected');
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  setTimeout(() => {
    console.log('Creating test rectangle...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "create_rectangle",
        params: { width: 100, height: 100, name: "Original Name" },
        commandId: "create_node"
      }
    }));
  }, 2000);
});

function runRenameTest() {
  if (currentTest >= renameTests.length) {
    console.log('\n=== All rename tests complete ===');
    ws.close();
    return;
  }

  const test = renameTests[currentTest];
  console.log(`\nTest ${currentTest + 1}: ${test.name}`);

  ws.send(JSON.stringify({
    type: "message",
    channel: CHANNEL_ID,
    message: {
      command: "rename_node",
      params: { nodeId: createdNodeId, name: test.newName },
      commandId: `rename_${currentTest}`
    }
  }));
}

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;

    if (result && phase === 'create') {
      createdNodeId = result.id;
      console.log('Created node:', createdNodeId);
      phase = 'rename';
      setTimeout(() => runRenameTest(), 500);
    } else if (result && phase === 'rename') {
      console.log('  Old name:', result.oldName);
      console.log('  New name:', result.newName);
      console.log('  ✓ Rename successful');

      currentTest++;
      setTimeout(() => runRenameTest(), 500);
    }
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 60000);
```

---

## Validation Checklist

- [ ] Basic renaming works
- [ ] Frame can be renamed
- [ ] Text node can be renamed
- [ ] Empty name handled
- [ ] Special characters work
- [ ] Unicode characters work
- [ ] Sequential renames work
- [ ] `oldName` correct in response
- [ ] `newName` correct in response
- [ ] Error for missing name
- [ ] Error for non-existent node
- [ ] Error for missing nodeId
- [ ] Name visible in Figma layers panel
