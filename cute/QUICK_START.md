# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies
Open a command prompt/terminal in the project folder and run:

**Windows:**
```cmd
npm install
```

**Linux/Mac:**
```bash
npm install
```

### Step 2: Run the Application

**Windows:**
```cmd
npm start
```
Or double-click `start.bat`

**Linux/Mac:**
```bash
npm start
```
Or run `./start.sh`

### Step 3: Login

Use the default credentials:
- **Admin**: username: `admin`, password: `admin123`, role: Admin
- **User**: username: `user`, password: `user123`, role: User

---

## 📚 Features Guide

### For Regular Users:

1. **Generate Serial Numbers**
   - Click "Generate Serial Numbers" on dashboard
   - Select model (Model-A, Model-B, or Model-C)
   - Enter quantity (1-1000)
   - Fill in manufacturing details
   - Click "Generate" to create unique serial numbers

2. **View Reports**
   - Click "View Monthly Reports"
   - Select month and year
   - Export to Excel or PDF

3. **Analytics**
   - View charts showing:
     - Serials by Model
     - Serials by Operator
     - Monthly trends

### For Administrators:

All user features PLUS:

4. **Admin Panel**
   - View all users' data
   - Edit serial number entries
   - Delete entries
   - Export company-wide reports

---

## 🛠️ Building for Windows

To create a standalone Windows installer:

```bash
npm run build
```

The installer will be created in the `dist/` folder.

---

## 📝 Troubleshooting

**Issue**: Application won't start
- **Solution**: Delete `node_modules` folder and run `npm install` again

**Issue**: Database errors
- **Solution**: Delete `serialnumbers.db` file and restart the application

**Issue**: Export not working
- **Solution**: Check that you have write permissions to your Downloads folder

---

## 🔐 Security Note

This is a demo application. For production use:
- Change default passwords
- Implement password hashing
- Add proper security measures

---

## 📞 Support

For issues or questions, check the README.md file for detailed documentation.

---

**Happy Serial Number Generating! 🎉**
