param(
  [Parameter(Mandatory = $true)]
  [string]$Name,

  [Parameter(Mandatory = $true)]
  [string]$Destination,

  [string]$AppName = $Name
)

$ErrorActionPreference = "Stop"

$source = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$target = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($Destination)

if (Test-Path -LiteralPath $target) {
  throw "Destination already exists: $target"
}

$exclude = @(".git", ".next", "node_modules", "apps/web/.next", "apps/web/test-results", "apps/web/playwright-report")
New-Item -ItemType Directory -Path $target | Out-Null

robocopy.exe $source $target /E /XD $exclude /NFL /NDL /NJH /NJS /NC /NS | Out-Null
if ($LASTEXITCODE -gt 7) {
  throw "robocopy failed with exit code $LASTEXITCODE"
}

$packagePath = Join-Path $target "package.json"
$envExamplePath = Join-Path $target ".env.example"

$packageJson = Get-Content -LiteralPath $packagePath -Raw | ConvertFrom-Json
$packageJson.name = $Name
$packageJson | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath $packagePath -Encoding utf8

$envExample = Get-Content -LiteralPath $envExamplePath -Raw
$envExample = $envExample -replace 'APP_NAME="KV Web Starter"', "APP_NAME=`"$AppName`""
$envExample = $envExample -replace 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kv_web_starter"', "DATABASE_URL=`"postgresql://postgres:postgres@localhost:5432/$($Name -replace '[^a-zA-Z0-9_]', '_')`""
$envExample | Set-Content -LiteralPath $envExamplePath -Encoding utf8

Write-Host "Created $Name at $target"
Write-Host "Next: cd `"$target`"; pnpm install; copy .env.example .env; pnpm db:generate"
