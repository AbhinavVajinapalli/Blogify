@echo off
echo ========================================
echo Blog Platform - Diagnostic Check
echo ========================================
echo.

echo [1] Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    goto :end
)
echo OK: Node.js is installed
echo.

echo [2] Checking npm installation...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed!
    goto :end
)
echo OK: npm is installed
echo.

echo [3] Checking if backend dependencies exist...
cd /d "%~dp0backend"
if not exist "node_modules\" (
    echo ERROR: Backend dependencies not installed!
    echo Installing backend dependencies now...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install backend dependencies!
        goto :end
    )
) else (
    echo OK: Backend dependencies found
)
echo.

echo [4] Checking if frontend dependencies exist...
cd /d "%~dp0frontend"
if not exist "node_modules\" (
    echo ERROR: Frontend dependencies not installed!
    echo Installing frontend dependencies now...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install frontend dependencies!
        goto :end
    )
) else (
    echo OK: Frontend dependencies found
)
echo.

echo ========================================
echo Diagnostic complete!
echo ========================================
echo.
echo If all checks passed, you can now run:
echo   start-servers.bat
echo.

:end
echo Press any key to exit...
pause > nul
