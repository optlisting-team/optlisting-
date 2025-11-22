# Backend Server Startup Script
Write-Host "`n=== OptListing Backend Server 시작 ===" -ForegroundColor Cyan
Write-Host ""

cd backend

Write-Host "Python 경로 확인..." -ForegroundColor Yellow
python --version

Write-Host "`n의존성 확인..." -ForegroundColor Yellow
if (Test-Path "requirements.txt") {
    Write-Host "✅ requirements.txt 발견" -ForegroundColor Green
} else {
    Write-Host "❌ requirements.txt 없음" -ForegroundColor Red
    exit 1
}

Write-Host "`n서버 시작 중..." -ForegroundColor Yellow
Write-Host "API 주소: http://localhost:8000" -ForegroundColor Cyan
Write-Host "API 문서: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""

python main.py



