# Start MongoDB with safe memory limit
$ErrorActionPreference = "Stop"

$port = 27017
$dataDir = Join-Path $PSScriptRoot "..\data\db"
if (-not (Test-Path $dataDir)) {
    New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
}

$conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($conn) {
    Write-Host "✅ MongoDB is already running on port $port." -ForegroundColor Green
    exit 0
}

$mongodPath = "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe"
if (-not (Test-Path $mongodPath)) {
    $mongodCmd = Get-Command mongod.exe -ErrorAction SilentlyContinue
    if ($mongodCmd) {
        $mongodPath = $mongodCmd.Source
    } else {
        Write-Error "Could not locate mongod.exe. Please ensure MongoDB is installed."
        exit 1
    }
}

Write-Host "🚀 Starting MongoDB on port $port (Memory limit: 256MB)..." -ForegroundColor Cyan
Start-Process -FilePath $mongodPath -ArgumentList "--dbpath `"$dataDir`" --port $port --wiredTigerCacheSizeGB 0.25" -WindowStyle Hidden

Start-Sleep -Seconds 2
$check = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($check) {
    Write-Host "✅ MongoDB successfully started on port $port!" -ForegroundColor Green
} else {
    Write-Warning "MongoDB was launched, waiting for port $port to open..."
}
