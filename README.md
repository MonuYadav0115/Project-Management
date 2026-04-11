# Project Camp 

A full-stack collaborative project management application.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

##  Overview

Project Camp is a full-stack project management tool that enables teams to collaborate effectively — create projects, manage tasks, track progress, and work together with role-based access control.

---

##  Repositories

| Part | Description | Link |
|------|-------------|------|
|  Frontend | React + Vite + Tailwind | [Go to Frontend →](./frontend/) |
|  Backend | Node.js + Express + MongoDB | [Go to Backend →](./backend/) |

---

##  Features

-  JWT Authentication + Email Verification
-  Project Management (Create, Update, Delete)
-  Task & Subtask Tracking
-  File Attachments on Tasks
-  Team Members with Role-Based Access
-  Project Notes
-  Modern Dark Theme UI

---



### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill .env values
npm start
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

##  Role System

| Role | Access |
|------|--------|
| Admin | Full access |
| Project Admin | Manage tasks & subtasks |
| Member | View & toggle subtasks |



