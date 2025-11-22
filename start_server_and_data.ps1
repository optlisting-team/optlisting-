# Start Backend Server and Generate Dummy Data
Write-Host "`n=== OptListing 백엔드 서버 시작 ===" -ForegroundColor Cyan
Write-Host ""

# Change to backend directory
cd backend

# Check if Python is available
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python 발견: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python을 찾을 수 없습니다. Python이 설치되어 있는지 확인하세요." -ForegroundColor Red
    exit 1
}

# Start server in background
Write-Host "`n서버 시작 중..." -ForegroundColor Yellow
Write-Host "API 주소: http://localhost:8000" -ForegroundColor Cyan
Write-Host "API 문서: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""

# Start server
$serverProcess = Start-Process -FilePath "python" -ArgumentList "main.py" -PassThru -NoNewWindow

Write-Host "서버 프로세스 시작됨 (PID: $($serverProcess.Id))" -ForegroundColor Green
Write-Host "서버가 시작될 때까지 10초 대기 중..." -ForegroundColor Yellow

# Wait for server to start
Start-Sleep -Seconds 10

# Check if server is running
Write-Host "`n=== 서버 상태 확인 ===" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/" -TimeoutSec 5 -UseBasicParsing
    Write-Host "✅ 서버 실행 중!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ 서버가 아직 시작 중일 수 있습니다. 잠시 후 다시 시도하세요." -ForegroundColor Yellow
    Write-Host "에러: $_" -ForegroundColor Gray
}

# Generate dummy data
Write-Host "`n=== 더미 데이터 생성 ===" -ForegroundColor Cyan
try {
    $dummyResponse = Invoke-WebRequest -Uri "http://localhost:8000/api/dummy-data?count=100" -Method POST -TimeoutSec 30 -UseBasicParsing
    $dummyData = $dummyResponse.Content | ConvertFrom-Json
    Write-Host "✅ $($dummyData.message)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ 더미 데이터 생성 실패: $_" -ForegroundColor Yellow
    Write-Host "서버가 완전히 시작될 때까지 기다린 후 수동으로 생성하세요:" -ForegroundColor Gray
    Write-Host "  http://localhost:8000/api/dummy-data?count=100" -ForegroundColor White
}

# Verify data
Write-Host "`n=== 데이터 확인 ===" -ForegroundColor Cyan
try {
    $listingsResponse = Invoke-WebRequest -Uri "http://localhost:8000/api/listings" -TimeoutSec 5 -UseBasicParsing
    $listingsData = $listingsResponse.Content | ConvertFrom-Json
    Write-Host "✅ 총 $($listingsData.listings.Count)개의 리스팅이 있습니다" -ForegroundColor Green
} catch {
    Write-Host "⚠️ 데이터 확인 실패: $_" -ForegroundColor Yellow
}

Write-Host "`n=== 완료 ===" -ForegroundColor Green
Write-Host "프론트엔드에서 확인하세요: http://localhost:5173" -ForegroundColor Cyan
Write-Host "`n서버를 중지하려면 Ctrl+C를 누르세요." -ForegroundColor Yellow
Write-Host ""

# Keep script running to keep server alive
Wait-Process -Id $serverProcess.Id



