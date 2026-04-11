# Project Camp 

A full-stack project management web application built with React + Node.js.

![Project Camp](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

##  Features

-  JWT Authentication with email verification
-  Project management with role-based access
-  Task & subtask tracking
-  File attachments on tasks
-  Team member management
-  Project notes
-  Modern dark theme UI

##  Tech Stack

**Frontend:**
- React + Vite
- Tailwind CSS
- Axios
- React Router DOM
- Lucide React

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (file uploads)
- Nodemailer (emails)


## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB
- npm

### Backend Setup

```bash
cd "Project Management Backend"
npm install
cp .env.example .env
# Fill in your .env values
npm start
```

### Frontend Setup

```bash
cd "Project Management Frontend"
npm install
npm run dev
```

##  Environment Variables

Create `.env` file in backend:

```env
PORT=8000
MONGODB_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=7d
SERVER_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:5173
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
FORGOT_PASSWORD_REDIRECT_URL=http://localhost:5173/reset-password
```

## Project Strutures 

Project Management/
├── Project Management Backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── validators/
│   └── index.js
└── Project Management Frontend/
└── src/
├── api/
├── context/
└── pages/


