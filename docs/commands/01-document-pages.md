# Document & Pages

Commands for working with documents, pages, and node information.

---

## `get_document_info`

Get current page and document information.

**Parameters**: None

**Returns**:
```json
{
  "name": "Page Name",
  "id": "page_id",
  "type": "PAGE",
  "children": [{ "id": "...", "name": "...", "type": "..." }],
  "currentPage": { "id": "...", "name": "...", "childCount": 5 }
}
```

---

## `get_all_pages`

Get all pages in the document.

**Parameters**: None

**Returns**:
```json
{
  "documentName": "My Document",
  "documentId": "root_id",
  "totalPages": 3,
  "currentPage": { "id": "...", "name": "...", "childCount": 5 },
  "pages": [
    { "id": "...", "name": "Page 1", "type": "PAGE", "childCount": 10, "isCurrentPage": true }
  ]
}
```

---

## `get_selection`

Get currently selected nodes.

**Parameters**: None

**Returns**:
```json
{
  "selectionCount": 2,
  "selection": [
    { "id": "123:456", "name": "Frame 1", "type": "FRAME", "visible": true }
  ]
}
```

---

## `get_node_info`

Get detailed information about a specific node.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeId` | string | Yes | Node ID in colon format (e.g., "4371:50004") |

**Returns**: Full node data including fills, strokes, bounds, children

---

## `get_nodes_info`

Get information about multiple nodes in parallel.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nodeIds` | string[] | Yes | Array of node IDs |

**Returns**: Array of node data objects

---

## `read_my_design`

Export currently selected nodes as JSON structure.

**Parameters**: None (uses current selection)

**Returns**: Array of complete node hierarchies for selected nodes

---

## `create_page`

Create a new page in the document.

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | string | No | "New Page" | Name for the new page |
| `setAsCurrent` | boolean | No | false | Switch to the new page after creation |

**Returns**:
```json
{
  "id": "123:1",
  "name": "New Page",
  "type": "PAGE",
  "childCount": 0,
  "isCurrentPage": false
}
```

---

## `set_current_page`

Switch to a different page.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pageId` | string | Yes | ID of the page to switch to |

**Returns**:
```json
{
  "success": true,
  "previousPageId": "0:1",
  "previousPageName": "Page 1",
  "currentPageId": "123:1",
  "currentPageName": "Page 2"
}
```
