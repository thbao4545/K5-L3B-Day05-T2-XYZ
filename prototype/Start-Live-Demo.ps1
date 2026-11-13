# Start the loopback bridge in the background and open the live chat.
$ErrorActionPreference='Stop'
$studyFlowUrl='http://127.0.0.1:5180'
$studyFlowReady=$false
try {
    $studyFlowHealth=Invoke-RestMethod -Uri ($studyFlowUrl+'/api/health') -TimeoutSec 2
    if($studyFlowHealth.service -ne 'studyflow-live'){throw 'Port 5180 is used by another application.'}
    $studyFlowReady=$true
} catch {
    $studyFlowNode=(Get-Command node -ErrorAction Stop).Source
    $studyFlowScript=Join-Path $PSScriptRoot 'live-server.cjs'
    Start-Process -FilePath $studyFlowNode -ArgumentList ('"'+$studyFlowScript+'"') -WorkingDirectory $PSScriptRoot -WindowStyle Hidden
    for($studyFlowAttempt=0;$studyFlowAttempt -lt 25;$studyFlowAttempt++){
        Start-Sleep -Milliseconds 200
        try {$studyFlowHealth=Invoke-RestMethod -Uri ($studyFlowUrl+'/api/health') -TimeoutSec 1;if($studyFlowHealth.service -eq 'studyflow-live'){$studyFlowReady=$true;break}}catch{}
    }
}
if(-not $studyFlowReady){throw 'Cannot open the local live demo. Check Node22+ and port5180.'}
Start-Process -FilePath ($studyFlowUrl+'/index.html')
