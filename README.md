# 🌴 Holidex – Smart Vacations Platform

![Vacation Vibes](https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif)

---

## 🚀 Project Setup & Run Guide

### 🔐 LocalStack Init Script Permissions

LocalStack runs initialization scripts from `/etc/localstack/init/ready.d`.  
For the script to run, it **must be executable**.

After cloning the repository, run:

```bash
chmod +x localstack/init/ready.d/s3-init.sh
```

⚠️ **Important:** If you skip this step, LocalStack will start without uploading the demo images.

---

## 🏗️ Architecture Overview

This project contains:
- **Frontend** (React)
- **Backend** (Node + Express + Sequelize)
- **MySQL** (Database)
- **LocalStack** (S3 mock for cloud storage)

All services run together via **Docker Compose** 🐳

---

## 🔧 1. Environment Variables (Backend)

The backend requires two runtime environment variables:

```bash
JWT_SECRET=jwtSecret
APP_SECRET=secret
```

### 👉 Running the backend manually (dev mode):

```bash
JWT_SECRET=jwtSecret APP_SECRET=secret npm run dev
```

---

## 👑 2. Admin Login

Admin account included in the seed:

| Field    | Value           |
|----------|-----------------|
| **Email**    | ido1@mail.com   |
| **Password** | 123456          |

---

## 👤 3. Regular User Logins

Test with these pre-seeded accounts:

| Email             | Password |
|-------------------|----------|
| tomer10@mail.com  | 123456   |
| gil5@mail.com     | 123456   |

---

## 📁 4. LocalStack S3 Bucket

The project uses this S3 bucket:

```
images.sunnydb.com
```

### 📸 Image Upload Process

Images are uploaded automatically on startup from:

```
localstack/init/images/
```

The upload script:

```
localstack/init/ready.d/s3-init.sh
```

**Make sure it is executable:**

```bash
chmod +x localstack/init/ready.d/s3-init.sh
```

---

## 🚀 5. Running the Entire Project with Docker Compose

### Start everything from scratch:

```bash
docker compose down -v
docker compose build --no-cache
docker compose up
```

### ✅ After startup:

- ✨ MySQL is seeded with test data
- 🪣 S3 bucket is created and pre-filled with images
- 🔗 Backend is connected to LocalStack
- 🎨 Frontend loads all images from S3 correctly

---

## 🌟 Features

- 🏖️ Browse and book vacation packages
- 🔐 Secure authentication system
- 👥 Admin and user role management
- 📸 Image storage with S3 (LocalStack)
- 🎨 Modern, responsive React UI
- 🐳 Fully containerized with Docker
- 🔄 Real-time data synchronization

---
