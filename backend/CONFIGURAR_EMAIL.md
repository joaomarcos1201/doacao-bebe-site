# Configuração do Email Gmail

Para que o sistema envie emails de recuperação de senha, você precisa configurar uma senha de aplicativo do Gmail.

## Passos para configurar:

### 1. Ativar verificação em duas etapas
- Acesse: https://myaccount.google.com/security
- Clique em "Verificação em duas etapas"
- Siga as instruções para ativar

### 2. Gerar senha de aplicativo
- Ainda em https://myaccount.google.com/security
- Clique em "Senhas de app"
- Selecione "Outro (nome personalizado)"
- Digite: "Doacao Bebe Site"
- Clique em "Gerar"
- **Copie a senha gerada (16 caracteres)**

### 3. Atualizar configuração
- Abra o arquivo: `backend/src/main/resources/application.properties`
- Substitua a linha:
  ```
  spring.mail.password=qwer tyui asdf ghjk
  ```
- Por:
  ```
  spring.mail.password=SUA_SENHA_DE_APP_AQUI
  ```

### 4. Testar
- Reinicie o backend: `cd backend && mvn spring-boot:run`
- Teste a recuperação de senha no frontend

## Email configurado:
- **Email:** alemdopositivo2024@gmail.com
- **Servidor:** smtp.gmail.com
- **Porta:** 587

## Observações:
- A senha de aplicativo é diferente da sua senha normal do Gmail
- Mantenha a senha segura e não compartilhe
- Se não funcionar, verifique se a verificação em duas etapas está ativa