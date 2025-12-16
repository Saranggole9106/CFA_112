# Testing Guide - ArtFolio Admin Features

## 🚀 Quick Start

Your project is now running with full admin functionality!

**Frontend**: http://localhost:5173  
**Backend**: http://localhost:5001

---

## 👤 Creating an Admin Account

### Option 1: Register as Admin (Recommended for Testing)
1. Go to http://localhost:5173/register
2. Fill in the registration form:
   - Username: `admin` (or any name)
   - Email: `admin@artfolio.com` (or any email)
   - Password: `admin123` (or any password)
   - **Role**: Select **"Admin"** from dropdown
3. Click Register
4. You'll be automatically logged in

### Option 2: Use API to Create Admin
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@artfolio.com",
    "password": "admin123",
    "role": "admin"
  }'
```

---

## 🎯 Testing Admin Features

### 1. Access Admin Dashboard
1. Login with admin credentials
2. Navigate to: http://localhost:5173/admin
3. You should see the admin panel with statistics

### 2. View Platform Statistics
On the admin dashboard, you'll see:
- **Total Users** (Artists + Visitors breakdown)
- **Total Artworks**
- **Flagged Items** count
- **Total Sales Volume** and order count

### 3. Manage Artworks
1. Click the **"Artworks"** tab
2. You'll see a table with all artworks on the platform
3. For each artwork you can:
   - **Flag** - Mark as inappropriate for review
   - **Delete** - Permanently remove the artwork

**Test it:**
- Flag an artwork → Check "Flagged" tab to see it appear
- Delete an artwork → It should disappear from the list

### 4. Manage Users
1. Click the **"Users"** tab
2. View all registered users with their:
   - Username
   - Email
   - Role (Artist/Visitor/Admin)
   - Status (Active/Banned)
3. **Ban/Unban users** (except other admins)

**Test it:**
- Ban a user → Status changes to "Banned"
- Unban the user → Status returns to "Active"

### 5. View Sales Analytics
1. Click the **"Sales"** tab
2. See all platform transactions with:
   - Date of purchase
   - Artwork title
   - Artist name
   - Buyer name
   - Amount paid

### 6. Review Flagged Content
1. Click the **"Flagged"** tab
2. See all artworks marked as flagged
3. For each flagged item you can:
   - **Unflag** - Remove the flag
   - **Delete** - Remove the artwork

---

## 🧪 Complete Testing Flow

### Step 1: Create Test Data
1. **Create an Artist account**:
   - Register with role "Artist"
   - Upload 2-3 artworks with prices

2. **Create a Visitor account**:
   - Register with role "Visitor"
   - Browse artworks
   - Like some artworks
   - Leave comments
   - Purchase an artwork (Buy Now)

3. **Create an Admin account**:
   - Register with role "Admin"

### Step 2: Test Admin Moderation
1. **Login as Admin**
2. Go to `/admin`
3. **Check Statistics**:
   - Should show correct user count
   - Should show artwork count
   - Should show sales volume

4. **Test Artwork Moderation**:
   - Go to "Artworks" tab
   - Flag one artwork
   - Go to "Flagged" tab → Should appear there
   - Delete one artwork → Should be removed

5. **Test User Management**:
   - Go to "Users" tab
   - Ban the visitor account
   - Verify the status changes

6. **Test Sales Tracking**:
   - Go to "Sales" tab
   - Should see the purchase made by visitor
   - Verify all details are correct

---

## 🔑 API Endpoints Reference

### Admin Routes (Require Admin Token)

```javascript
// Get platform statistics
GET /api/admin/stats

// Get all users
GET /api/admin/users

// Get all artworks
GET /api/admin/artworks

// Get all sales
GET /api/admin/sales

// Get flagged artworks
GET /api/admin/flagged

// Delete artwork
DELETE /api/admin/artworks/:id

// Delete comment
DELETE /api/admin/artworks/:artworkId/comments/:commentId

// Ban/Unban user
PATCH /api/admin/users/:id/ban
Body: { "banned": true/false }

// Flag/Unflag artwork
PATCH /api/admin/artworks/:id/flag
Body: { "flagged": true/false }
```

### Testing with cURL

**Get Statistics:**
```bash
curl http://localhost:5001/api/admin/stats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Ban a User:**
```bash
curl -X PATCH http://localhost:5001/api/admin/users/USER_ID/ban \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"banned": true}'
```

**Delete Artwork:**
```bash
curl -X DELETE http://localhost:5001/api/admin/artworks/ARTWORK_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## 🎨 User Flow Testing

### Artist Flow
1. Register as artist
2. Upload artwork (with title, description, price, tags)
3. View dashboard → See uploaded artworks
4. Check sales → See purchases made by visitors

### Visitor Flow
1. Register as visitor
2. Browse gallery (`/explore`)
3. Click on artwork → View details
4. Like the artwork
5. Leave a comment
6. Click "Buy Now" → Purchase the artwork
7. View profile → See purchase history

### Admin Flow
1. Register/Login as admin
2. Go to `/admin`
3. View statistics
4. Moderate content (flag/delete artworks)
5. Manage users (ban/unban)
6. Track sales across platform

---

## ✅ Features Checklist

Test each feature to ensure everything works:

- [ ] Admin can view platform statistics
- [ ] Admin can see all users
- [ ] Admin can ban/unban users
- [ ] Admin can view all artworks
- [ ] Admin can flag artworks
- [ ] Admin can delete artworks
- [ ] Admin can view flagged content queue
- [ ] Admin can view all sales
- [ ] Statistics update in real-time
- [ ] Deleted artworks are removed from database
- [ ] Banned users status is reflected
- [ ] Flagged items appear in flagged tab

---

## 🐛 Troubleshooting

### "Access Denied" Error
- Make sure you're logged in as admin
- Check that your token is valid
- Verify the role is set to "admin" in the database

### Statistics Not Showing
- Ensure you have some data in the database (users, artworks, orders)
- Check browser console for errors
- Verify backend is running on port 5001

### Can't Delete Artwork
- Confirm you're logged in as admin
- Check that the artwork ID is valid
- Look at server logs for error messages

### Server Not Starting
- Make sure MongoDB is running
- Check `.env` file has correct `MONGO_URI`
- Verify port 5001 is not in use

---

## 📝 Notes

- **Mock Payments**: The e-commerce system simulates payments. No real payment gateway is integrated.
- **Image Uploads**: Images are stored in `/server/uploads/` directory
- **JWT Tokens**: Tokens expire after 1 day
- **Admin Protection**: Admin routes are protected and require admin role

---

## 🎉 Success Criteria

Your admin panel is working correctly if:
1. ✅ Statistics display real data from database
2. ✅ You can view and manage all users
3. ✅ You can flag and delete artworks
4. ✅ Flagged content appears in dedicated tab
5. ✅ Sales data shows all platform transactions
6. ✅ User ban/unban functionality works
7. ✅ UI is responsive and visually appealing

---

**Happy Testing! 🚀**
