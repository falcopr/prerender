# Install
# http://nssm.cc/usage
$fullPathOfPrerender = $PSScriptRoot
$fullPathOfBinaries = [System.IO.Path]::GetFullPath((Join-Path $fullPathOfPrerender '\bin'))
$fullPathOfNode = (Get-Command node.exe).Path
$env:Path += ";$fullPathOfBinaries"
$prerenderServiceName = 'Prerender.io Server'

nssm install 'Prerender.io Server' $fullPathOfNode
nssm set $prerenderServiceName AppDirectory $fullPathOfPrerender
nssm set $prerenderServiceName AppParameters 'server.js'
nssm set $prerenderServiceName Description $prerenderServiceName
nssm set $prerenderServiceName Start SERVICE_DELAYED_AUTO_START
Get-Service $prerenderServiceName | Start-Service
