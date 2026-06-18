
# API Documentation — Defence Fleet Management System

A role-based fleet maintenance system API built with Node.js, Express, and MongoDB. It handles authentication, vehicle management, maintenance workflows, and supplier coordination through a structured approval system.

---

# API Endpoints — Defence Fleet Management System

## Authentication
POST /api/auth/register  
POST /api/auth/login  

---

## Vehicles
GET /api/vehicles  
POST /api/vehicles  
DELETE /api/vehicles/6a2551c5bd89f01c922ba3f8  

---

## Issues / Maintenance
POST /api/issues  
GET /api/issues  
GET /api/issues/6a2554ebbd89f01c922ba407  

---

## Dashboard Analytics
GET /api/issues/dashboard/counts  

---

## Junior Engineer Flow
GET /api/issues/jr-executive/pending  
PUT /api/issues/6a2554ebbd89f01c922ba407/jr-executive/approve  
PUT /api/issues/6a2554ebbd89f01c922ba407/jr-executive/reject  

---

## Officer In Charge (OIC) Flow
GET /api/issues/oic/pending  
PUT /api/issues/6a2554ebbd89f01c922ba407/oic/approve  
PUT /api/issues/6a2554ebbd89f01c922ba407/oic/reject  

---

## Supplier Flow
GET /api/issues/supplier/approved  
PUT /api/issues/6a2554ebbd89f01c922ba407/supplier/update  

---

## Users (Reference Only)
GET /api/users  
GET /api/users/6a2553ccbd89f01c922ba403  

---


## Authentication Header
Authorization: Bearer <JWT_TOKEN>

---

# Project Structure

## Client

```
client/
├── public/
├── src/
│   ├── Components/
│   ├── Pages/
│   │   ├── JrExecutive/
│   │   │   ├── Allissues.jsx
│   │   │   ├── Approvedissues.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── IssueDetails.jsx
│   │   │   ├── PendingApprovals.jsx
│   │   │   └── RejectedIssues.jsx
│   │   │
│   │   ├── OIC/
│   │   │   └── Dashboard.jsx
│   │   │
│   │   ├── Supplier/
│   │   │   └── Dashboard.jsx
│   │   │
│   │   ├── VehicleManager/
│   │   │   ├── CreateRequest.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── RequestsList.jsx
│   │   │   ├── Vehicles.jsx
│   │   │   ├── addvehicle.jsx
│   │   │   └── requestdetails.jsx
│   │   │
│   │   └── Login.jsx
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx
│   │
│   ├── utils/
│   │   └── Api.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── public/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── package.json
└── package-lock.json
```

---

## Server

```
server/
├── config/
│   └── db.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   ├── Issue.js
│   ├── User.js
│   └── Vehicle.js
│
├── routes/
│   ├── auth.js
│   ├── issues.js
│   └── vehicles.js
│
├── app.js
├── package.json
├── package-lock.json
└── .gitignore
```

---

# Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Context API
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Security

* JWT Authentication
* Role-Based Access Control (RBAC)

---

# Workflow Summary

1. User logs in and receives JWT token
2. Vehicle Manager manages fleet
3. Junior Engineer creates & reviews issues
4. OIC approves or rejects requests
5. Supplier completes maintenance updates
6. System tracks full lifecycle automatically

---

# Notes

* All protected routes require JWT token
* Roles determine access level
* Workflow is strictly sequential (JE → OIC → Manager → Supplier)
* System is designed for structured fleet maintenance operations

---
