
# 🔐 Sistema de Autenticação Completo

Autenticação segura com suporte a múltiplos papéis, renovação de sessão e recuperação de senha por e-mail.

## ✨ Funcionalidades

* ✅ Cadastro e login com JWT
* 🔄 Refresh token automático
* 🔒 Controle de acesso por papéis (`admin`, `user`, etc.)
* 🛡 Guards para proteção de rotas
* 📧 Recuperação de senha via e-mail

---

## 🧱 Tecnologias

* **NestJS**
* **TypeORM**
* **MySQL**
* **JWT**
* **BCrypt**
* **Nodemailer**
* **dotenv**

---

## 🚀 Como rodar

### 1. Clone o projeto

```bash
git clone https://github.com/DnzxDev/auth-system.git
cd auth-system
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o `.env`

```env
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

---

## 📬 Contribua

Sugestões, melhorias ou correções são bem-vindas via *issues* ou *pull requests*.

---

## 🧑‍💻 Autor

Desenvolvido por [Dn](https://github.com/DnzxDev) com ❤️
