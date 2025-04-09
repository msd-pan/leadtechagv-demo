@echo off
:: 获取当前批处理文件所在的目录
set SCRIPT_DIR=%~dp0

:: 进入当前批处理文件所在目录
cd /d "%SCRIPT_DIR%"

:: 如果项目目录在批处理所在目录的子目录中，则可以直接导航到子目录
:: cd leadtechagv

:: 启动项目
npm run dev

pause
