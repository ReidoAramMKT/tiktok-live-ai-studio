# 🔗 Como Conectar ao TikTok Real

## 📋 Passo a Passo Completo

### **Passo 1: Criar Aplicativo no TikTok for Developers**

1. **Acesse**: https://developers.tiktok.com/
2. **Faça login** com sua conta do TikTok
3. **Clique em "Conecte um aplicativo"** (botão rosa)
4. **Preencha as informações:**
   - **Nome**: `TikTok Live AI Studio`
   - **Descrição**: `Plataforma para lives no TikTok com AI e interatividade`
   - **Categoria**: Entertainment
   - **Tipo**: Web App

### **Passo 2: Configurar Permissões**

Após criar o app, configure as permissões:

1. **Vá para "App Details"**
2. **Em "Permissions", adicione:**
   - ✅ `user.info.basic`
   - ✅ `video.list`
   - ✅ `live.manage`
   - ✅ `live.read`

3. **Em "Redirect URLs", adicione:**
   - `http://localhost:3000/auth/callback`

### **Passo 3: Obter Credenciais**

Após a aprovação, você receberá:
- **Client Key** (API Key)
- **Client Secret**

### **Passo 4: Configurar o Sistema**

1. **Crie o arquivo `.env` na raiz do projeto:**
   ```bash
   copy env.windows.example .env
   ```

2. **Edite o arquivo `.env` e substitua:**
   ```env
   TIKTOK_API_KEY=seu_client_key_aqui
   TIKTOK_SECRET=seu_client_secret_aqui
   TIKTOK_REDIRECT_URI=http://localhost:3000/auth/callback
   ```

3. **Reinicie o sistema:**
   ```powershell
   .\INICIAR_POWERSHELL.ps1
   ```

### **Passo 5: Conectar sua Conta**

1. **Acesse**: http://localhost:3000
2. **Vá para o painel "Interações"**
3. **Clique em "Conectar TikTok"**
4. **Autorize o aplicativo**
5. **Você será redirecionado de volta**

## 🔧 Configuração Manual do .env

Se preferir criar manualmente, crie um arquivo `.env` com:

```env
# Configurações do TikTok
TIKTOK_API_KEY=seu_client_key_aqui
TIKTOK_SECRET=seu_client_secret_aqui
TIKTOK_REDIRECT_URI=http://localhost:3000/auth/callback
TIKTOK_ROOM_ID=sala_padrao

# Outras configurações
PORT=3000
NODE_ENV=development
JWT_SECRET=seu_jwt_secret_super_seguro
SESSION_SECRET=seu_session_secret_super_seguro
```

## ⚠️ Importante

- **Mantenha suas credenciais seguras**
- **Não compartilhe o arquivo .env**
- **Use HTTPS em produção**
- **Configure corretamente as URLs de redirecionamento**

## 🎯 Funcionalidades Disponíveis com TikTok Real

✅ **Lives em tempo real**  
✅ **Comentários automáticos**  
✅ **Likes e presentes**  
✅ **Analytics reais**  
✅ **Gamificação baseada em dados reais**  

## 🆘 Solução de Problemas

### "App não aprovado"
- Aguarde a aprovação do TikTok
- Verifique se todas as permissões estão corretas

### "Erro de redirecionamento"
- Verifique se a URL está correta no TikTok for Developers
- Certifique-se de que o sistema está rodando na porta 3000

### "Credenciais inválidas"
- Verifique se copiou corretamente Client Key e Secret
- Certifique-se de que o app está aprovado

## 📞 Suporte

- **Documentação TikTok**: https://developers.tiktok.com/doc/
- **Issues**: Reporte problemas no repositório
- **Comunidade**: Participe da comunidade de streamers 