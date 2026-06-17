# 🌾 AgriMart — Agricultural E-Commerce Platform

AgriMart is a full-stack e-commerce web application that connects **farmers** directly with **customers**, enabling them to list, manage, and sell agricultural products online. The platform also includes a powerful **Admin panel** for overseeing users, farmers, products, orders, and feedback.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Pages & Roles](#-pages--roles)
- [Database Models](#-database-models)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)

---

## ✨ Features

### 👤 Customer
- Browse and search agricultural products
- View product details with images and pricing
- Place orders and track order status
- Manage profile and order history
- Submit feedback/reviews

### 🚜 Farmer
- Register and manage a farmer profile
- Add, edit, and delete product listings (with image uploads)
- Manage incoming orders
- View farmer-specific dashboard

### 🛡️ Admin
- Secure admin login
- Dashboard with overview statistics
- Manage all users, farmers, products, orders, and feedback
- Control categories, sub-categories, and third-level categories
- Manage cities, areas, and shipping details

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI Framework |
| Vite | Build Tool |
| React Router DOM v6 | Client-side Routing |
| Tailwind CSS | Styling |
| shadcn/ui + Radix UI | UI Component Library |
| Axios | HTTP Client |
| React Hook Form + Zod | Form Validation |
| TanStack Query | Server State Management |
| Recharts | Charts & Analytics |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime Environment |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM (Object Document Mapper) |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Multer | File / Image Uploads |
| CORS | Cross-Origin Resource Sharing |
| dotenv | Environment Variable Management |
| Nodemon | Development Auto-Reload |

---

## 📁 Project Structure

```
AgriMart Project/
├── agrimart proj/              # Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── api/                # Axios API service files
│   │   ├── assets/             # Static assets (images, icons)
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # React Context (Auth, etc.)
│   │   ├── data/               # Static/mock data
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility functions
│   │   ├── pages/
│   │   │   ├── admin/          # Admin panel pages
│   │   │   ├── farmer/         # Farmer portal pages
│   │   │   ├── Index.jsx       # Home / Landing page
│   │   │   ├── Products.jsx    # Product listing
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Booking.jsx     # Order booking
│   │   │   ├── Profile.jsx     # Customer profile
│   │   │   ├── Login.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Feedback.jsx
│   │   │   └── NotFound.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── backendProj/                # Backend (Node.js + Express)
    ├── Controllers/            # Route handler logic
    ├── DBConnection/           # MongoDB connection setup
    ├── middleware/             # Auth & other middleware
    ├── Models/                 # Mongoose schema models
    │   ├── userTbl.js
    │   ├── farmerTbl.js
    │   ├── productTbl.js
    │   ├── orderTbl.js
    │   ├── orderDetailTbl.js
    │   ├── categoryTbl.js
    │   ├── subCategoryTbl.js
    │   ├── thirdCategoryTbl.js
    │   ├── cityTbl.js
    │   ├── areaTbl.js
    │   ├── shippingTbl.js
    │   ├── paymentTbl.js
    │   └── feedbackTbl.js
    ├── routes/                 # Express route definitions
    ├── public/                 # Uploaded files / static assets
    ├── views/                  # EJS view templates
    ├── app.js                  # Express app entry point
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)

---

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backendProj
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the `backendProj/` directory:
   ```env
   JWT_SECRET=your_super_secret_key
   JWT_EXPIRES=7d
   PORT=3000
   BCRYPT_ROUNDS=10
   MONGO_URI=mongodb://localhost:27017/AgriMartDB
   ```

4. **Start the backend server:**
   ```bash
   npm start
   ```
   The backend will run on **http://localhost:3000**

---

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd "agrimart proj"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will run on **http://localhost:5173**

---

## 🔐 Environment Variables

Create a `.env` file in the `backendProj/` directory with the following variables:

| Variable | Description | Example |
|---|---|---|
| `JWT_SECRET` | Secret key for JWT token signing | `your_super_secret_key` |
| `JWT_EXPIRES` | JWT token expiration duration | `7d` |
| `PORT` | Port the backend server runs on | `3000` |
| `BCRYPT_ROUNDS` | Number of bcrypt hashing rounds | `10` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/AgriMartDB` |

> ⚠️ **Never commit your `.env` file to version control.** It is already included in `.gitignore`.

---

## 📡 API Endpoints

All API routes are prefixed with `/api`.

| Resource | Base URL | Description |
|---|---|---|
| Users | `/api/users` | Register, login, manage customers |
| Farmers | `/api/farmer` | Farmer registration & management |
| Products | `/api/products` | Product CRUD operations |
| Categories | `/api/category` | Product categories |
| Sub-Categories | `/api/subCategory` | Sub-category management |
| Third Categories | `/api/thirdCategory` | Third-level categories |
| Orders | `/api/order` | Order placement & management |
| Order Details | `/api/orderDetail` | Individual order item details |
| Payments | `/api/payment` | Payment records |
| Shipping | `/api/shipping` | Shipping information |
| Cities | `/api/city` | City management |
| Areas | `/api/area` | Area management |
| Feedback | `/api/feedback` | Customer feedback & reviews |

---

## 📄 Pages & Roles

### Customer Pages
| Page | Route | Description |
|---|---|---|
| Home | `/` | Landing page with featured products |
| Products | `/products` | Browse all products |
| Product Detail | `/product/:id` | View single product details |
| Booking | `/booking` | Place an order |
| Profile | `/profile` | View & edit customer profile |
| About | `/about` | About the platform |
| Feedback | `/feedback` | Submit feedback |
| Login | `/login` | Customer login / register |

### Farmer Pages
| Page | Route | Description |
|---|---|---|
| Farmer Login | `/farmer/login` | Farmer login portal |
| Farmer Register | `/farmer/register` | New farmer registration |
| Farmer Dashboard | `/farmer/dashboard` | Overview stats |
| Farmer Products | `/farmer/products` | Manage product listings |
| Add Product | `/farmer/add-product` | Add a new product |
| Edit Product | `/farmer/edit-product/:id` | Edit an existing product |
| Farmer Orders | `/farmer/orders` | View & manage orders |
| Farmer Profile | `/farmer/profile` | Manage farmer profile |

### Admin Pages
| Page | Route | Description |
|---|---|---|
| Admin Login | `/admin/login` | Admin login portal |
| Admin Dashboard | `/admin/dashboard` | Platform overview & statistics |
| Manage Users | `/admin/users` | View & manage customers |
| Manage Farmers | `/admin/farmers` | View & manage farmers |
| Manage Products | `/admin/products` | Oversee all product listings |
| Manage Orders | `/admin/orders` | View & update all orders |
| Feedback | `/admin/feedback` | Review customer feedback |

---

## 🗄️ Database Models

| Model | Description |
|---|---|
| `userTbl` | Customer user accounts |
| `farmerTbl` | Farmer profiles with bank & document details |
| `productTbl` | Products listed by farmers (with images) |
| `categoryTbl` | Top-level product categories |
| `subCategoryTbl` | Second-level sub-categories |
| `thirdCategoryTbl` | Third-level product categories |
| `orderTbl` | Customer orders with status tracking |
| `orderDetailTbl` | Line items for each order |
| `paymentTbl` | Payment records linked to orders |
| `shippingTbl` | Shipping/delivery information |
| `cityTbl` | Available cities for delivery |
| `areaTbl` | Areas within cities |
| `feedbackTbl` | Customer reviews and ratings |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is developed for educational purposes.

---

<div align="center">
  <p>Made with ❤️ by the AgriMart Team</p>
  <p>🌾 Empowering Farmers, Feeding Communities 🌾</p>
</div>
