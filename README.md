```markdown
# 🔐 Sistema de Autenticação Completo

Este projeto é um sistema de autenticação robusto, desenvolvido para atender aplicações modernas que requerem controle de acesso seguro, com suporte a múltiplos papéis (roles), renovação de tokens e recuperação de senha via e-mail.

## ✨ Funcionalidades

- ✅ **Cadastro de Usuário**
- ✅ **Login com JWT**
- 🔄 **Refresh Token** para renovação automática de sessão
- 🔒 **Sistema de papéis (roles)** como `admin`, `user`, etc.
- 🚧 **Guards de autorização** para proteger rotas com base nos papéis
- 📧 **Esqueci minha senha** com envio de token de recuperação por e-mail

---

## 🧱 Tecnologias Utilizadas

- **NestJS**
- **JWT (JSON Web Token)**
- **TypeORM**
- **Banco de dados**: MySQL
- **Nodemailer** para envio de e-mails
- **BCrypt** para hashing de senhas
- **dotenv** para variáveis de ambiente

## 🚀 Como Executar

### 1. Clone o projeto

```bash
git clone https://github.com/DnzxDev/auth-system.git
cd auth-system
````

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o arquivo `.env`

Crie um `.env` na raiz com as seguintes variáveis:

```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=auth_db
JWT_SECRET=
MAIL_HOST=smtp.gmail.com
MAIL_USER=seu_email@gmail.com
MAIL_PASS=sua_senha_de_app
MAIL_FROM=noreply@seuapp.com
FRONTEND_URL=http://localhost:3001

```
### 4. Inicie o servidor

```bash
npm run build
npm run start
```

## 📬 Contribuição

Sinta-se à vontade para abrir *issues* ou *pull requests* com sugestões, melhorias ou correções.

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License**.

---



## 🧑‍💻 Autor

Desenvolvido com ❤️ por [Dn](https://github.com/DnzxDev)

```

