# 🏆 TasksHero Frontend (Family Task & Reward System)

A web-based family management system for organizing tasks and rewards for children.

Parents can define tasks, create rewards, and assign them to children.  
Children earn points by completing tasks and redeem them for rewards.

---

# ✨ Features

## 👨‍👩‍👧‍👦 Family Management

- Define a family name
- Create, edit, and manage children
- Optional image upload for children
- Individual voice selection per child (Web Speech API)

---

## 📋 Tasks (Task Pool)

- Create, edit, and delete tasks
- Age group categorization:
  - Kindergarten
  - Elementary School
  - Teenager

- Assign points per task
- Assign tasks to one or multiple children
- Filtering & sorting functionality
- Optional image upload or placeholder image

---

## 🎁 Rewards (Reward Pool)

- Create, edit, and delete rewards
- Define reward cost (points required)
- Filter by cost categories:
  - Small Rewards (5–19 points)
  - Medium Rewards (20–49 points)
  - Large Rewards (50–100 points)

- Children can redeem rewards (with automatic point validation)
- Optimistic UI updates
- Animated success feedback upon redemption

---

## ⭐ Points System

```code
Points = Completed Tasks − Redeemed Rewards
```

- Animated point display (SVG + Motion animation)
- Immediate visual feedback
- Real-time calculation

---

## 🔊 Text-to-Speech Feature

- WWeb Speech API integration
- Selectable German voice per child
- Tasks and rewards can be read aloud

⚠️ Currently, the selected voice is stored in the browser’s localStorage.
This means the voice preference is browser-specific and not persisted per child on the backend.
Selecting a new voice overrides the previously selected voice.

---

## 🔐 Authentication

- Implemented with Clerk
- Protected areas using `<SignedIn>` / `<SignedOut>`
- Token-based API communication (Bearer Token)

---

# 🏗️ Architecture

## Frontend

- React (Vite)
- TailwindCSS
- Clerk Authentication
- REST API communication
- Motion animations (`motion/react`)
- React Icons

---

## Backend (External)

API: https://github.com/aline-j/taskshero-backend

The frontend expects a REST API with the following endpoints:

### User

```code
GET /me
PUT /update-user
```

### Family

```code
GET /family
POST /family
```

### Children

```code
GET /children
POST /children
GET /children/:id
PUT /children/:id
GET /children/:id/tasks
GET /children/:id/rewards
```

### Tasks

```code
GET /tasks
POST /tasks
POST /assign-task
POST /children/:childId/tasks/:taskId/completed
```

### Rewards

```code
GET /rewards
POST /rewards
POST /children/:childId/rewards/:rewardId/redeemed
```

---

# 📂 Project Structure (Frontend)

```code
src/
│
├── pages/
│ ├── Account.jsx
│ ├── Auth.jsx
│ ├── Children.jsx
│ ├── ChildDetails.jsx
│ ├── Tasks.jsx
│ ├── Rewards.jsx
│ └── Family.jsx
│
├── components/
│ ├── AddTaskForm.jsx
│ ├── UpdateTaskForm.jsx
│ ├── AddRewardForm.jsx
│ ├── UpdateChildForm.jsx
│ ├── AddChildForm.jsx
│ ├── AssignmentTaskForm.jsx
│ ├── Score.jsx
│ ├── CompletedRedeemedAnimation.jsx
│ └── ...
│
└── context/
 └── ChildrenContext.jsx
```

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/aline-j/taskshero-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a .env file in the root directory:

```text
VITE_API_URL=http://localhost:8000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

### 4. 🚀 Running the Application

```bash
npm run dev
```
