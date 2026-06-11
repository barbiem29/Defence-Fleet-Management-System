# Defence Fleet Management System

<div align="center">

### Enterprise-Grade Defence Vehicle Maintenance & Approval Workflow System

A secure role-based backend application designed to streamline defence fleet maintenance operations, issue reporting, multi-level approvals, and supplier coordination through a structured workflow.

**Live Demo:** https://defence-fleet-management-system.onrender.com

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-Backend-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-Authentication-red?logo=jsonwebtokens)
![REST API](https://img.shields.io/badge/API-REST-blue)
![Role Based Access](https://img.shields.io/badge/Security-RBAC-orange)

</div>

---

## Overview

The Defence Fleet Management System (DFMS) is a backend solution developed to simulate real-world maintenance workflows used in defence logistics and fleet operations.

The system enables authorised personnel to manage vehicles, report maintenance issues, coordinate spare-part availability, and process repair approvals through multiple authority levels.

The application follows a secure Role-Based Access Control (RBAC) architecture and uses JWT authentication to protect sensitive operations.

---

## Key Features

### Fleet Management

* Register and manage defence vehicles
* Maintain fleet inventory records
* Categorise vehicles by operational class
* Track vehicle details and maintenance status

### Maintenance Issue Tracking

* Report faults and maintenance requests
* Monitor issue progress throughout its lifecycle
* Maintain historical repair records
* Track resolution status

### Multi-Level Approval Workflow

#### Junior Engineer (JE)

* Performs technical verification
* Reviews maintenance requests
* Approves or rejects issues

#### Officer In Charge (OIC)

* Conducts final administrative review
* Approves or rejects verified requests

#### Supplier

* Confirms spare-part availability
* Updates procurement status
* Coordinates supply fulfilment

### Role-Based Security

* JWT Authentication
* Protected API Routes
* Authorisation Middleware
* Role-Based Access Control (RBAC)

### Status Monitoring

#### JE Status

* Pending
* Approved
* Rejected

#### OIC Status

* Pending
* Approved
* Rejected

#### Supplier Status

* Pending
* Supplied
* Not Available

---

## System Workflow

```text
Issue Reported
      │
      ▼
Junior Engineer Review
      │
      ▼
Officer In Charge Approval
      │
      ▼
Supplier Verification
      │
      ▼
Maintenance Completion
```

---

## Technology Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose ODM

### Security

* JSON Web Token (JWT)
* Password Hashing
* Role-Based Access Control

### API Architecture

* RESTful APIs
* Middleware-Based Authentication
* Modular MVC Structure

### Deployment

* Render

---

## Authentication Flow

```text
User Login
    │
    ▼
JWT Token Generated
    │
    ▼
Token Sent In Request Header
    │
    ▼
Authentication Middleware
    │
    ▼
Role Verification
    │
    ▼
Protected Resource Access
```

---

## User Roles

| Role                    | Responsibilities                           |
| ----------------------- | ------------------------------------------ |
| Admin                   | System administration and management       |
| Junior Engineer (JE)    | Technical verification of issues           |
| Officer In Charge (OIC) | Final approval authority                   |
| Supplier                | Spare-part availability and supply updates |

---

## REST API Endpoints

### Authentication

| Method | Endpoint             | Description                        |
| ------ | -------------------- | ---------------------------------- |
| POST   | `/api/auth/register` | Register a new user                |
| POST   | `/api/auth/login`    | Authenticate user and generate JWT |

---

### Vehicle Management

| Method | Endpoint        | Description           |
| ------ | --------------- | --------------------- |
| POST   | `/api/vehicles` | Add vehicle           |
| GET    | `/api/vehicles` | Retrieve all vehicles |

---

### Issue Management

| Method | Endpoint      | Description              |
| ------ | ------------- | ------------------------ |
| POST   | `/api/issues` | Create maintenance issue |
| GET    | `/api/issues` | Fetch all issues         |

---

### Workflow Management

| Method | Endpoint                   | Description            |
| ------ | -------------------------- | ---------------------- |
| PUT    | `/api/issues/jee/:id`      | JE review action       |
| PUT    | `/api/issues/oic/:id`      | OIC approval action    |
| PUT    | `/api/issues/supplier/:id` | Supplier status update |

---

## Project Structure

```bash
Defence-Fleet-Management-System/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── vehicleController.js
│   └── issueController.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
│
├── models/
│   ├── User.js
│   ├── Vehicle.js
│   └── Issue.js
│
├── routes/
│   ├── auth.js
│   ├── vehicles.js
│   └── issues.js
│
├── app.js
├── package.json
└── README.md
```

---

## Environment Variables

Create a `.env` file inside the root directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

## Installation & Setup

### Clone Repository

```bash
git clone https://github.com/barbiem29/Defence-Fleet-Management-System.git
```

### Navigate To Project

```bash
cd Defence-Fleet-Management-System
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

or

```bash
npx nodemon app.js
```

### Production

```bash
node app.js
```

---

## Live Deployment

Application URL:

https://defence-fleet-management-system.onrender.com

---

## Security Features

* JWT-Based Authentication
* Role-Based Authorisation
* Protected API Routes
* Middleware Access Control
* Secure Password Storage
* Centralised Request Validation

---

## Learning Outcomes

This project demonstrates practical implementation of:

* REST API Development
* Authentication & Authorisation
* MongoDB Data Modelling
* Express Middleware Architecture
* Backend Workflow Automation
* Enterprise Access Control Systems
* Real-World Approval Pipelines

---

## Future Enhancements

* React Frontend Dashboard
* Real-Time Notifications
* Audit Logging System
* Analytics & Reporting Dashboard
* Fleet Health Monitoring
* Maintenance Scheduling
* Email Notifications
* API Documentation with Swagger

---


