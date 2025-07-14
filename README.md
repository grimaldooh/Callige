# 🎓 Student Attendance Management System

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-13+-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Microsoft_Azure-0089D0?style=for-the-badge&logo=microsoft-azure&logoColor=white" alt="Azure" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
</div>

<div align="center">
  <h3>🚀 A comprehensive web application for managing student attendance, built with modern technologies</h3>
</div>

---

## ✨ Features

<table>
<tr>
<td width="33%">

### 👨‍💼 **Admin Dashboard**
- 📊 **Real-time Analytics** - Comprehensive attendance statistics
- 👥 **User Management** - Students, teachers, and admin accounts
- 🏫 **Group Management** - Create and organize student groups
- 📅 **Event Coordination** - Schedule and track events
- ⚙️ **System Configuration** - Academic periods and settings

</td>
<td width="33%">

### 👨‍🏫 **Teacher Portal**
- ✅ **Attendance Tracking** - Quick and intuitive attendance marking
- 📋 **Group Overview** - View assigned classes and students
- 📝 **Justification Review** - Approve/reject absence requests
- 📈 **Progress Monitoring** - Track student attendance trends
- 📱 **Mobile Responsive** - Mark attendance on any device

</td>
<td width="33%">

### 🎓 **Student Interface**
- 📊 **Personal Dashboard** - View attendance history
- 📄 **Justification Requests** - Submit absence documentation
- 📈 **Progress Tracking** - Monitor attendance percentage
- 🎯 **Goal Setting** - Track attendance targets
- 📱 **Mobile Access** - Check status anywhere

</td>
</tr>
</table>

---

## 🛠️ **Technology Stack**

<div align="center">

| **Frontend** | **Backend** | **Database** | **Cloud** | **Tools** |
|:---:|:---:|:---:|:---:|:---:|
| ![Next.js](https://skillicons.dev/icons?i=nextjs) | ![Node.js](https://skillicons.dev/icons?i=nodejs) | ![PostgreSQL](https://skillicons.dev/icons?i=postgresql) | ![Azure](https://skillicons.dev/icons?i=azure) | ![Prisma](https://skillicons.dev/icons?i=prisma) |
| Next.js 13+ | API Routes | PostgreSQL | Blob Storage | Prisma ORM |
| ![React](https://skillicons.dev/icons?i=react) | ![JavaScript](https://skillicons.dev/icons?i=js) | | | ![Git](https://skillicons.dev/icons?i=git) |
| React 18 | JWT Auth | | | Version Control |
| ![Tailwind](https://skillicons.dev/icons?i=tailwindcss) | | | | |
| Tailwind CSS | | | | |

</div>

---

## 🚀 **Quick Start**

### Prerequisites
```bash
📋 Node.js 18.0+ 
📋 PostgreSQL database
📋 Azure Storage Account
📋 Email account (Gmail recommended)
```

### Installation

<details>
<summary><b>🔧 Step-by-step setup</b></summary>

1. **📁 Clone the repository**
   ```bash
   git clone <repository-url>
   cd gestion
   ```

2. **📦 Install dependencies**
   ```bash
   npm install
   ```

3. **⚙️ Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # 🗄️ Database
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   
   # ☁️ Azure Storage
   AZURE_STORAGE_CONNECTION_STRING="your_azure_storage_connection_string"
   
   # 🔐 JWT Secret
   JWT_SECRET="your_super_secret_jwt_key"
   
   # 📧 Email Configuration
   EMAIL_USER="your_email@gmail.com"
   EMAIL_PASSWORD="your_app_password"
   ```

4. **🗃️ Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Apply database schema
   npx prisma db push
   
   # (Optional) Seed with sample data
   npx prisma db seed
   ```

5. **🎉 Start Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) to view the application

</details>

---

## 📁 **Project Architecture**

```
📦 src/
├── 📂 app/                    # Next.js 13+ App Router
│   ├── 📁 admin/             # 👨‍💼 Admin Dashboard
│   ├── 📁 teacher/           # 👨‍🏫 Teacher Portal  
│   ├── 📁 students/          # 🎓 Student Interface
│   ├── 📁 auth/              # 🔐 Authentication
│   ├── 📁 context/           # 🔄 React Context
│   └── 📁 api/               # 🌐 API Routes
├── 📂 components/            # 🧩 Reusable Components
│   ├── 📁 Modales/          # 🪟 Modal Components
│   ├── 📁 Teachers/         # 👨‍🏫 Teacher Components
│   ├── 📁 Students/         # 🎓 Student Components
│   └── 📁 Stats/            # 📊 Analytics Components
├── 📂 lib/                  # 🔧 Utility Libraries
├── 📂 services/             # 🌐 API Services
└── 📂 prisma/               # 🗄️ Database Schema
```

---

## 📊 **Key Features Deep Dive**

### **🎯 Attendance Management**
- ⚡ Real-time attendance tracking with instant updates
- 📊 Automatic percentage calculations and trend analysis
- 🎨 Color-coded attendance status (Present, Absent, Justified)
- 📱 Mobile-optimized interface for teachers
- 🔄 Bulk operations for efficient class management

### **📝 Justification System**
- 📎 File upload support for medical certificates and documents
- 🔄 Multi-stage approval workflow
- 📧 Automatic email notifications
- 📊 Analytics on justification patterns
- 🔍 Admin oversight and reporting

### **📈 Analytics & Reporting**
- 📊 Real-time dashboards with interactive charts
- 📅 Monthly and semester trend analysis
- 🏆 Student ranking and performance metrics
- 📋 Exportable reports for administration
- 🎯 Attendance goal tracking and alerts

---

## 🔒 **Security & Performance**

<div align="center">

| **Security** | **Performance** | **Reliability** |
|:---:|:---:|:---:|
| 🔐 JWT Authentication | ⚡ Server-side Rendering | 🔄 Error Boundaries |
| 🛡️ Role-based Access | 📱 Mobile Optimization | 🔍 Input Validation |
| 🔒 Password Hashing | 🗄️ Database Optimization | 📊 Monitoring |
| 🛡️ CORS Protection | 🖼️ Image Optimization | 🔧 Health Checks |

</div>

---

## 🌐 **API Documentation**

<details>
<summary><b>📚 API Endpoints Overview</b></summary>

### Authentication
```http
POST /api/auth/login          # 🔐 User login
POST /api/auth/logout         # 🚪 User logout
POST /api/auth/register       # 📝 User registration
```

### Student Management
```http
GET    /api/students          # 📋 Fetch students
POST   /api/students          # ➕ Create student
PUT    /api/admin/findStudent # ✏️ Update student
DELETE /api/admin/students    # 🗑️ Delete student
```

### Attendance
```http
GET  /api/teacher/attendance        # 📊 Get attendance lists
POST /api/teacher/updateAttendance  # ✅ Update attendance
GET  /api/group/attendance          # 📈 Group attendance data
```

### Justifications
```http
POST /api/justificantes              # 📝 Submit justification
GET  /api/student/justificante       # 📋 Get justifications
POST /api/teacher/attendanceStatus   # ✅ Update status
```

</details>

---

## 🚀 **Deployment**

### **☁️ Production Build**
```bash
# Build for production
npm run build

# Start production server
npm start
```

### **🌐 Environment Variables for Production**
Ensure these are configured in your production environment:
- `DATABASE_URL` - Production PostgreSQL connection
- `AZURE_STORAGE_CONNECTION_STRING` - Azure Blob Storage
- `JWT_SECRET` - Strong secret key for JWT
- `EMAIL_USER` & `EMAIL_PASSWORD` - Email service credentials

---

## 🤝 **Contributing**

We welcome contributions! Here's how you can help:

1. 🍴 **Fork** the repository
2. 🌿 **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. 📤 **Push** to the branch (`git push origin feature/AmazingFeature`)
5. 🔀 **Open** a Pull Request

<div align="center">

### **📝 Commit Convention**
`type(scope): description`

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

</div>

---

## 🔧 **Troubleshooting**

<details>
<summary><b>🚨 Common Issues & Solutions</b></summary>

### **🗄️ Database Connection Issues**
```bash
# Check PostgreSQL status
sudo service postgresql status

# Verify connection string
echo $DATABASE_URL
```

### **☁️ Azure Storage Issues**
```bash
# Test connection string
az storage account show --name your_account_name
```

### **🔐 Authentication Problems**
- Clear browser cache and cookies
- Verify JWT_SECRET is set correctly
- Check token expiration settings

</details>

---

## 📊 **Statistics & Metrics**

<div align="center">

| **Feature** | **Status** | **Coverage** |
|:---:|:---:|:---:|
| 🎓 Student Management | ✅ Complete | 100% |
| 👨‍🏫 Teacher Portal | ✅ Complete | 100% |
| 📊 Analytics Dashboard | ✅ Complete | 95% |
| 📱 Mobile Responsive | ✅ Complete | 100% |
| 🔐 Authentication | ✅ Complete | 100% |

</div>

---

## 📞 **Support & Contact**

<div align="center">

**Need help?** We're here for you!

[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:support@example.com)
[![Issues](https://img.shields.io/badge/Issues-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/your-repo/issues)
[![Wiki](https://img.shields.io/badge/Wiki-0366D6?style=for-the-badge&logo=github&logoColor=white)](https://github.com/your-repo/wiki)

</div>

---

## 📄 **License**

<div align="center">

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**🎓 Academic Project** - Developed as part of university curriculum

</div>

---

<div align="center">

### **⭐ Star this repository if you found it helpful!**

**Made with ❤️ by me**

</div>