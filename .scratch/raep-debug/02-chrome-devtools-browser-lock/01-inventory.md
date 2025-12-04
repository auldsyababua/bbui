# STEP 1: INVENTORY

## Files Involved

### MCP Configuration
- **/home/workhorse/.claude.json**: ✅ EXISTS (1.1MB file)
  - Chrome DevTools MCP configured on line 2671-2681
  - Command: `npx -y chrome-devtools-mcp@latest`
  - CHROME_PATH env set to: `/usr/bin/chromium-browser`

### Profile Directory
- **/home/workhorse/.cache/chrome-devtools-mcp/chrome-profile/**: ✅ EXISTS
  - **CRITICAL**: Directory was deleted earlier but **recreated automatically**
  - Last modified: Dec 4 11:58 (recent)
  - Indicates MCP server process recreated it after deletion

### Chrome/Chromium
- **/usr/bin/chromium-browser**: ✅ EXISTS
  - Version: Chromium 142.0.7444.175 snap
  - Symlink at /opt/google/chrome/chrome: ✅ EXISTS (created earlier)

## Dependencies

- **chromium-browser**: ✅ INSTALLED (v142.0.7444.175)
- **npx**: ✅ AVAILABLE (from npm)
- **chrome-devtools-mcp**: ✅ RUNNING (npm package via npx)
- **Node.js**: ✅ AVAILABLE (for MCP server)

## Running Processes

### MCP Server Processes
Current chrome-devtools-mcp server processes:
- **PID 3900633**: node /home/workhorse/.npm/_npx/.../chrome-devtools-mcp
  - Status: RUNNING
  - Started: ~11:56 (from earlier ps output)
  - **This is the current session's MCP server**

### Chrome/Chromium Processes
- No Chromium browser processes running (verified earlier)
- No Chrome processes running

## Error Logs

### Error Message (from MCP tool calls)
```
The browser is already running for /home/workhorse/.cache/chrome-devtools-mcp/chrome-profile.
Use --isolated to run multiple browser instances.
```

### Error Occurrence
- First occurred: After previous Claude Code sessions
- Persists after: User restarted Claude Code
- Persists after: Deleting profile directory
- Persists after: Killing stale MCP processes

## Environment

### Environment Variables
- **CHROME_PATH**: Set to `/usr/bin/chromium-browser` (in .claude.json)

### MCP Server Configuration
From `/home/workhorse/.claude.json` (lines 2671-2681):
```json
"chrome-devtools": {
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "chrome-devtools-mcp@latest"],
  "env": {
    "CHROME_PATH": "/usr/bin/chromium-browser"
  }
}
```

## Previous Investigation Actions

1. ✅ Killed 6 stale chrome-devtools-mcp processes from old sessions
2. ✅ Removed /home/workhorse/.cache/chrome-devtools-mcp/chrome-profile/ directory
3. ✅ Removed SingletonLock files
4. ❌ Error still persists
5. ⚠️ Profile directory **automatically recreated** by MCP server

## Key Findings

1. **Root Issue**: MCP server process (PID 3900633) has **internal state** that tracks browser as "running"
2. **Profile Recreation**: Deleting profile doesn't help because MCP recreates it
3. **No Browser Running**: No actual Chromium processes exist
4. **Lock is Internal**: Lock is maintained in MCP server memory, not just filesystem

## BetterST Inventory Planning

**Thought 1**: Need to check MCP config, Chrome processes, profile locks, MCP servers, error logs
**Thought 2**: Already have investigation data - MCP config found, multiple stale processes killed, profile deleted but error persists
**Thought 3**: Key files: .claude.json (MCP config), chrome-profile directory (was deleted), Chrome processes, MCP server processes (2 running)
**Thought 4**: Dependencies: chromium-browser, npx, CHROME_PATH env var. Error logs not directly accessible.
