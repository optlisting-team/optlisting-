# OptListing 전체 서버 시작 스크립트
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "OptListing 서버 시작" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is available
Write-Host "Python 확인 중..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python을 찾을 수 없습니다!" -ForegroundColor Red
    exit 1
}

# Check if Node.js is available
Write-Host "`nNode.js 확인 중..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✅ $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js를 찾을 수 없습니다!" -ForegroundColor Red
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "백엔드 서버 시작 (포트 8000)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start backend server in new window
$backendScript = @"
cd '$PWD\backend'
Write-Host '=== 백엔드 서버 시작 ===' -ForegroundColor Cyan
Write-Host 'API: http://localhost:8000' -ForegroundColor Green
Write-Host 'Docs: http://localhost:8000/docs' -ForegroundColor Green
Write-Host ''
python main.py
"@

$backendScriptPath = "$env:TEMP\start_backend.ps1"
$backendScript | Out-File -FilePath $backendScriptPath -Encoding UTF8

Start-Process powershell -ArgumentList "-NoExit", "-File", $backendScriptPath

Write-Host "✅ 백엔드 서버 창이 열렸습니다" -ForegroundColor Green
Write-Host "서버가 시작될 때까지 10초 대기 중..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "프론트엔드 서버 시작 (포트 5173)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start frontend server in new window
$frontendScript = @"
cd '$PWD\frontend'
Write-Host '=== 프론트엔드 서버 시작 ===' -ForegroundColor Cyan
Write-Host 'URL: http://localhost:5173' -ForegroundColor Green
Write-Host ''
npm run dev
"@

$frontendScriptPath = "$env:TEMP\start_frontend.ps1"
$frontendScript | Out-File -FilePath $frontendScriptPath -Encoding UTF8

Start-Process powershell -ArgumentList "-NoExit", "-File", $frontendScriptPath

Write-Host "✅ 프론트엔드 서버 창이 열렸습니다" -ForegroundColor Green
Write-Host "서버가 시작될 때까지 15초 대기 중..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "더미 데이터 생성" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Generate dummy data
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/dummy-data?count=100" -Method POST -TimeoutSec 30 -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ $($data.message)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ 더미 데이터 생성 실패: $_" -ForegroundColor Yellow
    Write-Host "서버가 완전히 시작될 때까지 기다린 후 수동으로 생성하세요:" -ForegroundColor Gray
    Write-Host "  Invoke-WebRequest -Uri 'http://localhost:8000/api/dummy-data?count=100' -Method POST" -ForegroundColor White
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "✅ 모든 서버가 시작되었습니다!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 접속 정보:" -ForegroundColor Cyan
Write-Host "  - 프론트엔드: http://localhost:5173" -ForegroundColor White
Write-Host "  - 백엔드 API: http://localhost:8000" -ForegroundColor White
Write-Host "  - API 문서: http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "💡 서버를 중지하려면 각 창에서 Ctrl+C를 누르세요." -ForegroundColor Yellow
Write-Host ""



