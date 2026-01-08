# Test Cases - Figma MCP Extended

## Overview
This folder contains test case documentation for all 46 plugin commands. Each markdown file describes how to test a specific method, including parameters, expected responses, and edge cases.

## Prerequisites
1. Figma plugin installed and running
2. Plugin connected via WebSocket (note the channel ID)
3. Figma document open with appropriate permissions

## Test Structure
Each test case file includes:
- **Method Overview**: What the command does
- **Parameters**: Required and optional params with types
- **Expected Response**: JSON response format
- **Test Cases**: Numbered scenarios (TC-XX-NNN format)
- **Edge Cases**: Boundary conditions table
- **Notes**: Implementation details

## Test Case Naming Convention
```
TC-[CMD]-[NNN]

Where:
  CMD = Command abbreviation (2-3 letters)
  NNN = Sequential number (001-999)

Examples:
  TC-CR-001 = Create Rectangle, test 1
  TC-MN-005 = Move Node, test 5
  TC-CT-012 = Create Text, test 12
```

---

## Command Categories

### Creation Commands (`/tests/creation/`)
| File | Command | Tests |
|------|---------|-------|
| [create-rectangle.md](creation/create-rectangle.md) | `create_rectangle` | 10 |
| [create-frame.md](creation/create-frame.md) | `create_frame` | 14 |
| [create-text.md](creation/create-text.md) | `create_text` | 17 |
| [move-node.md](creation/move-node.md) | `move_node` | 14 |
| [resize-node.md](creation/resize-node.md) | `resize_node` | 19 |
| [delete-node.md](creation/delete-node.md) | `delete_node` | 17 |
| [clone-node.md](creation/clone-node.md) | `clone_node` | 20 |

### Styling Commands (`/tests/styling/`)
| File | Command | Tests |
|------|---------|-------|
| set-fill-color.md | `set_fill_color` | TBD |
| set-stroke-color.md | `set_stroke_color` | TBD |
| set-corner-radius.md | `set_corner_radius` | TBD |

### Layout Commands (`/tests/layout/`)
| File | Command | Tests |
|------|---------|-------|
| set-layout-mode.md | `set_layout_mode` | TBD |
| set-padding.md | `set_padding` | TBD |
| set-axis-align.md | `set_axis_align` | TBD |
| set-layout-sizing.md | `set_layout_sizing` | TBD |
| set-item-spacing.md | `set_item_spacing` | TBD |

### Text Commands (`/tests/text/`)
| File | Command | Tests |
|------|---------|-------|
| scan-text-nodes.md | `scan_text_nodes` | TBD |
| set-text-content.md | `set_text_content` | TBD |
| set-multiple-text-contents.md | `set_multiple_text_contents` | TBD |

### Image Commands (`/tests/images/`)
| File | Command | Tests |
|------|---------|-------|
| set-image-fill.md | `set_image_fill` | TBD |
| create-image-rectangle.md | `create_image_rectangle` | TBD |
| export-node-as-image.md | `export_node_as_image` | TBD |

### Component Commands (`/tests/components/`)
| File | Command | Tests |
|------|---------|-------|
| get-styles.md | `get_styles` | TBD |
| get-local-components.md | `get_local_components` | TBD |
| create-component-instance.md | `create_component_instance` | TBD |

### Annotation Commands (`/tests/annotations/`)
| File | Command | Tests |
|------|---------|-------|
| get-annotations.md | `get_annotations` | TBD |
| set-annotation.md | `set_annotation` | TBD |
| set-multiple-annotations.md | `set_multiple_annotations` | TBD |

### Instance Commands (`/tests/instances/`)
| File | Command | Tests |
|------|---------|-------|
| get-instance-overrides.md | `get_instance_overrides` | TBD |
| set-instance-overrides.md | `set_instance_overrides` | TBD |

### Connection Commands (`/tests/connections/`)
| File | Command | Tests |
|------|---------|-------|
| get-reactions.md | `get_reactions` | TBD |
| set-default-connector.md | `set_default_connector` | TBD |
| create-connections.md | `create_connections` | TBD |

### Document Commands (`/tests/document/`)
| File | Command | Tests |
|------|---------|-------|
| get-document-info.md | `get_document_info` | TBD |
| get-all-pages.md | `get_all_pages` | TBD |
| get-selection.md | `get_selection` | TBD |
| get-node-info.md | `get_node_info` | TBD |
| get-nodes-info.md | `get_nodes_info` | TBD |
| read-my-design.md | `read_my_design` | TBD |

### Extraction Commands (`/tests/extraction/`)
| File | Command | Tests |
|------|---------|-------|
| get-complete-file-data.md | `get_complete_file_data` | TBD |
| get-design-tokens.md | `get_design_tokens` | TBD |
| get-layout-constraints.md | `get_layout_constraints` | TBD |
| get-component-hierarchy.md | `get_component_hierarchy` | TBD |
| get-responsive-layouts.md | `get_responsive_layouts` | TBD |
| get-style-inheritance.md | `get_style_inheritance` | TBD |

### Scanning Commands (`/tests/scanning/`)
| File | Command | Tests |
|------|---------|-------|
| scan-nodes-by-types.md | `scan_nodes_by_types` | TBD |
| delete-multiple-nodes.md | `delete_multiple_nodes` | TBD |

---

## Running Tests

### Manual Testing
1. Open Figma with the plugin running
2. Connect to the plugin WebSocket
3. Send commands as JSON via your client
4. Verify responses and Figma canvas state

### Example Request Format
```json
{
  "type": "execute-command",
  "command": "create_rectangle",
  "params": {
    "x": 100,
    "y": 100,
    "width": 200,
    "height": 150
  }
}
```

### Example Response Format
```json
{
  "type": "command-result",
  "id": "<request-id>",
  "result": {
    "id": "123:456",
    "name": "Rectangle",
    "x": 100,
    "y": 100,
    "width": 200,
    "height": 150
  }
}
```

---

## Test Coverage Summary

| Category | Commands | Tests Created |
|----------|----------|---------------|
| Creation | 7 | 7 |
| Styling | 3 | 0 |
| Layout | 5 | 0 |
| Text | 3 | 0 |
| Images | 3 | 0 |
| Components | 3 | 0 |
| Annotations | 3 | 0 |
| Instances | 2 | 0 |
| Connections | 3 | 0 |
| Document | 6 | 0 |
| Extraction | 6 | 0 |
| Scanning | 2 | 0 |
| **Total** | **46** | **7** |
