@echo off
echo ========================================
echo Stopping Blog Platform Servers
echo ========================================
echo.

echo Stopping Node.js processes...
taskkill /F /IM node.exe 2>nul

echo.
echo All servers stopped!
echo.
echo Press any key to exit...
pause > nul
