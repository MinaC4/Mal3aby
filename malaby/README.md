# ملعبي - Malaby

<div align="center">

![Logo](https://img.shields.io/badge/ملعبي-Malaby-10b981?style=for-the-badge&logo=football)

**منصة ذكية لحجز ملاعب كرة القدم**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://mongodb.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://docker.com)

</div>

---

## 📋 فهرس المحتويات

- [نظرة عامة](#-نظرة-عامة)
- [المميزات](#-المميزات)
- [الهيكل التقني](#-الهيكل-التقني)
- [متطلبات التشغيل](#-متطلبات-التشغيل)
- [التشغيل باستخدام Docker](#-التشغيل-باستخدام-docker)
- [التشغيل المحلي](#-التشغيل-المحلي)
- [متغيرات البيئة](#-متغيرات-البيئة)
- [API Documentation](#-api-documentation)
- [هيكل المشروع](#-هيكل-المشروع)
- [الدخول للوحة التحكم](#-الدخول-للوحة-التحكم)
- [الدعم الفني](#-الدعم-الفني)

---

## 🔭 نظرة عامة

**"ملعبي"** هي منصة ذكية تجمع كل صاحب ملعب كرة قدم في مكان واحد، حيث يتيح للمستخدمين:

- ✅ استعراض الملاعب مع الصور والأسعار والمواقع
- ✅ نظام حجز ذكي مع تجنب تضارب المواعيد
- ✅ إشعارات فورية لتأكيد الحجوزات
- ✅ لوحة تحكم شاملة لإدارة الحجوزات

---

## ✨ المميزات

### 👤 للمستخدمين
- تصفح الملاعب مع صور عالية الجودة
- فلترة وبحث متقدم
- حجز ذكي باختيار اليوم والوقت
- تجنب تضارب المواعيد تلقائياً
- دفع عبر فودافون كاش أو إنستا باي

### 👨‍💼 للأدمن (صاحب الملعب)
- لوحة تحكم شاملة
- عرض جميع الحجوزات مع تفاصيل العملاء
- إشعارات فورية بالحجوزات الجديدة
- إدارة حالات الحجوزات (تأكيد/إلغاء)
- عرض صور التحويلات البنكية

---

## 🏗 الهيكل التقني

### Architecture: Microservices

```
┌─────────────────────┐
│   Frontend User     │  ← React + Vite (Port 3000)
│   (User App)        │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│   Frontend Admin    │  ← React + Vite (Port 3001)
│   (Dashboard)       │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│   Backend API       │  ← Node.js + Express (Port 5000)
│   (REST API)        │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│   MongoDB Atlas     │  ← Cloud Database
│   (Database)        │
└─────────────────────┘
```

### التقنيات المستخدمة

| الطبقة | التقنية | الوصف |
|--------|---------|-------|
| Frontend User | React 18 + Vite + TypeScript + Tailwind CSS | واجهة المستخدم |
| Frontend Admin | React 18 + Vite + TypeScript + Tailwind CSS | لوحة التحكم |
| Backend | Node.js + Express + MongoDB (Mongoose) | API |
| Database | MongoDB Atlas | قاعدة البيانات |
| DevOps | Docker + Docker Compose | Containerization |

---

## 📦 متطلبات التشغيل

- **Docker** + **Docker Compose**
- أو **Node.js 20+** + **npm**
- اتصال بالإنترنت (لـ MongoDB Atlas)

---

## 🐳 التشغيل باستخدام Docker

### 1. استنساخ المشروع

```bash
git clone <repository-url>
cd malaby
```

### 2. إعداد متغيرات البيئة

```bash
# تعديل ملف .env باستخدام محررك المفضل
nano .env
```

تأكد من إضافة **MongoDB URI** الخاص بك:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/malaby?retryWrites=true&w=majority
```

### 3. بناء وتشغيل الخدمات

```bash
# بناء كل الخدمات
docker-compose up --build

# أو للتشغيل في الخلفية
docker-compose up --build -d
```

### 4. الوصول للتطبيقات

| الخدمة | الرابط | الوصف |
|--------|--------|-------|
| User App | http://localhost:3000 | واجهة المستخدم |
| Admin Dashboard | http://localhost:3001 | لوحة التحكم |
| API | http://localhost:5000/api | الـ API |

### 5. إدارة الخدمات

```bash
# إيقاف الخدمات
docker-compose down

# إعادة البناء
docker-compose up --build

# عرض الـ logs
docker-compose logs -f

# عرض logs لخدمة معينة
docker-compose logs -f api
```

### 6. ملء البيانات الافتراضية (Seed)

```bash
# تشغيل seed داخل الـ container
docker-compose exec api node seed.js
```

---

## 💻 التشغيل المحلي (بدون Docker)

### Backend

```bash
cd backend
npm install
npm run seed    # ملء البيانات الافتراضية (اختياري)
npm start       # التشغيل في وضع الإنتاج
# أو
npm run dev     # وضع التطوير (مع nodemon)
```

### Frontend User

```bash
cd frontend-user
npm install
npm run dev     # يعمل على http://localhost:3000
```

### Frontend Admin

```bash
cd frontend-admin
npm install
npm run dev     # يعمل على http://localhost:3001
```

---

## ⚙ متغيرات البيئة

| المتغير | الوصف | القيمة الافتراضية |
|---------|-------|-------------------|
| `MONGODB_URI` | رابط اتصال MongoDB Atlas | مطلوب |
| `NODE_ENV` | بيئة التشغيل | `production` |
| `PORT` | منفذ الـ API | `5000` |
| `CORS_ORIGIN` | المصادر المسموحة | `*` |
| `ADMIN_USERNAME` | اسم المستخدم للأدمن | `admin` |
| `ADMIN_PASSWORD` | كلمة المرور للأدمن | `admin123` |

---

## 🔌 API Documentation

### Endpoints

#### Pitches (الملاعب)

| Method | Endpoint | الوصف |
|--------|----------|-------|
| `GET` | `/api/pitches` | جلب كل الملاعب |
| `GET` | `/api/pitches/:id` | جلب ملعب محدد |
| `GET` | `/api/pitches/:id/slots?date=YYYY-MM-DD` | جلب المواعيد المتاحة |

#### Bookings (الحجوزات)

| Method | Endpoint | الوصف |
|--------|----------|-------|
| `GET` | `/api/bookings` | جلب كل الحجوزات |
| `POST` | `/api/bookings` | إنشاء حجز جديد |
| `GET` | `/api/bookings/:id` | جلب حجز محدد |
| `PUT` | `/api/bookings/:id/status` | تحديث حالة الحجز |
| `PUT` | `/api/bookings/:id/payment` | رفع صورة التحويل |
| `DELETE` | `/api/bookings/:id` | حذف حجز |

#### Notifications (الإشعارات)

| Method | Endpoint | الوصف |
|--------|----------|-------|
| `GET` | `/api/notifications` | جلب كل الإشعارات |
| `PUT` | `/api/notifications/:id/read` | تحديد كمقروء |
| `PUT` | `/api/notifications/read-all` | تحديد الكل كمقروء |
| `DELETE` | `/api/notifications/:id` | حذف إشعار |
| `GET` | `/api/notifications/stats/unread` | عدد الإشعارات غير المقروءة |

### Health Check

```bash
GET /health
```

---

## 📁 هيكل المشروع

```
malaby/
├── docker-compose.yml          # Docker Compose configuration
├── .env                        # Environment variables
├── .dockerignore               # Docker ignore rules
├── README.md                   # This file
├── docs/
│   └── API_DOCUMENTATION.md    # Detailed API docs
│
├── backend/                    # Backend API Service
│   ├── Dockerfile
│   ├── server.js               # Entry point
│   ├── package.json
│   ├── seed.js                 # Seed data
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── models/
│   │   ├── Pitch.js            # Pitch model
│   │   ├── Booking.js          # Booking model
│   │   └── Notification.js     # Notification model
│   ├── routes/
│   │   ├── pitches.js          # Pitch routes
│   │   ├── bookings.js         # Booking routes
│   │   └── notifications.js    # Notification routes
│   └── middleware/
│       └── errorHandler.js     # Error handling
│
├── frontend-user/              # User Frontend Service
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── lib/
│       │   └── utils.ts
│       ├── types/
│       │   └── index.ts
│       ├── hooks/
│       │   └── useApi.ts
│       ├── components/
│       │   ├── Navbar.tsx
│       │   ├── Footer.tsx
│       │   ├── PitchCard.tsx
│       │   └── BookingForm.tsx
│       └── pages/
│           ├── HomePage.tsx
│           ├── PitchesPage.tsx
│           ├── PitchDetailPage.tsx
│           ├── BookingPage.tsx
│           └── BookingSuccessPage.tsx
│
└── frontend-admin/             # Admin Dashboard Service
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── tsconfig.json
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── index.css
        ├── lib/
        │   └── utils.ts
        ├── types/
        │   └── index.ts
        ├── hooks/
        │   ├── useApi.ts
        │   └── useAuth.ts
        ├── components/
        │   ├── Sidebar.tsx
        │   └── Navbar.tsx
        └── pages/
            ├── LoginPage.tsx
            ├── DashboardPage.tsx
            ├── BookingsPage.tsx
            └── NotificationsPage.tsx
```

---

## 🔐 الدخول للوحة التحكم

1. افتح: http://localhost:3001
2. أدخل بيانات الدخول:
   - **اسم المستخدم:** `admin`
   - **كلمة المرور:** `admin123`

> ⚠️ **تنبيه أمني:** قم بتغيير بيانات الدخول الافتراضية في بيئة الإنتاج!

---

## 🚀 DevOps Friendly

تم تصميم المشروع ليكون سهل النشر على Kubernetes و Helm:

- ✅ كل خدمة في container مستقل
- ✅ Health checks مدمجة
- ✅ Environment variables للإعدادات
- ✅ Nginx reverse proxy للـ frontend
- ✅ قابل للتوسع أفقياً

### ملفات Kubernetes مستقبلية

```yaml
# k8s/namespace.yaml
# k8s/api-deployment.yaml
# k8s/api-service.yaml
# k8s/frontend-user-deployment.yaml
# k8s/frontend-user-service.yaml
# k8s/frontend-admin-deployment.yaml
# k8s/frontend-admin-service.yaml
# k8s/ingress.yaml
# helm/Chart.yaml
# helm/values.yaml
# helm/templates/*.yaml
```

---

## 📞 الدعم الفني

للاستفسارات أو المشاكل:

- 📧 البريد: info@malaby.com
- 📱 الهاتف: 0101 234 5678

---

<div align="center">

**Made with ❤️ for football lovers**

© 2024 ملعبي - Malaby. جميع الحقوق محفوظة.

</div>
