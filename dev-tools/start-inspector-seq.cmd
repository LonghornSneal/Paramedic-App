@echo off
setlocal
cd /d "%~dp0.."
REM Launch Inspector using config and auto-start the 'seq' server
start "mcp-inspector" cmd /c "npx @modelcontextprotocol/inspector --config inspector.mcp.json --server seq"
ping -n 3 127.0.0.1 >nul
start "mcp-ui" "http://localhost:6274/"
exit /b 0
