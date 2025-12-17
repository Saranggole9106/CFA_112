# Deployment Guide for ArtFolio

This project consists of two parts: a **Client** (Frontend) and a **Server** (Backend). To make it live, we recommend deploying the Client to **Netlify** and the Server to **Render** (free tier compatible).

## 1. Prerequisites
- A GitHub account.
- A [Netlify](https://www.netlify.com/) account.
- A [Render](https://render.com/) account.
- Your **MongoDB Connection String** (from MongoDB Atlas).

## 2. Prepare the Repository
✅ **Completed**: Your code is already pushed to GitHub with the Render configuration (`render.yaml`).

## 3. Deploy Server (Backend) to Render
1.  Log in to [Render Dashboard](https://dashboard.render.com/).
2.  Click **"New +"** -> **"Blueprint"**.
3.  Connect your repository: `Saranggole9106/MERN_STACK_112`.
4.  Render will automatically detect `render.yaml`.
5.  Click **"Apply"** or **"Create Service"**.
6.  Wait for the deployment to finish. **Copy the Service URL** (e.g., `https://artfolio-server-xxxx.onrender.com`).

**Note on File Uploads**: On Render's free tier, file uploads (images) are ephemeral and will disappear when the server restarts (which happens frequently). For a production app, you should integrate Cloudinary or AWS S3.

## 4. Deploy Client (Frontend) to Netlify
✅ **Completed**: The `client/netlify.toml` file has been updated with your Render Backend URL (`https://artfolio-server.onrender.com`).
The client has been deployed to Netlify.

## 5. Finalize Connection
✅ **Completed**: 
- **Frontend URL**: `https://artfolio-client-1765860529.netlify.app`
- **Backend URL**: `https://artfolio-server.onrender.com`

The application is now fully live and connected!

