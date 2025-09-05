@echo off
setlocal
cd /d C:\Users\HhsJa\OneDrive\Documents\GitHub\Paramedic-App
start "mcp-inspector" cmd /c "npx @modelcontextprotocol/inspector node .\node_modules\@modelcontextprotocol\server-filesystem\dist\index.js ."
REM wait briefly for server to start
ping -n 3 127.0.0.1 >nul
start "mcp-ui" "http://localhost:6274/?transport=stdio&serverCommand=node&serverArgs=C%3A%5CUsers%5CHhsJa%5COneDrive%5CDocuments%5CGitHub%5CParamedic-App%5Cnode_modules%5C%40modelcontextprotocol%5Cserver-filesystem%5Cdist%5Cindex.js&serverArgs=C%3A%5CUsers%5CHhsJa%5COneDrive%5CDocuments%5CGitHub%5CParamedic-App"
exit /b 0
