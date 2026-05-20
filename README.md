# 🎓 Classify AI 

> **A Next-Generation, AI-Powered Campus Management Desktop Application**

Classify AI is an AI-powered Academic Operating System (AOS) that redefines how educational institutions operate. Designed as a high-performance **Desktop App using Next.js and Tauri**, it replaces outdated ERP systems with a unified, intelligent platform connecting students, teachers, and administrators with cutting-edge technologies like **Geo-fenced Facial Recognition**, **AI Study Planners**, and **Multi-tier Role-Based Access Control (RBAC)**, it transforms campuses into fully digital, automated, and insight-driven environments.

---

## ✨ Why Classify AI?
Traditional LMS platforms are outdated, easy to bypass, and run as slow web apps. Classify AI introduces **Zero-Proxy Attendance** using Geolocation and Face Verification, running natively on your machine. It actively improves student productivity through AI-generated roadmaps and gives teachers powerful analytics to track progress.

---

## 🚀 Core Features by Role

### 👨‍🎓 1. Student Portal (Standard & Premium)
* **Zero-Proxy Attendance:** Secure attendance marking verified via device Geolocation and Facial Recognition.
* **Smart Dashboard:** Real-time overview of today’s attendance, upcoming exams, and interactive calendar (events, holidays, exams).
* **Assignment Hub:** Seamlessly submit text or files (PDFs/Images via Cloudinary), track grading status, and handle "Late Submissions" gracefully.
* **Instant Notifications:** Stay updated with push notifications for every campus announcement.
* **👑 Premium Features:** * **Bunk Manager:** Intelligently manage your attendance and calculate how many classes you can afford to miss.
  * **AI Study Planner:** Auto-generate personalized weekly or semester-wise study roadmaps based on your syllabus.
  * **AI Assistant:** A dedicated AI chatbot for resolving academic queries.

### 👨‍🏫 2. Teacher Portal
* **Advanced Analytics:** Track assignment submission rates and identify defaulting students instantly.
* **Attendance Tracking & Automated Warnings:** Monitor student attendance graphs and send one-click warning emails to students with low attendance.
* **Class Schedule:** Real-time daily timetable mapping with exact lecture timings.
* **Resource Management:** Distribute study materials, books, and campus-wide or section-specific announcements.

### 🛡️ 3. Assistant Portal (Campus Managers)
* **Secure Onboarding:** Add and verify new teachers and students via secure email authentication.
* **Operational Control:** Manage campus announcements, update the academic calendar, and schedule upcoming exams.
* **Audit Logs:** Maintain comprehensive system logs tracking logins, assignment uploads, and announcement publications for ultimate accountability.

### 👑 4. Admin Portal
* **Global Oversight:** The master control panel to create and assign Campus Assistants across multiple registered institutions on the Classify AI network.

---

## 🛠️ Tech Stack & Architecture

Classify AI is built to be a lightning-fast, secure native desktop application.

* **Frontend Framework:** Next.js (App Router), React, TypeScript, Tailwind CSS
* **Desktop Runtime:** Tauri (Rust-based, ultra-lightweight and secure)
* **Backend:** Next.js API Routes (Serverless)
* **Database & ORM:** PostgreSQL, Prisma ORM
* **Storage & Media:** Cloudinary (Secure PDF/Image hosting)
* **Notifications & Auth:** Firebase Cloud Messaging (FCM), Custom JWT Auth + Face/Geo Verification

---

## ⚙️ Getting Started (Local Development)

### Prerequisites
Before you begin, ensure you have the following installed:
* **Node.js** (v16 or higher)
* **Rust & Cargo** (Required for Tauri backend compilation)
* OS-specific dependencies for Tauri (e.g., `build-essential`, `webkit2gtk` for Linux)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/classify-ai.git](https://github.com/your-username/classify-ai.git)
   cd classify-ai
   ```

   > Replace `<your-github-username>` with your GitHub username if you have forked this repository.
2. **Install frontend dependencies:**
   ```bash
   npm install
      
3. **Set up Environment Variables:** <br> Create a `.env` file in the root directory and configure your credentials:
   ```code snippet
   DATABASE_URL="postgresql://user:password@localhost:5432/classify_ai"
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your_preset"
   # Add your Firebase Admin and Auth keys here
   
4. **Run Prisma Migrations:**
   ```bash
   npx prisma migrate dev
   npx prisma generate
      
5. **Start the Tauri Desktop App:**
   ```bash
   npm run tauri dev

_This command will start the Next.js frontend and compile the Rust backend, opening the Classify AI native desktop window._

---
## 🔮 Future Roadmap
* **[ ]Real-Time Campus Chat (Secure Communication Layer):** A highly secure, real-time messaging system designed specifically for structured academic communication between students, teachers, and campus staff.
  * **Role-Based Messaging (RBAC):** Controlled communication (Student ↔ Teacher, Teacher ↔ Class, Admin ↔ All).
  * **End-to-End Encryption (E2EE):** Ensures complete privacy and data protection.
  * **Smart Channels:** Class-wise, subject-wise, and announcement-based chat rooms.
  * **Read Receipts & Activity Tracking:** See who has read important academic messages.
  * **AI Moderation Layer:** Automatically detects spam, abuse, or irrelevant content.
  * **Pinned Messages & Highlights:** Important notices stay on top.
  * **Offline Sync & Delivery Queue:**  Messages sync automatically when user reconnects.
  * **Integration with Modules:** Directly linked with assignments, attendance alerts, and announcements.
* **[ ]Custom LLM Integration (Campus Intelligence Engine):** A deeply personalized AI system powered by a custom-trained Large Language Model, tailored specifically for each institution’s academic ecosystem.
  * **Campus-Specific Training:** Model trained on syllabus, notes, previous year papers, and teacher content.
  * **Context-Aware Responses:** Answers based on your college data, not generic internet knowledge.
  * **Student Assistant:** Helps in doubt solving, summaries, and concept explanations.
  * **Teacher Assistant:** Generates assignments, quizzes, and evaluation insights.
  * **Multi-Language Support:** Supports regional + English explanations for better accessibility.
  * **Memory Layer:** Remembers student progress, weak areas, and learning patterns.
  * **Secure Data Isolation:**  Each institution’s data remains completely isolated and private.
  * **On-Device / Hybrid Inference (Future):** Leveraging Tauri (Rust) for faster and more secure local AI execution.
  * **Explainability Layer:** AI explains how it derived an answer (important for academics).
* **[ ]EduReels- Short-Form Learning Engine (Instagram-like Experience):** To make education more engaging and addictive in a productive way, Classify AI will introduce a dedicated short-video content system inspired by platforms like Instagram Reels.
  * **Separate Content Flow:** A completely independent section focused only on educational short-form videos (no distraction content).
  * **AI-Curated Feed:** Personalized reels based on student’s syllabus, weak topics, and upcoming exams.
  * **Micro-Learning Videos:** 30–90 second concept explainers, quick revisions, formulas, and problem-solving tricks.
  * **Teacher & Verified Creator Uploads:** Only authenticated educators and top students can publish content.
  * **Gamified Learning:** Likes, saves, streaks, and rewards for consistent learning.
  * **Smart Revision Mode:**  Before exams, feed automatically shifts to high-priority revision content.
  * **Offline Sync (Future):** Download reels for low-connectivity environments.
* **[ ]AI Reel Generator (Notes -> Video Automation):** An advanced AI system that automatically converts study material into engaging short-form educational videos.
  * **Input Sources:** PDFs, handwritten notes (via OCR), typed content, or syllabus topics.
  * **AI Script Generation:** Converts raw content into concise, structured micro-learning scripts.
  * **Auto Voiceover:** Natural AI-generated narration in multiple languages.
  * **Visual Scene Generation:** Auto-create slides, diagrams, highlights, and key-point animations.
  * **Smart Segmentation:** Breaks large topics into multiple bite-sized reels.
  * **Concept Highlighting:**  Focus on formulas, definitions, and frequently asked questions.
  * **Teacher Control Layer:** Teachers can review, edit, and approve AI-generated reels before publishing.
  * **Personalized Output**: Generates reels tailored to a student’s weak areas and learning pace.
---
 <u>_Built with ❤️ for modern education._</u>