function Invoke-SeqThought {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [string]$Thought,

        [Parameter()]
        [int]$ThoughtNumber = 1,

        [Parameter()]
        [int]$TotalThoughts = 1,

        [Parameter()]
        [bool]$NextThoughtNeeded = $true,

        [Parameter()]
        [bool]$IsRevision,

        [Parameter()]
        [Nullable[int]]$RevisesThought,

        [Parameter()]
        [Nullable[int]]$BranchFromThought,

        [Parameter()]
        [string]$BranchId,

        [Parameter()]
        [Nullable[bool]]$NeedsMoreThoughts
    )

    $repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\\..\\..'))
    $payload = [ordered]@{
        name      = 'sequentialthinking'
        arguments = [ordered]@{
            thought           = $Thought
            nextThoughtNeeded = $NextThoughtNeeded
            thoughtNumber     = $ThoughtNumber
            totalThoughts     = $TotalThoughts
        }
    }

    if ($PSBoundParameters.ContainsKey('IsRevision')) {
        $payload.arguments.isRevision = $IsRevision
    }
    if ($PSBoundParameters.ContainsKey('RevisesThought') -and $null -ne $RevisesThought) {
        $payload.arguments.revisesThought = [int]$RevisesThought
    }
    if ($PSBoundParameters.ContainsKey('BranchFromThought') -and $null -ne $BranchFromThought) {
        $payload.arguments.branchFromThought = [int]$BranchFromThought
    }
    if ($PSBoundParameters.ContainsKey('BranchId') -and $BranchId) {
        $payload.arguments.branchId = $BranchId
    }
    if ($PSBoundParameters.ContainsKey('NeedsMoreThoughts') -and $null -ne $NeedsMoreThoughts) {
        $payload.arguments.needsMoreThoughts = [bool]$NeedsMoreThoughts
    }

    $json = $payload | ConvertTo-Json -Depth 4

    Push-Location $repoRoot
    try {
        $json | node 'dev-tools/mcp-call.mjs' 'seq' 'call' '-'
    }
    finally {
        Pop-Location
    }
}

Export-ModuleMember -Function Invoke-SeqThought
