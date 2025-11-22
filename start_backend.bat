@echo off
chcp 65001 >nul
echo ========================================
echo OptListing Backend Server
echo ========================================
echo.
cd /d %~dp0
echo 현재 폴더: %CD%
echo.
echo Python 확인 중...
py --version
if errorlevel 1 (
    echo python 명령어 시도 중...
    python --version
    if errorlevel 1 (
        echo ❌ Python을 찾을 수 없습니다!
        pause
        exit /b 1
    )
    set PYTHON_CMD=python
) else (
    set PYTHON_CMD=py
)
echo.
echo 서버 시작 중...
echo API: http://localhost:8000
echo Docs: http://localhost:8000/docs
echo.
echo ⚠️ 이 창을 닫지 마세요!
echo 서버를 중지하려면 Ctrl+C를 누르세요.
echo ========================================
echo.

%PYTHON_CMD% -m backend.main

if errorlevel 1 (
    echo.
    echo ❌ 서버 시작 실패!
    echo 에러 메시지를 확인하세요.
    pause
)



