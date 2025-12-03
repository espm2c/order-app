# PowerShell 스크립트: URL을 Chrome 브라우저에서 열기
param(
    [Parameter(Mandatory=$true)]
    [string]$Url
)

# Chrome 실행 파일 경로 찾기
$chromePaths = @(
    "${env:ProgramFiles}\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "${env:LOCALAPPDATA}\Google\Chrome\Application\chrome.exe"
)

$chromePath = $null
foreach ($path in $chromePaths) {
    if (Test-Path $path) {
        $chromePath = $path
        break
    }
}

if ($chromePath) {
    Start-Process -FilePath $chromePath -ArgumentList $Url
    Write-Host "Chrome 브라우저에서 열기: $Url" -ForegroundColor Green
} else {
    # Chrome을 찾을 수 없으면 기본 브라우저 사용
    Start-Process $Url
    Write-Host "기본 브라우저에서 열기: $Url" -ForegroundColor Yellow
}




