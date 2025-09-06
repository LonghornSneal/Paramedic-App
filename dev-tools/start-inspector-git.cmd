@echo off
setlocal
cd /d C:\Users\HhsJa\OneDrive\Documents\GitHub\Paramedic-App
REM Launch Inspector using config and auto-start the 'git' server
start "mcp-inspector" cmd /c "npx @modelcontextprotocol/inspector --config inspector.mcp.json --server git"
ping -n 3 127.0.0.1 >nul
start "mcp-ui" "http://localhost:6274/"
exit /b 0
