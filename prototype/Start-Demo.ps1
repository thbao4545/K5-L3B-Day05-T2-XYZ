# Open the static StudyFlow demo in the default browser. No server or install needed.
$ErrorActionPreference = 'Stop'
$studyFlowLanding = Join-Path -Path $PSScriptRoot -ChildPath 'landing.html'
if (-not (Test-Path -LiteralPath $studyFlowLanding -PathType Leaf)) {
    throw 'Cannot find landing.html next to Start-Demo.ps1. Keep the prototype folder together.'
}
$studyFlowUrl = [System.Uri]::new((Resolve-Path -LiteralPath $studyFlowLanding).Path).AbsoluteUri
Start-Process -FilePath $studyFlowUrl
