@echo off
rem Optional local generation. Requires Node22+ and the repository .env.
node "%~dp0generate-luna.cjs"
if errorlevel 1 (
  pause
  exit /b 1
)
start "" "%~dp0luna-demo.html"
