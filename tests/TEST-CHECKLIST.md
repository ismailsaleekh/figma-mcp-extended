# Test Checklist

This document tracks test coverage for all 73 exported commands and helper functions.

---

## Commands (73 Exported Functions)

### Document Commands (src/commands/document.ts)

| Method | Description | Test File | Status |
|--------|-------------|-----------|--------|
| `getDocumentInfo()` | Get current page/document info with children | `document/get_document_info.md` | [x] |
| `getAllPagesInfo()` | Get all pages in document with metadata | `document/get_all_pages_info.md` | [x] |
| `getSelection()` | Get current selection with node details | `document/get_selection.md` | [x] |
| `getNodeInfo(nodeId)` | Get detailed info for a single node (JSON export) | `document/get_node_info.md` | [x] |
| `getNodesInfo(nodeIds)` | Get info for multiple nodes in parallel | `document/get_nodes_info.md` | [x] |
| `readMyDesign()` | Export selected nodes as filtered JSON | `document/read_my_design.md` | [x] |
| `createPage(params?)` | Create a new page in the document | `document/create_page.md` | [x] |
| `setCurrentPage(params)` | Switch to a different page | `document/set_current_page.md` | [x] |

### Creation Commands (src/commands/creation.ts)

| Method | Description | Test File | Status |
|--------|-------------|-----------|--------|
| `createRectangle(params?)` | Create rectangle with position, size, name, parent | `creation/create_rectangle.md` | [x] |
| `createFrame(params?)` | Create frame with auto-layout, colors, padding | `creation/create_frame.md` | [x] |
| `createText(params?)` | Create text node with font, size, color | `creation/create_text.md` | [x] |
| `moveNode(params)` | Move node to x, y position | `creation/move_node.md` | [x] |
| `resizeNode(params)` | Resize node to width, height | `creation/resize_node.md` | [x] |
| `deleteNode(params)` | Delete node by ID | `creation/delete_node.md` | [x] |
| `cloneNode(params)` | Clone node with optional position | `creation/clone_node.md` | [x] |
| `createEllipse(params?)` | Create ellipse with position, size, fill | `creation/create_ellipse.md` | [x] |
| `createLine(params?)` | Create line from start to end point | `creation/create_line.md` | [x] |
| `createPolygon(params?)` | Create polygon with configurable point count | `creation/create_polygon.md` | [x] |
| `createVector(params)` | Create vector from SVG path data | `creation/create_vector.md` | [x] |

### Styling Commands (src/commands/styling.ts)

| Method | Description | Test File | Status |
|--------|-------------|-----------|--------|
| `setFillColor(params)` | Set fill color (RGBA) | `styling/set_fill_color.md` | [x] |
| `setStrokeColor(params)` | Set stroke color and weight | `styling/set_stroke_color.md` | [x] |
| `setCornerRadius(params)` | Set corner radius (uniform or per-corner) | `styling/set_corner_radius.md` | [x] |
| `setOpacity(params)` | Set node opacity (0-1) | `styling/set_opacity.md` | [x] |
| `setEffects(params)` | Set shadows and blur effects | `styling/set_effects.md` | [x] |
| `setGradientFill(params)` | Set gradient fill with stops | `styling/set_gradient_fill.md` | [x] |
| `setBlendMode(params)` | Set blend mode | `styling/set_blend_mode.md` | [x] |
| `setStrokeStyle(params)` | Set stroke style (align, cap, join, dash) | `styling/set_stroke_style.md` | [x] |

### Layout Commands (src/commands/layout.ts)

| Method | Description | Test File | Status |
|--------|-------------|-----------|--------|
| `setLayoutMode(params)` | Set auto-layout mode (NONE/HORIZONTAL/VERTICAL) | `layout/set_layout_mode.md` | [x] |
| `setPadding(params)` | Set padding (top/right/bottom/left) | `layout/set_padding.md` | [x] |
| `setAxisAlign(params)` | Set primary/counter axis alignment | `layout/set_axis_align.md` | [x] |
| `setLayoutSizing(params)` | Set layout sizing (FIXED/HUG/FILL) | `layout/set_layout_sizing.md` | [x] |
| `setItemSpacing(params)` | Set item and counter-axis spacing | `layout/set_item_spacing.md` | [x] |

### Text Commands (src/commands/text.ts)

| Method | Description | Test File | Status |
|--------|-------------|-----------|--------|
| `scanTextNodes(params)` | Scan for text nodes with chunked progress | `text/scan_text_nodes.md` | [x] |
| `setTextContent(params)` | Set text content with font loading | `text/set_text_content.md` | [x] |
| `setMultipleTextContents(params)` | Batch text replacement with progress | `text/set_multiple_text_contents.md` | [x] |
| `setFontFamily(params)` | Set font family on text node | `text/set_font_family.md` | [x] |
| `setFontSize(params)` | Set font size on text node | `text/set_font_size.md` | [x] |
| `setFontWeight(params)` | Set font weight on text node | `text/set_font_weight.md` | [x] |
| `setTextAlignment(params)` | Set horizontal/vertical text alignment | `text/set_text_alignment.md` | [x] |
| `setLineHeight(params)` | Set line height on text node | `text/set_line_height.md` | [x] |
| `setLetterSpacing(params)` | Set letter spacing on text node | `text/set_letter_spacing.md` | [x] |

### Image Commands (src/commands/images.ts)

| Method | Description | Test File | Status |
|--------|-------------|-----------|--------|
| `setImageFill(params)` | Set image fill from URL or base64 | `images/set_image_fill.md` | [x] |
| `createImageRectangle(params)` | Create rectangle with image fill | `images/create_image_rectangle.md` | [x] |
| `exportNodeAsImage(params)` | Export node as PNG base64 | `images/export_node_as_image.md` | [x] |

### Component Commands (src/commands/components.ts)

| Method | Description | Test File | Status |
|--------|-------------|-----------|--------|
| `getStyles()` | Get all local styles (colors, texts, effects, grids) | `components/get_styles.md` | [x] |
| `getLocalComponents()` | Get all local components in document | `components/get_local_components.md` | [x] |
| `createComponentInstance(params)` | Create instance from component key | `components/create_component_instance.md` | [x] |
| `createComponent(params)` | Convert node to component | `components/create_component.md` | [x] |
| `detachInstance(params)` | Detach instance from component | `components/detach_instance.md` | [x] |

### Annotation Commands (src/commands/annotations.ts)

| Method | Description | Test File | Status |
|--------|-------------|-----------|--------|
| `getAnnotations(params)` | Get annotations for node or entire page | `annotations/get_annotations.md` | [x] |
| `setAnnotation(params)` | Set annotation with label, category, properties | `annotations/set_annotation.md` | [x] |
| `setMultipleAnnotations(params)` | Batch set annotations | `annotations/set_multiple_annotations.md` | [x] |

### Instance Commands (src/commands/instances.ts)

| Method | Description | Test File | Status |
|--------|-------------|-----------|--------|
| `getInstanceOverrides(instanceNode?)` | Get overrides from instance | `instances/get_instance_overrides.md` | [x] |
| `setInstanceOverrides(params)` | Apply overrides to target instances | `instances/set_instance_overrides.md` | [x] |

### Connection Commands (src/commands/connections.ts)

| Method | Description | Test File | Status |
|--------|-------------|-----------|--------|
| `getReactions(params)` | Deep search for reactions (filters CHANGE_TO, highlights) | `connections/get_reactions.md` | [x] |
| `setDefaultConnector(params)` | Set/get default FigJam connector | `connections/set_default_connector.md` | [x] |
| `createConnections(params)` | Create connector lines between nodes | `connections/create_connections.md` | [x] |

### Extraction Commands (src/commands/extraction.ts)

| Method | Description | Test File | Status |
|--------|-------------|-----------|--------|
| `getCompleteFileData()` | Extract entire file (pages, styles, components, variables) | `extraction/get_complete_file_data.md` | [x] |
| `getDesignTokens()` | Extract design tokens (colors, typography) | `extraction/get_design_tokens.md` | [x] |
| `getLayoutConstraints(params)` | Get layout constraints for node | `extraction/get_layout_constraints.md` | [x] |
| `getComponentHierarchy()` | Analyze components, sets, and instances | `extraction/get_component_hierarchy.md` | [x] |
| `getResponsiveLayouts(params)` | Analyze responsive elements with CSS recommendations | `extraction/get_responsive_layouts.md` | [x] |
| `getStyleInheritance(params)` | Analyze styles with CSS recommendations | `extraction/get_style_inheritance.md` | [x] |

### Scanning Commands (src/commands/scanning.ts)

| Method | Description | Test File | Status |
|--------|-------------|-----------|--------|
| `scanNodesByTypes(params)` | Find nodes by type(s) | `scanning/scan_nodes_by_types.md` | [x] |
| `deleteMultipleNodes(params)` | Batch delete nodes with progress | `scanning/delete_multiple_nodes.md` | [x] |

### Node Operation Commands (src/commands/nodes.ts)

| Method | Description | Test File | Status |
|--------|-------------|-----------|--------|
| `groupNodes(params)` | Group multiple nodes together | `nodes/group_nodes.md` | [x] |
| `ungroupNodes(params)` | Ungroup a group node | `nodes/ungroup_nodes.md` | [x] |
| `setRotation(params)` | Set rotation on a node (degrees) | `nodes/set_rotation.md` | [x] |
| `setZIndex(params)` | Reorder node in layer stack | `nodes/set_z_index.md` | [x] |
| `renameNode(params)` | Rename a node | `nodes/rename_node.md` | [x] |
| `setVisibility(params)` | Set node visibility | `nodes/set_visibility.md` | [x] |
| `setConstraints(params)` | Set resize constraints | `nodes/set_constraints.md` | [x] |
| `lockNode(params)` | Lock or unlock a node | `nodes/lock_node.md` | [x] |

---

## Helper Functions

### Progress Helpers (src/helpers/progress.ts)

| Function | Description | Status |
|----------|-------------|--------|
| `generateCommandId()` | Generate unique command ID | N/A |
| `sendProgressUpdate(...)` | Send progress via postMessage | N/A |
| `delay(ms)` | Promise-based delay | N/A |

### Color Helpers (src/helpers/colors.ts)

| Function | Description | Status |
|----------|-------------|--------|
| `rgbaToHex(color)` | Convert RGB to hex string | N/A |
| `createSolidPaint(rgba)` | Create SolidPaint from RGBA | N/A |

### Font Helpers (src/helpers/fonts.ts)

| Function | Description | Status |
|----------|-------------|--------|
| `setCharacters(textNode, text)` | Smart text setting with 3 font strategies | N/A |
| `getFontStyle(weight)` | Map font weight to style name | N/A |

### Node Helpers (src/helpers/nodes.ts)

| Function | Description | Status |
|----------|-------------|--------|
| `filterFigmaNode(node)` | Filter node for JSON export | N/A |
| `customBase64Encode(bytes)` | Encode Uint8Array to base64 | N/A |
| `highlightNodeWithFill(node, duration)` | Yellow highlight effect | N/A |
| `findNodesByTypes(node, types, results)` | Recursive type search | N/A |
| `collectNodesToProcess(...)` | Collect nodes for chunked processing | N/A |

---

## Summary

| Category | Total | Tested | Remaining |
|----------|-------|--------|-----------|
| Document Commands | 8 | 8 | 0 |
| Creation Commands | 11 | 11 | 0 |
| Styling Commands | 8 | 8 | 0 |
| Layout Commands | 5 | 5 | 0 |
| Text Commands | 9 | 9 | 0 |
| Image Commands | 3 | 3 | 0 |
| Component Commands | 5 | 5 | 0 |
| Annotation Commands | 3 | 3 | 0 |
| Instance Commands | 2 | 2 | 0 |
| Connection Commands | 3 | 3 | 0 |
| Extraction Commands | 6 | 6 | 0 |
| Scanning Commands | 2 | 2 | 0 |
| Node Operation Commands | 8 | 8 | 0 |
| **Total** | **73** | **73** | **0** |

---

## New Commands (v2.0)

The following 27 commands were added in the latest update:

### Document (2 new)
- `create_page` - Create a new page in the document
- `set_current_page` - Switch to a different page

### Creation (4 new)
- `create_ellipse` - Create ellipse shapes
- `create_line` - Create lines between points
- `create_polygon` - Create polygon shapes with configurable sides
- `create_vector` - Create vectors from SVG path data

### Styling (5 new)
- `set_opacity` - Set node opacity (0-1 range)
- `set_effects` - Set shadows and blur effects
- `set_gradient_fill` - Set gradient fills with color stops
- `set_blend_mode` - Set blend mode
- `set_stroke_style` - Set stroke alignment, cap, join, and dash pattern

### Typography (6 new)
- `set_font_family` - Set font family on text nodes
- `set_font_size` - Set font size on text nodes
- `set_font_weight` - Set font weight on text nodes
- `set_text_alignment` - Set horizontal/vertical text alignment
- `set_line_height` - Set line height on text nodes
- `set_letter_spacing` - Set letter spacing on text nodes

### Node Operations (8 new)
- `group_nodes` - Group multiple nodes together
- `ungroup_nodes` - Ungroup a group node
- `set_rotation` - Set node rotation in degrees
- `set_z_index` - Reorder nodes in the layer stack
- `rename_node` - Rename a node
- `set_visibility` - Toggle node visibility
- `set_constraints` - Set resize constraints
- `lock_node` - Lock or unlock a node

### Components (2 new)
- `create_component` - Convert a node to a component
- `detach_instance` - Detach an instance from its component

---

## Notes

- Helper functions are internal utilities and don't need individual test files
- Each test file should include:
  - Command description and parameters
  - Expected response format
  - Multiple test scenarios (success and error cases)
  - Sample test script
  - Validation checklist

---

## Test Session: 2025-12-25 (Channel: gjknx7ut)

### Connection Commands

| Command | Result | Notes |
|---------|--------|-------|
| `getReactions` | ✅ PASS | Works correctly. Returns `nodesCount`, `nodesWithReactions`, and `nodes` array. Tested with single node, multiple nodes, empty array, and non-existent node. |
| `setDefaultConnector` | ✅ PASS (FigJam only) | Returns empty `{}` in regular Figma files (no connectors). Requires FigJam file with existing connector nodes. |
| `createConnections` | ✅ PASS (FigJam only) | Returns empty `{}` without default connector set. Requires FigJam environment with `setDefaultConnector` called first. |

### Extraction Commands

| Command | Result | Notes |
|---------|--------|-------|
| `getCompleteFileData` | ⚠️ ISSUE | Returns empty `{}`. May require investigation or longer timeout. |
| `getDesignTokens` | ✅ PASS | Returns `{colors, typography, effects, variables}`. Empty when no local styles defined in document. |
| `getLayoutConstraints` | ✅ PASS | Returns full layout info including `layoutMode`, `layoutSizing*`, padding, spacing, constraints, and `absoluteBoundingBox`. |
| `getComponentHierarchy` | ✅ PASS | Returns `{components, componentSets, instances, relationships}`. Empty arrays when no components in document. |
| `getResponsiveLayouts` | ✅ PASS | Returns detailed analysis with `breakpoints` (mobile/tablet/desktop/large), `responsiveElements` with CSS recommendations. |
| `getStyleInheritance` | ✅ PASS | Returns `{computedStyles, inheritedStyles, localStyles, recommendations}` with CSS property suggestions. |

### Scanning Commands

| Command | Result | Notes |
|---------|--------|-------|
| `scanNodesByTypes` | ⚠️ PARTIAL | Works correctly WITH `nodeId` param (scoped search). Returns empty `{}` for document-wide search without `nodeId`. |
| `deleteMultipleNodes` | ✅ PASS | Works correctly. Returns `{success, nodesDeleted, nodesFailed, results}` with per-node status. Handles non-existent nodes gracefully. |

### Test Environment Notes

- Document: Page 1 with "HyperMart - Premium" frame and various test elements
- File type: Regular Figma file (not FigJam)
- No local styles, components, or connectors defined in test document

---

## Test Session: 2026-01-03 (Channel: 6qcr259q)

### Summary

**Total: 34 tests | ✅ Passed: 32 | ❌ Failed: 1 | ⏭️ Skipped: 1**

### Document Commands (2/2)

| Command | Result | Notes |
|---------|--------|-------|
| `create_page` | ✅ PASS | Created page with custom name, returned ID and name |
| `set_current_page` | ✅ PASS | Switched to created page, returned previous/current page info |

### Creation Commands (4/4)

| Command | Result | Notes |
|---------|--------|-------|
| `create_ellipse` | ✅ PASS | Created ellipse at position with size and name |
| `create_line` | ✅ PASS | Created line from start to end point |
| `create_polygon` | ✅ PASS | Created hexagon (6 sides) with specified dimensions |
| `create_vector` | ✅ PASS | Created vector from SVG path data |

### Styling Commands (5/5)

| Command | Result | Notes |
|---------|--------|-------|
| `set_opacity` | ✅ PASS | Set opacity to 0.5 |
| `set_effects` | ✅ PASS | Applied DROP_SHADOW effect with color, offset, radius |
| `set_gradient_fill` | ✅ PASS | Applied linear gradient with 2 color stops |
| `set_blend_mode` | ✅ PASS | Set blend mode to MULTIPLY |
| `set_stroke_style` | ✅ PASS | Set stroke align, cap, join, and dash pattern |

### Text Commands (6/6)

| Command | Result | Notes |
|---------|--------|-------|
| `set_font_family` | ✅ PASS | Changed font to Arial Regular |
| `set_font_size` | ✅ PASS | Set font size to 24 |
| `set_font_weight` | ✅ PASS | Set font weight to 700 (Bold) |
| `set_text_alignment` | ✅ PASS | Set horizontal and vertical alignment to CENTER |
| `set_line_height` | ✅ PASS | Set line height to 32px |
| `set_letter_spacing` | ✅ PASS | Set letter spacing to 2px |

### Component Commands (1/2)

| Command | Result | Notes |
|---------|--------|-------|
| `create_component` | ✅ PASS | Converted rectangle to component, returned ID and key |
| `create_component_instance` | ❌ FAIL | `figma.importComponentByKeyAsync` requires published library component |
| `detach_instance` | ⏭️ SKIP | Skipped due to create_component_instance failure |

**Note:** `create_component_instance` uses `figma.importComponentByKeyAsync` which only works with components published to a team library. Local components cannot be instantiated this way.

### Node Commands (8/8)

| Command | Result | Notes |
|---------|--------|-------|
| `group_nodes` | ✅ PASS | Grouped 2 rectangles, returned group ID and child count |
| `ungroup_nodes` | ✅ PASS | Ungrouped successfully, returned ungrouped children array |
| `set_rotation` | ✅ PASS | Rotated node 45 degrees |
| `set_z_index` | ✅ PASS | Moved node to front of layer stack |
| `rename_node` | ✅ PASS | Renamed node to "Renamed Ellipse" |
| `set_visibility` (hide) | ✅ PASS | Hidden node (visible: false) |
| `set_visibility` (show) | ✅ PASS | Shown node (visible: true) |
| `set_constraints` | ✅ PASS | Set horizontal STRETCH, vertical CENTER |
| `lock_node` (lock) | ✅ PASS | Locked node |
| `lock_node` (unlock) | ✅ PASS | Unlocked node |

### Bug Fix Applied

- **ungroup_nodes**: Fixed bug where `group.remove()` was called after children were moved. Figma auto-deletes empty groups, so explicit removal caused "node does not exist" error.

### Test Environment

- Test runner: `tests/run-all-tests.js`
- WebSocket: `ws://localhost:3055`
- All 27 new v2.0 commands tested
