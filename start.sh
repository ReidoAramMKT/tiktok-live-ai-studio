#!/bin/bash

# TikTok Live AI Studio - Script de Inicialização
echo "🚀 Iniciando TikTok Live AI Studio..."

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js 16+ primeiro."
    exit 1
fi

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Por favor, instale o npm primeiro."
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js versão 16+ é necessária. Versão atual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Erro ao instalar dependências"
        exit 1
    fi
fi

# Verificar se o arquivo .env existe
if [ ! -f ".env" ]; then
    echo "⚙️ Criando arquivo de configuração..."
    if [ -f "env.example" ]; then
        cp env.example .env
        echo "✅ Arquivo .env criado. Edite as configurações conforme necessário."
    else
        echo "⚠️ Arquivo env.example não encontrado. Criando .env básico..."
        cat > .env << EOF
PORT=3000
NODE_ENV=development
TIKTOK_API_KEY=seu_api_key_aqui
TIKTOK_SECRET=seu_secret_aqui
EOF
    fi
fi

# Criar diretórios necessários
mkdir -p logs uploads

# Verificar se há processos rodando na porta 3000
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️ Porta 3000 já está em uso. Tentando parar processo..."
    pkill -f "node.*3000" || true
    sleep 2
fi

# Iniciar a aplicação
echo "🎬 Iniciando TikTok Live AI Studio..."
echo "📱 Acesse: http://localhost:3000"
echo "🛑 Pressione Ctrl+C para parar"
echo ""

npm start 