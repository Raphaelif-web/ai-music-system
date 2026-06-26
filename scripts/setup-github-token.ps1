# Configura GITHUB_TOKEN para o MCP do GitHub no Cursor (Windows)
# Uso: .\scripts\setup-github-token.ps1 -Token "ghp_seu_token_aqui"

param(
    [Parameter(Mandatory = $true)]
    [string]$Token
)

if ($Token -eq "YOUR_GITHUB_PAT" -or $Token.Length -lt 20) {
    Write-Error "Token inválido. Gere um PAT em https://github.com/settings/tokens"
    exit 1
}

[System.Environment]::SetEnvironmentVariable("GITHUB_TOKEN", $Token, "User")
$env:GITHUB_TOKEN = $Token

Write-Host "GITHUB_TOKEN configurado com sucesso (escopo: usuario)." -ForegroundColor Green
Write-Host "Reinicie o Cursor para o MCP do GitHub conectar." -ForegroundColor Yellow
