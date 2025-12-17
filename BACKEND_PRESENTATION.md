# ArtFolio: Backend Architecture & API Guide

**Project Code**: 108: MERN Stack – Digital Art Portfolio & Gallery
**Stack**: Node.js, Express.js, MongoDB (Mongoose)

---

## 1. Project Overview
The **ArtFolio Backend** is the engine powering the digital gallery. It is a RESTful API built with **Express.js** that handles data persistence, user authentication, file storage, and business logic. It serves as the bridge between the React Frontend and the MongoDB Database.

---

## 2. Technology Stack (Backend)
We utilized a robust and industry-standard architecture:

*   **Runtime**: [Node.js](https://nodejs.org/) (Asynchronous, Event-driven)
*   **Framework**: [Express.js](https://expressjs.com/) (Routing & Middleware)
*   **Database**: [MongoDB Atlas](https://www.mongodb.com/) (Cloud NoSQL Database)
*   **ODM**: [Mongoose](https://mongoosejs.com/) (Schema-based modeling)
*   **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) (Stateless auth)
*   **File Handling**: [Multer](https://github.com/expressjs/multer) (Image uploads)
*   **Security**: [Bcrypt.js](https://www.npmjs.com/package/bcryptjs) (Password hashing) + CORS

---

## 3. Architecture & Data Flow
The backend follows the **MVC (Model-View-Controller)** pattern (minus the View, as it's an API):

1.  **Request**: Client (React) sends an HTTP Request (e.g., `POST /api/login`).
2.  **Middleware**: Checks security (CORS) and parses JSON body.
3.  **Route**: Matches the URL to a specific handler function.
4.  **Controller Logic**: Executes business rules (e.g., "Check password").
5.  **Model**: Interacts with MongoDB to Fetch/Save data.
6.  **Response**: Sends JSON data back to the Client.

---

## 4. Key API Features & Methods

### 🔐 A. Authentication (Auth Routes)
*   **Secure Registration & Login**
    *   **POST** `/api/auth/register`: Creates a new user. Passwords are **hashed** before saving to DB.
    *   **POST** `/api/auth/login`: Verifies credentials and issues a **JWT Token**.

### 🖼️ B. Artwork Management (CRUD)
*   **Upload & Retrieval**
    *   **GET** `/api/artworks`: Fetches all artworks. Supports filters like `?category=Digital`.
    *   **GET** `/api/artworks/:id`: Fetches a single artwork's details.
    *   **POST** `/api/artworks`: (Protected) Artists upload an image file (handled by `multer`) and metadata.
    *   **PATCH** `/api/artworks/:id/like`: Toggles a "Like" on an artwork.

### 📝 C. Commission System
*   **Business Logic for Requests**
    *   **POST** `/api/commissions`: Visitor creates a request.
    *   **GET** `/api/commissions/artist`: Artist views pending requests.
    *   **PATCH** `/api/commissions/:id`: Artist updates status (`Accepted` / `Rejected`).

---

## 5. How It Works: Deep Dive

### 1. The Request-Response Cycle (GET vs POST)
*   **GET (Reading Data)**:
    *   *Scenario*: A user opens the "Explore" page.
    *   *Action*: React calls `fetch('/api/artworks')`.
    *   *Backend*: Query MongoDB `Artwork.find()`, populate user details, and return generic JSON array.
*   **POST (Creating Data)**:
    *   *Scenario*: User clicks "Register".
    *   *Action*: React sends JSON payload `{ email, password }`.
    *   *Backend*: Validates input -> Hashes Password -> Saves to DB -> Generates Token -> Returns Success.

### 2. Middleware & Protection
We use a custom `verifyToken` middleware.
*   Before accessing sensitive routes (like `POST /api/artworks`), the server checks the request header for a valid Token.
*   If valid: The request proceeds, and `req.user` is populated with the user's ID.
*   If invalid: The server immediately responds with `401 Unauthorized`.

### 3. File Uploads
We solve the challenge of saving images using **Multer**.
*   Images aren't stored IN the database (too slow).
*   Instead, images are saved to the `/uploads` folder on the server.
*   The Database only stores the **URL/Path** to that image.

---

## 6. Implementation Status Checklist

| Feature | Data Model | Route Path | Status |
| :--- | :--- | :--- | :--- |
| **User Auth** | `User.js` | `/api/auth` | ✅ API Live |
| **Artwork CRUD** | `Artwork.js` | `/api/artworks` | ✅ API Live |
| **File Storage** | Multer Config | `/uploads` | ✅ Configured |
| **Commissions** | `Commission.js` | `/api/commissions` | ✅ API Live |
| **Orders/Sales** | `Order.js` | `/api/orders` | ✅ API Live |

---

## 7. How to Verify (Testing with Postman/cURL)
You can test the backend independently of the frontend:
```bash
# Get all artworks
curl https://artfolio-server.onrender.com/api/artworks

# Health Check
curl https://artfolio-server.onrender.com/
```
