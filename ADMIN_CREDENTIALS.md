# Admin Credentials

## Default Admin Credentials

After deployment, the admin user is automatically created with these credentials:

- **Email:** `admin@gdcnagrota.edu.in`
- **Password:** `admin123`

## How to Change Admin Credentials

### Option 1: Change via Environment Variables (Recommended)

1. Go to Render dashboard
2. Navigate to your backend service
3. Go to "Environment" tab
4. Update these variables:
   - `ADMIN_EMAIL` - New admin email
   - `ADMIN_PASSWORD` - New admin password
5. Save changes (service will auto-redeploy)

**Note:** Changing these will only affect NEW admin creation. To change existing admin password, use Option 2.

### Option 2: Change Password After Login

1. Login to admin dashboard
2. Navigate to profile settings (if available)
3. Change password through UI

### Option 3: Update in Database

1. Connect to MongoDB
2. Find admin user:
   ```javascript
   db.users.findOne({ role: "admin" })
   ```
3. Update password (will be hashed automatically):
   ```javascript
   // Note: Password will be hashed by bcrypt on save
   // You may need to use a script to properly hash it
   ```

## Security Best Practices

1. **Change Default Password Immediately:** The default password `admin123` is insecure
2. **Use Strong Password:** Minimum 12 characters, mix of letters, numbers, symbols
3. **Don't Share Credentials:** Each admin should have their own account
4. **Regular Password Updates:** Change password every 90 days
5. **Enable 2FA:** If available in future updates

## Creating Additional Admin Users

Currently, only one admin user is automatically created. To create additional admins:

1. Login as existing admin
2. Use admin dashboard to create new admin users (if feature exists)
3. Or manually create in MongoDB with `role: "admin"` and `status: "approved"`

## Troubleshooting

### Can't Login as Admin

1. **Check Environment Variables:**
   - Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in Render
   - Check server logs for admin creation messages

2. **Check Database:**
   - Verify admin user exists in MongoDB
   - Check that `role: "admin"` and `status: "approved"`

3. **Check Server Logs:**
   - Look for "Admin user created successfully" message
   - Check for any errors during admin creation

4. **Reset Admin:**
   - Delete admin user from database
   - Restart server (admin will be recreated)
   - Or manually run seed script: `npm run seed`

### Admin User Not Created

1. Check server startup logs for errors
2. Verify MongoDB connection is working
3. Check that environment variables are set
4. Manually run seed script in Render shell:
   ```bash
   cd backend
   npm run seed
   ```

## Admin Login Endpoint

- **URL:** `/api/auth/login/admin`
- **Method:** POST
- **Body:**
  ```json
  {
    "username": "admin@gdcnagrota.edu.in",
    "password": "admin123"
  }
  ```

**Note:** You can use either email or name as username.

