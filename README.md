# Reimbursement Management System

A full-stack Reimbursement Management System built using **React, Node.js, Express.js, PostgreSQL (Supabase), and Drizzle ORM**.

The application provides a complete reimbursement workflow with role-based access control for Employees (EMP), Reporting Managers (RM), Accounts Payable Executives (APE), and Chief Financial Officers (CFO).

---

## Features

### Authentication

- User Registration
- User Login
- User Logout
- JWT Authentication
- HTTP-only Cookie Authentication
- Authentication Persistence
- Protected Routes

---

### Role-Based Access Control (RBAC)

Supported Roles:

- EMP
- RM
- APE
- CFO

Each role has access only to the features permitted by the backend authorization layer.

---

### Employee Management

- View Employees
- Assign Roles
- Assign Employees to Reporting Managers
- Remove Employee Assignments
- Role-Based Employee Visibility

---

### Reimbursement Workflow

Employees can:

- Create reimbursement requests
- View reimbursement history

Reporting Managers can:

- View subordinate reimbursement requests
- Approve or Reject requests

Accounts Payable Executives can:

- View RM-approved reimbursements
- Approve or Reject requests

Chief Financial Officers can:

- View approved reimbursements
- Override approvals (if enabled)

---

## Tech Stack

### Frontend

- React (Vite)
- React Router
- Axios
- Context API
- CSS

### Backend

- Node.js
- Express.js
- JWT
- bcrypt
- cookie-parser

### Database

- PostgreSQL (Supabase)
- Drizzle ORM

---

# Architecture

```
React Frontend
        │
        ▼
Express REST API
        │
        ▼
Drizzle ORM
        │
        ▼
Supabase PostgreSQL
```

---

# Project Structure

```
Reimbursement-Management/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── db/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
└── README.md
```

---

# Database Schema

## Users

| Field | Description |
|-------|-------------|
| id | UUID |
| name | User Name |
| email | User Email |
| password | Hashed Password |
| role | EMP / RM / APE / CFO |
| createdAt | Timestamp |
| updatedAt | Timestamp |

---

## Employee Manager

| Field | Description |
|-------|-------------|
| id | UUID |
| employeeId | Employee |
| managerId | Reporting Manager |
| createdAt | Timestamp |

---

## Reimbursements

| Field | Description |
|-------|-------------|
| id | UUID |
| employeeId | Employee |
| title | Reimbursement Title |
| description | Description |
| amount | Amount |
| rmApproval | Approval Status |
| apeApproval | Approval Status |
| finalStatus | Final Status |
| createdAt | Timestamp |
| updatedAt | Timestamp |

---

# Approval Workflow

```
Employee
      │
Create Reimbursement
      │
      ▼
Reporting Manager
      │
Approve / Reject
      │
      ▼
Accounts Payable Executive
      │
Approve / Reject
      │
      ▼
Chief Financial Officer
```

### Final Status Rules

```
RM = REJECTED
→ REJECTED

APE = REJECTED
→ REJECTED

RM = APPROVED
+
APE = APPROVED
→ APPROVED

Otherwise
→ PENDING
```

---

# API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/rest/onboardings/register` |
| POST | `/rest/onboardings/login` |
| POST | `/rest/onboardings/logout` |
| GET | `/rest/onboardings/profile` |

---

## Employee Management

| Method | Endpoint |
|---------|----------|
| GET | `/rest/employees` |
| POST | `/rest/employees/assign` |
| DELETE | `/rest/employees/assign` |

---

## Role Management

| Method | Endpoint |
|---------|----------|
| POST | `/rest/roles/assign` |

---

## Reimbursements

| Method | Endpoint |
|---------|----------|
| POST | `/rest/reimbursements` |
| PATCH | `/rest/reimbursements` |
| GET | `/rest/reimbursements` |
| GET | `/rest/reimbursements/:userId` |

---

# Running the Project

## Clone Repository

```bash
git clone https://github.com/Alka709/Reimbursement-Management.git
cd Reimbursement-Management
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
PORT=7002

DATABASE_URL=YOUR_SUPABASE_DATABASE_URL

JWT_SECRET=YOUR_SECRET

CLIENT_ORIGIN=http://localhost:5173
```

Run backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`

```env
VITE_API_BASE_URL=http://localhost:7002
```

Run frontend

```bash
npm run dev
```

---

# Testing

Test the application using:

- Postman (Backend APIs)
- Browser UI (Frontend)

Recommended workflow:

1. Register Employee
2. Assign RM
3. Assign Role
4. Login
5. Create Reimbursement
6. RM Approval
7. APE Approval
8. CFO View

---

# Future Enhancements

- Dashboard Analytics
- Search & Filtering
- Pagination
- Email Notifications
- Export Reports
- Audit Logs
- Multi-level Approval Workflow

---

# Author

**Alka Santhosh**

B.Tech Computer Science (AI & ML)

KR Mangalam University

---

## License

This project is developed for educational and portfolio purposes.
