# 🔐 Authentication System

Secure authentication with multi-role support, session renewal, and password recovery via email.

## Features

- **User registration and login with JWT**
- **Automatic refresh token**
- **Role-based access control** (`admin`, `user`, etc.)
- **Route protection guards**
- **Password recovery via email**

---

## Technologies

- **NestJS**
- **TypeORM**
- **MySQL**
- **JWT**
- **BCrypt**
- **Nodemailer**
- **dotenv**

---

## 🚀 How to Run

### 1. Clone the project

```bash
git clone https://github.com/DnzxDev/auth-system.git
cd auth-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure `.env`

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=auth_db

JWT_SECRET=your_jwt_secret_here

MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
MAIL_FROM=noreply@yourapp.com

FRONTEND_URL=http://localhost:3001
```

### 4. Start the server

```bash
npm run build
npm run start
```

---

## 📬 Contribute

Suggestions, improvements, or fixes are welcome via *issues* or *pull requests*.

---

## 🧑‍💻 Author

Developed by [Dn](https://github.com/DnzxDev)
