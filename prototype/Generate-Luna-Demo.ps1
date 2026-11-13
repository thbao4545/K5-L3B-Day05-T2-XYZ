# One generation request, then open static HTML. No server/database.
$ErrorActionPreference='Stop'
$studyFlowNode=(Get-Command node -ErrorAction Stop).Source
& $studyFlowNode (Join-Path $PSScriptRoot 'generate-luna.cjs')
if($LASTEXITCODE -ne 0){throw 'Luna generation failed. Check .env; the existing demo is unchanged.'}
$studyFlowGenerated=Join-Path $PSScriptRoot 'luna-demo.html'
Start-Process -FilePath ([System.Uri]::new((Resolve-Path -LiteralPath $studyFlowGenerated).Path).AbsoluteUri)
