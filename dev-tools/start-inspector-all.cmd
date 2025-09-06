@echo off
setlocal
set REPO=C:\Users\HhsJa\OneDrive\Documents\GitHub\Paramedic-App
cd /d %REPO%
REM Launch Inspector with absolute config path; connect any server from UI
start "mcp-inspector" cmd /c "npx @modelcontextprotocol/inspector --config %REPO%\inspector.mcp.json"
ping -n 3 127.0.0.1 >nul
start "mcp-ui" "http://localhost:6274/"
exit /b 0
