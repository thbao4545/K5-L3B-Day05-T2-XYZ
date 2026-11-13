@echo off
rem Double-click to open StudyFlow. This static demo needs no shell commands or server.
if not exist "%~dp0landing.html" (
  echo Cannot find landing.html. Keep the prototype folder together.
  pause
  exit /b 1
)
start "" "%~dp0landing.html"
