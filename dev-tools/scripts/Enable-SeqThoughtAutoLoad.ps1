[CmdletBinding()]
param(
    [Parameter()]
    [string]$ProfilePath = $PROFILE.CurrentUserCurrentHost
)

# Resolve module root and manifest
$moduleRoot = Resolve-Path -Path (Join-Path $PSScriptRoot '..\modules')
$moduleDirectory = Join-Path $moduleRoot 'Invoke-SeqThought'
$manifestPath = Join-Path $moduleDirectory 'Invoke-SeqThought.psd1'

if (-not (Test-Path $manifestPath)) {
    throw "Invoke-SeqThought manifest not found at $manifestPath"
}

# Ensure modules directory is part of the current session module path
$paths = ($env:PSModulePath -split ';') | Where-Object { $_ }
if ($paths -notcontains $moduleRoot.ProviderPath) {
    $env:PSModulePath = [string]::Join(';', @($paths + $moduleRoot.ProviderPath))
}

# Import for current session to validate
Import-Module $manifestPath -Force

# Prepare profile content for persistence
$profileDir = Split-Path -Parent $ProfilePath
if (-not (Test-Path $profileDir)) {
    New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
}

$profileBlock = @"
# Added by Enable-SeqThoughtAutoLoad.ps1 to keep Invoke-SeqThought available
if (Test-Path '$moduleRoot') {
    if ((\$env:PSModulePath -split ';') -notcontains '$moduleRoot') {
        \$env:PSModulePath = [string]::Join(';', @((\$env:PSModulePath -split ';') + '$moduleRoot'))
    }

    if (-not (Get-Module Invoke-SeqThought -ListAvailable | Where-Object { \$_.ModuleBase -eq '$moduleDirectory' })) {
        Import-Module '$manifestPath' -ErrorAction SilentlyContinue
    }
}
"@

if (-not (Test-Path $ProfilePath)) {
    New-Item -ItemType File -Path $ProfilePath -Force | Out-Null
}

$content = Get-Content -Path $ProfilePath -Raw
if ($content -notmatch 'Invoke-SeqThoughtAutoLoad') {
    Add-Content -Path $ProfilePath -Value "`n# Invoke-SeqThoughtAutoLoad`n$profileBlock"
}

Write-Output "Invoke-SeqThought autoload configured. Profile: $ProfilePath"
