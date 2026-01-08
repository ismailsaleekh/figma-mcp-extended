# Figma Plugin Instructions

**Mandatory documentation for all Figma-related tasks.**

---

## Required Reading

1. **[Operational Guide](docs/OPERATIONAL-GUIDE.md)** - Follow strictly
   - WebSocket connection procedures
   - Chunking strategies
   - Error handling

2. **[API Reference](docs/INDEX.md)** - Command documentation
   - 74 commands across 14 categories
   - Parameters and response formats

---

## Key Rules

- Use **WebSocket only** (port 3055) - no MCP, no REST API
- Convert node IDs: `4371-50004` → `4371:50004`
- Save scripts in `/ai-context/figma-parse/`
- Always close connections after use
