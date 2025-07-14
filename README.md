# Student Attendance Management System

A comprehensive web application for managing student attendance, built with Next.js, Prisma, PostgreSQL, and Azure Blob Storage.

## 🚀 Features

### For Administrators
- **Student Management**: Add, edit, delete, and view student profiles with photo uploads
- **Teacher Management**: Manage teacher accounts and assignments
- **Group Management**: Create and manage student groups with customizable class schedules
- **Event Management**: Organize and track events with attendance monitoring
- **Statistics Dashboard**: View comprehensive attendance analytics and justification reports
- **Period Management**: Set academic periods and attendance limits

### For Teachers
- **Attendance Tracking**: Mark student attendance for groups and events
- **Justification Review**: Approve or reject student absence justifications
- **Group Overview**: View assigned groups and their attendance statistics
- **Event Management**: Access event-specific attendance lists

### For Students
- **Attendance History**: View personal attendance records by group
- **Justification Requests**: Submit absence justifications with supporting documents
- **Event Participation**: Check event attendance status
- **Progress Tracking**: Monitor absence percentage and limits

## 🛠️ Technology Stack

- **Frontend**: Next.js 13+ with React
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: Azure Blob Storage
- **Authentication**: JWT-based authentication
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Heroicons
- **Email**: Nodemailer for notifications
- **Charts**: Chart.js for statistics visualization

## 📋 Prerequisites

- Node.js 18.0 or higher
- PostgreSQL database
- Azure Storage Account
- Email account for notifications (Gmail recommended)

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/grimaldooh/Callige
   cd gestion

2. **Install dependencies**

npm install

1. **Environment Setup Create a .env file in the root directory:**


# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Azure Storage
AZURE_STORAGE_CONNECTION_STRING="your_azure_storage_connection_string"

# JWT Secret
JWT_SECRET="your_jwt_secret_key"

# Email Configuration
EMAIL_USER="your_email@gmail.com"
EMAIL_PASSWORD="your_app_password"

📁 Project Structure


src/
├── app/                    # Next.js 13+ app directory
│   ├── admin/             # Admin dashboard pages
│   ├── teacher/           # Teacher portal pages
│   ├── students/          # Student portal pages
│   ├── auth/              # Authentication pages
│   ├── context/           # React context providers
│   └── api/               # API routes
├── components/            # Reusable React components
│   ├── Modales/          # Modal components
│   ├── Teachers/         # Teacher-specific components
│   ├── Students/         # Student-specific components
│   ├── Stats/            # Statistics components
│   └── ...
├── lib/                  # Utility libraries
├── services/             # API service functions
└── prisma/               # Database schema and migrations
