# Step-by-Step Usage Instructions

## 🎯 Complete User Guide

---

## Part 1: Installation & First Launch

### Step 1: Install Node.js
1. Download Node.js from https://nodejs.org/ (LTS version recommended)
2. Install with default settings
3. Verify installation: Open command prompt and type `node --version`

### Step 2: Install Application Dependencies
1. Navigate to the project folder
2. Open command prompt/terminal in that folder
3. Run: `npm install`
4. Wait for installation to complete (may take 2-3 minutes)

### Step 3: Launch the Application
**Option A - Command Line:**
```cmd
npm start
```

**Option B - Quick Start (Windows):**
- Double-click `start.bat`

**Option C - Quick Start (Linux/Mac):**
```bash
./start.sh
```

---

## Part 2: Using the Application

### 🔐 Login Screen

**What you'll see:**
- Clean login form with purple gradient background
- Username field
- Password field  
- Role dropdown (Admin/User)
- Login button

**How to login:**
1. Enter username: `admin` (for admin access) or `user` (for regular access)
2. Enter password: `admin123` or `user123`
3. Select role from dropdown: **Admin** or **User**
4. Click "Login" button

**Default Credentials:**
- **Admin**: admin/admin123/Admin
- **User**: user/user123/User

---

### 📊 Dashboard

**What you'll see:**
- Welcome message with your username and role
- Statistics card showing "Serials Generated This Month"
- Four colorful action buttons:
  - 🟢 Generate Serial Numbers (green gradient)
  - 🟡 View Monthly Reports (yellow-pink gradient)
  - 🔵 Analytics (blue-purple gradient)
  - 🔴 Admin Panel (orange-red gradient) - **Admin only**

**Navigation:**
- Click any action button to go to that page
- Click "Logout" to return to login screen

---

### ➕ Generate Serial Numbers

**Form Fields:**

1. **Model Number** (Required)
   - Dropdown with options: Model-A, Model-B, Model-C
   - Select the product model

2. **Quantity** (Required)
   - Number input (1-1000)
   - Enter how many serial numbers you want to generate

3. **Date of Manufacturing** (Required)
   - Date picker
   - Select or enter the manufacturing date

4. **Brazer Name** (Required)
   - Text input
   - Enter the name of the brazer

5. **Leak Testing Operator Code** (Required)
   - Text input
   - Enter the operator code

6. **Custom Codes (Optional)**
   - Code A, B, C, D text inputs
   - Optional internal tracking codes

**How to Generate:**
1. Fill in all required fields (marked with *)
2. Optional: Fill in custom codes A, B, C, D
3. Click "🔢 Generate Serial Numbers" button
4. Success message will appear
5. Generated serial numbers will be displayed in a list
6. Each serial is in format: XXXXX-XXXXX (e.g., AB12C-3D4E5)

**Example:**
```
Model: Model-A
Quantity: 5
Date: 2025-10-28
Brazer: John Doe
Operator: OP-001
Code A: LOT-123
```
Result: 5 unique serial numbers like:
- A1B2C-D3E4F
- G5H6I-J7K8L
- M9N0P-Q1R2S
- T3U4V-W5X6Y
- Z7A8B-C9D0E

---

### 📋 Monthly Reports

**Filter Options:**
- **Month Filter**: Select month and year
- **Filter Button**: Click to load data for selected month

**Table Columns:**
- ID
- Date (Manufacturing date)
- Model (Model-A, Model-B, Model-C)
- Qty (Quantity)
- Brazer (Brazer name)
- Operator (Operator code)
- Serial Number
- User (visible to Admin only)

**Export Options:**
1. **Export to Excel**
   - Click "📊 Export to Excel" button
   - File saves to Downloads folder
   - Filename: `serial_report_YYYY-MM.xlsx`

2. **Export to PDF**
   - Click "📄 Export to PDF" button
   - File saves to Downloads folder
   - Filename: `serial_report_YYYY-MM.pdf`

**Usage Example:**
1. Select month: October 2025
2. Click "🔍 Filter"
3. View all serials generated in October
4. Click "Export to Excel" to save report
5. Open file from Downloads folder

---

### 📈 Analytics

**Three Charts Available:**

1. **Serials per Model (Bar Chart)**
   - Shows count of serials for each model
   - Color-coded bars for Model-A, Model-B, Model-C
   - Helps track which models are most manufactured

2. **Serials per Operator (Pie Chart)**
   - Shows distribution by operator code
   - Each operator has different color
   - Useful for tracking operator productivity

3. **Total per Month (Line Chart)**
   - Shows last 12 months of serial generation
   - Line graph showing trends over time
   - Helps identify production patterns

**How it Works:**
- Charts automatically load when page opens
- **User role**: See only your data
- **Admin role**: See all users' data
- Charts update in real-time based on database

---

### 👤 Admin Panel (Admin Only)

**Features:**

1. **View All Data**
   - Table showing all serial numbers from all users
   - Includes user column showing who generated each serial

2. **Edit Entries**
   - Click "✏️ Edit" button on any row
   - Modal popup with all fields
   - Modify any field except serial number
   - Click "Save Changes" to update

3. **Delete Entries**
   - Click "🗑️ Delete" button on any row
   - Confirmation popup appears
   - Click OK to permanently delete
   - Action cannot be undone

4. **Export All Data**
   - **Export All to Excel**: Download complete database
   - **Export All to PDF**: Generate full report
   - Filename: `all_serials_YYYY-MM-DD`

5. **Refresh Data**
   - Click "🔄 Refresh" button
   - Reloads table with latest data

**Edit Example:**
1. Find serial number entry
2. Click "✏️ Edit"
3. Change quantity from 10 to 15
4. Change brazer name
5. Click "Save Changes"
6. Table updates automatically

**Delete Example:**
1. Find incorrect entry
2. Click "🗑️ Delete"
3. Confirm deletion
4. Entry removed from database

---

## Part 3: Common Tasks

### Task 1: Generate 100 Serial Numbers for Model-A
1. Login as user or admin
2. Click "Generate Serial Numbers"
3. Select Model: Model-A
4. Enter Quantity: 100
5. Select today's date
6. Enter brazer and operator
7. Click Generate
8. View 100 unique serials in the list

### Task 2: Export Monthly Report
1. Click "View Monthly Reports"
2. Select current month
3. Click "Filter"
4. Click "Export to Excel"
5. Check Downloads folder
6. Open Excel file to view report

### Task 3: View Analytics
1. Click "Analytics" from dashboard
2. Scroll through three charts
3. Analyze production trends
4. Identify top models and operators

### Task 4: Admin - Review and Clean Data
1. Login as admin
2. Click "Admin Panel"
3. Review all entries
4. Edit any incorrect entries
5. Delete duplicate or test entries
6. Export final clean report

---

## Part 4: Tips & Best Practices

### ✅ Do's:
- Generate serials in reasonable batches (1-500 at a time)
- Export monthly reports regularly for backup
- Use descriptive operator codes (e.g., OP-001, OP-002)
- Fill in optional codes for better tracking
- Review analytics weekly to monitor trends
- Admins should audit data monthly

### ❌ Don'ts:
- Don't generate more than 1000 serials at once
- Don't delete entries unless absolutely necessary
- Don't share admin credentials
- Don't modify serial numbers (not editable for data integrity)
- Don't close app while generating large batches

### 💡 Pro Tips:
1. **Naming Convention**: Use consistent operator codes
2. **Date Format**: Use actual manufacturing dates, not generation dates
3. **Backup**: Export monthly reports as backup
4. **Analytics**: Check trends before planning production
5. **Admin Access**: Limit admin access to managers only

---

## Part 5: Troubleshooting

### Problem: Can't login
**Solution**: 
- Check username/password spelling
- Ensure role is selected from dropdown
- Try default credentials: admin/admin123

### Problem: Serial numbers not generating
**Solution**:
- Fill all required fields (marked with *)
- Check quantity is between 1-1000
- Ensure date is selected

### Problem: Export not working
**Solution**:
- Check Downloads folder permissions
- Ensure disk space available
- Try exporting smaller dataset

### Problem: Charts not showing
**Solution**:
- Ensure internet connection (Chart.js loads from CDN)
- Generate some serials first (charts need data)
- Refresh page

### Problem: Database error
**Solution**:
- Close all app instances
- Delete `serialnumbers.db` file
- Restart app (will recreate database with default users)

---

## Part 6: Building Windows Installer

For distributing to other computers:

```bash
npm run build
```

**Output:**
- Creates `dist/` folder
- Contains Windows installer (.exe)
- Installer size: ~150-200 MB
- Users can install without Node.js

**Installation on other PCs:**
1. Copy installer from `dist/` folder
2. Run installer on target PC
3. Follow installation wizard
4. Launch from Start Menu or Desktop shortcut

---

## 📞 Support & Help

**For Technical Issues:**
- Check README.md for detailed documentation
- Review PROJECT_SUMMARY.md for architecture details
- Check console for error messages (F12 in app)

**For Usage Questions:**
- Refer to this guide
- Check QUICK_START.md for basics

---

## 🎉 You're Ready!

You now have complete knowledge to:
- ✅ Install and run the application
- ✅ Generate serial numbers
- ✅ Create monthly reports
- ✅ Analyze production data
- ✅ Manage data as admin
- ✅ Export and backup data

**Happy Serial Number Generating!** 🚀
