# 🎓 Classify AI

> **A Next-Generation, AI-Powered Academic Operating System for Modern Campuses**

Classify AI is a modern **Academic Operating System (AOS)** built to manage the real workflows of colleges and universities from one unified platform. It combines secure attendance, student onboarding, teacher workflows, HOD timetable management, assignments, resources, announcements, real-time campus chat, analytics, and AI-powered academic support.

Designed as a high-performance **desktop-first application using Next.js and Tauri**, Classify AI moves beyond traditional ERP/LMS tools by focusing on security, accountability, real campus operations, and role-based user experiences.

Classify AI is built around five major role layers:

- **Admin** — global controller of the Classify AI network
- **Assistant** — campus-level operational manager
- **Teacher** — academic delivery, attendance, resources, assignments, and analytics
- **HOD** — timetable and academic schedule authority
- **Student** — attendance, assignments, timetable, resources, announcements, and AI-assisted learning

---

## ✨ Why Classify AI?

Traditional campus systems are often fragmented, slow, and easy to bypass. Attendance systems are frequently vulnerable to proxy attendance, LMS tools are disconnected from real academic workflows, and campus communication often depends on external apps without institutional control.

Classify AI solves this through:

- **Zero-Proxy Attendance** using QR/session tokens, face verification, and geolocation validation
- **Role-Based Academic Workflows** for Admin, Assistant, Teacher, HOD, and Student roles
- **Secure Real-Time Campus Chat** for structured institutional communication
- **HOD Timetable Management** with conflict validation
- **Student & Teacher Timetable Views** connected to real class schedules
- **Assignment Lifecycle Management** with late submission tracking, grading, feedback, and analytics
- **Campus Activity Logs** for accountability and audit visibility
- **Premium Student Tools** such as Bunk Manager, AI Study Planner, and AI academic assistance
- **Future Classify Nexus Agent** for deeper personalized campus intelligence

---

## ⚠️ Current Project Status

Classify AI is currently under **active development**. Several major modules are already implemented and functional, including:

- Role-based dashboards
- Secure attendance workflows
- Assistant-managed campus setup
- Teacher attendance and assignment modules
- HOD timetable management
- Student timetable view
- Real-time campus chat
- Announcements and notifications
- Activity/audit logging
- Attendance statistics and sync fixes

For institutional or production use, the recommended approach is to first deploy a **controlled staging/demo version**, review the required modules, disable unnecessary or experimental modules, and then define production scope, responsibilities, maintenance expectations, and deployment terms.

---

## 🧾 Usage Notice

Classify AI is shared publicly for **demonstration, portfolio, and educational review purposes**.

Commercial, institutional, or production use of this project, including deployment on organizational infrastructure, requires **prior written permission from the author**.

**Author:** Vaibhav Mali

> Real environment variables, API keys, database credentials, production secrets, and service passwords should never be shared publicly or through chat/email. Use `.env.example` for configuration structure only.

---

## 🧩 Platform Architecture Overview

Classify AI follows a campus-centered hierarchy:

```txt
Admin
└── Campus Assistant
    ├── HOD / Teachers
    │   ├── Attendance
    │   ├── Assignments
    │   ├── Resources
    │   ├── Announcements
    │   └── Timetable View
    └── Students
        ├── Face Verification
        ├── Attendance Marking
        ├── Timetable View
        ├── Assignments
        ├── Resources
        ├── Announcements
        └── Premium AI Tools
```

Each campus can be configured independently with its own assistant, logo, geolocation settings, users, timetable, academic data, events, and operational controls.

---

## 🚀 Core Features by Role

### 👑 1. Admin Portal — Global System Controller

The Admin is the highest-level authority in Classify AI and controls the overall application network.

- **Assistant Appointment:** Admin appoints campus assistants for different colleges/campuses.
- **Email Verification:** Assistant appointment and onboarding flows use secure verification.
- **Multi-Campus Overview:** Admin can view all registered campuses and manage individual campus dashboards.
- **Campus Dashboard Access:** Admin can open a specific campus dashboard to view student count, teacher count, assistant identity, and campus analytics.
- **Campus Management:** Edit campus functionality is planned/under development for deeper configuration control.
- **Admin ↔ Assistant Communication:** Admin can communicate with assistants through the real-time campus chat layer.
- **Global Governance Layer:** Admin acts as the central authority for Classify AI, similar to a platform owner or network-level controller.

---

### 🛡️ 2. Assistant Portal — Campus Operations Manager

The Assistant acts as the operational head of a specific campus. Every campus has its own assistant responsible for setup, users, events, analytics, and day-to-day management.

#### Assistant Setup & Verification

When an assistant is appointed, they must complete a campus setup flow before accessing the full dashboard.

Setup includes:

- Campus name
- Hindi name
- Latitude and longitude
- WiFi BSSID / campus network reference
- Campus logo upload through Cloudinary
- Campus identity and operational configuration

If the assistant is not verified, dashboard access is blocked until setup is completed.

#### Assistant Dashboard

- Total students
- Total teachers
- Today’s attendance
- Today’s session/token activity
- Weekly attendance graph
- Recent activity logs
- Top attending students
- At-risk students
- Teacher activity
- Upcoming events
- Recent attendance overview

#### Manage Users

Assistants can manage both students and teachers.

Student fields include:

- Name
- Email
- Department
- Branch
- Year
- Semester
- Section
- Premium plan status

Teacher fields include:

- Name
- Email
- Department
- Designation such as HOD or Lecturer
- Subject assignment
- HOD teaching status where applicable

User onboarding is protected through OTP/email verification flows.

#### Manage Events

Assistants can add and manage:

- Holidays
- Exams
- Campus events
- Other academic or operational events

Event fields include:

- Title
- Description
- Event date
- Event type
- Status and actions

#### Premium Management

Assistant can manage premium plan visibility and user subscription status.

Includes:

- Total users
- Premium users
- Pro users
- Ultimate users
- Expired plans
- Plan downgrade/cancel actions
- Premium activity
- Upcoming expirations
- Monthly attendance report actions for premium users

#### Announcements

Assistants can create announcements for:

- Teachers
- Specific class groups
- All students

Announcements are connected with notification support.

#### Settings & Operations

Assistant settings include:

- Change assistant email with OTP verification
- Manage activity logs
- Contact/support messages
- Manage premium plan pricing
- Export activity logs to CSV

#### Audit Logs

Assistant can track system activity such as:

- Logins
- User additions/removals
- Assignment actions
- Announcements
- Attendance edits
- Premium activity
- System-level actions

---

### 👨‍🏫 3. Teacher Portal — Academic Delivery & Evaluation

Teachers manage attendance, assignments, announcements, resources, classes, and analytics.

#### Teacher Dashboard

- Welcome section with teacher name, date, and designation
- Assignment analytics
- Attendance analytics
- Quick actions for:
  - New assignment
  - New announcement
  - Upload resources
  - Attendance analytics

#### Assignment Analytics

- Total assignments
- Graded submissions
- Top subject
- Students tracked
- Performance by subject
- Average grade by subject
- Student grade trends
- Export to Excel option

#### Assignments

Teachers can:

- Create assignments with due dates
- Edit assignments until submissions begin
- View assignment cards and details
- Track submitted, late, and missing submissions
- View highest and lowest grades
- Grade student submissions
- Provide text feedback
- Provide audio feedback where implemented
- Attach digital signatures in graded PDF workflows
- Detect AI/plagiarism indicators depending on module configuration

#### Attendance

Teachers can:

- Start attendance sessions
- View attendance records
- Filter attendance by subject and date
- Edit attendance where allowed
- Download attendance reports as CSV
- Send warning emails to low-attendance students

Attendance edit actions are logged so assistants/admins can audit changes.

#### Classes & Timetable

Teachers can view daily and weekly classes generated from HOD-created timetable slots.

A timezone display issue was fixed where saved class times could shift during display. Timetable-safe formatting is now used to preserve intended class time.

#### Announcements & Resources

Teachers can:

- Create announcements for students
- Send updates with notification support
- Upload resources such as notes, PDFs, books, and academic material
- Make resources available to students for viewing and AI summary where configured

---

### 🧑‍🏫 4. HOD Portal — Timetable Authority

HOD functionality is implemented as a designation-based extension of the Teacher role. A teacher marked as **HOD** receives timetable management capabilities.

#### HOD Timetable Management

HODs can create and manage official timetables for departments/classes.

Implemented capabilities:

- Configure college working days
- Configure day timings
- Create timetable slots
- Edit timetable slots
- Delete timetable slots
- Assign classes to teachers, subjects, semesters, sections, and rooms

Supported entry types:

- `LECTURE`
- `LAB`
- `TUTORIAL`
- `EXTRA_CLASS`
- `LUNCH`
- `BREAK`
- `FREE`
- `EXAM`
- `EVENT`

Each timetable slot can include:

- Teacher
- Subject
- Semester
- Section
- Room
- Notes
- Weekday
- Start time
- End time

#### Timetable Validation

The backend validates:

- HOD authorization
- Working day validity
- College timing range
- Teacher conflict
- Semester-section conflict
- Room conflict
- Teacher-subject assignment validity

UI capabilities:

- Day timing setup
- Filters by day, semester, section, and teacher
- Add slot modal
- Edit slot modal
- Delete slot action
- Conflict error display
- Dark glassmorphism interface matching the rest of the app

---

### 👨‍🎓 5. Student Portal — Academic Companion

Students use Classify AI for attendance, timetable, assignments, announcements, resources, grades, and AI-assisted learning.

#### Student Setup & Login Security

- First-time login requires face setup/registration.
- Every login can be verified using face verification.
- Student identity is connected with campus, semester, section, and academic profile.

#### Student Dashboard

- Today’s attendance
- Today’s classes
- Upcoming exams
- Announcements
- Timetable shortcut
- Assignment status
- Academic activity overview

#### Attendance

Students can mark attendance through the secure attendance flow. Attendance is validated using:

- Session/QR code
- One-time attendance token
- Face verification
- Geolocation/geofencing
- Campus/session rules

Students can also view:

- Today’s attendance status
- Attendance history
- Subject-wise attendance percentage
- Attendance statistics

The timetable is fetched based on:

- `campusId`
- `semesterId`
- `sectionId`

Student timetable includes:

- Today’s Classes
- Weekly Timetable
- Semester and Section badges
- Classic Table View
- Modern Cards View

The Classic Table View gives an official college-style timetable layout with:

- Day-wise rows
- Time-wise columns
- Subject display
- Assigned teacher
- Room
- Subject/faculty legend

#### Assignments

Students can:

- View assignments
- Submit using text or files
- Submit on time or late
- View submission status
- View grades
- View teacher feedback
- Access graded assignment copy where supported

#### Resources

Students can access uploaded resources from teachers and view AI summaries where configured.

#### Premium Plans

Classify AI supports a tiered student feature model:

- **Starter** — basic student dashboard, attendance, assignments, announcements, resources, and exams
- **Pro** — includes Bunk Manager and AI Study Planner
- **Ultimate** — includes advanced AI assistant features such as Chat with AI where enabled

---

## 📍 Zero-Proxy Attendance System

Classify AI’s attendance system is designed to reduce proxy attendance through layered verification.

### Attendance Flow

1. Teacher starts an attendance session.
2. Students receive/access a QR or session-based attendance flow.
3. Student logs in and passes face verification.
4. Student scans the QR/session code.
5. The system validates:
   - One-time QR/session token
   - Student identity
   - Face verification
   - Latitude/longitude
   - Geofencing rules
   - Campus/session validity
6. Attendance is marked only if validation succeeds.

This layered system makes proxy attendance extremely difficult compared to QR-only or location-only systems.

### Recent Attendance Fixes

- Student attendance APIs now correctly resolve the student profile before querying attendance records.
- Attendance history, today’s attendance, attendance statistics, subject-wise percentage, and dashboard attendance now sync correctly after teacher actions.
- Attendance statistics were stabilized by replacing an ambiguous Prisma `groupBy` query with separate count queries.
- Attendance history date handling was fixed by returning both `date` and `markedAt` values.
- Attendance edit actions are now logged for audit tracking.

---

## 🧾 Assignment Workflow

Classify AI includes an assignment lifecycle designed for both teachers and students.

### Teacher Flow

- Teacher creates assignment with due date.
- Teacher can edit the assignment until the first submission is received.
- Teacher can view submission status:
  - On-time
  - Late
  - Not submitted
- Teacher can grade submissions.
- Teacher can provide text feedback.
- Teacher can provide audio feedback where configured.
- Teacher digital signature can be attached to graded assignment PDFs where supported.
- AI/plagiarism indicators can be shown during grading depending on module configuration.

### Student Flow

- Student receives assignment notification.
- Student submits assignment using text, PDF, image, or supported file formats.
- Late submissions are marked clearly.
- Student can view grade, feedback, and graded copy where supported.

---

## 💬 Secure Real-Time Campus Chat

Real-Time Campus Chat is now implemented as an active communication layer.

### Implemented Chat Capabilities

- Global `/chat` route for:
  - Student
  - Teacher
  - Assistant
  - Admin
- Role-aware chat experience from the logged-in user’s perspective
- Server-side session-based identity resolution using `session-token`
- Current user initialization through:

```txt
GET /api/auth/me
```

- Public/private key initialization
- Encrypted message flow
- Pusher private channels
- RBAC-based communication rules
- Real-time conversations
- Typing indicators
- Read receipts
- Message reactions
- Message edit/delete
- Pinned messages
- New message notifications

### Communication Model

Supported/targeted academic communication patterns include:

- Student ↔ Teacher
- Teacher ↔ Class/Section
- Teacher groups
- Student groups
- Teacher ↔ Assistant
- Admin ↔ Assistant

### Chat Security Fixes

Earlier, chat identity could be incorrectly resolved using localStorage priority such as `studentId → teacherId → adminId → assistantId`, which could open the chat under the wrong user context if multiple role IDs existed in storage.

This has been fixed by resolving the logged-in user securely from the server-side session cookie instead of trusting localStorage priority.

### Chat Cleanup Still In Progress

Some deeper cleanup is still planned. Certain chat-related APIs should eventually stop trusting frontend-provided identifiers such as `userId`, `senderId`, `creatorId`, `requesterId`, and `uploadedBy`, and should rely on server-side session identity everywhere.

> Offline sync and direct module-integrated message actions are not currently included as implemented chat features.

---

## 📅 Timetable System

Classify AI includes a role-aware timetable system connected to HOD-created schedules.

### HOD Side

HODs create and manage timetable slots with conflict validation.

### Teacher Side

Teachers can view their daily and weekly class schedules based on the HOD timetable.

### Student Side

Students can view their official timetable in both modern and classic formats.

### Timezone Fix

Teacher dashboard timetable display previously had a timezone issue where a saved time such as `9:00 AM` could display as `2:30 PM`. This was fixed by using timetable-safe formatting based on ISO time extraction.

---

## 🧠 AI & Premium Academic Tools

Classify AI includes AI-assisted tools for students and teachers where configured.

Implemented or available AI-assisted concepts include:

- AI Study Planner
- Syllabus analysis
- Expected question generation
- AI summaries for uploaded resources where configured
- Multi-provider AI support using OpenAI, Claude, Gemini/OpenRouter depending on configuration

AI interaction modules can be disabled or separated for university deployments that do not require AI features.

---

## 🧬 Future Vision — Classify Nexus

**Classify Nexus** is planned as a future personalized AI agent layer for Classify AI.

The goal is to evolve from simple AI responses into a context-aware academic agent that can work across the user’s academic environment.

Planned capabilities may include:

- Personalized academic memory
- Student progress awareness
- Weak-topic tracking
- Context-aware recommendations
- Study planning based on timetable, assignments, exams, and resources
- Teacher-side assistance for quizzes, assignments, and evaluation insights
- Secure campus-specific data isolation
- Optional hybrid/on-device intelligence through Tauri/Rust exploration

Classify Nexus is part of the future roadmap and is not treated as a required production module in the current deployment plan.

---

## 🛠️ Tech Stack & Architecture

Classify AI is built as a modern desktop-first academic platform.

- **Frontend Framework:** Next.js App Router, React, TypeScript, Tailwind CSS
- **Desktop Runtime:** Tauri
- **Backend:** Next.js API Routes
- **Database & ORM:** PostgreSQL, Prisma ORM
- **Real-Time Layer:** Pusher private channels
- **Storage & Media:** Cloudinary
- **Notifications:** Firebase Cloud Messaging
- **Authentication:** Custom auth, session-token identity, OTP verification, face verification flows
- **AI Providers:** OpenAI, Claude, Gemini/OpenRouter depending on module configuration
- **Security:** RBAC, audit logging, session-based identity resolution, face/geo verification

---

## ⚙️ Getting Started (Local Development)

### Prerequisites

Before you begin, install:

- **Node.js** v16 or higher
- **Rust & Cargo** for Tauri compilation
- **PostgreSQL**
- OS-specific Tauri dependencies

### Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/your-username/classify-ai.git
cd classify-ai
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory. Do not commit real secrets.

```env
DATABASE_URL="postgresql://user:password@localhost:5432/classify_ai"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your_upload_preset"
# Add Firebase, Pusher, SMTP, auth, and AI provider keys as required
```

> For shared/demo deployment, use `.env.example` only. Never share real production secrets.

4. **Run Prisma migrations**

```bash
npx prisma migrate dev
npx prisma generate
```

5. **Start the development app**

```bash
npm run dev
```

6. **Start the Tauri desktop app**

```bash
npm run tauri dev
```

---

## 🧪 Recommended Institutional Deployment Approach

For universities or organizations evaluating Classify AI, the recommended approach is:

1. Deploy a **staging/demo version first**.
2. Use an isolated server/VM/container environment.
3. Configure only the required modules.
4. Disable AI interaction modules, premium plans, and experimental roadmap features if not needed.
5. Use organization-owned credentials and environment variables.
6. Review scope, responsibilities, maintenance expectations, and usage terms before production deployment.

For a Proxmox-based university server, a safe approach would be:

- Isolated Ubuntu VM inside Proxmox
- Docker/Docker Compose for application services
- PostgreSQL as a separate service/container
- Nginx reverse proxy for domain routing and SSL/HTTPS
- Staging/demo deployment before production use

---

## 🔮 Future Roadmap

### Classify Nexus — Personalized Campus Agent

A future AI agent layer for personalized academic assistance and institution-specific intelligence.

### EduReels — Short-Form Learning Engine

A future educational short-form content system for micro-learning, exam revision, and verified teacher/student learning content.

### AI Reel Generator — Notes to Video Automation

A future AI-powered system for converting study materials into short educational videos with scripts, voiceover, visual scenes, and teacher approval.

### Advanced Chat Roadmap

Real-Time Campus Chat is already implemented, but future improvements may include:

- AI moderation layer
- Deeper server-side identity enforcement across all chat APIs
- Advanced smart channels where needed
- More institution-specific communication policies

---

## ❤️ Built For Modern Education

Classify AI is built with the vision of creating a secure, intelligent, and modern academic operating system for institutions that want to move beyond traditional ERP and LMS limitations.

---

<u>Built with ❤️ for modern education.</u>
