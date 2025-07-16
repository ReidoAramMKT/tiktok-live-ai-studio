@echo off
chcp 65001 >nul
echo 🚀 Iniciando TikTok Live AI Studio...

REM Verificar se o Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado. Por favor, instale o Node.js 16+ primeiro.
    echo 📥 Download: https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar se o npm está instalado
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm não encontrado. Por favor, instale o npm primeiro.
    pause
    exit /b 1
)

echo ✅ Node.js detectado: 
node --version

REM Verificar se as dependências estão instaladas
if not exist "node_modules" (
    echo 📦 Instalando dependências...
    npm install
    if errorlevel 1 (
        echo ❌ Erro ao instalar dependências
        pause
        exit /b 1
    )
)

REM Verificar se o arquivo .env existe
if not exist ".env" (
    echo ⚙️ Criando arquivo de configuração...
    if exist "env.example" (
        copy env.example .env
        echo ✅ Arquivo .env criado. Edite as configurações conforme necessário.
    ) else (
        echo ⚠️ Arquivo env.example não encontrado. Criando .env básico...
        echo PORT=3000> .env
        echo NODE_ENV=development>> .env
        echo TIKTOK_API_KEY=seu_api_key_aqui>> .env
        echo TIKTOK_SECRET=seu_secret_aqui>> .env
    )
)

REM Criar diretórios necessários
if not exist "logs" mkdir logs
if not exist "uploads" mkdir uploads

REM Verificar se há processos rodando na porta 3000
netstat -ano | findstr :3000 >nul
if not errorlevel 1 (
    echo ⚠️ Porta 3000 já está em uso. Tentando parar processo...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
        taskkill /f /pid %%a >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
)

REM Iniciar a aplicação
echo 🎬 Iniciando TikTok Live AI Studio...
echo 📱 Acesse: http://localhost:3000
echo 🛑 Pressione Ctrl+C para parar
echo.

npm start

pause 