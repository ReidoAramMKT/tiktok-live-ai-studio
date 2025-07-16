# TikTok Live AI Studio - Verificação de Sistema Windows
# Execute como: .\VERIFICAR_SISTEMA_WINDOWS.ps1

Write-Host "🔍 Verificando Sistema para TikTok Live AI Studio..." -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

$allChecksPassed = $true

# 1. Verificar versão do Windows
Write-Host "`n📋 Verificando Sistema Operacional..." -ForegroundColor Yellow
$osInfo = Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion, TotalPhysicalMemory
Write-Host "   Sistema: $($osInfo.WindowsProductName)" -ForegroundColor Green
Write-Host "   Versão: $($osInfo.WindowsVersion)" -ForegroundColor Green
Write-Host "   RAM: $([math]::Round($osInfo.TotalPhysicalMemory / 1GB, 2)) GB" -ForegroundColor Green

if ($osInfo.TotalPhysicalMemory -lt 4GB) {
    Write-Host "   ⚠️ RAM baixa detectada. Recomendado: 8GB ou mais" -ForegroundColor Yellow
    $allChecksPassed = $false
}

# 2. Verificar Node.js
Write-Host "`n📦 Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        $nodeVersionNum = $nodeVersion.TrimStart('v')
        $majorVersion = [int]($nodeVersionNum.Split('.')[0])
        
        if ($majorVersion -ge 16) {
            Write-Host "   ✅ Node.js $nodeVersion (OK)" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Node.js $nodeVersion (Versão muito antiga)" -ForegroundColor Red
            Write-Host "   📥 Atualize para versão 16+ em: https://nodejs.org/" -ForegroundColor Yellow
            $allChecksPassed = $false
        }
    } else {
        Write-Host "   ❌ Node.js não encontrado" -ForegroundColor Red
        Write-Host "   📥 Instale em: https://nodejs.org/" -ForegroundColor Yellow
        $allChecksPassed = $false
    }
} catch {
    Write-Host "   ❌ Erro ao verificar Node.js" -ForegroundColor Red
    $allChecksPassed = $false
}

# 3. Verificar npm
Write-Host "`n📦 Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ npm $npmVersion (OK)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ npm não encontrado" -ForegroundColor Red
        $allChecksPassed = $false
    }
} catch {
    Write-Host "   ❌ Erro ao verificar npm" -ForegroundColor Red
    $allChecksPassed = $false
}

# 4. Verificar Git
Write-Host "`n📦 Verificando Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ $gitVersion (OK)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️ Git não encontrado (opcional)" -ForegroundColor Yellow
        Write-Host "   📥 Instale em: https://git-scm.com/download/win" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️ Git não encontrado (opcional)" -ForegroundColor Yellow
}

# 5. Verificar portas
Write-Host "`n🌐 Verificando Portas..." -ForegroundColor Yellow
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    Write-Host "   ⚠️ Porta 3000 está em uso" -ForegroundColor Yellow
    Write-Host "   Processo: $($port3000.OwningProcess)" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ Porta 3000 disponível" -ForegroundColor Green
}

# 6. Verificar câmera
Write-Host "`n📷 Verificando Câmera..." -ForegroundColor Yellow
try {
    $cameraDevices = Get-WmiObject -Class Win32_PnPEntity | Where-Object { $_.Name -like "*camera*" -or $_.Name -like "*webcam*" }
    if ($cameraDevices) {
        Write-Host "   ✅ Câmera(s) detectada(s):" -ForegroundColor Green
        foreach ($camera in $cameraDevices) {
            Write-Host "      - $($camera.Name)" -ForegroundColor Green
        }
    } else {
        Write-Host "   ⚠️ Nenhuma câmera detectada" -ForegroundColor Yellow
        Write-Host "   💡 Conecte uma webcam para usar detecção de movimento" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️ Não foi possível verificar câmeras" -ForegroundColor Yellow
}

# 7. Verificar microfone
Write-Host "`n🎤 Verificando Microfone..." -ForegroundColor Yellow
try {
    $audioDevices = Get-WmiObject -Class Win32_SoundDevice
    if ($audioDevices) {
        Write-Host "   ✅ Dispositivo(s) de áudio detectado(s):" -ForegroundColor Green
        foreach ($device in $audioDevices) {
            Write-Host "      - $($device.Name)" -ForegroundColor Green
        }
    } else {
        Write-Host "   ⚠️ Nenhum dispositivo de áudio detectado" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️ Não foi possível verificar dispositivos de áudio" -ForegroundColor Yellow
}

# 8. Verificar espaço em disco
Write-Host "`n💾 Verificando Espaço em Disco..." -ForegroundColor Yellow
$currentDrive = (Get-Location).Drive.Name
$diskInfo = Get-WmiObject -Class Win32_LogicalDisk | Where-Object { $_.DeviceID -eq "$currentDrive`:" }
if ($diskInfo) {
    $freeSpaceGB = [math]::Round($diskInfo.FreeSpace / 1GB, 2)
    $totalSpaceGB = [math]::Round($diskInfo.Size / 1GB, 2)
    $usedSpaceGB = $totalSpaceGB - $freeSpaceGB
    $usagePercent = [math]::Round(($usedSpaceGB / $totalSpaceGB) * 100, 1)
    
    Write-Host "   💾 Disco $currentDrive`:" -ForegroundColor Green
    Write-Host "      Total: $totalSpaceGB GB" -ForegroundColor Green
    Write-Host "      Livre: $freeSpaceGB GB" -ForegroundColor Green
    Write-Host "      Uso: $usagePercent%" -ForegroundColor Green
    
    if ($freeSpaceGB -lt 1) {
        Write-Host "   ⚠️ Pouco espaço em disco (< 1GB livre)" -ForegroundColor Yellow
        $allChecksPassed = $false
    }
}

# 9. Verificar política de execução
Write-Host "`n🔒 Verificando Política de Execução..." -ForegroundColor Yellow
$executionPolicy = Get-ExecutionPolicy -Scope CurrentUser
Write-Host "   Política atual: $executionPolicy" -ForegroundColor Green

if ($executionPolicy -eq "Restricted") {
    Write-Host "   ⚠️ Política muito restritiva" -ForegroundColor Yellow
    Write-Host "   💡 Execute: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Yellow
}

# 10. Verificar conectividade de rede
Write-Host "`n🌐 Verificando Conectividade..." -ForegroundColor Yellow
try {
    $ping = Test-Connection -ComputerName "8.8.8.8" -Count 1 -Quiet
    if ($ping) {
        Write-Host "   ✅ Conectividade de rede OK" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️ Problemas de conectividade" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️ Não foi possível verificar conectividade" -ForegroundColor Yellow
}

# Resultado final
Write-Host "`n==================================================" -ForegroundColor Cyan
if ($allChecksPassed) {
    Write-Host "✅ Sistema verificado com sucesso!" -ForegroundColor Green
    Write-Host "🎬 Você pode executar o TikTok Live AI Studio" -ForegroundColor Green
    Write-Host "`n🚀 Execute: .\INICIAR_POWERSHELL.ps1" -ForegroundColor Cyan
} else {
    Write-Host "❌ Alguns problemas foram detectados" -ForegroundColor Red
    Write-Host "🔧 Corrija os problemas acima antes de continuar" -ForegroundColor Yellow
    Write-Host "📖 Consulte INSTRUCOES_WINDOWS.md para mais detalhes" -ForegroundColor Yellow
}

Write-Host "`nPressione qualquer tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 