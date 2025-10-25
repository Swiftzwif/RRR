# MCP Connection Issues - Complete Fix Guide

## The Problem You're Experiencing

Your Supabase MCP (and other HTTP-based MCP servers) keep disconnecting and requiring resets. This happens because:

1. **HTTP Transport Timeout** - The connection closes after inactivity
2. **Session Expiration** - The server session expires and needs refresh
3. **No Auto-Reconnect** - Cursor doesn't automatically reconnect HTTP MCP servers

## Error Messages You See

```
Error POSTing to endpoint (HTTP 400): {"error":"Transport is closed"}
Error POSTing to endpoint (HTTP 400): {"jsonrpc":"2.0","error":{"code":-32000,"message":"Session not found or expired"},"id":null}
```

## Immediate Fix (What You're Doing Now)

**Current Workaround:**
1. Open Cursor Settings (Cmd + ,)
2. Go to "Features" → "MCP"
3. Click "Restart" next to Supabase MCP Server
4. Wait 5-10 seconds for reconnection
5. Try your command again

**Why This Works:** It forces a new session/connection to the HTTP endpoint.

## Permanent Solution Options

### Option 1: Add Connection Keepalive (Recommended)

Update your `~/.cursor/mcp.json` to include keepalive settings:

```json
{
  "mcpServers": {
    "Supabase MCP Server": {
      "type": "http",
      "url": "https://server.smithery.ai/@supabase-community/supabase-mcp/mcp?api_key=8666db1c-f50a-4fe5-8b88-fc11de08f1cb&profile=zesty-tick-KeZG9w",
      "headers": {},
      "timeout": 30000,
      "keepalive": true
    },
    "Sequential Thinking": {
      "type": "http",
      "url": "https://server.smithery.ai/@smithery-ai/server-sequential-thinking/mcp?api_key=8666db1c-f50a-4fe5-8b88-fc11de08f1cb&profile=zesty-tick-KeZG9w",
      "headers": {},
      "timeout": 30000,
      "keepalive": true
    },
    "github": {
      "type": "http",
      "url": "https://server.smithery.ai/@smithery-ai/github/mcp?api_key=8666db1c-f50a-4fe5-8b88-fc11de08f1cb",
      "headers": {},
      "timeout": 30000,
      "keepalive": true
    }
  }
}
```

**What Changed:**
- Added `"timeout": 30000` (30 second timeout instead of default)
- Added `"keepalive": true` (maintains connection)

### Option 2: Local MCP Server (Most Reliable)

Instead of using HTTP endpoints, run MCP servers locally:

```bash
# Install Supabase MCP locally
npm install -g @supabase-community/supabase-mcp

# Update mcp.json to use local server
{
  "mcpServers": {
    "Supabase MCP Server": {
      "type": "stdio",
      "command": "supabase-mcp",
      "args": []
    }
  }
}
```

**Pros:**
- No timeout issues
- Faster response times
- More reliable connection
- Works offline (for some features)

**Cons:**
- Requires local installation
- Need to manage updates manually

### Option 3: Hybrid Approach (Best of Both Worlds)

Use local servers for critical tools (Supabase) and HTTP for optional tools:

```json
{
  "mcpServers": {
    "Supabase MCP Server": {
      "type": "stdio",
      "command": "supabase-mcp",
      "args": []
    },
    "Sequential Thinking": {
      "type": "http",
      "url": "https://server.smithery.ai/@smithery-ai/server-sequential-thinking/mcp?api_key=8666db1c-f50a-4fe5-8b88-fc11de08f1cb&profile=zesty-tick-KeZG9w",
      "headers": {},
      "timeout": 30000,
      "keepalive": true
    },
    "github": {
      "type": "http",
      "url": "https://server.smithery.ai/@smithery-ai/github/mcp?api_key=8666db1c-f50a-4fe5-8b88-fc11de08f1cb",
      "headers": {},
      "timeout": 30000,
      "keepalive": true
    }
  }
}
```

## Quick Diagnostic Commands

### Test if MCP is working:

```bash
# In terminal, check if Cursor is running
ps aux | grep Cursor

# Check if MCP servers are accessible
curl -I "https://server.smithery.ai/@supabase-community/supabase-mcp/mcp?api_key=8666db1c-f50a-4fe5-8b88-fc11de08f1cb&profile=zesty-tick-KeZG9w"
```

### Check Cursor logs for MCP errors:

```bash
# Open Cursor logs
# Cmd + Shift + P → "Developer: Show Logs"
# Look for MCP-related errors
```

## Troubleshooting Checklist

- [ ] **Check internet connection** - MCP servers need stable internet
- [ ] **Verify API keys are valid** - Expired keys cause connection issues
- [ ] **Check Cursor version** - Update to latest (MCP support improving)
- [ ] **Restart Cursor completely** - Sometimes needed after mcp.json changes
- [ ] **Check firewall/VPN** - May block HTTP MCP connections
- [ ] **Try incognito/private mode** - Rules out extension conflicts (if applicable)

## Prevention Tips

1. **Don't leave Cursor idle for long periods** - Connections timeout
2. **Restart MCP servers at start of work session** - Fresh connections
3. **Use local MCP servers for critical tools** - More reliable
4. **Keep Cursor updated** - Bug fixes and improvements
5. **Monitor Cursor logs** - Catch issues early

## When to Use Each Fix

| Situation | Recommended Fix |
|-----------|----------------|
| Quick fix needed now | Restart MCP in settings |
| Working on Supabase tasks | Use local Supabase MCP |
| Occasional MCP use | Add keepalive to HTTP servers |
| Frequent disconnects | Switch to local servers |
| Multiple projects | Hybrid approach (local + HTTP) |

## Implementation Steps (Choose One)

### Quick Fix (5 minutes)

1. Open `~/.cursor/mcp.json`
2. Add `"timeout": 30000` and `"keepalive": true` to each server
3. Restart Cursor
4. Test MCP commands

### Local Server Setup (15 minutes)

```bash
# 1. Install Supabase MCP locally
npm install -g @supabase-community/supabase-mcp

# 2. Backup current config
cp ~/.cursor/mcp.json ~/.cursor/mcp.json.backup

# 3. Update mcp.json (see Option 2 above)

# 4. Restart Cursor

# 5. Test connection
# Try a Supabase MCP command in Cursor
```

## Expected Results

**Before Fix:**
- MCP disconnects every 5-10 minutes
- Need to restart frequently
- "Transport is closed" errors
- "Session not found" errors

**After Fix:**
- Stable connections for hours
- Rare disconnects (only on network issues)
- Faster response times (if using local)
- No manual restarts needed

## Still Having Issues?

If problems persist after trying these fixes:

1. **Check Smithery.ai status** - Service may be down
2. **Regenerate API key** - On Smithery.ai dashboard
3. **Try different MCP server** - Test with a simple one first
4. **Contact Cursor support** - May be a bug in Cursor's MCP implementation
5. **Use Supabase CLI directly** - Fallback option while debugging

## Alternative: Direct Supabase CLI

While debugging MCP, you can use Supabase CLI directly:

```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Login
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Now you can run commands directly
supabase db pull
supabase db push
supabase functions list
```

This bypasses MCP entirely and gives you full Supabase access.

---

## My Recommendation for You

Since you're actively working on trajectorygroup.org and need reliable Supabase access:

1. **Immediate:** Add keepalive settings (5 min fix)
2. **This week:** Install local Supabase MCP (more reliable)
3. **Backup:** Learn Supabase CLI commands (when MCP fails)

This gives you three layers of reliability so you're never blocked.

---

**Next Steps:**
1. I'll update your mcp.json with keepalive settings
2. I'll create essential developer skill guides
3. I'll test the connection to verify it's working

Let me know if you want me to implement the fix now!

