# STEP 0: SETUP

**Issue Being Debugged**: Chrome DevTools MCP browser lock preventing new page creation
**Working Directory**: `.scratch/raep-debug/02-chrome-devtools-browser-lock/`
**Created**: 2025-12-04

## Issue Description

The Chrome DevTools MCP server returns error: "The browser is already running for /home/workhorse/.cache/chrome-devtools-mcp/chrome-profile. Use --isolated to run multiple browser instances."

**Symptoms**:
- Cannot create new Chrome pages via `mcp__chrome-devtools__new_page`
- Cannot list pages via `mcp__chrome-devtools__list_pages`
- Error persists after restarting Claude Code session
- Error persists after removing profile directory

**Context**:
- User restarted Claude Code to clear MCP server state
- Chrome DevTools MCP is connected and shows 26 tools available
- Chromium is installed at /usr/bin/chromium-browser
- Multiple stale chrome-devtools-mcp processes from previous sessions

## Planned Directory Structure
- 00-setup.md (this file)
- 01-inventory.md
- 02-hypotheses.md
- 03-perplexity-leads.md
- 04-validation.md
- 05-quick-tests.md
- 06-research-full.md
- 07-decomposition.md
- 08-evaluation.md
- 10-handoff.md

## BetterST Setup Planning

**Thought 1**: Issue is about Chrome DevTools MCP browser lock. Need descriptive slug.
**Thought 2**: Selected 'chrome-devtools-browser-lock' as clear and specific.
**Thought 3**: Check existing folders to determine next sequence number (02).
