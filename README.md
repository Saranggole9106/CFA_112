# ArtFolio - Digital Art Portfolio & Gallery

A premium MERN stack platform where artists showcase and monetize their work, and visitors interact through likes, comments, commissions, and purchases.

![Project Status](https://img.shields.io/badge/status-complete-success)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

---

## 🎯 Project Overview

**ArtFolio** is a comprehensive digital art platform that serves as:
- **Portfolio** for artists to showcase their work
- **Gallery** for visitors to discover and interact with art
- **Marketplace** for simulated print sales
- **Commission Platform** for custom artwork requests
- **Community Space** with social features (likes, comments)
- **Admin Panel** for content moderation and platform management

---

## ✨ Key Features

### 👥 Three User Roles

#### 🎨 **Artist**
- Create professional portfolio with bio and profile image
- Upload artworks with titles, descriptions, tags, and categories
- Set pricing for print sales
- Receive and manage commission requests
- Track sales and earnings
- View engagement metrics (likes, comments)

#### 👤 **Visitor**
- Browse comprehensive art gallery
- Like artworks and build favorites collection
- Leave comments and engage with community
- Send commission requests directly to artists
- Purchase art prints (simulated e-commerce)
- Track purchase history and commission status

#### 🛡️ **Admin**
- View platform-wide statistics and analytics
- Moderate content (flag/delete artworks and comments)
- Manage users (ban/unban problematic accounts)
- Track all sales transactions
- Review flagged content queue
- Monitor platform health

**Pre-configured Admin Account:**
- 📧 Email: `admin@gmail.com`
- 🔑 Password: `890098`
- Access at: http://localhost:5173/admin

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas URI)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd "CFA PROJECT 112"
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

4. **Setup Frontend**
```bash
cd ../client
npm install
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd server
node index.js
```
Server runs on: http://localhost:5001

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Frontend runs on: http://localhost:5173

---

## 📁 Project Structure

```
CFA PROJECT 112/
├── server/                    # Backend (Express + MongoDB)
│   ├── models/               # Database schemas
│   │   ├── User.js          # User model (artist/visitor/admin)
│   │   ├── Artwork.js       # Artwork model with likes & comments
│   │   ├── Commission.js    # Commission request model
│   │   └── Order.js         # Purchase order model
│   ├── routes/              # API endpoints
│   │   ├── auth.js          # Authentication routes
│   │   ├── artworks.js      # Artwork CRUD, like, comment
│   │   ├── commissions.js   # Commission management
│   │   ├── orders.js        # Purchase & sales tracking
│   │   └── admin.js         # Admin moderation routes
│   ├── uploads/             # Uploaded artwork images
│   ├── .env                 # Environment variables
│   ├── index.js             # Server entry point
│   └── package.json
│
├── client/                   # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ArtworkCard.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Home.jsx              # Landing page
│   │   │   ├── Explore.jsx           # Gallery/Browse
│   │   │   ├── ArtworkDetail.jsx     # Artwork view
│   │   │   ├── ArtistProfile.jsx     # Artist portfolio
│   │   │   ├── VisitorProfile.jsx    # Visitor dashboard
│   │   │   ├── Commissions.jsx       # Commission requests
│   │   │   ├── Login.jsx             # Authentication
│   │   │   ├── Register.jsx          # User registration
│   │   │   ├── artist/
│   │   │   │   ├── Dashboard.jsx     # Artist analytics
│   │   │   │   ├── Artworks.jsx      # Manage portfolio
│   │   │   │   ├── NewArtwork.jsx    # Upload artwork
│   │   │   │   └── Commissions.jsx   # Commission inbox
│   │   │   └── admin/
│   │   │       └── Dashboard.jsx     # Admin panel
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Auth state management
│   │   ├── App.jsx           # Main app component
│   │   ├── index.css         # Global styles
│   │   └── main.jsx
│   └── package.json
│
├── .agent/                   # Project documentation
│   └── artfolio_implementation_plan.md
├── PROJECT_SUMMARY.md        # Complete feature summary
├── TESTING_GUIDE.md          # Testing instructions
├── ARCHITECTURE.md           # System architecture
└── README.md                 # This file
```

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
- `GET /api/artworks/user/uploaded` - Get artist's artworks
- `GET /api/artworks/user/liked` - Get liked artworks
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
- `GET /api/admin/artworks` - All artworks
- `GET /api/admin/sales` - All sales
- `GET /api/admin/flagged` - Flagged content
- `DELETE /api/admin/artworks/:id` - Delete artwork
- `DELETE /api/admin/artworks/:aid/comments/:cid` - Delete comment
- `PATCH /api/admin/users/:id/ban` - Ban/unban user
- `PATCH /api/admin/artworks/:id/flag` - Flag/unflag artwork

---

## 🎨 Features Implemented

### Core Functionality
- ✅ User authentication with JWT
- ✅ Role-based access control (Artist, Visitor, Admin)
- ✅ File upload for artwork images
- ✅ Image storage and serving

### Artist Features
- ✅ Portfolio creation and management
- ✅ Artwork upload with metadata
- ✅ Commission request inbox
- ✅ Sales tracking and analytics
- ✅ Earnings dashboard

### Visitor Features
- ✅ Gallery browsing and exploration
- ✅ Like/unlike artworks
- ✅ Comment on artworks
- ✅ Commission request submission
- ✅ Print purchase (simulated)
- ✅ Purchase history

### Admin Features
- ✅ Platform statistics dashboard
- ✅ User management (view, ban, unban)
- ✅ Content moderation (flag, delete)
- ✅ Sales analytics
- ✅ Flagged content review queue

### Social Features
- ✅ Like system
- ✅ Comment threads
- ✅ Artist-visitor interaction
- ✅ Community engagement

### E-Commerce
- ✅ Print pricing
- ✅ Purchase workflow
- ✅ Order tracking
- ✅ Sales history
- ✅ Mock payment system

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Framer Motion** - Animations
- **Lucide React** - Icon library
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

---

## 📖 Documentation

- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Complete feature overview
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - How to test all features
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and data flows
- **[.agent/artfolio_implementation_plan.md](./.agent/artfolio_implementation_plan.md)** - Implementation details

---

## 🧪 Testing

### Quick Test Flow

1. **Create Test Accounts:**
   - Register as Artist
   - Register as Visitor
   - Register as Admin

2. **Test Artist Flow:**
   - Upload 2-3 artworks
   - Set prices
   - View dashboard

3. **Test Visitor Flow:**
   - Browse gallery
   - Like artworks
   - Leave comments
   - Purchase an artwork
   - Send commission request

4. **Test Admin Flow:**
   - Login as admin
   - Go to `/admin`
   - View statistics
   - Flag an artwork
   - Ban a user
   - View sales data

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for detailed testing instructions.

---

## 🎯 User Journeys

### Artist
```
Register → Upload Artworks → Receive Commissions → Track Sales → Manage Portfolio
```

### Visitor
```
Register → Browse Gallery → Like & Comment → Request Commission → Purchase Prints
```

### Admin
```
Login → View Statistics → Moderate Content → Manage Users → Track Platform Activity
```

---

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Role-based access control
- Protected API routes
- Input validation
- CORS configuration

---

## 🎨 Design Features

- Premium glassmorphism UI
- Dark mode design
- Responsive layout
- Smooth animations
- Modern typography
- Vibrant color palette

---

## 📝 Database Schema

### User
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  role: 'artist' | 'visitor' | 'admin',
  bio: String,
  profileImage: String,
  commissionOpen: Boolean,
  banned: Boolean
}
```

### Artwork
```javascript
{
  title: String,
  description: String,
  imageUrl: String,
  artist: ObjectId (ref: User),
  tags: [String],
  category: String,
  price: Number,
  isForSale: Boolean,
  likes: [ObjectId] (ref: User),
  comments: [{
    user: ObjectId,
    text: String,
    createdAt: Date
  }],
  flagged: Boolean
}
```

### Commission
```javascript
{
  requester: ObjectId (ref: User),
  artist: ObjectId (ref: User),
  brief: String,
  status: 'pending' | 'accepted' | 'completed' | 'rejected',
  notes: String,
  price: Number,
  deadline: Date
}
```

### Order
```javascript
{
  buyer: ObjectId (ref: User),
  artwork: ObjectId (ref: Artwork),
  amount: Number,
  status: 'pending' | 'completed'
}
```

---

## 🚀 Deployment

### Backend Deployment (Example: Heroku)
```bash
# Add MongoDB Atlas URI to environment variables
# Deploy to Heroku or similar platform
```

### Frontend Deployment (Example: Vercel)
```bash
cd client
npm run build
# Deploy dist/ folder to Vercel or Netlify
```

---

## 📄 License

This project is created for educational purposes.

---

## 👨‍💻 Development

### Running in Development
```bash
# Terminal 1 - Backend with auto-reload
cd server
nodemon index.js

# Terminal 2 - Frontend with hot reload
cd client
npm run dev
```

### Building for Production
```bash
cd client
npm run build
```

---

## 🎉 Project Status

**✅ COMPLETE** - All core features implemented and functional:
- User authentication & authorization
- Artist portfolio management
- Visitor interactions (likes, comments, purchases)
- Commission system
- E-commerce functionality
- Admin moderation panel
- Platform analytics

---

## 📞 Support

For issues or questions, refer to:
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) for testing help
- [ARCHITECTURE.md](./ARCHITECTURE.md) for system understanding
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for feature details

---

**Built with ❤️ using the MERN Stack**
