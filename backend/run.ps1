# Script de lancement Spring Chat - telecharge Maven si absent
$ErrorActionPreference = "Stop"
$BackendDir = $PSScriptRoot
$MavenDir = Join-Path $BackendDir ".maven"
$MavenZip = Join-Path $env:TEMP "apache-maven-3.9.12-bin.zip"
$MavenUrl = "https://dlcdn.apache.org/maven/maven-3/3.9.12/binaries/apache-maven-3.9.12-bin.zip"
$Port = 8080

# Liberer le port 8080 si deja utilise (ancienne instance)
function Stop-ProcessOnPort {
    $conn = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($conn) {
        Write-Host "Le port $Port est occupe. Arret du processus en cours..."
        $conn | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
        Start-Sleep -Seconds 2
    }
}
Stop-ProcessOnPort

function Get-MavenCmd {
    # Deja dans le PATH ?
    $mvn = Get-Command mvn -ErrorAction SilentlyContinue
    if ($mvn) { return "mvn" }
    # Maven local dans .maven
    $mvnCmd = Join-Path $MavenDir "apache-maven-3.9.12\bin\mvn.cmd"
    if (Test-Path $mvnCmd) { return $mvnCmd }
    return $null
}

function Install-LocalMaven {
    if (Test-Path (Join-Path $MavenDir "apache-maven-3.9.12")) { return }
    Write-Host "Maven non trouve. Telechargement dans $MavenDir ..."
    New-Item -ItemType Directory -Force -Path $MavenDir | Out-Null
    if (-not (Test-Path $MavenZip)) {
        Write-Host "Download de Maven 3.9.12..."
        Invoke-WebRequest -Uri $MavenUrl -OutFile $MavenZip -UseBasicParsing
    }
    Write-Host "Extraction..."
    Expand-Archive -Path $MavenZip -DestinationPath $MavenDir -Force
}

$mvnCmd = Get-MavenCmd
if (-not $mvnCmd) {
    Install-LocalMaven
    $mvnCmd = Join-Path $MavenDir "apache-maven-3.9.12\bin\mvn.cmd"
}

Set-Location $BackendDir
Write-Host "Lancement de Spring Chat..."
& $mvnCmd spring-boot:run
