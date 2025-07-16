# TikTok Live AI Studio - Script de Inicialização PowerShell
# Execute como: .\INICIAR_POWERSHELL.ps1

Write-Host "🚀 Iniciando TikTok Live AI Studio..." -ForegroundColor Green

# Verificar se o Node.js está instalado
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Node.js não encontrado. Por favor, instale o Node.js 16+ primeiro." -ForegroundColor Red
        Write-Host "📥 Download: https://nodejs.org/" -ForegroundColor Yellow
        Read-Host "Pressione Enter para sair"
        exit 1
    }
    Write-Host "✅ Node.js detectado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao verificar Node.js" -ForegroundColor Red
    exit 1
}

# Verificar se o npm está instalado
try {
    $npmVersion = npm --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ npm não encontrado. Por favor, instale o npm primeiro." -ForegroundColor Red
        Read-Host "Pressione Enter para sair"
        exit 1
    }
    Write-Host "✅ npm detectado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao verificar npm" -ForegroundColor Red
    exit 1
}

# Verificar se as dependências estão instaladas
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao instalar dependências" -ForegroundColor Red
        Read-Host "Pressione Enter para sair"
        exit 1
    }
    Write-Host "✅ Dependências instaladas com sucesso!" -ForegroundColor Green
}

# Verificar se o arquivo .env existe
if (-not (Test-Path ".env")) {
    Write-Host "⚙️ Criando arquivo de configuração..." -ForegroundColor Yellow
    if (Test-Path "env.windows.example") {
        Copy-Item "env.windows.example" ".env"
        Write-Host "✅ Arquivo .env criado com configurações otimizadas para Windows." -ForegroundColor Green
    } elseif (Test-Path "env.example") {
        Copy-Item "env.example" ".env"
        Write-Host "✅ Arquivo .env criado. Edite as configurações conforme necessário." -ForegroundColor Green
    } else {
        Write-Host "⚠️ Arquivo env.example não encontrado. Criando .env básico..." -ForegroundColor Yellow
        @"
PORT=3000
NODE_ENV=development
TIKTOK_API_KEY=seu_api_key_aqui
TIKTOK_SECRET=seu_secret_aqui
WINDOWS_COMPATIBILITY_MODE=true
"@ | Out-File -FilePath ".env" -Encoding UTF8
        Write-Host "✅ Arquivo .env básico criado." -ForegroundColor Green
    }
}

# Criar diretórios necessários
if (-not (Test-Path "logs")) { New-Item -ItemType Directory -Name "logs" | Out-Null }
if (-not (Test-Path "uploads")) { New-Item -ItemType Directory -Name "uploads" | Out-Null }

# Verificar se há processos rodando na porta 3000
$portInUse = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "⚠️ Porta 3000 já está em uso. Tentando parar processo..." -ForegroundColor Yellow
    $portInUse | ForEach-Object {
        Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
}

# Iniciar a aplicação
Write-Host "🎬 Iniciando TikTok Live AI Studio..." -ForegroundColor Green
Write-Host "📱 Acesse: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🛑 Pressione Ctrl+C para parar" -ForegroundColor Yellow
Write-Host ""

try {
    npm start
} catch {
    Write-Host "❌ Erro ao iniciar a aplicação" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
} 