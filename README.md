# MediSync — Full-Stack Doctor & Patient Appointment System

A clean, modern, and reliable appointment booking system built with **React**, **Java (Spring Boot 3)**, and **PostgreSQL**.

## 🌐 Live Production & Repository Links

- **GitHub Repository**: [https://github.com/kishorB19/appointment-booking-system](https://github.com/kishorB19/appointment-booking-system)
- **Vercel Frontend URL**: [https://frontend-ten-murex-2hsttxiju3.vercel.app](https://frontend-ten-murex-2hsttxiju3.vercel.app)
- **Deployment Status**: ✅ Production Ready

---

## 🎯 Key Roles & Features

### 1. 🧑‍⚕️ Patient Role
- **Browse Specialists**: Search doctors by name, clinic, or filter by medical specialty (Cardiology, Dermatology, Pediatrics, Neurology, etc.).
- **Doctor Profiles**: View consultation fees, ratings, years of clinical experience, available days, and operating hours.
- **Book Consultations**: Pick an upcoming date, interactive time slots, and specify reason/symptoms.
- **Appointment Management**: Track upcoming visits, filter by status (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`), and cancel if needed.
- **Digital Prescriptions**: View and print doctor-issued prescriptions (with Rx medications, dosages, frequency, and instructions).

### 2. 🩺 Doctor Role
- **Consultation Queue**: Real-time KPI summary (Total bookings, Today's patients, Pending action, Completed consultations).
- **Manage Appointments**: Confirm pending requests, decline visits, or mark completed.
- **Digital Prescription Composer**: Interactive medication builder (name, dosage, frequency, duration), clinical diagnosis, dietary instructions, and follow-up notes.
- **Practice Availability**: Configure active consultation days (Mon–Sun), start/end working hours, consultation fee, and clinic details.
- **Issued Prescriptions Archive**: Full history of generated prescriptions.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Modern Vanilla CSS Design System, Lucide React Icons.
- **Backend**: Java 21 / 22, Spring Boot 3.4.3, Spring Security 6 with JWT (JJWT 0.12.x), Spring Data JPA.
- **Database**: PostgreSQL 18 (database: `appointment_booking`).

---

## 🔑 Pre-Seeded Demo Accounts (1-Click or Manual)

| Role | Name | Email | Password | Details |
|------|------|-------|----------|---------|
| **Patient** | Alex Taylor | `patient@demo.com` | `password123` | Pre-booked appointments & Rx |
| **Doctor** | Dr. Sarah Jenkins | `doctor.sarah@demo.com` | `password123` | Cardiology ($75/visit) |
| **Doctor** | Dr. Robert Chen | `doctor.robert@demo.com` | `password123` | Dermatology ($60/visit) |
| **Doctor** | Dr. Priya Sharma | `doctor.priya@demo.com` | `password123` | Pediatrics ($55/visit) |
| **Doctor** | Dr. Marcus Vance | `doctor.marcus@demo.com` | `password123` | Neurology ($90/visit) |

*(You can also register brand new Patient or Doctor accounts anytime directly from the Sign Up form).*

---

## 🚀 Running Locally

### 1. Backend (Spring Boot + PostgreSQL)
```powershell
cd "e:\DAS JAVA\backend"
.\mvnw.cmd spring-boot:run
```
- Runs on: `http://localhost:8080`
- Connects to PostgreSQL: `localhost:5432/appointment_booking` (User: `postgres`)

### 2. Frontend (React + Vite)
```powershell
cd "e:\DAS JAVA\frontend"
npm install
npm run dev
```
- Runs on: `http://localhost:5173`
- Automatically proxies API requests to `http://localhost:8080`

---

## 📦 Deploying to GitHub

1. Ensure Git is configured with your name and email:
```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

2. Add all files and make the initial commit:
```powershell
git add .
git commit -m "Initial commit: Complete full-stack doctor and patient appointment system"
```

3. Create a new repository on GitHub (e.g. `appointment-booking-system`).

4. Link the remote repository and push:
```powershell
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git
git push -u origin main
```

---

## 🌐 Deploying Frontend to Vercel

The frontend includes `vercel.json` pre-configured for Single-Page Application (SPA) routing.

### Option A: Via Vercel Web Dashboard (Recommended)
1. Go to [https://vercel.com](https://vercel.com) and log in.
2. Click **"Add New"** > **"Project"** and import your GitHub repository.
3. In **Root Directory**, click **Edit** and select `frontend`.
4. Under **Environment Variables**, set:
   - `VITE_API_BASE_URL` = `<YOUR_DEPLOYED_BACKEND_URL>` (e.g., hosted on Render, Railway, or AWS).
5. Click **Deploy**.

### Option B: Via Vercel CLI
```powershell
cd "e:\DAS JAVA\frontend"
npm install -g vercel
vercel
```
Follow the CLI prompts to deploy directly.
