# Reimbursement Management System - BACKEND

Backend implementation for a reimbursement approval workflow built using Node.js, Express.js, PostgreSQL (Supabase), and Drizzle ORM.

---

# Tech Stack

* Node.js
* Express.js
* PostgreSQL (Supabase)
* Drizzle ORM
* JWT Authentication
* HTTP-only Cookies
* bcrypt

---

# Architecture

```text
Express
   |
Controllers
   |
Services
   |
Drizzle ORM
   |
Supabase PostgreSQL
```

Project Structure:

```text
src/
├── controllers/
├── services/
├── routes/
├── middlewares/
├── config/
├── db/
│   ├── schema/
│   ├── migrations/
│   └── seed/
├── utils/
├── app.js
└── server.js
```

---

# Features

## Authentication

* User Registration
* User Login
* User Logout
* JWT Authentication
* HTTP-only Cookie Authentication
* Password Hashing using bcrypt

## Role Based Access Control (RBAC)

Supported Roles:

* EMP
* RM
* APE
* CFO

## Employee Management

* Assign Roles
* Assign Employee to RM
* Remove Employee Mapping
* Employee Visibility based on Role

## Reimbursement Workflow

* Create Reimbursement
* RM Approval
* APE Approval
* CFO Override
* Reimbursement Visibility
* Subordinate Reimbursement View

---

# Database Design

## Users

Stores application users.

Fields:

* id
* name
* email
* password
* role
* createdAt
* updatedAt

---

## Employee Manager

Stores reporting hierarchy.

Fields:

* id
* employeeId
* managerId
* createdAt

Business Rule:

* Every employee reports to exactly one RM.

---

## Reimbursements

Stores reimbursement requests.

Fields:

* id
* employeeId
* title
* description
* amount
* rmApproval
* apeApproval
* finalStatus
* createdAt
* updatedAt

Approval Status Values:

* PENDING
* APPROVED
* REJECTED

---

# Environment Variables

Create a `.env` file:

```env
PORT=7002

DATABASE_URL=your_supabase_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_ORIGIN=http://localhost:3000
```

---

# Installation

Install dependencies:

```bash
npm install
```

---

# Database Migration

Generate migrations:

```bash
npx drizzle-kit generate
```

Apply migrations:

```bash
npm run db:migrate
```

---

# Seed CFO Account

Run:

```bash
npm run db:seed-data
```

Seeded Account:

```text
Email: cfo@org.com
Password: CFO#ORG@April2026
Role: CFO
```

---

# Run Application

Development:

```bash
npm run dev
```

Server runs on:

```text
http://localhost:7002
```

---

# API Endpoints

## Public Endpoints

### Register

```http
POST /rest/onboardings/register
```

### Login

```http
POST /rest/onboardings/login
```

### Logout

```http
POST /rest/onboardings/logout
```

---

## Role Management

### Assign Role

```http
POST /rest/roles/assign
```

Access:

```text
CFO
```

---

## Employee Management

### Get Employees

```http
GET /rest/employees
```

### Assign Employee

```http
POST /rest/employees/assign
```

### Remove Employee Assignment

```http
DELETE /rest/employees/assign
```

Access:

```text
CFO
```

---

## Reimbursement Management

### Create Reimbursement

```http
POST /rest/reimbursements
```

Access:

```text
EMP
```

### Approve / Reject Reimbursement

```http
PATCH /rest/reimbursements
```

Access:

```text
RM / APE / CFO
```

### Get Reimbursements

```http
GET /rest/reimbursements
```

### Get Employee Reimbursements

```http
GET /rest/reimbursements/:userId
```

---

# Reimbursement Lifecycle

```text
EMP
↓
Creates Reimbursement
↓
RM Reviews
↓
APPROVED / REJECTED

If Approved
↓
APE Reviews
↓
APPROVED / REJECTED

If Approved
↓
Visible to CFO
```

Final Status Rules:

```text
RM REJECTED
→ REJECTED

APE REJECTED
→ REJECTED

RM APPROVED
+
APE APPROVED
→ APPROVED

Otherwise
→ PENDING
```

---

# Validation Rules

## Registration

* Email must belong to org.com domain
* Email must be unique
* Required fields must be present

## Employee Assignment

* Employee must exist
* Manager must exist
* Employee role must be EMP
* Manager role must be RM
* Employee cannot be assigned twice

## Reimbursements

* Amount must be greater than zero
* Employee must be assigned to an RM
* RM can only approve subordinate reimbursements
* APE can only approve after RM approval

---

# Author

Alka Santhosh

B.Tech Computer Science (AI & ML)
KR Mangalam University
