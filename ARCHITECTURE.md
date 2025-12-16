# ArtFolio - Complete Project Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         ARTFOLIO PLATFORM                        │
│                  Digital Art Portfolio & Gallery                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         USER ROLES                               │
├─────────────────┬─────────────────┬──────────────────────────────┤
│    ARTIST       │    VISITOR      │         ADMIN                │
│  (Creator)      │   (Consumer)    │      (Moderator)             │
└─────────────────┴─────────────────┴──────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                       │
│                   http://localhost:5173                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PUBLIC PAGES                                                    │
│  ├── Home (/)                    - Landing page                 │
│  ├── Explore (/explore)          - Gallery/Browse artworks      │
│  ├── Artwork Detail (/artwork/:id) - Individual artwork view    │
│  ├── Artist Profile (/artist/:id)  - Artist portfolio           │
│  ├── Login (/login)              - Authentication               │
│  └── Register (/register)        - User registration            │
│                                                                  │
│  ARTIST PROTECTED ROUTES                                         │
│  ├── Dashboard (/artist/dashboard)     - Analytics & stats      │
│  ├── Artworks (/artist/artworks)       - Manage portfolio       │
│  ├── New Artwork (/artist/artworks/new) - Upload artwork        │
│  └── Commissions (/artist/commissions) - Commission requests    │
│                                                                  │
│  VISITOR PROTECTED ROUTES                                        │
│  ├── Profile (/profile)          - Purchase history, likes      │
│  └── Commissions (/commissions) - Send commission requests      │
│                                                                  │
│  ADMIN PROTECTED ROUTES                                          │
│  └── Admin Panel (/admin)        - Full moderation dashboard    │
│      ├── Overview Tab            - Platform statistics          │
│      ├── Artworks Tab            - Moderate all artworks         │
│      ├── Users Tab               - User management               │
│      ├── Sales Tab               - Transaction history          │
│      └── Flagged Tab             - Review flagged content       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTP Requests (JWT Auth)
┌─────────────────────────────────────────────────────────────────┐
│                  BACKEND (Express + Node.js)                     │
│                   http://localhost:5001                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  API ROUTES                                                      │
│                                                                  │
│  /api/auth                                                       │
│  ├── POST /register              - User registration            │
│  ├── POST /login                 - User authentication          │
│  └── GET  /me                    - Get current user             │
│                                                                  │
│  /api/artworks                                                   │
│  ├── GET    /                    - Get all artworks (public)    │
│  ├── GET    /:id                 - Get single artwork           │
│  ├── POST   /                    - Create artwork (artist)      │
│  ├── GET    /user/uploaded       - Get artist's artworks        │
│  ├── GET    /user/liked          - Get liked artworks           │
│  ├── PATCH  /:id/like            - Like/unlike artwork          │
│  └── POST   /:id/comments        - Add comment                  │
│                                                                  │
│  /api/commissions                                                │
│  ├── POST   /                    - Create commission request    │
│  ├── GET    /artist              - Get artist's commissions     │
│  └── PATCH  /:id                 - Update commission status     │
│                                                                  │
│  /api/orders                                                     │
│  ├── POST   /                    - Create order (purchase)      │
│  ├── GET    /my-orders           - Get buyer's orders           │
│  └── GET    /sales/history       - Get artist's sales           │
│                                                                  │
│  /api/admin (ADMIN ONLY)                                         │
│  ├── GET    /stats               - Platform statistics          │
│  ├── GET    /users               - All users                    │
│  ├── GET    /artworks            - All artworks                 │
│  ├── GET    /sales               - All sales                    │
│  ├── GET    /flagged             - Flagged content              │
│  ├── DELETE /artworks/:id        - Delete artwork               │
│  ├── DELETE /artworks/:aid/comments/:cid - Delete comment       │
│  ├── PATCH  /users/:id/ban       - Ban/unban user               │
│  └── PATCH  /artworks/:id/flag   - Flag/unflag artwork          │
│                                                                  │
│  MIDDLEWARE                                                      │
│  ├── CORS                        - Cross-origin requests        │
│  ├── JWT Verification            - Token authentication         │
│  ├── Multer                      - File upload handling         │
│  └── Role-based Access Control   - Permission checking          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↕ Mongoose ODM
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  COLLECTIONS                                                     │
│                                                                  │
│  users                                                           │
│  ├── _id, username, email, password (hashed)                    │
│  ├── role: 'artist' | 'visitor' | 'admin'                       │
│  ├── bio, profileImage                                          │
│  ├── commissionOpen: Boolean                                    │
│  └── banned: Boolean                                            │
│                                                                  │
│  artworks                                                        │
│  ├── _id, title, description, imageUrl                          │
│  ├── artist: ObjectId → users                                   │
│  ├── tags: [String], category: String                           │
│  ├── price: Number, isForSale: Boolean                          │
│  ├── likes: [ObjectId] → users                                  │
│  ├── comments: [{ user, text, createdAt }]                      │
│  └── flagged: Boolean                                           │
│                                                                  │
│  commissions                                                     │
│  ├── _id, requester: ObjectId → users                           │
│  ├── artist: ObjectId → users                                   │
│  ├── brief: String, deadline: Date                              │
│  ├── status: 'pending'|'accepted'|'completed'|'rejected'        │
│  ├── notes: String, price: Number                               │
│  └── createdAt, updatedAt                                       │
│                                                                  │
│  orders                                                          │
│  ├── _id, buyer: ObjectId → users                               │
│  ├── artwork: ObjectId → artworks                               │
│  ├── amount: Number                                             │
│  ├── status: 'pending' | 'completed'                            │
│  └── createdAt, updatedAt                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      FILE STORAGE                                │
├─────────────────────────────────────────────────────────────────┤
│  /server/uploads/                                                │
│  └── Artwork images (uploaded via multer)                       │
│      Served statically at: /uploads/:filename                   │
└─────────────────────────────────────────────────────────────────┘
```

## User Journey Flows

### 🎨 ARTIST JOURNEY
```
Register (role: artist)
    ↓
Login → JWT Token
    ↓
Upload Artwork
    ├── Add title, description, tags
    ├── Set category (Digital, Oil, etc.)
    ├── Set price for prints
    └── Upload image file
    ↓
Manage Portfolio
    ├── View all uploaded artworks
    ├── Track likes and comments
    └── Monitor engagement
    ↓
Receive Commissions
    ├── View commission requests
    ├── Accept/Reject requests
    ├── Set pricing
    └── Update status (completed/rejected)
    ↓
Track Sales
    ├── View purchase history
    ├── See buyer information
    ├── Calculate total earnings
    └── Monitor sales trends
```

### 👤 VISITOR JOURNEY
```
Register (role: visitor)
    ↓
Login → JWT Token
    ↓
Browse Gallery
    ├── Explore all artworks
    ├── Filter by category
    ├── Search by tags
    └── View artist profiles
    ↓
Interact with Art
    ├── Like artworks (build favorites)
    ├── Leave comments (engage community)
    └── View artwork details
    ↓
Request Commission
    ├── Select artist
    ├── Write brief/description
    ├── Set deadline
    └── Submit request
    ↓
Purchase Prints
    ├── Click "Buy Now"
    ├── Simulated payment
    ├── Order confirmation
    └── Track purchase history
```

### 🛡️ ADMIN JOURNEY
```
Login (role: admin)
    ↓
View Dashboard
    ├── Total users (artists + visitors)
    ├── Total artworks
    ├── Sales volume
    ├── Flagged items count
    └── Commission statistics
    ↓
Moderate Content
    ├── View all artworks
    ├── Flag inappropriate content
    ├── Delete artworks
    ├── Delete comments
    └── Review flagged queue
    ↓
Manage Users
    ├── View all registered users
    ├── See user roles and status
    ├── Ban problematic users
    └── Unban users
    ↓
Track Platform Activity
    ├── View all sales transactions
    ├── Monitor artist earnings
    ├── Track buyer activity
    └── Generate insights
```

## Data Flow Examples

### Example 1: Purchasing an Artwork
```
Visitor clicks "Buy Now"
    ↓
Frontend: POST /api/orders
    Body: { artworkId: "..." }
    Headers: { Authorization: "Bearer <token>" }
    ↓
Backend: Verify JWT token
    ↓
Backend: Find artwork by ID
    ↓
Backend: Create Order document
    {
        buyer: <visitor_id>,
        artwork: <artwork_id>,
        amount: <artwork.price>,
        status: 'completed'
    }
    ↓
Backend: Save to database
    ↓
Backend: Return order confirmation
    ↓
Frontend: Show success message
    ↓
Artist Dashboard: Sales count increases
Admin Dashboard: Total volume increases
```

### Example 2: Admin Deleting Artwork
```
Admin clicks "Delete" on artwork
    ↓
Frontend: Confirm deletion dialog
    ↓
Frontend: DELETE /api/admin/artworks/:id
    Headers: { Authorization: "Bearer <admin_token>" }
    ↓
Backend: Verify admin role
    ↓
Backend: Delete artwork from database
    ↓
Backend: Return success response
    ↓
Frontend: Remove artwork from UI
    ↓
Frontend: Refresh statistics
```

### Example 3: Commission Request Flow
```
Visitor submits commission request
    ↓
Frontend: POST /api/commissions
    Body: { artistId, brief, deadline }
    ↓
Backend: Create Commission document
    {
        requester: <visitor_id>,
        artist: <artist_id>,
        brief: "...",
        status: 'pending',
        deadline: <date>
    }
    ↓
Artist Dashboard: New commission appears
    ↓
Artist accepts commission
    ↓
Frontend: PATCH /api/commissions/:id
    Body: { status: 'accepted', price: 500 }
    ↓
Backend: Update commission status
    ↓
Visitor sees updated status
```

## Security & Authentication

```
┌─────────────────────────────────────────┐
│         JWT Token Flow                  │
├─────────────────────────────────────────┤
│                                         │
│  1. User logs in                        │
│     POST /api/auth/login                │
│     { email, password }                 │
│                                         │
│  2. Server verifies credentials         │
│     - Check email exists                │
│     - Compare hashed password           │
│                                         │
│  3. Generate JWT token                  │
│     jwt.sign({                          │
│       _id: user._id,                    │
│       role: user.role                   │
│     }, SECRET, { expiresIn: '1d' })     │
│                                         │
│  4. Return token to client              │
│     { token, user: {...} }              │
│                                         │
│  5. Client stores token                 │
│     localStorage.setItem('token', ...)  │
│                                         │
│  6. Subsequent requests include token   │
│     Authorization: Bearer <token>       │
│                                         │
│  7. Server verifies token               │
│     jwt.verify(token, SECRET)           │
│                                         │
│  8. Check role permissions              │
│     if (role !== 'admin') deny access   │
│                                         │
└─────────────────────────────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────┐
│           FRONTEND                      │
├─────────────────────────────────────────┤
│  React 18                               │
│  Vite (Build tool)                      │
│  React Router (Navigation)              │
│  Framer Motion (Animations)             │
│  Lucide React (Icons)                   │
│  Context API (State management)         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│           BACKEND                       │
├─────────────────────────────────────────┤
│  Node.js                                │
│  Express.js (Web framework)             │
│  MongoDB (Database)                     │
│  Mongoose (ODM)                         │
│  JWT (Authentication)                   │
│  bcryptjs (Password hashing)            │
│  Multer (File uploads)                  │
│  CORS (Cross-origin)                    │
│  dotenv (Environment variables)         │
└─────────────────────────────────────────┘
```

---

**This architecture supports:**
- ✅ Multi-role user system
- ✅ Secure authentication & authorization
- ✅ File upload & storage
- ✅ Social interactions (likes, comments)
- ✅ Commission workflow
- ✅ E-commerce functionality
- ✅ Admin moderation & analytics
- ✅ Scalable and maintainable codebase
