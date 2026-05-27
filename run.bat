@echo off
setlocal

:: Get the directory of the batch file
set "BASE_DIR=%~dp0"

echo Starting Mock Test App...
echo Base Directory: "%BASE_DIR%"

:: Start the Server
start "Mock App Server" /D "%BASE_DIR%server" cmd /k "node node_modules\tsx\dist\cli.mjs watch src\index.ts"

:: Start the Client
start "Mock App Client" /D "%BASE_DIR%client" cmd /k "node node_modules\next\dist\bin\next dev"

echo.
echo Servers are starting in separate windows.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
pause
