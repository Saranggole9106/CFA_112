# CFA Project Submission: ArtFolio

> **Note:** This document provides the text content for your 2-page PDF submission. Please copy the sections below into a Word Document or Google Doc, adding screenshots where indicated, and export as a PDF.

---

## Page 1: Concept Overview

### Problem Statement
In the current digital landscape, independent artists often struggle to find a creating a dedicated space that effectively combines portfolio management, community engagement, and monetization. General-purpose social media platforms lack specialized tools for managing commissions, tracking print sales, and maintaining a professional portfolio simultaneously. Furthermore, art enthusiasts and potential buyers often face fragmented experiences when trying to discover new artists, purchase prints, or request custom artwork (commissions) in a secure and structured environment. There is a need for a unified platform that streamlines the connection between creators and admirers, facilitating both social interaction and commerce.

### Proposed Solution
**ArtFolio** is a full-stack web application designed to bridge the gap between artists and art lovers. It serves as a comprehensive ecosystem where:

1.  **Artists** can build professional portfolios, upload and categorize artworks, and monetize their creativity through direct commissioned work and print sales. The platform provides tools to manage commission requests (accept/reject/negotiate) and track earnings via a dedicated dashboard.
2.  **Visitors** can discover art through a dynamic gallery, engage with the community by liking and commenting on artworks, and seamlessly purchase prints or request custom commissions directly from artists.
3.  **Admins** ensure a safe environment through content moderation (flagging/deleting inappropriate content) and user management, while monitoring platform growth through advanced analytics.

**Technical Implementation:**
The solution is built using the **MERN Stack** (MongoDB, Express.js, React, Node.js):
*   **Frontend:** React with Vite for a fast, responsive user interface using modern glassmorphism design principles.
*   **Backend:** Node.js and Express.js REST API handling complex logic for authentication, order processing, and commission workflows.
*   **Database:** MongoDB for flexible storage of user profiles, artworks, commissions, and transaction history.
*   **Key Features:** Role-based authentication (RBAC), real-time status tracking for commissions, inter-user social interactions, and a robust admin panel for platform oversight.

---

## Page 2: Application Visuals

**Instructions for the User:**
*   Layout this page with **two columns**.
*   Insert **4-5 screenshots** of your application.
*   Add a brief caption below each screenshot.

### Recommended Screenshots to Capture:

1.  **Landing Page / Explore Gallery**
    *   *Caption:* The main gallery view allowing visitors to browse and filter artworks by category.
2.  **Artwork Detail View**
    *   *Caption:* Detailed view of an interaction page showing "Buy Now" and "Request Commission" options along with comments.
3.  **Artist Dashboard**
    *   *Caption:* The artist's private dashboard for managing uploaded artworks and tracking sales performance.
4.  **Commission Workflow**
    *   *Caption:* The commission management interface showing status tracking (Pending → Accepted → Completed).
5.  **Admin Analytics Panel**
    *   *Caption:* The admin dashboard displaying platform statistics, user management, and content moderation tools.
