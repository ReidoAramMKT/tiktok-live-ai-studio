# Script para instalar o Git no Windows
Write-Host "🚀 Instalando Git..." -ForegroundColor Green

# URL do instalador do Git
$gitUrl = "https://github.com/git-for-windows/git/releases/download/v2.43.0.windows.1/Git-2.43.0-64-bit.exe"
$installerPath = "$env:TEMP\git-installer.exe"

Write-Host "📥 Baixando Git..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri $gitUrl -OutFile $installerPath -UseBasicParsing
    Write-Host "✅ Download concluído!" -ForegroundColor Green
    
    Write-Host "🔧 Instalando Git..." -ForegroundColor Yellow
    Start-Process -FilePath $installerPath -ArgumentList "/VERYSILENT", "/NORESTART" -Wait
    
    Write-Host "✅ Git instalado com sucesso!" -ForegroundColor Green
    Write-Host "🔄 Reiniciando o PowerShell para aplicar as mudanças..." -ForegroundColor Yellow
    
    # Limpar arquivo temporário
    Remove-Item $installerPath -Force -ErrorAction SilentlyContinue
    
} catch {
    Write-Host "❌ Erro ao instalar Git: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Alternativa: Baixe manualmente em https://git-scm.com/download/win" -ForegroundColor Yellow
}

Write-Host "🎯 Após a instalação, feche e abra o PowerShell novamente" -ForegroundColor Cyan 