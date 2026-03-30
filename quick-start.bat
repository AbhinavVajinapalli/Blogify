@echo off
cls
echo ============================================
echo   BLOG PLATFORM - Simple Server Start
echo ============================================
echo.
echo This will start BOTH servers in THIS window.
echo You will see all the logs here.
echo.
echo FRONTEND will run on: http://localhost:3000
echo BACKEND will run on:  http://localhost:5000
echo.
echo Press Ctrl+C to stop the servers
echo ============================================
echo.
pause
echo.

cd /d "%~dp0"

echo [STEP 1] Installing/checking backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies!
    pause
    exit /b 1
)
echo.

echo [STEP 2] Installing/checking frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies!
    pause
    exit /b 1
)
echo.

echo [STEP 3] Starting backend server...
cd ..\backend
start /B cmd /c "npm run dev 2>&1"
echo Backend starting on http://localhost:5000
timeout /t 3 /nobreak > nul
echo.

echo [STEP 4] Starting frontend server...
cd ..\frontend
echo Frontend starting on http://localhost:3000
echo.
echo ============================================
echo   Servers are starting!
echo ============================================
echo.
echo Wait 20-30 seconds, then open in your browser:
echo.
echo   http://localhost:3000
echo.
echo You should see the beautiful new design!
echo.
echo Press Ctrl+C to stop both servers
echo ============================================
echo.

call npm start
