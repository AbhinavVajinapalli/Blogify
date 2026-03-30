@echo off
echo ========================================
echo Starting Blog Platform Servers
echo ========================================
echo.

echo Checking if dependencies are installed...
if not exist "%~dp0backend\node_modules\" (
    echo ERROR: Backend dependencies not found!
    echo Please run check-setup.bat first
    pause
    exit /b 1
)
if not exist "%~dp0frontend\node_modules\" (
    echo ERROR: Frontend dependencies not found!
    echo Please run check-setup.bat first
    pause
    exit /b 1
)
echo OK: Dependencies found
echo.

echo [1/2] Starting Backend Server (Port 5000)...
start "Backend Server - DO NOT CLOSE" cmd /k "cd /d "%~dp0backend" && echo Starting backend... && npm run dev"

echo Waiting 8 seconds for backend to initialize...
timeout /t 8 /nobreak > nul

echo [2/2] Starting Frontend Server (Port 3001)...
start "Frontend Server - DO NOT CLOSE" cmd /k "cd /d "%~dp0frontend" && echo Starting frontend... && npm start"

echo.
echo ========================================
echo Servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3001
echo.
echo Two command prompt windows have opened:
echo   - Backend Server (Port 5000)
echo   - Frontend Server (Port 3001)
echo.
echo IMPORTANT: Do NOT close those windows!
echo.
echo Wait 20-30 seconds for servers to fully start.
echo Look for these messages:
echo   Backend:  "Server running on port 5000"
echo   Frontend: "Compiled successfully!" or "webpack compiled"
echo.
echo Then open: http://localhost:3001 in your browser
echo.
echo If you see errors, take a screenshot and share it.
echo.
pause
