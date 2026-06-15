# Kiírjuk Corvus nyers skins adatait a HAR-ból
$harPath = 'Source\HAR_1808.har'
$har = Get-Content $harPath -Raw | ConvertFrom-Json

foreach ($entry in $har.log.entries) {
    if ($entry.response.content.text -and $entry.response.content.text.Contains('"ident"')) {
        try {
            $parsed = $entry.response.content.text | ConvertFrom-Json
            $r = $parsed.results | Where-Object { $_.ident -eq 'heroGetAll' }
            if ($r) { 
                $corvus = $r.result.response.'50'
                if ($corvus) {
                    Write-Host "Corvus (50) a HAR-ban:"
                    Write-Host "  power: $($corvus.power)"
                    Write-Host "  skins: $($corvus.skins | ConvertTo-Json)"
                }
                
                $orion = $r.result.response.'13'
                if ($orion) {
                    Write-Host "Orion (13) a HAR-ban:"
                    Write-Host "  power: $($orion.power)"
                    Write-Host "  skins: $($orion.skins | ConvertTo-Json)"
                }
            }
        } catch {}
    }
}
