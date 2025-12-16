# 🔑 Admin Credentials

## Fixed Admin Account

Your ArtFolio platform now has a **pre-configured admin account** with fixed credentials:

### **Login Credentials:**

```
📧 Email:    admin@gmail.com
🔑 Password: 890098
👤 Username: admin
🛡️  Role:     admin
```

---

## How to Login

1. **Go to Login Page**
   - Open http://localhost:5173/login

2. **Enter Credentials**
   - Email: `admin@gmail.com`
   - Password: `890098`

3. **Click Login**
   - You'll be logged in as admin

4. **Access Admin Panel**
   - Navigate to http://localhost:5173/admin
   - Or click on your profile/username in the navbar

---

## Admin Panel Features

Once logged in, you can access:

### **Dashboard Tabs:**
- **Overview** - Platform statistics and metrics
- **Artworks** - View, flag, and delete all artworks
- **Users** - View all users, ban/unban accounts
- **Sales** - Track all platform transactions
- **Flagged** - Review and moderate flagged content

### **Admin Capabilities:**
- ✅ View platform-wide statistics
- ✅ Moderate all content (artworks and comments)
- ✅ Delete inappropriate artworks
- ✅ Delete inappropriate comments
- ✅ Flag/unflag artworks for review
- ✅ Ban/unban users
- ✅ View all sales transactions
- ✅ Monitor platform health

---

## Re-creating Admin Account

If you ever need to recreate the admin account:

### **Method 1: Using npm script**
```bash
cd server
npm run seed-admin
```

### **Method 2: Using node directly**
```bash
cd server
node seedAdmin.js
```

The script will:
- Check if admin account exists
- Create it if it doesn't exist
- Show the credentials

---

## Security Notes

### **For Development:**
These credentials are fine for local development and testing.

### **For Production:**
⚠️ **IMPORTANT**: Before deploying to production:
1. Change the admin password to something more secure
2. Use environment variables for admin credentials
3. Consider implementing 2FA for admin accounts
4. Remove the seed script or protect it

---

## Testing Admin Features

### **Quick Test Checklist:**

1. **Login as Admin**
   - [ ] Use credentials: admin@gmail.com / 890098
   - [ ] Successfully logged in

2. **Access Admin Panel**
   - [ ] Navigate to /admin
   - [ ] See dashboard with statistics

3. **View Statistics**
   - [ ] Total users count
   - [ ] Total artworks count
   - [ ] Sales volume
   - [ ] Flagged items

4. **Moderate Artworks**
   - [ ] Go to "Artworks" tab
   - [ ] Flag an artwork
   - [ ] Delete an artwork

5. **Manage Users**
   - [ ] Go to "Users" tab
   - [ ] View all users
   - [ ] Ban a user
   - [ ] Unban a user

6. **Track Sales**
   - [ ] Go to "Sales" tab
   - [ ] View transaction history

7. **Review Flagged Content**
   - [ ] Go to "Flagged" tab
   - [ ] See flagged artworks
   - [ ] Unflag or delete items

---

## Troubleshooting

### "Invalid credentials" error
- Make sure you're using: `admin@gmail.com` (not .com)
- Password is exactly: `890098`
- Check caps lock is off

### Admin panel not accessible
- Make sure you're logged in as admin
- Check the URL is exactly: http://localhost:5173/admin
- Verify the role is "admin" in the database

### Need to reset admin account
Run the seed script again:
```bash
cd server
npm run seed-admin
```

---

## Additional Admin Accounts

If you need to create more admin accounts:

### **Option 1: Via Registration**
1. Go to http://localhost:5173/register
2. Fill in details
3. Select "Admin" role
4. Register

### **Option 2: Via Database**
Update an existing user's role to "admin" in MongoDB

### **Option 3: Via Seed Script**
Modify `seedAdmin.js` to create additional admins

---

**Your admin account is ready to use! 🎉**

Login at: http://localhost:5173/login
