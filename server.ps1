# Simple PowerShell HTTP Server for ADITHYA Security Website
# Run this script to start a local web server on port 8080

$http = [System.Net.HttpListener]::new()
$http.Prefixes.Add("http://localhost:8080/")
$http.Start()

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ADITHYA Security Services Website" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Server running at: " -NoNewline
Write-Host "http://localhost:8080" -ForegroundColor Green
Write-Host ""
Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Open browser automatically
Start-Process "http://localhost:8080"

$webRoot = $PSScriptRoot
if ([string]::IsNullOrEmpty($webRoot)) {
    $webRoot = Get-Location
}

$mimeTypes = @{
    ".html" = "text/html"
    ".css"  = "text/css"
    ".js"   = "application/javascript"
    ".json" = "application/json"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
}

try {
    while ($http.IsListening) {
        $context = $http.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/") { $localPath = "/index.html" }
        
        $filePath = Join-Path $webRoot $localPath.TrimStart("/")
        
        if (Test-Path $filePath -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $response.ContentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] 200 $localPath" -ForegroundColor Green
        } else {
            $response.StatusCode = 404
            $message = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 - File Not Found</h1>")
            $response.ContentType = "text/html"
            $response.ContentLength64 = $message.Length
            $response.OutputStream.Write($message, 0, $message.Length)
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] 404 $localPath" -ForegroundColor Red
        }
        
        $response.Close()
    }
} finally {
    $http.Stop()
    Write-Host "Server stopped." -ForegroundColor Yellow
}
