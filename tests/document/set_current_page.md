# Test Case: set_current_page

## Command
`set_current_page`

## Description
Switches to a different page in the Figma document by page ID.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `pageId` | string | **Yes** | - | ID of the page to switch to |

## Expected Response

```json
{
  "success": true,
  "previousPageId": "0:1",
  "previousPageName": "Page 1",
  "currentPageId": "1:2",
  "currentPageName": "Page 2"
}
```

---

## Test Scenarios

### Test 1: Switch to Existing Page

**Purpose:** Verify switching to a valid page works.

**Prerequisites:**
1. Create a second page using `create_page`
2. Note the page ID from the response

**Command:**
```javascript
{
  command: "set_current_page",
  params: {
    pageId: "PAGE_ID_HERE"
  }
}
```

**Expected Result:**
- `success` is true
- `currentPageId` matches provided pageId
- Figma UI shows the target page

**Verification Steps:**
1. Check `success` is true
2. Verify `currentPageId` equals the provided pageId
3. Confirm Figma canvas shows the target page

---

### Test 2: Switch Back to Original Page

**Purpose:** Verify switching back works.

**Prerequisites:**
1. Note the original page ID
2. Switch to another page
3. Switch back using original ID

**Expected Result:**
- Returns to original page
- `previousPageId` shows the page we switched from

---

### Test 3: Switch to Non-Existent Page (Error Case)

**Purpose:** Verify error handling for invalid page ID.

**Command:**
```javascript
{
  command: "set_current_page",
  params: {
    pageId: "999:999"
  }
}
```

**Expected Result:**
- Error: "Page not found with ID: 999:999"

---

### Test 4: Missing pageId Parameter (Error Case)

**Purpose:** Verify error for missing required parameter.

**Command:**
```javascript
{
  command: "set_current_page",
  params: {}
}
```

**Expected Result:**
- Error: "Missing pageId parameter"

---

### Test 5: Switch Between Multiple Pages

**Purpose:** Verify sequential page switching.

**Prerequisites:**
1. Create Page A, Page B, Page C
2. Note all page IDs

**Commands (execute sequentially):**
```javascript
{ command: "set_current_page", params: { pageId: "PAGE_A_ID" } }
{ command: "set_current_page", params: { pageId: "PAGE_B_ID" } }
{ command: "set_current_page", params: { pageId: "PAGE_C_ID" } }
{ command: "set_current_page", params: { pageId: "PAGE_A_ID" } }
```

**Expected Result:**
- Each switch succeeds
- `previousPageId` correctly tracks the previous page

---

## Sample Test Script

```javascript
/**
 * Test: set_current_page command
 * Prerequisites: Figma plugin connected, multiple pages exist
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

let originalPageId = null;
let newPageId = null;
let phase = 'get_pages';

ws.on('open', () => {
  console.log('Connected');
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  setTimeout(() => {
    // First, get all pages to find IDs
    console.log('Getting all pages...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "get_all_pages_info",
        params: {},
        commandId: "get_pages"
      }
    }));
  }, 2000);
});

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  if (parsed.type === 'broadcast' && parsed.sender === 'User') {
    const result = parsed.message.result;

    if (result && phase === 'get_pages') {
      console.log('Pages found:', result.totalPages);

      if (result.pages && result.pages.length >= 2) {
        originalPageId = result.currentPage.id;
        newPageId = result.pages.find(p => p.id !== originalPageId)?.id;

        if (newPageId) {
          phase = 'switch';
          console.log(`\nSwitching from ${originalPageId} to ${newPageId}...`);

          ws.send(JSON.stringify({
            type: "message",
            channel: CHANNEL_ID,
            message: {
              command: "set_current_page",
              params: { pageId: newPageId },
              commandId: "switch_page"
            }
          }));
        } else {
          console.log('Need at least 2 pages. Creating one...');
          phase = 'create';
          ws.send(JSON.stringify({
            type: "message",
            channel: CHANNEL_ID,
            message: {
              command: "create_page",
              params: { name: "Test Page" },
              commandId: "create_page"
            }
          }));
        }
      }
    } else if (result && phase === 'create') {
      newPageId = result.id;
      phase = 'switch';
      console.log(`Created page ${newPageId}, now switching...`);

      ws.send(JSON.stringify({
        type: "message",
        channel: CHANNEL_ID,
        message: {
          command: "set_current_page",
          params: { pageId: newPageId },
          commandId: "switch_page"
        }
      }));
    } else if (result && phase === 'switch') {
      console.log('\n=== Switch Result ===');
      console.log('Success:', result.success);
      console.log('Previous Page:', result.previousPageName, `(${result.previousPageId})`);
      console.log('Current Page:', result.currentPageName, `(${result.currentPageId})`);

      if (result.success && result.currentPageId === newPageId) {
        console.log('✓ Page switch successful');
      } else {
        console.log('✗ Page switch failed');
      }

      // Test error case
      phase = 'error_test';
      console.log('\nTesting error case (invalid page ID)...');
      ws.send(JSON.stringify({
        type: "message",
        channel: CHANNEL_ID,
        message: {
          command: "set_current_page",
          params: { pageId: "999:999" },
          commandId: "error_test"
        }
      }));
    } else if (phase === 'error_test') {
      if (parsed.message.error) {
        console.log('✓ Error correctly returned:', parsed.message.error);
      }
      ws.close();
    }
  }
});

ws.on('error', (err) => console.error('Error:', err));
setTimeout(() => ws.close(), 30000);
```

---

## Validation Checklist

- [ ] Successfully switches to existing page
- [ ] `success` is true on valid switch
- [ ] `previousPageId` correctly identifies the previous page
- [ ] `currentPageId` matches the target page
- [ ] `previousPageName` and `currentPageName` are accurate
- [ ] Error returned for non-existent page ID
- [ ] Error returned for missing pageId parameter
- [ ] Figma UI updates to show target page
- [ ] Can switch back and forth between pages
