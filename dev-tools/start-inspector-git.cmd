@echo off
setlocal
cd /d C:\Users\HhsJa\OneDrive\Documents\GitHub\Paramedic-App
start "mcp-inspector" cmd /c "npx @modelcontextprotocol/inspector"
ping -n 3 127.0.0.1 >nul
start "mcp-ui" "http://localhost:6274/?transport=stdio&serverCommand=node&serverArgs=C%3A%5CUsers%5CHhsJa%5COneDrive%5CDocuments%5CGitHub%5CParamedic-App%5Cnode_modules%5C%40cyanheads%5Cgit-mcp-server%5Cdist%5Cindex.js"
exit /b 0
