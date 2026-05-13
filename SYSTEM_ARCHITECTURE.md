# System Architecture Diagram - Fullstack EMS

## Complete System Architecture Overview

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║                    FULLSTACK EMS - COMPLETE ARCHITECTURE                      ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝


┌───────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT TIER                                      │
│                           (React + Vite SPA)                                  │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│    ┌─────────────────────────────────────────────────────────────┐            │
│    │                    User Interface Layer                     │            │
│    │                                                             │            │
│    │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │           │
│    │  │  Dashboard     │  │  Employees     │  │  Attendance    │ │           │
│    │  │   Page         │  │   Page         │  │   Page         │ │           │
│    │  └────────────────┘  └────────────────┘  └────────────────┘ │           │
│    │                                                             │           │
│    │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │           │
│    │  │  Leave Mgmt    │  │  Payslips      │  │  Settings      │ │           │
│    │  │   Page         │  │   Page         │  │   Page         │ │           │
│    │  └────────────────┘  └────────────────┘  └────────────────┘ │           │
│    │                                                             │           │
│    └─────────────────────────────────────────────────────────────┘           │
│                                  │                                           │
│                                  ▼                                           │
│    ┌─────────────────────────────────────────────────────────────┐           │
│    │              Component & UI Components Layer                │           │
│    │                                                             │           │
│    │  Forms:            Modals:             Cards:               │           │
│    │  • LoginForm       • ApplyLeave        • EmployeeCard       │           │
│    │  • EmployeeForm    • ChangePassword    • PayslipCard        │           │
│    │  • ProfileForm     • ConfirmModal      • AttendanceCard     │           │
│    │  • PayslipGen                                               │           │
│    │                                                             │           │
│    │  UI:               Navigation:         Utilities:           │           │
│    │  • Sidebar         • Header            • Loading            │           │
│    │  • Footer          • Menu              • Toast Messages     │           │
│    │                                                             │           │
│    └─────────────────────────────────────────────────────────────┘           │
│                                  │                                           │
│                                  ▼                                           │
│    ┌─────────────────────────────────────────────────────────────┐           │
│    │           State Management & Context API Layer              │           │
│    │                                                             │           │
│    │  ┌──────────────────────────────────────────────────────┐   │           │
│    │  │              AuthContext                             │   │           │
│    │  │                                                      │   │           │
│    │  │  State:                                              │   │           │
│    │  │  • currentUser: {id, name, email, role}              │   │           │
│    │  │  • isAuthenticated: boolean                          │   │           │
│    │  │  • token: JWT string                                 │   │           │
│    │  │  • loading: boolean                                  │   │           │
│    │  │  • error: string | null                              │   │           │
│    │  │                                                      │   │           │
│    │  │  Methods:                                            │   │           │
│    │  │  • login(email, password)                            │   │           │
│    │  │  • logout()                                          │   │           │
│    │  │  • updateProfile(data)                               │   │           │
│    │  │  • refreshToken()                                    │   │           │
│    │  │                                                      │   │           │
│    │  └──────────────────────────────────────────────────────┘   │           │
│    │                                                             │           │
│    │  ┌──────────────────────────────────────────────────────┐   │           │
│    │  │           Local Storage / Session Storage            │   │           │
│    │  │                                                      │   │           │
│    │  │  • authToken (persistent)                            │   │           │
│    │  │  • userData (JSON, persistent)                       │   │           │
│    │  │  • preferences (user settings)                       │   │           │
│    │  │  • refreshToken (secure)                             │   │           │
│    │  │                                                      │   │           │
│    │  └──────────────────────────────────────────────────────┘   │           │
│    │                                                             │           │
│    └─────────────────────────────────────────────────────────────┘           │
│                                  │                                           │
│                                  ▼                                           │
│    ┌─────────────────────────────────────────────────────────────┐           │
│    │                   HTTP Client Layer                         │           │
│    │                                                             │           │
│    │  ┌──────────────────────────────────────────────────────┐   │           │
│    │  │           Axios Instance Configuration               │   │           │
│    │  │                                                      │   │           │
│    │  │  Base Config:                                        │   │           │
│    │  │  • baseURL: process.env.REACT_APP_API_URL            │   │           │
│    │  │  • timeout: 10000ms                                  │   │           │
│    │  │  • headers: {Content-Type: application/json}         │   │           │
│    │  │                                                      │   │           │
│    │  │  Request Interceptor:                                │   │           │
│    │  │  • Add Authorization header with token               │   │           │
│    │  │  • Format request payload                            │   │           │
│    │  │  • Add timestamp                                     │   │           │
│    │  │                                                      │   │           │
│    │  │  Response Interceptor:                               │   │           │
│    │  │  • Parse response data                               │   │           │
│    │  │  • Handle 401 (unauthorized)                         │   │           │
│    │  │  • Refresh token automatically                       │   │           │
│    │  │  • Handle errors globally                            │   │           │
│    │  │                                                      │   │           │
│    │  └──────────────────────────────────────────────────────┘   │           │
│    │                                                             │           │
│    └─────────────────────────────────────────────────────────────┘           │
│                                                                              │
│    Deployment: Vercel (Serverless)                                           │
│    Environment: Production / Development                                     │
│                                                                              │
└───────────────────────────────────────────────────────────────────────────────┘
                                    │
                  REST API Calls (HTTP/HTTPS JSON)
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
    (Other Services)            (AUTH)                    (RESOURCES)


┌───────────────────────────────────────────────────────────────────────────────┐
│                            APPLICATION TIER                                   │
│                         (Node.js + Express Server)                            │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│    ┌─────────────────────────────────────────────────────────────┐            │
│    │                      Express Server                         │            │
│    │         (RESTful API Endpoints & Routing)                   │            │
│    │                                                             │            │
│    │  Authentication Routes:          Resource Routes:           │            │
│    │  • POST   /api/auth/login         • GET    /api/employees   │            │
│    │  • POST   /api/auth/register      • POST   /api/employees   │            │
│    │  • POST   /api/auth/logout        • PUT    /api/employees/:id            |
│    │  • POST   /api/auth/refresh       • DELETE /api/employees/:id            |
│    │                                                             │            │
│    │  Attendance Routes:               Leave Routes:             │            │
│    │  • POST   /api/attendance/check-in • GET    /api/leave      │            │
│    │  • POST   /api/attendance/check-out• POST   /api/leave/apply             |
│    │  • GET    /api/attendance/history • PUT    /api/leave/:id/approve        |
│    │  • GET    /api/attendance/stats   • PUT    /api/leave/:id/reject         |
│    │                                                             │            │
│    │  Payslip Routes:                  Dashboard Routes:         │            │
│    │  • GET    /api/payslip            • GET    /api/dashboard/stats          |
│    │  • POST   /api/payslip/generate   • GET    /api/dashboard/charts         |
│    │  • GET    /api/payslip/:id                                  │            │
│    │                                                             │            │
│    │  Profile Routes:                                            │            │
│    │  • GET    /api/profile                                      │            │
│    │  • PUT    /api/profile                                      │            │
│    │  • PUT    /api/profile/change-password                      │            │
│    │                                                             │            │
│    └─────────────────────────────────────────────────────────────┘            │
│                                  │                                            │
│                                  ▼                                            │
│    ┌─────────────────────────────────────────────────────────────┐            │
│    │                  Middleware Pipeline                        │            │
│    │                                                             │            │
│    │  ┌─ Request Parsing ─────────────────────────────────────┐ │             │
│    │  │ • JSON Body Parser                                   │ │              │
│    │  │ • URL Encoded Parser                                 │ │              │
│    │  └──────────────────────────────────────────────────────┘ │              │
│    │                        │                                  │              │
│    │                        ▼                                  │              │
│    │  ┌─ CORS & Security Middleware ──────────────────────────┐│           │
│    │  │ • CORS headers                                       ││           │
│    │  │ • Helmet security headers                            ││           │
│    │  │ • Rate limiting                                      ││           │
│    │  └──────────────────────────────────────────────────────┘│           │
│    │                        │                                  │           │
│    │                        ▼                                  │           │
│    │  ┌─ Authentication Middleware ────────────────────────────┐│           │
│    │  │ • Extract JWT from Authorization header              ││           │
│    │  │ • Verify token signature                             ││           │
│    │  │ • Check token expiration                             ││           │
│    │  │ • Attach decoded user to req.user                    ││           │
│    │  └──────────────────────────────────────────────────────┘│           │
│    │                        │                                  │           │
│    │              ✗ Fail ───┴─── ✓ Pass                       │           │
│    │              │               │                           │           │
│    │              ▼               ▼                           │           │
│    │         401 Error    Authorization Middleware           │           │
│    │                   ┌─────────────────────────────────┐   │           │
│    │                   │ • Check user role               │   │           │
│    │                   │ • Verify resource ownership      │   │           │
│    │                   │ • Apply RBAC rules              │   │           │
│    │                   └─────────────────────────────────┘   │           │
│    │                        │                                  │           │
│    │              ✗ Fail ───┴─── ✓ Pass                       │           │
│    │              │               │                           │           │
│    │              ▼               ▼                           │           │
│    │         403 Error      Input Validation                 │           │
│    │                   ┌─────────────────────────────────┐   │           │
│    │                   │ • Validate request schema       │   │           │
│    │                   │ • Sanitize inputs               │   │           │
│    │                   │ • Check required fields         │   │           │
│    │                   │ • Type validation               │   │           │
│    │                   └─────────────────────────────────┘   │           │
│    │                        │                                  │           │
│    │              ✗ Fail ───┴─── ✓ Pass                       │           │
│    │              │               │                           │           │
│    │              ▼               ▼                           │           │
│    │         400 Error    Request to Controller             │           │
│    │                                                             │           │
│    └─────────────────────────────────────────────────────────────┘           │
│                                  │                                           │
│                                  ▼                                           │
│    ┌─────────────────────────────────────────────────────────────┐           │
│    │                    Controller Layer                        │           │
│    │         (Business Logic & Request Handling)                 │           │
│    │                                                             │           │
│    │  Each controller method:                                  │           │
│    │  1. Extract parameters from request                      │           │
│    │  2. Validate input (if not by middleware)                │           │
│    │  3. Call appropriate service                             │           │
│    │  4. Handle response from service                         │           │
│    │  5. Format and send JSON response                        │           │
│    │  6. Catch and handle errors                              │           │
│    │                                                             │           │
│    │  Controllers:                                             │           │
│    │  ├─ authController                                        │           │
│    │  ├─ employeeController                                    │           │
│    │  ├─ attendanceController                                  │           │
│    │  ├─ leaveController                                       │           │
│    │  ├─ payslipController                                     │           │
│    │  ├─ dashboardController                                   │           │
│    │  └─ profileController                                     │           │
│    │                                                             │           │
│    └─────────────────────────────────────────────────────────────┘           │
│                                  │                                           │
│                    ┌─────────────┼──────────────┐                           │
│                    │             │              │                           │
│                    ▼             ▼              ▼                           │
│    ┌───────────────────┐  ┌──────────────┐  ┌──────────────┐              │
│    │ Service Layer     │  │ Trigger      │  │ Trigger      │              │
│    │ (Business Logic)  │  │ Email Notif  │  │ Async Jobs   │              │
│    │                   │  │              │  │              │              │
│    │ • Calculations    │  │ → Nodemailer │  │ → Inngest    │              │
│    │ • Validations     │  │              │  │              │              │
│    │ • Transformations │  └──────────────┘  └──────────────┘              │
│    │ • Rules           │                                                   │
│    │ • Processing      │                                                   │
│    └───────────────────┘                                                   │
│            │                                                                │
│            ▼                                                                │
│    ┌─────────────────────────────────────────────────────────────┐         │
│    │                   Data Access Layer                        │         │
│    │        (Mongoose ODM & Database Queries)                    │         │
│    │                                                             │         │
│    │  Models:                          Operations:             │         │
│    │  • User                           • find()               │         │
│    │  • Employee                       • findById()           │         │
│    │  • Attendance                     • create()             │         │
│    │  • LeaveApplication               • updateOne()          │         │
│    │  • Payslip                        • deleteOne()          │         │
│    │                                   • aggregate()          │         │
│    │  Each model defines:                                      │         │
│    │  • Schema structure               • Custom methods      │         │
│    │  • Field validation               • Middleware hooks     │         │
│    │  • Indexes                        • Population logic     │         │
│    │                                                             │         │
│    └─────────────────────────────────────────────────────────────┘         │
│                                  │                                         │
│                                  ▼                                         │
│                    Query execution on MongoDB                             │
│                                                                            │
└───────────────────────────────────────────────────────────────────────────┘
        │                    │                              │
        │ DB Operations      │ Send Emails                 │ Queue Tasks
        │                    │                              │
        ▼                    ▼                              ▼


┌────────────────────────────┐  ┌────────────────────────────┐  ┌──────────────┐
│      DATA TIER             │  │    EMAIL SERVICE TIER      │  │ JOB QUEUE    │
│  (MongoDB Database)        │  │   (Nodemailer - SMTP)      │  │ (Inngest)    │
├────────────────────────────┤  ├────────────────────────────┤  ├──────────────┤
│                            │  │                            │  │              │
│  Collections:              │  │  Features:                 │  │ Background   │
│  • users                   │  │  • Send emails             │  │ Tasks:       │
│  • employees               │  │  • Email templates         │  │ • Payroll    │
│  • attendance              │  │  • Attachments             │  │ • Reminders  │
│  • leave_applications      │  │  • Tracking                │  │ • Reports    │
│  • payslips                │  │  • Notifications           │  │ • Cleanup    │
│                            │  │  • Confirmations           │  │ • Exports    │
│  Indexes:                  │  │                            │  │              │
│  • _id (primary)           │  │  Events Triggered:         │  │ Execution:   │
│  • userId, employeeId      │  │  • User registration       │  │ • Immediate  │
│  • email (unique)          │  │  • Password reset          │  │ • Scheduled  │
│  • date fields             │  │  • Leave approval          │  │ • Recurring  │
│  • status                  │  │  • Attendance alerts       │  │              │
│                            │  │  • Payslip generated       │  │ Monitoring:  │
│  Transactions:             │  │  • Status updates          │  │ • Retry logic│
│  • ACID compliance         │  │                            │  │ • Error logs │
│  • Multi-doc updates       │  │  SMTP Configuration:       │  │ • Execution  │
│                            │  │  • Gmail / Custom SMTP     │  │   stats      │
│  Storage:                  │  │  • Port: 587/465           │  │              │
│  • Cloud: MongoDB Atlas    │  │  • TLS/SSL enabled         │  │ Storage:     │
│  • Region: AWS/Azure       │  │  • Credentials secured     │  │ • Cloud      │
│  • Backup: Automated       │  │    in environment vars     │  │ • Database   │
│                            │  │                            │  │              │
└────────────────────────────┘  └────────────────────────────┘  └──────────────┘
```

---

## Data Flow Diagram (Request to Response)

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                          COMPLETE REQUEST CYCLE                         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

1. USER ACTION (Frontend)
   └─ User clicks "Create Employee" button
   └─ Form is filled with data
   └─ Submit button clicked

2. FRONTEND PROCESSING (React)
   └─ Event handler triggered
   └─ Form validation performed
   └─ Data extracted and prepared
   └─ Loading state set to true
   └─ Show spinner

3. HTTP REQUEST (Axios)
   ├─ Request Interceptor runs:
   │  ├─ Get token from localStorage
   │  ├─ Add Authorization header
   │  └─ Set Content-Type: application/json
   │
   ├─ Send HTTP Request:
   │  ├─ Method: POST
   │  ├─ URL: /api/employees
   │  ├─ Headers: {Authorization: "Bearer token123...", ...}
   │  └─ Body: {name: "John", dept: "IT", email: "john@..."}
   │
   └─ Request sent to backend

4. BACKEND REQUEST HANDLING (Express)
   ├─ Express router receives request
   ├─ Route matched: POST /api/employees
   │
   └─ Middleware Pipeline:
      ├─ 1️⃣ Body Parser: Parse JSON body ✓
      ├─ 2️⃣ CORS Middleware: Check origin ✓
      ├─ 3️⃣ Auth Middleware:
      │  ├─ Extract token from header
      │  ├─ Verify JWT signature
      │  ├─ Check expiration
      │  └─ Attach user to req: req.user = {id, role, ...}
      │  └─ ✓ Pass
      │
      ├─ 4️⃣ Authorization Middleware:
      │  ├─ Check req.user.role
      │  ├─ Verify permission to create employee
      │  └─ ✓ Pass
      │
      ├─ 5️⃣ Validation Middleware:
      │  ├─ Validate req.body against schema
      │  ├─ Check required fields
      │  ├─ Validate email format
      │  ├─ Check no duplicates
      │  └─ ✓ Pass
      │
      └─ Route handler passed to controller

5. CONTROLLER EXECUTION
   └─ employeeController.create(req, res)
      ├─ Extract data: const {name, dept, email} = req.body
      ├─ Get user ID: const userId = req.user.id
      ├─ Call service: await employeeService.createEmployee({...})
      │
      └─ Service returns: {success: true, data: {...employee}}

6. SERVICE LAYER (Business Logic)
   └─ employeeService.createEmployee(data)
      ├─ Validate business rules
      ├─ Check if email exists: await Employee.findOne({email})
      │  └─ Not found ✓ Continue
      ├─ Hash sensitive data if needed
      ├─ Prepare document for insertion
      │
      └─ Call Model layer

7. MODEL LAYER (Mongoose)
   └─ Employee.create(employeeData)
      ├─ Validate against schema
      ├─ Run pre-save hooks
      ├─ Convert to MongoDB document
      │
      └─ Execute database operation

8. DATABASE OPERATION (MongoDB)
   └─ db.employees.insertOne({
        name: "John",
        dept: "IT",
        email: "john@...",
        createdAt: new Date(),
        ...
      })
      ├─ Generate _id ObjectId
      ├─ Insert document
      ├─ Create/update indexes
      │
      └─ Return inserted document

9. RESPONSE BUILDING (Backend)
   ├─ Controller receives created document
   ├─ Format response:
   │  └─ {
   │       success: true,
   │       message: "Employee created successfully",
   │       data: {
   │         _id: "507f1f77bcf86cd799439011",
   │         name: "John",
   │         dept: "IT",
   │         email: "john@...",
   │         createdAt: "2024-05-13T10:30:00Z"
   │       }
   │     }
   │
   ├─ Set status code: 201 (Created)
   ├─ Set headers: Content-Type: application/json
   │
   └─ Trigger optional actions:
      ├─ Send welcome email (Nodemailer)
      └─ Queue background job (Inngest)

10. HTTP RESPONSE (Axios)
    ├─ Backend sends HTTP response
    │  ├─ Status: 201 Created
    │  ├─ Headers: {...}
    │  └─ Body: JSON response
    │
    ├─ Response Interceptor runs:
    │  ├─ Check status code
    │  ├─ Parse response
    │  └─ Return data
    │
    └─ Response returned to component

11. FRONTEND STATE UPDATE (React)
    ├─ Update context state:
    │  └─ setEmployees([...previous, newEmployee])
    │
    ├─ Update loading state:
    │  └─ setLoading(false)
    │
    ├─ Set success message:
    │  └─ setMessage("Employee created successfully!")
    │
    ├─ Component re-renders with new data
    │
    └─ Toast notification shown

12. USER SEES RESULT
    └─ New employee appears in list
    └─ Success message displayed
    └─ Form cleared
    └─ Loading spinner removed
```

---

## Integration Points

```
┌──────────────────────────────────────────────────────────────────┐
│                    SYSTEM INTEGRATIONS                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Frontend ↔ Backend Communication                            │
│     ├─ Protocol: HTTP/HTTPS REST API                           │
│     ├─ Format: JSON                                            │
│     ├─ Authentication: JWT Bearer Token                        │
│     └─ CORS: Configured for frontend domain                   │
│                                                                  │
│  2. Backend ↔ Database Communication                           │
│     ├─ Driver: Mongoose (ODM)                                 │
│     ├─ Database: MongoDB                                       │
│     ├─ Connection: MongoDB Connection String (Atlas)          │
│     └─ Queries: Native MongoDB queries via Mongoose API       │
│                                                                  │
│  3. Backend ↔ Email Service                                    │
│     ├─ Service: Nodemailer                                    │
│     ├─ Protocol: SMTP                                         │
│     ├─ Provider: Gmail / Custom SMTP Server                  │
│     └─ Trigger: Async task from controllers                  │
│                                                                  │
│  4. Backend ↔ Job Queue                                        │
│     ├─ Service: Inngest                                       │
│     ├─ Purpose: Background job processing                    │
│     ├─ Trigger: Async operations from controllers            │
│     └─ Examples: Payroll, reports, reminders                 │
│                                                                  │
│  5. Frontend ↔ Local Storage                                   │
│     ├─ Data: Auth tokens, user data                          │
│     ├─ Purpose: Persist user session                         │
│     └─ Security: HttpOnly flags on sensitive data            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  DEPLOYMENT INFRASTRUCTURE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Frontend Deployment (Vercel)                                  │
│  ├─ Build: npm run build (Vite)                              │
│  ├─ Output: dist/ folder with optimized SPA                 │
│  ├─ Hosting: Vercel CDN (Edge locations worldwide)          │
│  ├─ Environment: .env.production file                       │
│  └─ Auto-deploys: On git push to main branch               │
│                                                                 │
│  Backend Deployment (Options)                                  │
│  ├─ Option 1: Vercel Serverless Functions                   │
│  ├─ Option 2: Heroku                                        │
│  ├─ Option 3: AWS EC2 / ECS                                │
│  ├─ Option 4: DigitalOcean Droplet                         │
│  └─ Env Config: Stored in hosting provider secrets         │
│                                                                 │
│  Database Deployment (MongoDB Atlas)                          │
│  ├─ Cloud: AWS / Azure / Google Cloud                      │
│  ├─ Region: Primary region + backup regions                │
│  ├─ Connection: Encrypted connection string                │
│  ├─ Backup: Automated daily backups                        │
│  └─ Scaling: Auto-scaling clusters                         │
│                                                                 │
│  Domain & SSL                                                  │
│  ├─ Domain: Custom domain (e.g., ems.example.com)          │
│  ├─ DNS: Configured to point to hosting provider           │
│  ├─ SSL: Auto-provisioned HTTPS certificate               │
│  └─ Security: HSTS headers enabled                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Security Layers

```
┌──────────────────────────────────────────────────────────────────┐
│                      SECURITY ARCHITECTURE                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Layer 1: Transport Security                                   │
│  ├─ HTTPS/TLS encryption                                      │
│  ├─ Certificate pinning (optional)                            │
│  └─ HSTS headers                                              │
│                                                                  │
│  Layer 2: CORS & Request Security                             │
│  ├─ CORS validation (allowed origins)                         │
│  ├─ Rate limiting                                             │
│  ├─ Request size limits                                       │
│  └─ Helmet security headers                                   │
│                                                                  │
│  Layer 3: Authentication                                       │
│  ├─ JWT tokens (Bearer scheme)                               │
│  ├─ Token expiration (15 min access, 7 day refresh)         │
│  ├─ Refresh token rotation                                   │
│  └─ Secure token storage (HttpOnly cookies / localStorage)  │
│                                                                  │
│  Layer 4: Authorization                                        │
│  ├─ Role-Based Access Control (RBAC)                         │
│  ├─ Resource ownership verification                          │
│  ├─ Permission checking                                      │
│  └─ Route protection middleware                              │
│                                                                  │
│  Layer 5: Data Protection                                      │
│  ├─ Password hashing (bcryptjs)                              │
│  ├─ Input validation & sanitization                          │
│  ├─ SQL injection prevention (Mongoose/ODM)                 │
│  ├─ XSS protection                                           │
│  └─ CSRF protection                                          │
│                                                                  │
│  Layer 6: Application Layer                                    │
│  ├─ Error handling (no sensitive info in errors)            │
│  ├─ Logging & monitoring                                     │
│  ├─ Audit trails                                             │
│  └─ Rate limiting per user/IP                               │
│                                                                  │
│  Layer 7: Database Security                                    │
│  ├─ Connection encryption                                    │
│  ├─ Database access control                                  │
│  ├─ Backup encryption                                        │
│  └─ Audit logging                                            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

**Version:** 1.0  
**Last Updated:** May 13, 2026  
**Created by:** Architecture Team
