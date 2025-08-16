@echo off
echo 🚀 Starting Cozy Recommendations locally...

REM Check if Node.js is installed
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Create .env if it doesn't exist
if not exist ".env" (
    echo 📝 Creating .env file...
    copy .env.example .env
    echo ⚠️ Please edit .env file with your database credentials
)

REM Build the project
echo 🔨 Building project...
npm run build

REM Try different ports
echo 🔍 Finding available port...

REM Try port 3000
netstat -an | find "3000" >nul
if %ERRORLEVEL% neq 0 (
    echo ✅ Starting on port 3000
    set PORT=3000
    goto start
)

REM Try port 3001
netstat -an | find "3001" >nul
if %ERRORLEVEL% neq 0 (
    echo ✅ Starting on port 3001
    set PORT=3001
    goto start
)

REM Try port 8000
netstat -an | find "8000" >nul
if %ERRORLEVEL% neq 0 (
    echo ✅ Starting on port 8000
    set PORT=8000
    goto start
)

echo ⚠️ Using default port 4000
set PORT=4000

:start
echo 🌐 Server will be available at: http://localhost:%PORT%
echo 📱 Also try: http://127.0.0.1:%PORT%
set NODE_ENV=development
npm run dev

pause