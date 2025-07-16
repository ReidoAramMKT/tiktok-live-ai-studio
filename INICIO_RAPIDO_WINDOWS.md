# 🚀 TikTok Live AI Studio - Início Rápido Windows

## ⚡ Inicialização em 3 Passos

### Passo 1: Verificar Sistema
```powershell
# Execute o verificador de sistema
.\VERIFICAR_SISTEMA_WINDOWS.ps1
```

### Passo 2: Iniciar Aplicação
```powershell
# Execute o script de inicialização
.\INICIAR_POWERSHELL.ps1
```

### Passo 3: Acessar Interface
- Abra seu navegador
- Acesse: **http://localhost:3000**
- Comece a usar!

## 📋 Checklist Rápido

- [ ] Node.js 16+ instalado
- [ ] npm funcionando
- [ ] Porta 3000 livre
- [ ] Câmera conectada (opcional)
- [ ] Microfone funcionando (opcional)

## 🎯 Funcionalidades Principais

### 🎭 Detecção de Movimento
- **Facial**: Reconhecimento de expressões
- **Corporal**: Detecção de gestos
- **Configuração**: Sensibilidade ajustável

### 🎤 Síntese de Voz AI
- **5 Vozes**: Diferentes personalidades
- **3 Estilos**: Formal, casual, animado
- **Controle**: Painel dedicado

### ✨ Efeitos Visuais
- **3D**: Efeitos Three.js avançados
- **2D**: Canvas personalizado
- **Biblioteca**: 20+ efeitos prontos

### 🎮 Gamificação
- **Níveis**: Sistema de progressão
- **Conquistas**: 15 desbloqueáveis
- **Ranking**: Leaderboard em tempo real

### 📊 Analytics
- **Métricas**: Visualizações, engajamento
- **Gráficos**: Interativos e responsivos
- **Relatórios**: Exportáveis

## 🔧 Configuração Rápida

### Arquivo .env
O arquivo é criado automaticamente com configurações otimizadas para Windows.

### Personalização
Edite o arquivo `.env` para:
- Alterar porta (padrão: 3000)
- Configurar credenciais TikTok
- Ajustar performance

## 🛠️ Solução de Problemas Comuns

### "Node.js não encontrado"
```powershell
# Baixe e instale: https://nodejs.org/
```

### "Porta 3000 em uso"
```powershell
# Verificar processo
netstat -ano | findstr :3000

# Parar processo
taskkill /f /pid [PID]
```

### "Permissão negada"
```powershell
# Ajustar política
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "Dependências não instaladas"
```powershell
# Limpar e reinstalar
npm cache clean --force
rm -rf node_modules
npm install
```

## 📱 Interface Web

### Painéis Principais
1. **Controle de Movimento**: Configurar detecção
2. **Voz AI**: Selecionar voz e personalidade
3. **Efeitos Visuais**: Ativar efeitos
4. **Live Preview**: Visualizar stream
5. **Interações**: Ver eventos TikTok
6. **Gamificação**: Sistema de pontos
7. **Analytics**: Métricas em tempo real

### Atalhos de Teclado
- `Ctrl + M`: Alternar painel de movimento
- `Ctrl + V`: Alternar painel de voz
- `Ctrl + E`: Alternar painel de efeitos
- `Ctrl + L`: Alternar preview da live
- `Ctrl + I`: Alternar interações
- `Ctrl + G`: Alternar gamificação
- `Ctrl + A`: Alternar analytics

## 🎬 Modo Demo

Para testar sem conexão real com TikTok:
1. Inicie a aplicação
2. Acesse a interface web
3. Ative "Modo Demo" no painel de interações
4. Teste todas as funcionalidades

## 🚀 Deploy em Produção

### Usando PM2
```powershell
npm install -g pm2
pm2 start ecosystem.config.js
pm2 monit
```

### Usando Docker
```powershell
docker build -t tiktok-live-ai-studio .
docker run -p 3000:3000 tiktok-live-ai-studio
```

## 📞 Suporte

- **Documentação**: `README.md`
- **Instruções Windows**: `INSTRUCOES_WINDOWS.md`
- **Verificação**: `VERIFICAR_SISTEMA_WINDOWS.ps1`

## 🎉 Próximos Passos

1. **Configure sua câmera** no painel de movimento
2. **Escolha uma voz AI** que combine com seu estilo
3. **Ative efeitos visuais** para engajamento
4. **Monitore analytics** para melhorar performance
5. **Experimente a gamificação** para interatividade

---

**🎬 Divirta-se criando lives incríveis com AI!** 