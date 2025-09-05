@echo off
setlocal
cd /d C:\Users\HhsJa\OneDrive\Documents\GitHub\Paramedic-App
start "mcp-inspector" cmd /c "npx @modelcontextprotocol/inspector node .\node_modules\mcp-smart-crawler\build\index.js"
ping -n 3 127.0.0.1 >nul
start "mcp-ui" "http://localhost:6274/"
exit /b 0
