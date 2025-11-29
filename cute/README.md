# Serial Number Generation Software

A Windows desktop application built with Electron.js, Node.js, and SQLite for generating and managing serial numbers with role-based access control.

## 🚀 Features

- **Role-based Authentication**: Admin and User roles with different permissions
- **Serial Number Generation**: Auto-generate unique 10-digit alphanumeric serial numbers (format: XXXXX-XXXXX)
- **Dashboard**: View monthly statistics and quick action buttons
- **Monthly Reports**: Filter, view, and export reports by month
- **Analytics**: Visual charts showing serials by model, operator, and month
- **Admin Panel**: Manage all users' data, edit/delete entries
- **Export Functionality**: Export reports to Excel (.xlsx) and PDF formats

## 📋 Requirements

- Node.js 16.x or higher
- npm 8.x or higher
- Windows OS (for building Windows executable)

## 🛠️ Installation

1. **Clone or download this project**

2. **Install dependencies**:
   ```bash
   npm install
   ```

## 🎯 Running the Application

### Development Mode (with DevTools)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## 📦 Building for Windows

To create a Windows installer (.exe):

```bash
npm run build
```

The installer will be created in the `dist` folder.

## 🔐 Default Login Credentials

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: Admin

### User Account
- **Username**: `user`
- **Password**: `user123`
- **Role**: User

## 📊 Database Structure

### Users Table
- `id` - Primary key
- `username` - Unique username
- `password` - User password (in production, use hashed passwords)
- `role` - User role (Admin/User)
- `createdAt` - Account creation timestamp

### Serials Table
- `id` - Primary key
- `modelNumber` - Product model (Model-A, Model-B, Model-C)
- `quantity` - Number of serials generated
- `dateOfManufacturing` - Manufacturing date
- `brazerName` - Name of the brazer
- `operatorCode` - Leak testing operator code
- `codeA`, `codeB`, `codeC`, `codeD` - Custom internal codes
- `serialNumber` - Unique generated serial number
- `createdAt` - Generation timestamp
- `userId` - Foreign key to users table

## 🎨 User Interface

### Login Screen
- Username, password, and role selection
- Authentication against SQLite database

### Dashboard
- Monthly serial count statistics
- Quick action buttons for Generate, Reports, Analytics, and Admin Panel (Admin only)

### Generate Serial Numbers
- Model selection dropdown
- Quantity input (1-1000)
- Date of manufacturing picker
- Brazer name and operator code fields
- Optional custom internal codes (A, B, C, D)
- Real-time serial number generation

### Monthly Reports
- Month/year filter
- Tabular display of all serial data
- Export to Excel and PDF

### Analytics
- Bar chart: Serials per Model
- Pie chart: Serials per Operator
- Line chart: Total serials per month (last 12 months)

### Admin Panel (Admin Only)
- View all users' serial numbers
- Edit serial number entries
- Delete serial number entries
- Export company-wide reports

## 📁 Project Structure

```
serial-number-generation-software/
├── main.js                 # Main Electron process
├── database.js             # SQLite database manager
├── package.json            # Project dependencies
├── pages/                  # HTML pages
│   ├── login.html
│   ├── dashboard.html
│   ├── generate.html
│   ├── reports.html
│   ├── analytics.html
│   └── admin.html
├── styles/                 # CSS stylesheets
│   └── main.css
└── serialnumbers.db        # SQLite database (auto-created)
```

## 🔧 Technologies Used

- **Electron.js** - Desktop application framework
- **Node.js** - JavaScript runtime
- **SQLite** (better-sqlite3) - Database
- **Chart.js** - Data visualization
- **XLSX** - Excel export
- **PDFKit** - PDF export
- **HTML/CSS/JavaScript** - UI

## ⚡ Key Functionalities

### Serial Number Generation
- Generates unique 10-digit alphanumeric codes
- Format: XXXXX-XXXXX
- Ensures uniqueness through database constraints
- Stores all metadata with each serial

### Reports & Analytics
- Month-wise filtering
- Real-time statistics
- Visual analytics with Chart.js
- Export capabilities (Excel/PDF)

### Admin Features
- View all users' data
- Edit serial entries
- Delete serial entries
- Company-wide exports

## 🛡️ Security Notes

**Important**: This is a demo application. For production use:

1. Implement password hashing (bcrypt, argon2)
2. Add input validation and sanitization
3. Implement proper session management
4. Add database backup mechanisms
5. Implement audit logging
6. Add two-factor authentication
7. Use environment variables for sensitive data

## 📝 Usage Tips

1. **Generating Serials**: Users can generate between 1-1000 serial numbers at once
2. **Monthly Reports**: Use the month picker to filter data by specific months
3. **Analytics**: Charts automatically update based on your role (User sees only their data, Admin sees all)
4. **Export Files**: Exported files are saved to your Downloads folder
5. **Admin Panel**: Only accessible to users with Admin role

## 🐛 Troubleshooting

### Database locked error
- Close all instances of the application
- Delete `serialnumbers.db` and restart (will recreate with default users)

### Charts not displaying
- Ensure internet connection (Chart.js loads from CDN)
- Check browser console for errors

### Build errors
- Ensure all dependencies are installed: `npm install`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## 📄 License

MIT License - Feel free to use and modify for your needs.

## 👨‍💻 Development

To contribute or modify:

1. Fork the repository
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

**Created with ❤️ using Electron.js**
