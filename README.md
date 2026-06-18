# Defence Fleet Management System

<div align="center">

A secure full-stack MERN application designed to manage defence fleet maintenance through a structured role-based workflow. The system replaces manual processes with a digital approval pipeline for maintenance requests, vehicle allocation, and supplier coordination.

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-Backend-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![React](https://img.shields.io/badge/React-Frontend-blue?logo=react)
![JWT](https://img.shields.io/badge/JWT-Authentication-red?logo=jsonwebtokens)
![RBAC](https://img.shields.io/badge/Security-Role%20Based%20Access-orange)

**Live Demo:** https://defence-fleet-management-system.onrender.com

</div>

---

## Overview

The Defence Fleet Management System (DFMS) is built to simulate real-world defence logistics workflows. It digitizes vehicle maintenance operations by introducing a structured approval system and role-based dashboards.

Every maintenance request follows a controlled workflow starting from issue creation, moving through technical verification, administrative approval, and finally supplier execution. This ensures accountability, traceability, and secure access at every stage.

The system uses **JWT authentication** and **Role-Based Access Control (RBAC)** to ensure each user only accesses permitted features.

---
## Key Features
### Fleet Management
- Register and manage defence vehicles within a centralized system  
- Maintain complete and structured fleet inventory records  
- Categorise vehicles based on operational class and usage type  
- Track real-time vehicle details and maintenance status  
- Ensure continuous updates of fleet availability and condition  
- Provide a centralized view of all fleet resources  
### Maintenance Issue Tracking
- Report vehicle faults and maintenance-related issues  
- Create structured maintenance requests with required details  
- Monitor issue progress throughout its lifecycle stages  
- Maintain historical repair and maintenance records  
- Track resolution status from initiation to completion  
- Ensure transparency in maintenance workflow tracking  

---

## Dashboards
### Vehicle Manager
- Manage complete vehicle inventory including add, update, and delete operations  
- Control vehicle allocation after approval from workflow stages  
- Assign appropriate suppliers for maintenance execution  
- Monitor overall fleet performance and operational status  
- Ensure only approved requests are processed for execution  
- Maintain coordination between all system roles and operations  

---

### Junior Engineer Excecutive (JE)
- Perform initial technical verification of maintenance requests  
- Review reported vehicle issues for accuracy and relevance  
- Approve or reject issues based on technical evaluation  
- Ensure proper validation before forwarding requests  
- Identify genuine maintenance requirements in the system  
- Act as the first level of approval in the workflow  

---

### Officer In Charge (OIC)
- Conduct final administrative review of maintenance requests  
- Evaluate requests based on operational requirements  
- Approve or reject verified maintenance issues  
- Forward approved requests to Vehicle Manager for execution  
- Maintain proper records of all approval decisions  
- Ensure compliance with organizational workflow rules  

---

### Supplier
- Confirm availability of required spare parts for maintenance  
- Update procurement and supply status in the system  
- Coordinate execution of maintenance tasks  
- Monitor real-time progress of repair work  
- Ensure completion of assigned maintenance activities  
- Mark tasks as completed after execution  

---

## Tech Stack
**Frontend**
- React.js
- Tailwind CSS
- Vite
- Context API
- Axios

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB
- Mongoose

**Authentication**
- JWT Authentication
- Role-Based Access Control (RBAC)
## API Reference

Complete list of endpoints and workflow details:

 https://github.com/barbiem29/Defence-Fleet-Management-System/blob/main/API.md
---

## Installation and Setup

Follow these steps to set up and run the project locally on your system.

### Clone the Repository

```bash
git clone https://github.com/barbiem29/Defence-Fleet-Management-System.git 
cd Defence-Fleet-Management-System
cd server
npm install
cd ../client
npm install
cd server
npm run dev
cd client
npm run dev
```

## Environment Variables

The backend requires a few essential environment variables to configure the server, database connection, and authentication system. These values must be defined in a `.env` file inside the `server` directory.

| Variable     | Description                                                | Example Value |
|--------------|------------------------------------------------------------|---------------|
| PORT         | Port on which the backend server runs                      | 5000 |
| MONGO_URI    | MongoDB connection string used for database connection     | mongodb+srv://... |
| JWT_SECRET   | Secret key used to sign and verify JWT authentication      | your_secret_key |

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
---

After starting both frontend and backend servers, open the application in the browser and log in using the demo credentials provided below.

### Demo Login

Email: manager@demo.com  
Password: your_password  

---

### Testing Workflow

1. Login as Vehicle Manager  
   - Add new vehicles into the system  
   - View and manage complete fleet data  
   - Allocate vehicles after approval workflow  
   - Assign suppliers for maintenance execution  

2. Login as Junior Engineer or Executive  
   - Create maintenance requests for vehicle issues  
   - Report faults with required details  
   - Forward validated requests for approval process  

3. Login as Officer In Charge (OIC)  
   - Review submitted maintenance requests  
   - Approve or reject issues based on evaluation  

4. Login as Supplier  
   - View assigned maintenance tasks  
   - Update repair and progress status  
   - Mark tasks as completed after execution  

---

### Expected Workflow

Junior Engineer → Officer In Charge (OIC) → Vehicle Manager → Supplier  

This flow ensures complete end-to-end validation of the maintenance lifecycle within the system.

---

## Learning Outcomes

This project provided practical exposure to designing and implementing a real-world role-based enterprise system using the MERN stack. It enhanced understanding of full-stack development, secure authentication mechanisms, and structured workflow-based system design.

By completing this project, the following technical competencies were developed:

- Development of RESTful APIs using Node.js and Express.js  
- Designing scalable and efficient MongoDB schemas using Mongoose  
- Implementation of secure authentication using JWT  
- Application of Role-Based Access Control in multi-user systems  
- Structuring multi-level approval workflows in real-world applications  
- Integration of frontend and backend using React and Axios  
- Managing application state across role-specific dashboards in a structured manner  
