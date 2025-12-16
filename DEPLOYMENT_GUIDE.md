# Deployment Guide for ArtFolio

This project consists of two parts: a **Client** (Frontend) and a **Server** (Backend). To make it live, we recommend deploying the Client to **Netlify** and the Server to **Render** (free tier compatible).

## 1. Prerequisites
- A GitHub account.
- A [Netlify](https://www.netlify.com/) account.
- A [Render](https://render.com/) account.
- Your **MongoDB Connection String** (from MongoDB Atlas).

## 2. Prepare the Repository
Ensure all your code is committed and pushed to GitHub.
```bash
git add .
git commit -m "Prepared for deployment"
git push origin main
```

## 3. Deploy Server (Backend) to Render
1.  Log in to [Render Dashboard](https://dashboard.render.com/).
2.  Click **"New +"** -> **"Web Service"**.
3.  Connect your GitHub repository.
4.  Standard configuration:
    -   **Root Directory**: `server`
    -   **Runtime**: Node
    -   **Build Command**: `npm install`
    -   **Start Command**: `node index.js`
5.  **Environment Variables** (Add these in the "Environment" tab):
    -   `MONGO_URI`: Your MongoDB connection string.
    -   `JWT_SECRET`: A secure random string for authentication.
    -   `NODE_ENV`: `production`
    -   `CLIENT_URL`: `https://artfolio-client-1765860529.netlify.app` (This is your live Netlify URL).
6.  Click **"Create Web Service"**.
7.  Wait for the deployment to finish. **Copy the Service URL** (e.g., `https://artfolio-api.onrender.com`).

**Note on File Uploads**: On Render's free tier, file uploads (images) are ephemeral and will disappear when the server restarts (which happens frequently). For a production app, you should integrate Cloudinary or AWS S3.

## 4. Deploy Client (Frontend) to Netlify
1.  Open `client/netlify.toml` in your code.
2.  **CRITICAL**: Update the proxy URL to match your real Backend URL from step 3.
    ```toml
    [[redirects]]
      from = "/api/*"
      to = "https://your-new-render-url.onrender.com/api/:splat"  # <-- CHANGE THIS
      status = 200
      force = true
    ```
3.  Commit and push this change to GitHub.
4.  Log in to [Netlify](https://app.netlify.com/).
5.  Click **"Add new site"** -> **"Import from existing project"**.
6.  Select **GitHub** and choose your repository.
7.  Configuration:
    -   **Base directory**: `client`
    -   **Build command**: `npm run build`
    -   **Publish directory**: `dist`
8.  Click **"Deploy"**.

## 5. Finalize Connection
1.  Once Netlify deploys, you will get a URL (e.g., `https://awesome-site-123.netlify.app`).
2.  Go back to **Render Dashboard** -> Your Service -> **Environment**.
3.  Update `CLIENT_URL` to your Netlify URL (no trailing slash). This secures your API to only allow requests from your frontend.
