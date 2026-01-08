# Figma MCP Extended

A powerful Figma plugin that extends MCP (Model Context Protocol) capabilities, enabling AI assistants to communicate with Figma via WebSocket for AI-assisted design operations.

## Overview

This plugin consists of two components:
- **Figma Plugin** (client) - Runs inside Figma and communicates with the WebSocket server
- **WebSocket Server** (server) - Runs locally on your machine to relay messages between AI tools and Figma

### Features

- **75 commands** across 14 categories
- Full programmatic access to Figma designs
- Create shapes, text, frames, vectors, and SVGs
- Modify styling, layout, and typography
- Work with components and instances
- Extract design tokens and file data
- Export images and assets

## Prerequisites

- [Bun](https://bun.sh) runtime installed
- Figma Desktop App or browser version
- Port 3055 available (or configure a different port)

## Installation

### 1. Install Bun

If you don't have Bun installed:

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1|iex"
```

### 2. Clone the Repository

```bash
git clone https://github.com/anthropics/figma-mcp-extended.git
cd figma-mcp-extended
bun install
```

### 3. Import Plugin to Figma

**Option A: Using Figma Desktop App**

1. Open Figma Desktop App
2. Go to **Plugins** → **Development** → **Import plugin from manifest**
3. Navigate to the cloned repository folder
4. Select the `manifest.json` file
5. Click **Open**

**Option B: Using Figma in Browser**

1. Open any Figma file in your browser
2. Click the Figma menu → **Plugins** → **Development** → **Import plugin from manifest**
3. Browse to the plugin directory and select `manifest.json`

The plugin will now appear in your **Development** plugins list.

## Usage

### Step 1: Start the WebSocket Server

Navigate to the plugin directory and start the server:

```bash
bun socket.ts
```

You should see:
```
WebSocket server running on port 3055
```

**Keep this terminal window open** - the server must be running for the plugin to work.

### Step 2: Run the Plugin in Figma

1. Open any Figma file
2. Right-click → **Plugins** → **Development** → **Figma MCP Extended**
3. The plugin window will open

### Step 3: Connect to Server

1. In the plugin window, verify the port is `3055` (default)
2. Click the **Connect** button
3. You should see: `Connected to MCP server on port 3055 in channel: [random-id]`

### Step 4: Use with AI Tools

Once connected, you can use AI assistants (Claude, etc.) to interact with your Figma designs through the MCP protocol.

## Configuration

### Change Server Port

If port 3055 is already in use, you can modify the port:

1. **In socket.ts** (line 40):
   ```typescript
   port: 3055,  // Change to your desired port
   ```

2. **In the Figma plugin UI**:
   - Enter your custom port number before clicking Connect

### Windows WSL Setup

If you're using Windows with WSL, uncomment this line in `socket.ts` (line 42):

```typescript
hostname: "0.0.0.0",  // Uncomment this line
```

This allows WSL to accept connections from Windows.

## API Reference

See the [API Documentation](docs/INDEX.md) for the complete list of 75 commands across 14 categories:

- Document & Pages (8 commands)
- Shape Creation (12 commands)
- Styling (8 commands)
- Text (9 commands)
- Node Operations (10 commands)
- Layout (5 commands)
- Components (5 commands)
- Images & Export (2 commands)
- Annotations (3 commands)
- Instances & Overrides (2 commands)
- Connections (3 commands)
- Extraction & Analysis (6 commands)
- Scanning (1 command)
- Utility (1 command)

## Troubleshooting

### Error: "ERR_CONNECTION_REFUSED"

**Problem:** WebSocket server is not running

**Solution:**
1. Make sure you've started the server: `bun socket.ts`
2. Check if port 3055 is available: `lsof -i :3055` (macOS/Linux) or `netstat -an | findstr 3055` (Windows)
3. Verify no firewall is blocking port 3055

### Error: "Channel name is required"

**Problem:** WebSocket connection failed during channel join

**Solution:**
1. Disconnect and reconnect the plugin
2. Restart the WebSocket server
3. Clear browser cache if using Figma in browser

### Plugin Not Appearing in Figma

**Problem:** Plugin not showing in Development menu

**Solution:**
1. Make sure you imported from `manifest.json` (not the folder)
2. Try **Plugins** → **Development** → **View all development plugins**
3. Re-import the plugin if needed
4. Restart Figma Desktop App

### "Not connected to MCP server"

**Problem:** Plugin UI shows disconnected state

**Solution:**
1. Verify WebSocket server is running (check terminal)
2. Check console for error messages (Right-click plugin → Inspect)
3. Make sure port number matches in both server and plugin UI
4. Try closing and reopening the plugin

### WebSocket Disconnects Frequently

**Problem:** Connection drops during use

**Solution:**
1. Check your internet connection stability
2. Disable VPN if active
3. Increase timeout in socket.ts if needed
4. Check system firewall settings

### Bun Command Not Found

**Problem:** `bun: command not found` error

**Solution:**
1. Restart your terminal after installing Bun
2. Add Bun to PATH manually:
   ```bash
   # Add to ~/.bashrc or ~/.zshrc
   export PATH="$HOME/.bun/bin:$PATH"
   ```
3. Verify installation: `bun --version`

### Port Already in Use

**Problem:** `Error: Address already in use`

**Solution:**
1. Find what's using port 3055:
   ```bash
   # macOS/Linux
   lsof -i :3055

   # Windows
   netstat -ano | findstr :3055
   ```
2. Kill the process or use a different port (see Configuration section)

## File Structure

```
figma-mcp-extended/
├── manifest.json       # Figma plugin configuration
├── code.js            # Plugin backend logic (built)
├── src/               # TypeScript source files
│   ├── index.ts       # Main entry point
│   ├── types.ts       # Type definitions
│   └── commands/      # Command implementations
├── ui.html            # Plugin user interface
├── socket.ts          # WebSocket server
├── docs/              # API documentation
└── tests/             # Test cases
```

## Development

### Building the Plugin

```bash
bun run build
```

### Watch Mode (Development)

```bash
bun run dev
```

### Type Checking

```bash
bun run typecheck
```

### Modifying the Plugin

1. Edit files in `src/` or `ui.html`
2. Run `bun run build` to compile
3. In Figma: **Plugins** → **Development** → **Hot reload plugin**

### Debugging

**View Console Logs:**
1. Right-click on plugin window
2. Select **Inspect** (Chrome DevTools)
3. Go to **Console** tab

**Server Logs:**
- All WebSocket activity is logged in the terminal where you ran `bun socket.ts`

## Tech Stack

- **Runtime:** Bun (TypeScript)
- **WebSocket:** Built-in Bun WebSocket API
- **Figma Plugin API:** Latest version
- **Communication:** Channel-based WebSocket messaging

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and questions:
1. Check the Troubleshooting section above
2. Review console logs for error messages
3. Open an issue on GitHub
