# Requires: npx supabase login (once, in a normal terminal)
# Usage: powershell -File scripts/deploy-assistant.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

$envFile = Join-Path $PSScriptRoot "..\nodejs_space\.env"
$secrets = @{}
Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') {
    $secrets[$matches[1].Trim()] = $matches[2].Trim().Trim('"')
  }
}

$ref = "cxfpfztwxpeziaezdoom"
$dbPass = ($secrets["DATABASE_URL"] -replace '^.*://[^:]+:', '' -replace '@.*$', '')

Write-Host "Linking project $ref ..."
npx --yes supabase link --project-ref $ref --password $dbPass --yes

Write-Host "Setting Edge Function secrets (values not printed) ..."
npx --yes supabase secrets set `
  "GROQ_API_KEY=$($secrets['GROQ_API_KEY'])" `
  "JWT_SECRET=$($secrets['JWT_SECRET'])" `
  "GROQ_MODEL=$($secrets['GROQ_MODEL'])"

Write-Host "Deploying assistant-chat ..."
npx --yes supabase functions deploy assistant-chat --no-verify-jwt

Write-Host "Done."
