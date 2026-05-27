# 🎯 SETUP INSTRUCTIONS (For Things I Can't Fix Automatically)

Hey there! I fixed lots of bugs in your code, but some things need YOU to do them because they need special accounts or passwords. Here's how to do them step-by-step, like I'm explaining to a 5-year-old! 👶

---

## 🔐 STEP 1: Fix the Secret Password (JWT_SECRET)

**What's wrong?** Your secret password is too simple and easy to guess. It's like using "12345" as your password!

**How to fix it:**
1. Open the file: `server/.env`
2. Find the line that says: `JWT_SECRET="dev-secret-key-change-in-production"`
3. Change it to something SUPER long and random, like: `JWT_SECRET="my-super-duper-secret-password-that-nobody-will-ever-guess-1234567890"`
4. Save the file!

**Why?** This keeps your app safe from bad people who want to break in.

---

## 🔑 STEP 2: Set Up Google Login (Optional but Cool!)

**What's wrong?** Google login won't work because you don't have the special codes from Google.

**How to fix it:**

### Part A: Get the Codes from Google
1. Go to this website: https://console.cloud.google.com/
2. Click "Create Project" (it's a big blue button)
3. Give your project a name, like "Mock Test App"
4. Click "Create"
5. Wait a little bit (like counting to 10)
6. Click the search box at the top and type "Google+ API"
7. Click on it and press "Enable"
8. Go back to the search box and type "Google Identity"
9. Click on "Google Identity Toolkit API" and press "Enable"
10. On the left side, click "Credentials"
11. Click "Create Credentials" at the top
12. Click "OAuth client ID"
13. Choose "Web application"
14. Where it says "Authorized JavaScript origins", type: `http://localhost:3000`
15. Where it says "Authorized redirect URIs", type: `http://localhost:3000`
16. Click "Create"
17. You'll see a popup with two codes - copy them both!

### Part B: Put the Codes in Your App
1. Open `server/.env`
2. Find the line: `GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID_HERE"`
3. Replace it with the first code you copied (the Client ID)
4. Add a new line: `GOOGLE_CLIENT_SECRET="your-second-code-here"`
5. Replace with the second code you copied (the Client Secret)
6. Save the file!

7. Open `client/.env.local` (create this file if it doesn't exist)
8. Add this line: `NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-first-code-here"`
9. Replace with the first code you copied (the Client ID)
10. Save the file!

**Why?** This lets people sign in with their Google account instead of typing a password.

---

## 📧 STEP 3: Set Up Email for Password Reset (Optional but Useful!)

**What's wrong?** When people forget their password, the reset link is only shown in the server logs, not sent to their email.

**How to fix it:**

### Option A: Use Gmail (Easiest)
1. Go to https://myaccount.google.com/security
2. Turn on "2-Step Verification" (it's safer!)
3. Go to https://myaccount.google.com/apppasswords
4. Create a new app password called "Mock Test App"
5. Copy the password it gives you
6. Open `server/.env`
7. Add these lines:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=the-password-you-just-copied
   EMAIL_FROM=your-email@gmail.com
   ```
8. Save the file!

### Option B: Use a Different Email Service
1. Sign up for a service like SendGrid, Mailgun, or Amazon SES
2. They'll give you special codes
3. Put those codes in your `.env` file like in Option A

**Why?** This lets people reset their password by email instead of seeing it in server logs.

---

## 🗄️ STEP 4: Move Your Database to a Safer Place (Important!)

**What's wrong?** Your database is in a public folder where anyone could find it!

**How to fix it:**
1. Right now your database is at: `C:/Users/Public/mock_test_app_dev.db`
2. Move it to a safer place, like: `C:/Users/YOUR_NAME/Documents/mock_test_app_dev.db`
3. Open `server/.env`
4. Find the line: `DATABASE_URL="file:C:/Users/Public/mock_test_app_dev.db"`
5. Change it to: `DATABASE_URL="file:C:/Users/YOUR_NAME/Documents/mock_test_app_dev.db"`
6. Save the file!

**Why?** This keeps your data safe from other people who use the computer.

---

## 🚀 STEP 5: Run the Database Update (Important!)

**What's wrong?** I changed the database from PostgreSQL to SQLite, so you need to update it!

**How to fix it:**
1. Open your terminal (the black box where you type commands)
2. Go to the server folder: `cd "c:/Users/siddh/OneDrive/Desktop/mock app/server"`
3. Type this command: `npx prisma generate`
4. Press Enter
5. Wait for it to finish
6. Type this command: `npx prisma db push`
7. Press Enter
8. Wait for it to finish

**Why?** This tells your database about the changes I made to the code.

---

## 🧪 STEP 6: Test Your App (Make Sure It Works!)

**How to test:**
1. Open your terminal
2. Go to the main folder: `cd "c:/Users/siddh/OneDrive/Desktop/mock app"`
3. Run the app: `run.bat` (or double-click the run.bat file)
4. Wait for both windows to open
5. Open your web browser
6. Go to: http://localhost:3000
7. Try to sign up for a new account
8. Try to log in
9. Try to take a test

**If something doesn't work:**
- Check the server window for error messages
- Make sure you followed all the steps above
- Make sure your `.env` files are saved correctly

---

## ✅ What I Fixed For You Automatically

I fixed these things so you don't have to worry about them:

1. ✅ Fixed database configuration (changed from PostgreSQL to SQLite)
2. ✅ Fixed Prisma client to not create too many connections
3. ✅ Added proper error handling (now errors are handled nicely)
4. ✅ Added a logging system (now errors are logged properly)
5. ✅ Fixed TypeScript type errors (code is safer now)
6. ✅ Added input validation (bad data can't break your app)
7. ✅ Added error handling for JSON parsing
8. ✅ Removed console.log statements (replaced with proper logging)
9. ✅ Fixed AuthContext types (frontend code is safer)
10. ✅ Added environment variable validation
11. ✅ Created example .env files (so you know what to fill in)
12. ✅ Updated all controllers with proper error handling

---

## 🎉 You're All Set!

After following these steps, your app should be much safer and work better! If you have any problems, check the error messages in the terminal windows - they'll tell you what's wrong.

Good luck! 🚀
