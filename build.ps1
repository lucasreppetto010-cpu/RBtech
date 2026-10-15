# Gera rb-tech.html (prévia) e index.html (site final) a partir de rb-tech.src.html
Set-Location $PSScriptRoot
$src  = [IO.File]::ReadAllText((Resolve-Path .\rb-tech.src.html), [Text.Encoding]::UTF8)
$icon = 'data:image/png;base64,' + [Convert]::ToBase64String([IO.File]::ReadAllBytes((Resolve-Path .\logo-icon-sm.png)))
$full = 'data:image/png;base64,' + [Convert]::ToBase64String([IO.File]::ReadAllBytes((Resolve-Path .\logo-full.png)))
$wpp  = 'https://wa.me/5555996822565?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20RB%20Tech%20e%20quero%20um%20or%C3%A7amento.'
$demo = 'https://wa.me/5555996822565?text=Ol%C3%A1%2C%20quero%20ver%20uma%20demonstra%C3%A7%C3%A3o%20do%20Sistema%20de%20Gest%C3%A3o%20RB%20Tech.'
$out  = $src.Replace('{{LOGO_ICON}}',$icon).Replace('{{LOGO_FULL}}',$full).Replace('{{WPP_DEMO}}',$demo).Replace('{{WPP}}',$wpp)
foreach ($k in 'sb','ultra','cr','koreia','almada','storevault') { $out = $out.Replace("{{SHOT_$k}}", 'data:image/jpeg;base64,' + [Convert]::ToBase64String([IO.File]::ReadAllBytes((Resolve-Path ".\shots\$k.jpg")))) }
$enc  = New-Object Text.UTF8Encoding $false
[IO.File]::WriteAllText((Join-Path $PSScriptRoot 'rb-tech.html'), $out, $enc)
$site = $out.Replace("<meta name=`"claude:viewport-fit-sides`" content=`"cover`">`n", '')
$i = $site.IndexOf('</style>') + 8
$page = "<!doctype html>`n<html lang=`"pt-BR`">`n<head>`n<meta charset=`"utf-8`">`n<meta name=`"viewport`" content=`"width=device-width, initial-scale=1, viewport-fit=cover`">`n<link rel=`"icon`" href=`"$icon`">`n" + $site.Substring(0,$i) + "`n</head>`n<body style=`"margin:0`">" + $site.Substring($i) + "</body>`n</html>`n"
[IO.File]::WriteAllText((Join-Path $PSScriptRoot 'index.html'), $page, $enc)
