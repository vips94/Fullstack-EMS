## --- Please Use Personal Computer For Any Setup or Hands-on ---

# Fullstack EMS (Employee Management System)

A comprehensive **Employee Management System** built with the **MERN stack** (MongoDB, Express.js, React, Node.js). This application provides complete HR management capabilities including employee records, attendance tracking, leave management, payroll generation, and admin dashboards.

## 🎯 Features

### **Admin Dashboard**
- 📊 Company-wide analytics (total employees, daily attendance, pending leaves)
- 👥 Employee CRUD operations (Create, Read, Update, Delete)
- ✅ Leave request approvals/rejections with email notifications
- 💰 Payslip generation and distribution
- 📈 Department-wise employee distribution

### **Employee Features**
- 🔐 Secure login with JWT authentication
- ⏰ Digital attendance tracking (Check-in/Check-out)
- 📅 Leave application and history tracking
- 💼 Personal profile management
- 🧾 Payslip access and download
- 📊 Personal dashboard with attendance stats

### **Background Processing**
- 🤖 **Inngest** event-driven architecture for async operations:
  - Auto-checkout after 9 hours with reminder emails
  - Leave application reminders (24-hour pending notifications)
  - Daily attendance reminders (11:30 AM IST cron job)
- 📧 Email notifications via Nodemailer (Brevo relay)

### **Security & Best Practices**
- 🔐 JWT-based authentication (7-day token expiry)
- 🔒 Bcrypt password hashing (10 salt rounds)
- 🛡️ Role-based access control (ADMIN vs EMPLOYEE)
- 📝 Soft delete pattern for data integrity
- 💾 MongoDB transactions for atomic operations
- ✨ Comprehensive error handling and validation

---

## 🚀 Quick Start

### **Prerequisites**
- **Node.js** v16+ and **npm** v8+
- **MongoDB** v4.4+ (local or cloud - MongoDB Atlas)
- **Git** for version control

### **Environment Setup**

Create a `.env` file in the **server** directory:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fullstack-ems

# JWT Configuration
JWT_SECRET=your_secret_key_here_min_32_chars

# Email Service (Nodemailer - Brevo)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_brevo_email@example.com
SMTP_PASS=your_brevo_smtp_key
ADMIN_EMAIL=admin@example.com

# Server Port
PORT=5000

# Inngest Configuration
INNGEST_EVENT_KEY=your_inngest_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

---

## 📦 Installation & Setup

### **1. Clone the Repository**

```bash
git clone https://github.com/vips94/Fullstack-EMS.git
cd Fullstack-EMS
```

### **2. Backend Setup**

```bash
cd server

# Install dependencies
npm install

# Run database seeding (creates initial admin user)
node seed.js

# Output:
# Admin user created
# email: admin@example.com
# password: admin123
# change the password after login.

# Start the server
npm start

# Server runs on: http://localhost:5000
```

### **3. Frontend Setup**

```bash
cd ../client

# Install dependencies
npm install

# Start the React development server
npm run dev

# Frontend runs on: http://localhost:5173 (Vite default)
```

### **4. Access the Application**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Admin Login**: 
  - Email: `admin@example.com`
  - Password: `admin123` (change after first login)

---

## 🏗️ Project Structure

```
Fullstack-EMS/
├── server/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── nodeemailer.js        # Email service setup
│   ├── controllers/
│   │   ├── authController.js     # Login, JWT, password change
│   │   ├── employeeController.js # Employee CRUD (with transactions)
│   │   ├── attendanceController.js # Check-in/out operations
│   │   ├── leaveController.js    # Leave request workflow
│   │   ├── payslipController.js  # Payroll generation
│   │   ├── profileController.js  # User profile management
│   │   └── dashboardController.js # Role-specific dashboards
│   ├── models/
│   │   ├── User.js               # Authentication schema
│   │   ├── Employee.js           # Employee profile schema
│   │   ├── Attendance.js         # Daily attendance records
│   │   ├── LeaveApplication.js   # Leave requests
│   │   └── Payslip.js            # Payroll documents
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── employeeRoutes.js
│   │   ├── attendanceRoute.js
│   │   ├── leaveRoutes.js
│   │   ├── payslipRoutes.js
│   │   ├── profileRoute.js
│   │   └── dashboardRoute.js
│   ├── middleware/
│   │   └── auth.js               # JWT verification & role checks
│   ├── inngest/
│   │   └── index.js              # Background jobs & cron functions
│   ├── constants/
│   │   └── departments.js        # Department list
│   ├── server.js                 # Express app entry point
│   ├── seed.js                   # Database initialization
│   └── package.json
│
└── client/
    ├── src/
    │   ├── api/
    │   │   └── axios.js          # Axios instance configuration
    │   ├── components/           # Reusable React components
    │   ├── pages/                # Page components
    │   ├── context/
    │   │   └── AuthContext.jsx   # Global auth state
    │   ├── assets/               # Images, icons, styles
    │   ├── App.jsx               # Main app component
    │   └── main.jsx              # React DOM entry point
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── vercel.json
```

---

## 🔌 API Endpoints

### **Authentication**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login (returns JWT token) |
| GET | `/api/auth/session` | Get current user session |
| POST | `/api/auth/change-password` | Change user password |

### **Employees** (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees (with department filter) |
| POST | `/api/employees` | Create new employee |
| PUT | `/api/employees/:id` | Update employee details |
| DELETE | `/api/employees/:id` | Soft delete employee |

### **Attendance**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/attendance` | Check-in/Check-out |
| GET | `/api/attendance` | Get attendance history |

### **Leave**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaves` | Get leaves (all for admin, own for employee) |
| POST | `/api/leaves` | Submit leave request |
| PATCH | `/api/leaves/:id` | Approve/Reject leave (Admin only) |

### **Payslips**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payslips` | Get payslips (all for admin, own for employee) |
| GET | `/api/payslips/:id` | Get specific payslip |
| POST | `/api/payslips` | Generate payslip (Admin only) |

### **Profile**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get user profile |
| POST | `/api/profile` | Update profile |

### **Dashboard**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Get role-specific dashboard stats |

---

## 🛠️ Technology Stack

### **Frontend**
- **React 18** - UI library
- **Vite** - Fast build tool
- **Axios** - HTTP client
- **CSS3** - Styling

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Bcrypt** - Password hashing
- **JWT** - Authentication tokens
- **Nodemailer** - Email service
- **Inngest** - Background job processing
- **CORS** - Cross-origin requests
- **Multer** - Form data parsing

### **DevOps & Deployment**
- **Vercel** - Frontend hosting (via vercel.json config)
- **MongoDB Atlas** - Cloud database
- **Environment variables** - Secure configuration

---

## 📊 Key Features Breakdown

### **1. Employee Management**
- ✨ Create employees with auto-generated user accounts
- 🔄 Update employee details (name, department, salary)
- 🗑️ Soft delete employees (preserves data integrity)
- 🔍 Department-wise filtering
- 📊 Real-time employee count tracking

### **2. Attendance System**
- ⏰ Clock-in/out with timestamp recording
- 🕐 Working hours calculation (in decimal format)
- 📅 Day type classification:
  - **Full Day** ≥ 8 hours
  - **Three Quarter** ≥ 6 hours
  - **Half Day** ≥ 4 hours
  - **Short Day** < 4 hours
- 🚨 Late detection (>9 hours marked as LATE)
- 🤖 Auto-checkout after 9 hours with email reminder
- 📜 Attendance history with pagination

### **3. Leave Management**
- 📋 Leave types: SICK, CASUAL, ANNUAL
- 📅 Date range validation (future dates only)
- ⏸️ Leave statuses: PENDING, APPROVED, REJECTED
- 🔔 Automatic admin reminders (24-hour pending notification)
- 📧 Email notifications on approval/rejection
- 👤 Employee can view only their leaves; Admin sees all

### **4. Payroll System**
- 💰 Payslip generation with salary breakdown:
  - Basic Salary
  - Allowances
  - Deductions
  - Net Salary (automatic calculation)
- 📊 Monthly payslip tracking
- 🔐 Access control (employee sees own, admin sees all)
- 📥 Payslip retrieval by ID

### **5. Background Processing (Inngest)**

#### **Auto-Checkout Function**
- Waits 9 hours after check-in
- Sends reminder email at 9-hour mark
- Auto-checks out at 10 hours (Half Day status)
- Prevents attendance data inconsistency

#### **Leave Reminder Function**
- Triggers on leave request creation
- Waits 24 hours
- Sends admin reminder if leave still PENDING
- Ensures timely leave approvals

#### **Daily Attendance Cron (11:30 AM IST)**
- Runs every morning at 11:30 AM IST
- Fetches all active employees
- Identifies absent employees (not on leave + not checked in)
- Sends personalized reminder emails
- Returns attendance statistics

---

## 🔐 Authentication & Security

### **JWT Token Management**
```javascript
// Token structure
{
  userId: "user_id",
  email: "user@example.com",
  role: "ADMIN" | "EMPLOYEE",
  expiresIn: "7d"
}
```

### **Middleware Chain**
```javascript
// Middleware order matters:
1. express.json() - Parse JSON body
2. multer().none() - Parse form data
3. protect - JWT verification
4. portectAdmin - Role verification (Admin only)
```

### **Password Security**
- Bcrypt hashing with 10 salt rounds
- Never store plain passwords
- Password change requires current password verification
- Temporary password (admin123) on seed, must change on first login

### **Role-Based Access Control**
- **ADMIN**: Full system access (employees, leaves, payslips)
- **EMPLOYEE**: Personal data access only (own attendance, leaves, payslip)

---

## 🐛 Common Issues & Troubleshooting

### **MongoDB Connection Error**
```
Error: connect ECONNREFUSED
```
**Solution**: Ensure MongoDB is running locally or update `MONGODB_URI` in .env with correct Atlas connection string.

### **Seed Script Fails**
```
Error: Missing ADMIN_EMAIL env variable
```
**Solution**: Add `ADMIN_EMAIL=admin@example.com` to .env file before running seed.

### **Nodemailer Email Sending Fails**
```
Error: Invalid login credentials
```
**Solution**: 
1. Verify Brevo credentials in .env
2. Enable "Less secure app access" if using Gmail
3. Check email account isn't locked

### **Auto-checkout Not Triggering**
```
No events are being processed
```
**Solution**: 
1. Verify Inngest configuration in .env
2. Check Inngest dashboard for event history
3. Ensure server is running (auto-checkout is backend only)

### **CORS Errors**
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Verify `cors()` middleware is configured in `server.js` with correct frontend URL.

---

## 📈 Performance Optimization

### **Database Optimization**
- ✨ `.lean()` queries for read-only operations (dashboards, lists)
- 🔗 `.populate()` for efficient joins
- 📊 Compound indexes on (employeeId, date) for unique attendance
- 🗂️ Pagination with `.limit()` and `.skip()`

### **MongoDB Transactions**
- 💾 Employee creation uses transactions (atomicity)
- 🔄 Ensures User + Employee created together or rolled back
- ⚠️ Prevents orphaned records

### **Caching & Pagination**
- 📄 Attendance history limited to recent 30 records by default
- ⏱️ Dashboard queries parallelized with `Promise.all()`
- 🔍 Efficient filtering with MongoDB operators ($ne, $gte, $lt)

---

## 🧪 Testing

### **Test Admin Login**
```bash
Email: admin@example.com
Password: admin123
```

### **Test Employee Creation**
1. Login as Admin
2. Navigate to Employees
3. Click "Add Employee"
4. Fill details (Auto-generates user account with temporary password)
5. Employee receives email with credentials

### **Test Attendance**
1. Login as Employee
2. Click Check-In (records current time)
3. Click Check-Out (calculates working hours)
4. View attendance history

---

## 🚀 Deployment

### **Frontend (Vercel)**
```bash
cd client
npm run build
# Deploy via Vercel dashboard or CLI
vercel deploy
```

### **Backend (Render/Railway/Heroku)**
```bash
cd server
# Push to GitHub
git push origin main

# Connect to deployment platform
# Set environment variables in platform dashboard
# Deploy automatically on push
```

### **Database (MongoDB Atlas)**
1. Create cluster on MongoDB Atlas
2. Add IP whitelist for deployment server
3. Update `MONGODB_URI` in production .env

---

## 📝 Code Documentation

All functions include comprehensive comments explaining:
- **Function Purpose**: What the function does
- **Parameters**: Input parameters with types
- **Return Values**: Output and structure
- **Library Methods**: Mongoose, bcrypt, JWT, Inngest operations with explanations
- **Business Logic**: Complex operations like transactions, date calculations, role-based access

Example:
```javascript
/**
 * createEmployee - Creates new employee with user account (atomic transaction)
 * POST /api/employees
 * Uses: mongoose.startSession(), bcrypt.hash(), User.create()
 */
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## ⭐ Show Your Support

If you find this project helpful, please consider giving it a ⭐ on GitHub!

---

**Last Updated**: May 2026  
**Version**: 1.0.0  
**Maintained by**: vips94
