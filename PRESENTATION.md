# ArtFolio: Frontend Architecture & Implementation Guide

**Project Code**: 108: MERN Stack – Digital Art Portfolio & Gallery
**Stack**: React.js (Vite) + Vanilla CSS (Glassmorphism)

---

## 1. Project Overview
**ArtFolio** is a modern, high-performance Digital Art Gallery and Portfolio platform. The frontend is built with **React 19** using **Vite**, designed to be visually stunning ("Wow Factor") with a dark, glassmorphism aesthetic. It connects to a robust Express/MongoDB backend to provide dynamic artist portfolios, commission management, and e-commerce features.

---

## 2. Technology Stack (Frontend)
We chose a modern, lightweight, and fast stack for the best user experience:

*   **Framework**: [React 19](https://react.dev/) (Latest logic & hooks)
*   **Build Tool**: [Vite](https://vitejs.dev/) (Blazing fast HMR & builds)
*   **Routing**: [React Router v7](https://reactrouter.com/) (Client-side navigation)
*   **Styling**: Vanilla CSS + CSS Variables (Custom Design System, Glassmorphism)
*   **Icons**: [Lucide React](https://lucide.dev/) (Clean, consistent SVG icons)
*   **Animations**: Minimal CSS transitions & hover effects
*   **State Management**: React Context API (`AuthContext`)

---

## 3. Getting Started
How to run the frontend locally for development.

### Prerequisites
*   Node.js (v18+)
*   NPM (v9+)

### Installation Steps
```bash
# 1. Navigate to the client directory
cd client

# 2. Install dependencies
npm install

# 3. Start the Development Server
npm run dev
```
> The app will run at `http://localhost:5173`.
> It proxies API requests to `http://localhost:5001` (ensure backend is running).

---

## 4. Key Features & Deliverables

### 🎨 A. Visual Excellence (UI/UX)
*   **Masonry Grid Layout**: A Pinterest-style dynamic grid for browsing artworks (`MasonryGrid.jsx`). Handles images of varying aspect ratios gracefully.
*   **Glassmorphism Design**: Translucent elements with blur filters for a premium feel.
*   **Responsive**: Fully mobile-optimized navigation and layouts.

### 🔐 B. Authentication & Security
*   **Role-Based Access**:
    *   **Visitors**: Can browse, like, and comment.
    *   **Artists**: Can upload art, manage profile, accept commissions.
    *   **Admins**: Can moderate content and view platform stats.
*   **JWT Handling**: Secure storage of tokens in LocalStorage with automatic expiration handling.
*   **Protected Routes**: Components that redirect unauthorized users (`ProtectedRoute.jsx`).

### 🖼️ C. Art & Portfolio Management
*   **Artwork Upload**: Drag-and-drop style form for artists to publish work with tags, categories, and pricing.
*   **Dynamic Gallery**: Filtering by category (Digital, Oil, Photography) and infinite-scroll style browsing.
*   **Single Artwork View**: Detailed view with Lightbox-like emphasis, comments section, and "Buy Print" options.

### 📝 D. Commission System
*   **Request Form**: Visitors can request custom work from artists.
*   **Artist Dashboard**: Dedicated view for artists to `Accept`, `Reject`, or `Complete` commissions.
*   **Status Tracking**: Visual badges indicating commission progress.

---

## 5. Directory Structure
Understanding the codebase layout.

```text
client/src/
├── components/         # Reusable UI blocks
│   ├── MasonryGrid.jsx # The core gallery grid
│   ├── Navbar.jsx      # Responsive navigation
│   └── ArtworkCard.jsx # Individual art item
├── pages/              # Main Route Views
│   ├── Home.jsx        # Landing page with Hero section
│   ├── Explore.jsx     # Search & Discovery
│   ├── Login/Register  # Auth pages
│   └── artist/         # Artist-specific dashboards
├── context/            # Global State
│   └── AuthContext.jsx # User login state & helper functions
└── utils/              # Helper scripts
```

---

## 6. Implementation Status Checklist

| Feature | Status | Component/File |
| :--- | :--- | :--- |
| **React Gallery Setup** | ✅ Complete | `Explore.jsx`, `MasonryGrid.jsx` |
| **Artist Profiles** | ✅ Complete | `ArtistProfile.jsx` |
| **Commission Forms** | ✅ Complete | `Commissions.jsx` |
| **Authentication UI** | ✅ Complete | `Login.jsx`, `Register.jsx` |
| **Responsive Design** | ✅ Complete | `index.css` (Media Queries) |
| **Live API Integration** | ✅ Complete | Connected to Render Backend |

---

## 7. Future Roadmap (Optional Advanced Features)
*   **Virtual Gallery Tours**: 3D canvas navigation using Three.js.
*   **AI Recommendations**: Suggesting art based on liked tags.
*   **Print-on-Demand**: Stripe integration for real payments.
