# 🎬 TikTok Live AI Studio - Guia para Windows

## 📋 Pré-requisitos

### 1. Node.js
- **Versão**: 16.0 ou superior
- **Download**: https://nodejs.org/
- **Verificação**: Abra o PowerShell e digite `node --version`

### 2. npm (vem com Node.js)
- **Verificação**: Digite `npm --version` no PowerShell

### 3. Git (opcional, para clonar o repositório)
- **Download**: https://git-scm.com/download/win

## 🚀 Inicialização Rápida

### Opção 1: PowerShell (Recomendado)
```powershell
# Navegue até a pasta do projeto
cd "C:\caminho\para\stremers"

# Execute o script PowerShell
.\INICIAR_POWERSHELL.ps1
```

### Opção 2: Prompt de Comando
```cmd
# Navegue até a pasta do projeto
cd "C:\caminho\para\stremers"

# Execute o script batch
INICIAR_WINDOWS.bat
```

### Opção 3: Manual
```powershell
# Instalar dependências
npm install

# Criar arquivo de configuração
copy env.example .env

# Iniciar aplicação
npm start
```

## 🌐 Acesso à Aplicação

Após a inicialização, acesse:
- **URL**: http://localhost:3000
- **Interface**: Interface web moderna e responsiva
- **Funcionalidades**: Todas as funcionalidades disponíveis

## ⚙️ Configuração

### Arquivo .env
O arquivo `.env` é criado automaticamente. Edite-o conforme necessário:

```env
PORT=3000
NODE_ENV=development
TIKTOK_API_KEY=seu_api_key_aqui
TIKTOK_SECRET=seu_secret_aqui
```

### Configurações Avançadas
- **Porta**: Altere `PORT` no arquivo `.env`
- **Modo**: `development` para desenvolvimento, `production` para produção
- **TikTok**: Configure suas credenciais da API do TikTok

## 🛠️ Funcionalidades Principais

### 1. Detecção de Movimento
- **OpenCV**: Detecção facial e corporal
- **TensorFlow**: Reconhecimento de gestos
- **Configuração**: Ajuste sensibilidade no painel

### 2. Síntese de Voz AI
- **Múltiplas Vozes**: 5 vozes diferentes
- **Personalidades**: 3 personalidades únicas
- **Controle**: Painel dedicado para configuração

### 3. Efeitos Visuais
- **Three.js**: Efeitos 3D avançados
- **Canvas 2D**: Efeitos 2D personalizados
- **Biblioteca**: Mais de 20 efeitos pré-configurados

### 4. Integração TikTok
- **WebSocket**: Conexão em tempo real
- **Eventos**: Likes, comentários, presentes
- **Simulação**: Modo demo para testes

### 5. Gamificação
- **Níveis**: Sistema de progressão
- **Conquistas**: 15 conquistas desbloqueáveis
- **Leaderboard**: Ranking em tempo real

### 6. Analytics
- **Métricas**: Visualizações, engajamento
- **Relatórios**: Gráficos interativos
- **Recomendações**: Sugestões baseadas em dados

## 🔧 Solução de Problemas

### Erro: "Node.js não encontrado"
```powershell
# Verificar instalação
node --version

# Se não instalado, baixe em: https://nodejs.org/
```

### Erro: "Porta 3000 em uso"
```powershell
# Verificar processos na porta
netstat -ano | findstr :3000

# Parar processo específico
taskkill /f /pid [PID]
```

### Erro: "Dependências não instaladas"
```powershell
# Limpar cache do npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules
npm install
```

### Erro: "Permissão negada"
```powershell
# Executar PowerShell como Administrador
# Ou ajustar políticas de execução
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 📁 Estrutura de Arquivos

```
stremers/
├── src/                    # Código fonte do servidor
│   ├── modules/           # Módulos principais
│   └── index.js          # Servidor principal
├── public/               # Interface web
│   ├── index.html       # Página principal
│   ├── styles.css       # Estilos
│   └── app.js          # JavaScript frontend
├── logs/                # Logs da aplicação
├── uploads/             # Arquivos enviados
├── INICIAR_POWERSHELL.ps1  # Script PowerShell
├── INICIAR_WINDOWS.bat     # Script CMD
└── README.md            # Documentação completa
```

## 🎯 Dicas de Uso

### Para Streamers
1. **Configure sua câmera** no painel de movimento
2. **Escolha uma voz AI** que combine com seu estilo
3. **Ative efeitos visuais** para engajamento
4. **Monitore analytics** para melhorar performance

### Para Desenvolvedores
1. **Modo desenvolvimento**: `NODE_ENV=development`
2. **Logs detalhados**: Verifique pasta `logs/`
3. **Hot reload**: Use `npm run dev` para desenvolvimento
4. **Testes**: Execute `npm test` para testes

## 🚀 Deploy em Produção

### Usando PM2
```powershell
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar com PM2
pm2 start ecosystem.config.js

# Monitorar
pm2 monit
```

### Usando Docker
```powershell
# Construir imagem
docker build -t tiktok-live-ai-studio .

# Executar container
docker run -p 3000:3000 tiktok-live-ai-studio
```

## 📞 Suporte

- **Documentação**: Consulte `README.md`
- **Issues**: Reporte problemas no repositório
- **Comunidade**: Participe da comunidade de streamers

---

**🎉 Divirta-se criando lives incríveis com AI!** 