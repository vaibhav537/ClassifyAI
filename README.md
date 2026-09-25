# 🎓 Classify AI

> **AI-powered academic operating system for modern campuses**

Classify AI is a multi-role college ERP and student support platform built for real campus workflows — attendance, academics, communication, analytics, timetable management, assignments, and AI-assisted learning — from one unified system.

It is built as a **desktop-first product with Next.js + Tauri**, backed by PostgreSQL and Prisma, with role-aware workflows for **Admin, Assistant, Teacher, HOD, and Student** users.

<p align="left">
  <a href="https://classify-ai-app.vercel.app/"><strong>🌐 Live Website / Downloads</strong></a>
  ·
  <a href="./docs/technical-overview.md"><strong>📘 Technical Overview</strong></a>
</p>

---

## ✨ What makes Classify AI different?

- **Proxy-resistant attendance** using QR/session tokens, face verification, and optional geolocation checks
- **Role-based campus workflows** for Admin, Assistant, Teacher, HOD, and Student users
- **HOD timetable management** with teacher, room, and class-conflict validation
- **Assignment lifecycle management** with submission tracking, grading, feedback, analytics, and AI-assisted workflows
- **Real-time campus communication** with role-aware chat, notifications, and structured communication rules
- **AI-assisted academics** including study planning, syllabus analysis, expected-question generation, and resource assistance
- **EduReels** with class-first learning feeds, teacher/student videos, campus review, saves, and reports
- **Desktop distribution** through Tauri with the current app version at **v2.4.0**

---

## 🧩 Platform Architecture

```text
Admin
└── Campus Assistant
    ├── HOD / Teachers
    │   ├── Attendance
    │   ├── Assignments
    │   ├── Resources
    │   ├── Announcements
    │   └── Timetable
    └── Students
        ├── Attendance & Face Verification
        ├── Timetable
        ├── Assignments & Grades
        ├── Resources & Announcements
        └── AI-assisted Tools
```

Each campus can maintain its own users, academic configuration, timetable, geolocation rules, events, announcements, and operational settings.

---

## 🚀 Core Features

### 👑 Admin
- Multi-campus overview
- Campus/assistant management
- Platform-level governance
- Admin ↔ Assistant communication

### 🛡️ Assistant
- Campus setup and verification
- Student and teacher management
- Events, announcements, analytics, and audit activity
- Campus-level operational controls

### 👨‍🏫 Teacher
- Attendance sessions and reports
- Assignment creation, grading, and feedback
- Resources and announcements
- Attendance and assignment analytics
- Daily/weekly timetable views

### 🧑‍🏫 HOD
- Department timetable management
- Teacher/subject/section/room assignment
- Conflict validation for official schedules

### 👨‍🎓 Student
- Secure attendance flow
- Attendance history and subject-wise percentage
- Daily and weekly timetable views
- Assignments, grades, feedback, and resources
- Announcements, exams, and AI-assisted academic tools

---

## 🔐 Attendance Flow

```text
Teacher starts session
        ↓
Student opens/scans attendance flow
        ↓
Session + token validation
        ↓
Identity / face verification
        ↓
Optional geolocation / campus checks
        ↓
Attendance recorded
```

The system is designed to make proxy attendance significantly harder than QR-only or location-only approaches by combining multiple verification layers.

---

## 🧠 AI-assisted Academic Features

Depending on configuration, Classify AI supports:

- AI Study Planner
- Syllabus analysis
- Expected-question generation
- AI-assisted resource summaries
- Assignment-analysis workflows
- Multi-provider AI integration

AI features can be separated or disabled for deployments that do not require them.

---

## 💬 Real-time Communication

The campus chat layer supports role-aware communication across Admin, Assistant, Teacher, and Student users, with capabilities such as:

- Real-time conversations
- Private-channel support
- Typing indicators
- Read receipts
- Message reactions
- Edit/delete and pinned messages
- New-message notifications

Identity resolution is designed around server-side session context rather than trusting client-side role identifiers.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Backend | Next.js server APIs, Prisma ORM |
| Database | PostgreSQL |
| Desktop | Tauri 2, Rust |
| Realtime | Pusher |
| Notifications | Firebase |
| Storage / Media | Cloudinary |
| Attendance | QR tooling, face-api.js, geolocation support |
| AI | OpenAI, Google GenAI, multi-provider integrations |
| Caching / Queues | Redis / Upstash, BullMQ where configured |

---

## 📦 Local Development

```bash
# install dependencies
yarn install

# generate Prisma client
npx prisma generate

# run the web app
yarn dev
```

For desktop development:

```bash
yarn tauri dev
```

Configure the required environment variables for database, authentication, AI providers, storage, notifications, and other enabled services before running the complete feature set.

> Never commit production API keys, database credentials, or service secrets to the repository.

---

## 📚 Documentation

- [Technical Overview](./docs/technical-overview.md) — architecture, workflows, implementation notes, security considerations, and ongoing hardening
- [Teacher Dashboard Feature Checklist](./docs/teacher-dashboard-features.md)
- [EduReels](./docs/edureels.md) — video upload, approval rules, feed ranking, and deployment notes

The deeper engineering notes have intentionally been moved out of this README so the project landing page stays concise and easy to evaluate.

---

## ⚠️ Project Status

Classify AI is under **active development**. Major modules are implemented, while some areas are still being hardened and prepared for controlled production use.

For institutional adoption, a staged deployment and security/configuration review is recommended before full production rollout.

---

## 🧾 Usage Notice

Classify AI is shared publicly for **demonstration, portfolio, and educational review purposes**.

Commercial, institutional, or production use requires **prior written permission from the author**.

**Author:** Vaibhav Mali

---

<p align="center">
  <strong>Building software for real campus problems — not just another CRUD demo.</strong>
</p>
