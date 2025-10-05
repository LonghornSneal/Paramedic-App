[CmdletBinding()]
param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$Url,

    [Parameter()]
    [string]$OutFile,

    [switch]$PassThru
)

$headers = @{ 'User-Agent' = 'CodexAgent/1.0 (contact: Paramedic-App automation)' }

function Invoke-Request {
    param([string]$Target)
    try {
        return Invoke-WebRequest -Uri $Target -Headers $headers -ErrorAction Stop
    } catch {
        $_.Data['RequestTarget'] = $Target
        throw
    }
}

function Resolve-RedditUrl {
    param([string]$Target)
    try {
        Invoke-WebRequest -Uri $Target -Headers $headers -Method Head -MaximumRedirection 0 -ErrorAction Stop | Out-Null
        return $Target
    } catch {
        $response = $_.Exception.Response
        if ($response -and $response.StatusCode.value__ -in 301,302,307,308) {
            return $response.Headers['Location']
        }
        return $Target
    }
}

function Get-RedditJson {
    param([string]$Target)
    $resolved = Resolve-RedditUrl -Target $Target
    try {
        $uri = [Uri]$resolved
    } catch {
        return $null
    }
    if ($uri.Host -notlike '*.reddit.com') { return $null }

    if ($resolved -notmatch '\\.json') {
        if ($uri.AbsolutePath -match '/comments/') {
            $base = $resolved.TrimEnd('/')
            $jsonUrl = if ($base -match '\\.json$') { $base } else { "$base/.json?raw_json=1" }
            return Invoke-Request -Target $jsonUrl
        }
    }
    return Invoke-Request -Target $resolved
}

function TryRequestPipeline {
    param([string]$Target)
    try {
        return Invoke-Request -Target $Target
    } catch {
        $exception = $_
        $response = $exception.Exception.Response
        if ($response) {
            $status = [int]$response.StatusCode
            if ($status -in 403,404) {
                if ($Target -like '*reddit.com*') {
                    $reddit = Get-RedditJson -Target $Target
                    if ($reddit) { return $reddit }
                }
                $escaped = [Uri]::EscapeUriString($Target)
                $fallback = "https://r.jina.ai/${escaped}"
                return Invoke-Request -Target $fallback
            }
        }
        throw
    }
}

$response = TryRequestPipeline -Target $Url
$content = $response.Content

if ($OutFile) {
    Set-Content -Path $OutFile -Value $content -Encoding UTF8
}

if ($PassThru -or -not $OutFile) {
    return $content
}

