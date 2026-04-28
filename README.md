# mock-test-app
A full-stack mock test application built with modern web technologies.

  # 📚 ExamPrep

> A smart, student-first exam preparation platform featuring custom mock tests and curated Previous Year Questions (PYQs) — all in one place.

---

## 🧭 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Roadmap](#roadmap)
- [License](#license)

---

## 📖 About the Project

**ExamPrep** is a web-based exam preparation platform built to give students full control over how they practice. Whether you want to simulate a real exam environment with a custom mock test or revisit Previous Year Questions by chapter — ExamPrep has you covered.

> ⚠️ This is currently a **mock/demo version**. Active development is ongoing and a full public release is planned.

---

## ✨ Features

### 🧪 Custom Mock Test Panel
- Students can **select specific chapters** to include in their mock test
- Configure test details such as number of questions, time limit, and difficulty level
- A clean, distraction-free **test-taking interface** to simulate real exam conditions
- Instant results and performance summary upon submission

### 📂 PYQ Panel (Previous Year Questions)
- Organized, chapter-wise access to **Previous Year Questions**
- Inbuilt mock tests based on past paper patterns
- Helps students understand **exam trends** and frequently tested topics

### 🔒 User Panel
- Student accounts with personalized dashboards
- Track mock test history and performance over time

---

## 🛠️ Tech Stack

| Layer      | Technology               |
|------------|--------------------------|
| Frontend   | HTML, React.js           |
| Backend    | Node.js                  |
| Database   | PostgreSQL               |
| Styling    | CSS / (UI framework TBD) |

---

## 📁 Project Structure
---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/)
- [Git](https://git-scm.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/examprep.git
cd examprep

# 2. Install backend dependencies
cd server
npm install

# 3. Install frontend dependencies
cd ../client
npm install
```

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/examprep
JWT_SECRET=your_jwt_secret
```

### Running the App

```bash
# Start the backend
cd server
npm run dev

# Start the frontend (new terminal)
cd client
npm start
```

Visit `http://localhost:3000` in your browser.

---

## 🗺️ Roadmap

- [ ] **UI/UX Overhaul** — Cleaner, modern, mobile-friendly interface
- [ ] **Enhanced Security** — Rate limiting, JWT hardening, HTTPS
- [ ] **Easier Access** — Simplified onboarding and login flow
- [ ] **Performance Analytics** — Charts and insights on student progress
- [ ] **Subject & Exam Filtering** — JEE, NEET, UPSC, and more
- [ ] **Timed Practice Mode** — Adaptive timer for different exam formats
- [ ] **Terms & Conditions / Privacy Policy** — Before public launch
- [ ] **Admin Dashboard** — Manage questions, users, and content
- [ ] **Mobile App** — PWA or native version

---

## 📄 License

Currently unlicensed (personal/demo project). A license will be added before public release.

---

<p align="center">Built with ❤️ for students who take their preparation seriously.</p>
