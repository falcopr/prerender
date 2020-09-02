# Uninstall
# http://nssm.cc/usage
$fullPathOfPrerender = $PSScriptRoot
$fullPathOfBinaries = [System.IO.Path]::GetFullPath((Join-Path $fullPathOfPrerender '\bin'))
$env:Path += ";$fullPathOfBinaries"
$prerenderServiceName = 'Prerender.io Server'

Get-Service $prerenderServiceName | Stop-Service
nssm remove 'Prerender.io Server' confirm
# sc.exe delete 'Prerender.io Server'