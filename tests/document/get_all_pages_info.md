# Test Case: get_all_pages_info

## Command
`get_all_pages`

## Description
Gets information about all pages in the Figma document, including metadata for each page.

## Parameters

None required.

## Expected Response

```json
{
  "documentName": "My Design File",
  "documentId": "0:0",
  "totalPages": 3,
  "currentPage": {
    "id": "0:1",
    "name": "Page 1",
    "childCount": 5
  },
  "pages": [
    {
      "id": "0:1",
      "name": "Page 1",
      "type": "PAGE",
      "childCount": 5,
      "isCurrentPage": true
    },
    {
      "id": "1:1",
      "name": "Page 2",
      "type": "PAGE",
      "childCount": 3,
      "isCurrentPage": false
    },
    {
      "id": "2:1",
      "name": "Components",
      "type": "PAGE",
      "childCount": 12,
      "isCurrentPage": false
    }
  ]
}
```

---

## Test Scenarios

### Test 1: Get All Pages in Single-Page Document

**Purpose:** Verify response with only one page.

**Prerequisites:**
- Document with single page

**Command:**
```javascript
{
  command: "get_all_pages",
  params: {}
}
```

**Expected Result:**
- `totalPages` equals 1
- `pages` array has one entry
- That entry has `isCurrentPage: true`

**Verification Steps:**
1. Check `totalPages` equals 1
2. Check `pages.length` equals 1
3. Verify `pages[0].isCurrentPage` is true

---

### Test 2: Get All Pages in Multi-Page Document

**Purpose:** Verify all pages are listed.

**Prerequisites:**
- Document with multiple pages (create in Figma)

**Command:**
```javascript
{
  command: "get_all_pages",
  params: {}
}
```

**Expected Result:**
- `totalPages` matches actual page count
- All pages listed in `pages` array
- Only one page has `isCurrentPage: true`

**Verification Steps:**
1. Count pages in Figma
2. Verify `totalPages` matches
3. Verify `pages.length` matches
4. Only one `isCurrentPage: true`

---

### Test 3: Verify Current Page Identification

**Purpose:** Verify current page is correctly marked.

**Command:**
```javascript
{
  command: "get_all_pages",
  params: {}
}
```

**Expected Result:**
- `currentPage.id` matches page with `isCurrentPage: true`
- `currentPage.name` matches that page's name

**Verification Steps:**
1. Find page with `isCurrentPage: true`
2. Verify its `id` matches `currentPage.id`
3. Verify its `name` matches `currentPage.name`

---

### Test 4: Verify Page Child Counts

**Purpose:** Verify childCount is accurate for each page.

**Prerequisites:**
- Create known number of frames on different pages

**Command:**
```javascript
{
  command: "get_all_pages",
  params: {}
}
```

**Expected Result:**
- Each page's `childCount` reflects actual top-level children

---

### Test 5: Verify Document Metadata

**Purpose:** Verify document name and ID are returned.

**Command:**
```javascript
{
  command: "get_all_pages",
  params: {}
}
```

**Expected Result:**
- `documentName` is not empty
- `documentId` is valid (usually "0:0")

**Verification Steps:**
1. Check `documentName` is a non-empty string
2. Check `documentId` is present

---

### Test 6: Verify Page Types

**Purpose:** Verify all pages have type "PAGE".

**Command:**
```javascript
{
  command: "get_all_pages",
  params: {}
}
```

**Expected Result:**
- Every entry in `pages` has `type: "PAGE"`

---

### Test 7: Get Pages After Adding New Page

**Purpose:** Verify new pages are detected.

**Prerequisites:**
1. Get initial page count
2. Create new page in Figma UI
3. Call get_all_pages again

**Expected Result:**
- `totalPages` increased by 1
- New page appears in `pages` array

---

### Test 8: Verify Page Order

**Purpose:** Verify pages are returned in correct order.

**Prerequisites:**
- Multiple pages with known order in Figma

**Command:**
```javascript
{
  command: "get_all_pages",
  params: {}
}
```

**Expected Result:**
- Pages appear in same order as Figma sidebar

---

## Sample Test Script

```javascript
/**
 * Test: get_all_pages command
 * Prerequisites: Figma plugin connected, channel ID obtained
 */

const WebSocket = require('ws');

const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WS_URL = 'ws://localhost:3055';

const ws = new WebSocket(WS_URL);

ws.on('open', () => {
  console.log('Connected to Figma MCP Extended');

  // Join channel
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));

  // Wait for join, then get all pages
  setTimeout(() => {
    console.log('Getting all pages info...');
    ws.send(JSON.stringify({
      type: "message",
      channel: CHANNEL_ID,
      message: {
        command: "get_all_pages",
        params: {},
        commandId: "all_pages_" + Date.now()
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
      console.log('\n=== Document Info ===');
      console.log('Document Name:', result.documentName);
      console.log('Document ID:', result.documentId);
      console.log('Total Pages:', result.totalPages);

      console.log('\n=== Current Page ===');
      console.log('Name:', result.currentPage.name);
      console.log('ID:', result.currentPage.id);
      console.log('Children:', result.currentPage.childCount);

      console.log('\n=== All Pages ===');
      result.pages.forEach((page, index) => {
        const current = page.isCurrentPage ? ' (CURRENT)' : '';
        console.log(`${index + 1}. ${page.name}${current}`);
        console.log(`   ID: ${page.id}`);
        console.log(`   Type: ${page.type}`);
        console.log(`   Children: ${page.childCount}`);
      });

      console.log('\n=== Validation ===');

      // Check totalPages matches
      if (result.totalPages === result.pages.length) {
        console.log('✓ totalPages matches pages array length');
      } else {
        console.log('✗ totalPages mismatch');
      }

      // Check only one current page
      const currentPages = result.pages.filter(p => p.isCurrentPage);
      if (currentPages.length === 1) {
        console.log('✓ Exactly one page marked as current');
      } else {
        console.log('✗ Wrong number of current pages:', currentPages.length);
      }

      // Check current page ID matches
      const markedCurrent = result.pages.find(p => p.isCurrentPage);
      if (markedCurrent && markedCurrent.id === result.currentPage.id) {
        console.log('✓ Current page ID matches');
      } else {
        console.log('✗ Current page ID mismatch');
      }

      // Check all types are PAGE
      const allPages = result.pages.every(p => p.type === 'PAGE');
      if (allPages) {
        console.log('✓ All entries have type PAGE');
      } else {
        console.log('✗ Some entries are not type PAGE');
      }

      ws.close();
    }

    if (result && result.error) {
      console.log('Error:', result.error);
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
}, 15000);
```

---

## Validation Checklist

- [ ] Response contains `documentName`, `documentId`, `totalPages`
- [ ] `currentPage` object has `id`, `name`, `childCount`
- [ ] `pages` is an array
- [ ] `totalPages` equals `pages.length`
- [ ] Each page has `id`, `name`, `type`, `childCount`, `isCurrentPage`
- [ ] All pages have `type: "PAGE"`
- [ ] Exactly one page has `isCurrentPage: true`
- [ ] `currentPage.id` matches page with `isCurrentPage: true`
- [ ] Page child counts are accurate
- [ ] Pages appear in correct order
- [ ] New pages are detected after creation
- [ ] Document name is not empty
