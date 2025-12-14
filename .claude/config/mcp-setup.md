# MCP Server Setup Guide

Model Context Protocol (MCP) servers extend Claude Code's capabilities. Here's how to set them up for the Multi-Agent Development System.

## Required MCP Servers

These are essential for full system functionality:

### 1. Filesystem
**Purpose**: Secure file operations
**Status**: Built into Claude Code ✅
**No action needed**

### 2. Git
**Purpose**: Repository management
**Status**: Built into Claude Code ✅
**No action needed**

### 3. GitHub
**Purpose**: PR/issue management
**Installation**:
```bash
claude mcp add github --scope user
```

Configure with your GitHub token:
- Token needs: `repo`, `read:org` permissions
- Get token: https://github.com/settings/tokens

### 4. Web Search
**Purpose**: Research & documentation lookup
**Status**: Built into Claude Code ✅
**No action needed**

### 5. Time
**Purpose**: Timestamps & scheduling
**Status**: Built into Claude Code ✅
**No action needed**

## Optional MCP Servers

These enhance specific workflows:

### Figma (if available)
**Purpose**: Design token extraction from Figma
**Installation**: Check MCP marketplace or build custom

For now, use manual workflow:
1. Export Figma design code
2. Place in project folder
3. Tell UI/UX Designer agent where it is
4. Agent extracts tokens manually

### Perplexity
**Purpose**: Enhanced research capabilities
**Installation**:
```bash
claude mcp add perplexity --scope user
```

## Verifying Installation

Check installed MCP servers:
```bash
claude mcp list
```

## Configuration

MCP servers are configured in:
```
~/.claude/mcp-config.json
```

Or via Claude Code settings.

## Troubleshooting

### GitHub MCP Not Working
- Verify token has correct permissions
- Check token hasn't expired
- Ensure network connectivity

### MCP Command Not Found
- Update Claude Code to latest version
- MCP support requires Claude Code 1.0+

## System Integration

The Multi-Agent System expects these MCPs:
- **GitHub Admin agent**: Uses GitHub MCP for PR management
- **Backend/Frontend agents**: Use Filesystem MCP for file operations
- **Coordinator**: Uses Web Search for research

Without GitHub MCP, GitHub Admin will use git CLI commands as fallback.

## Adding More MCPs

Browse available MCPs:
- Official list: https://github.com/modelcontextprotocol/servers
- Community MCPs: Check Claude Code marketplace

Install custom MCP:
```bash
claude mcp add [mcp-name] --scope [user|project]
```

## Next Steps

1. ✅ Install GitHub MCP (optional but recommended)
2. ✅ Verify MCP list
3. ✅ Test system with `/build` command
4. ✅ Enjoy client-ready development!
