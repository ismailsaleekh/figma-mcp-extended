# Test Case: set_min_max_size

## Command
`set_min_max_size`

## Description
Sets min/max width and height constraints on an auto-layout frame. Used for modals, bottom sheets, cards, and other elements that need bounded sizing.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodeId` | string | **Yes** | - | ID of auto-layout frame (colon format) |
| `minWidth` | number | No | - | Minimum width constraint |
| `maxWidth` | number | No | - | Maximum width constraint |
| `minHeight` | number | No | - | Minimum height constraint |
| `maxHeight` | number | No | - | Maximum height constraint |

**Note:** At least one of the four constraint values must be provided.

## Expected Response

```json
{
  "id": "123:456",
  "name": "Frame",
  "minWidth": 280,
  "maxWidth": 360,
  "minHeight": null,
  "maxHeight": null,
  "layoutMode": "VERTICAL"
}
```

---

## Test Scenarios

### Test 1: Set Min Width Only

**Purpose:** Verify setting a single constraint.

**Prerequisites:**
1. Create a frame with auto-layout enabled
2. Set sizing to HUG so constraints are meaningful

**Command:**
```javascript
{
  command: "set_min_max_size",
  params: {
    nodeId: "AUTO_LAYOUT_FRAME_ID",
    minWidth: 280
  }
}
```

**Expected Result:**
- `minWidth` equals 280
- Other constraints unchanged

**Verification Steps:**
1. Check `minWidth` equals 280
2. Confirm frame does not shrink below 280px

---

### Test 2: Set Max Width Only

**Purpose:** Verify maximum width constraint.

**Command:**
```javascript
{
  command: "set_min_max_size",
  params: {
    nodeId: "FRAME_ID",
    maxWidth: 360
  }
}
```

**Expected Result:**
- `maxWidth` equals 360
- Frame does not grow beyond 360px

---

### Test 3: Set Both Min and Max Width

**Purpose:** Verify bounded width range.

**Command:**
```javascript
{
  command: "set_min_max_size",
  params: {
    nodeId: "FRAME_ID",
    minWidth: 280,
    maxWidth: 360
  }
}
```

**Expected Result:**
- `minWidth` equals 280
- `maxWidth` equals 360
- Frame stays within 280-360px range

---

### Test 4: Set Min Height Only

**Purpose:** Verify minimum height constraint.

**Command:**
```javascript
{
  command: "set_min_max_size",
  params: {
    nodeId: "FRAME_ID",
    minHeight: 200
  }
}
```

**Expected Result:**
- `minHeight` equals 200
- Frame does not shrink below 200px height

---

### Test 5: Set All Four Constraints

**Purpose:** Verify setting all constraints at once.

**Command:**
```javascript
{
  command: "set_min_max_size",
  params: {
    nodeId: "FRAME_ID",
    minWidth: 280,
    maxWidth: 540,
    minHeight: 200,
    maxHeight: 600
  }
}
```

**Expected Result:**
- All four values set correctly
- Frame bounded in both dimensions

---

### Test 6: Modal Width Constraints (Common Pattern)

**Purpose:** Verify typical modal sizing.

**Command:**
```javascript
{
  command: "set_min_max_size",
  params: {
    nodeId: "MODAL_FRAME_ID",
    minWidth: 280,
    maxWidth: 360
  }
}
```

**Expected Result:**
- Modal frame respects 280-360px width range

---

### Test 7: Sheet Max Width (Common Pattern)

**Purpose:** Verify typical bottom sheet constraint.

**Command:**
```javascript
{
  command: "set_min_max_size",
  params: {
    nodeId: "SHEET_FRAME_ID",
    maxWidth: 540
  }
}
```

**Expected Result:**
- Sheet does not exceed 540px width

---

### Test 8: Card Min Height (Common Pattern)

**Purpose:** Verify typical card minimum height.

**Command:**
```javascript
{
  command: "set_min_max_size",
  params: {
    nodeId: "CARD_FRAME_ID",
    minHeight: 120
  }
}
```

**Expected Result:**
- Card maintains at least 120px height even with minimal content

---

### Test 9: Update Existing Constraints

**Purpose:** Verify constraints can be changed.

**Commands (execute sequentially):**
```javascript
// Set initial
{ command: "set_min_max_size", params: { nodeId: "FRAME_ID", minWidth: 200 } }

// Update
{ command: "set_min_max_size", params: { nodeId: "FRAME_ID", minWidth: 300 } }
```

**Expected Result:**
- Final `minWidth` is 300

---

### Test 10: No Constraints Provided (Error Case)

**Purpose:** Verify error when no values given.

**Command:**
```javascript
{
  command: "set_min_max_size",
  params: {
    nodeId: "FRAME_ID"
  }
}
```

**Expected Result:**
- Error: "At least one of minWidth, maxWidth, minHeight, or maxHeight must be provided"

---

### Test 11: Non-Auto-Layout Frame (Error Case)

**Purpose:** Verify error for frames without auto-layout.

**Command:**
```javascript
{
  command: "set_min_max_size",
  params: {
    nodeId: "REGULAR_FRAME_ID",
    minWidth: 280
  }
}
```

**Expected Result:**
- Error: "Min/max size constraints can only be set on auto-layout frames"

---

### Test 12: Non-Existent Node (Error Case)

**Purpose:** Verify error handling for invalid ID.

**Command:**
```javascript
{
  command: "set_min_max_size",
  params: {
    nodeId: "999:999",
    minWidth: 280
  }
}
```

**Expected Result:**
- Error: "Node with ID 999:999 not found"

---

### Test 13: Non-Frame Node (Error Case)

**Purpose:** Verify error for unsupported node types.

**Command:**
```javascript
{
  command: "set_min_max_size",
  params: {
    nodeId: "TEXT_NODE_ID",
    minWidth: 100
  }
}
```

**Expected Result:**
- Error: "Node type TEXT does not support min/max size constraints"

---

## Validation Checklist

- [ ] Min width constraint applied correctly
- [ ] Max width constraint applied correctly
- [ ] Min height constraint applied correctly
- [ ] Max height constraint applied correctly
- [ ] All four constraints can be set at once
- [ ] Individual constraints can be set independently
- [ ] Constraints can be updated
- [ ] Common patterns work (modal, sheet, card)
- [ ] Error for no constraints provided
- [ ] Error for non-auto-layout frame
- [ ] Error for non-existent node ID
- [ ] Error for non-frame node type
- [ ] Response contains all constraint values and layout mode
