# 🎨 ArtFolio - Digital Art Gallery Platform

![Project Status](https://img.shields.io/badge/status-complete-success)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A premium **MERN stack** platform where artists showcase and monetize their work, and visitors interact through likes, comments, commissions, and purchases.

## 🌟 Live Demo

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001

## 📸 Screenshots

*Add your screenshots here*

---

## 🚀 Features

### 👨‍🎨 For Artists
- ✅ Create professional portfolio with bio and profile image
- ✅ Upload artworks with titles, descriptions, tags, and categories
- ✅ Set pricing for print sales
- ✅ Receive and manage commission requests
- ✅ Track sales and earnings (from both prints and commissions)
- ✅ View engagement metrics (likes, comments)

### 👤 For Visitors
- ✅ Browse comprehensive art gallery with masonry grid layout
- ✅ Like artworks and build favorites collection
- ✅ Leave comments and engage with community
- ✅ Send commission requests directly to artists
- ✅ Purchase art prints (simulated e-commerce)
- ✅ Track purchase history and commission status

### 🛡️ For Admins
- ✅ View platform-wide statistics and analytics
- ✅ Moderate content (flag/delete artworks and comments)
- ✅ Manage users (ban/unban problematic accounts)
- ✅ Track all sales transactions
- ✅ Review flagged content queue
- ✅ Monitor platform health

**Pre-configured Admin Account:**
- 📧 Email: `admin@gmail.com`
- 🔑 Password: `890098`

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

---

## 📁 Project Structure

```
MERN_STACK_112/
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── context/         # Auth context
│   │   └── App.jsx
│   └── package.json
│
├── server/                   # Backend (Express + MongoDB)
│   ├── models/              # Database schemas
│   ├── routes/              # API endpoints
│   ├── uploads/             # Uploaded images
│   ├── index.js             # Server entry point
│   └── package.json
│
├── .agent/                  # Project documentation
├── README.md
├── TESTING_GUIDE.md
├── ARCHITECTURE.md
└── REQUIREMENTS_CHECKLIST.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas URI)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Saranggole9106/MERN_STACK_112.git
cd MERN_STACK_112
```

2. **Setup Backend**
```bash
cd server
npm install
```

3. **Configure Environment**

Create `.env` file in `server/` directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5001
```

4. **Seed Admin Account** (Optional)
```bash
npm run seed-admin
```

5. **Setup Frontend**
```bash
cd ../client
npm install
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd server
npm start
# or
node index.js
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Visit: http://localhost:5173

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Artworks
- `GET /api/artworks` - Get all artworks
- `GET /api/artworks/:id` - Get single artwork
- `POST /api/artworks` - Create artwork (artist only)
- `PATCH /api/artworks/:id/like` - Like/unlike artwork
- `POST /api/artworks/:id/comments` - Add comment

### Commissions
- `POST /api/commissions` - Create commission request
- `GET /api/commissions/artist` - Get artist's commissions
- `PATCH /api/commissions/:id` - Update commission status

### Orders
- `POST /api/orders` - Create order (purchase)
- `GET /api/orders/my-orders` - Get buyer's orders
- `GET /api/orders/sales/history` - Get artist's sales

### Admin (Admin Only)
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - All users
- `DELETE /api/admin/artworks/:id` - Delete artwork
- `PATCH /api/admin/users/:id/ban` - Ban/unban user

[See full API documentation](./TESTING_GUIDE.md)

---

## 📚 Documentation

- **[README.md](./README.md)** - Project overview and setup
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Complete feature list
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - How to test all features
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design and data flows
- **[REQUIREMENTS_CHECKLIST.md](./REQUIREMENTS_CHECKLIST.md)** - Requirements verification
- **[ADMIN_CREDENTIALS.md](./ADMIN_CREDENTIALS.md)** - Admin login details

---

## 🎯 User Flows

### Artist Journey
```
Register → Upload Artworks → Receive Commissions → Track Sales → Manage Portfolio
```

### Visitor Journey
```
Register → Browse Gallery → Like & Comment → Request Commission → Purchase Prints
```

### Admin Journey
```
Login → View Statistics → Moderate Content → Manage Users → Track Platform
```

---

## 🔒 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ Protected API routes
- ✅ Input validation
- ✅ CORS configuration

---

## 🎨 Design Features

- ✅ Premium glassmorphism UI
- ✅ Dark mode design
- ✅ Responsive layout (mobile/tablet/desktop)
- ✅ Smooth animations with Framer Motion
- ✅ Modern typography
- ✅ Vibrant color palette
- ✅ Masonry grid layout

---

## 📊 Database Schema

### Collections
- **users** - User accounts (artists, visitors, admins)
- **artworks** - Artwork uploads with metadata
- **commissions** - Commission requests and tracking
- **orders** - Purchase orders and sales

[See detailed schema](./ARCHITECTURE.md)

---

## 🧪 Testing

### Quick Test Flow

1. **Create Admin Account**
   - Email: admin@gmail.com
   - Password: 890098

2. **Test Artist Flow**
   - Register as Artist
   - Upload artworks
   - View dashboard

3. **Test Visitor Flow**
   - Register as Visitor
   - Browse gallery
   - Like, comment, purchase

4. **Test Admin Flow**
   - Login as admin
   - Go to `/admin`
   - Moderate content

[See detailed testing guide](./TESTING_GUIDE.md)

---

## 🚀 Deployment

### Backend (Heroku/Railway)
```bash
# Set environment variables
MONGO_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<your-secret>
PORT=5001
```

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy dist/ folder
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Sarang Gole**
- GitHub: [@Saranggole9106](https://github.com/Saranggole9106)

---

## 🙏 Acknowledgments

- Built as a learning project for MERN stack development
- Inspired by modern art portfolio platforms
- Uses simulated e-commerce (no real payment processing)

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**⭐ If you found this project helpful, please give it a star!**
