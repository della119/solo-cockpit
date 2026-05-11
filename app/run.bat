@echo off
setlocal
title Solo Operator Cockpit
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js not found on PATH.
  echo Install Node.js 18+ from https://nodejs.org/
  pause
  exit /b 1
)

echo Checking dependencies...
call npm install --prefer-offline
if errorlevel 1 (
  echo npm install failed.
  pause
  exit /b 1
)

for /f "tokens=5" %%P in ('netstat -ano ^| findstr ":3001 " ^| findstr LISTENING') do taskkill /PID %%P /F >nul 2>nul
for /f "tokens=5" %%P in ('netstat -ano ^| findstr ":5173 " ^| findstr LISTENING') do taskkill /PID %%P /F >nul 2>nul

echo.
echo   Solo Operator Cockpit  -  http://localhost:5173
echo   Keep this window open. Close to stop.
echo.

call npm run dev

echo App stopped.
pause
