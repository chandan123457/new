# Developer Technical Reference

## 🔧 Technical Documentation for Developers

---

## Architecture Overview

### Application Type: Electron Desktop App
- **Main Process**: Node.js backend (main.js)
- **Renderer Process**: HTML/CSS/JS frontend (pages/*.html)
- **Database**: SQLite (better-sqlite3)
- **Communication**: IPC (Inter-Process Communication)

---

## File-by-File Technical Breakdown

### 1. package.json
**Purpose**: Project configuration and dependencies

**Key Scripts:**
- `start`: Launch app in production mode
- `dev`: Launch with DevTools enabled
- `build`: Create Windows installer using electron-builder

**Dependencies:**
```json
{
  "electron": "^27.0.0",           // Desktop framework
  "better-sqlite3": "^11.8.1",     // SQLite bindings
  "chart.js": "^4.4.0",            // Charts
  "xlsx": "^0.18.5",               // Excel export
  "pdfkit": "^0.13.0"              // PDF generation
}
```

---

### 2. main.js (Main Process)
**Purpose**: Electron main process, window management, IPC handlers

**Key Components:**

#### Window Creation
```javascript
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  mainWindow.loadFile('pages/login.html');
}
```

#### IPC Handlers
- `login`: Authenticate user
- `get-monthly-count`: Get current month serial count
- `generate-serial`: Create new serial numbers
- `get-serials`: Retrieve serials (filtered by user)
- `get-serials-by-month`: Filter by month
- `get-analytics`: Aggregate data for charts
- `delete-serial`: Remove entry (admin)
- `update-serial`: Modify entry (admin)
- `export-excel`: Export to XLSX
- `export-pdf`: Export to PDF

#### Serial Number Generation
```javascript
function generateSerialNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let serial = '';
  for (let i = 0; i < 10; i++) {
    if (i === 5) serial += '-';
    serial += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return serial;
}
```
- Format: XXXXX-XXXXX
- Charset: A-Z, 0-9
- Length: 11 characters (including hyphen)
- Uniqueness: Enforced by database UNIQUE constraint

---

### 3. database.js (Database Manager)
**Purpose**: SQLite database operations

**Class: DatabaseManager**

#### Constructor
```javascript
constructor() {
  const dbPath = path.join(__dirname, 'serialnumbers.db');
  this.db = new Database(dbPath);
  this.initialize();
}
```

#### Key Methods

**User Operations:**
- `authenticateUser(username, password, role)`: Login validation
- `getAllUsers()`: Retrieve all users (admin)

**Serial Operations:**
- `insertSerial(data)`: Create new serial entry
- `getSerialsForUser(userId)`: Get user's serials
- `getAllSerials()`: Get all serials (admin)
- `getMonthlyCount(userId)`: Count this month's serials
- `getSerialsByMonth(month, userId)`: Filter by month
- `deleteSerial(id)`: Remove entry
- `updateSerial(id, data)`: Modify entry

**Analytics Operations:**
- `getAnalyticsByModel(userId)`: Group by model
- `getAnalyticsByOperator(userId)`: Group by operator
- `getAnalyticsByMonth(userId)`: Group by month (last 12)

#### SQL Queries Examples

**Monthly Count:**
```sql
SELECT COUNT(*) as count 
FROM serials 
WHERE strftime('%Y-%m', createdAt) = ? 
AND userId = ?
```

**Analytics by Model:**
```sql
SELECT modelNumber, COUNT(*) as count 
FROM serials 
WHERE userId = ? 
GROUP BY modelNumber
```

---

### 4. pages/login.html
**Purpose**: Authentication UI

**Key Features:**
- Username/password/role inputs
- Client-side validation
- IPC call to authenticate
- localStorage for session management

**IPC Call:**
```javascript
const result = await ipcRenderer.invoke('login', { 
  username, 
  password, 
  role 
});

if (result.success) {
  localStorage.setItem('user', JSON.stringify(result.user));
  window.location.href = 'dashboard.html';
}
```

---

### 5. pages/dashboard.html
**Purpose**: Main dashboard and navigation

**Data Loading:**
```javascript
const result = await ipcRenderer.invoke('get-monthly-count', 
  currentUser.role === 'Admin' ? null : currentUser.id
);
```
- If Admin: Pass null to get all serials count
- If User: Pass userId to get only their count

**Role-Based Display:**
```javascript
if (currentUser.role === 'Admin') {
  document.getElementById('adminBtn').style.display = 'block';
}
```

---

### 6. pages/generate.html
**Purpose**: Serial number generation form

**Form Validation:**
- Model: Required, dropdown
- Quantity: Required, 1-1000
- Date: Required, date picker
- Brazer: Required, text
- Operator: Required, text
- Codes A-D: Optional, text

**Generation Process:**
```javascript
const formData = {
  modelNumber: ...,
  quantity: parseInt(...),
  dateOfManufacturing: ...,
  brazerName: ...,
  operatorCode: ...,
  codeA: ... || '',
  codeB: ... || '',
  codeC: ... || '',
  codeD: ... || '',
  userId: currentUser.id
};

const result = await ipcRenderer.invoke('generate-serial', formData);
```

**Backend Logic:**
```javascript
// main.js
for (let i = 0; i < data.quantity; i++) {
  let serialNumber;
  let unique = false;
  
  while (!unique) {
    serialNumber = generateSerialNumber();
    try {
      db.insertSerial({ ...data, serialNumber });
      unique = true;
    } catch (err) {
      // If UNIQUE constraint fails, retry
    }
  }
}
```

---

### 7. pages/reports.html
**Purpose**: Monthly reports with export

**Filter Implementation:**
```javascript
const month = document.getElementById('monthFilter').value; // Format: YYYY-MM
const result = await ipcRenderer.invoke('get-serials-by-month', { 
  month, 
  userId 
});
```

**Excel Export:**
```javascript
// main.js
const XLSX = require('xlsx');

ipcMain.handle('export-excel', async (event, { data, filename }) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Serials');
  
  const filePath = path.join(app.getPath('downloads'), `${filename}.xlsx`);
  XLSX.writeFile(workbook, filePath);
  
  return { success: true, path: filePath };
});
```

**PDF Export:**
```javascript
// main.js
const PDFDocument = require('pdfkit');

ipcMain.handle('export-pdf', async (event, { data, filename }) => {
  const doc = new PDFDocument({ margin: 30 });
  const stream = fs.createWriteStream(filePath);
  
  doc.pipe(stream);
  
  // Title
  doc.fontSize(20).text('Serial Number Report', { align: 'center' });
  
  // Table headers and rows
  // ... rendering logic ...
  
  doc.end();
  
  return new Promise((resolve) => {
    stream.on('finish', () => {
      resolve({ success: true, path: filePath });
    });
  });
});
```

---

### 8. pages/analytics.html
**Purpose**: Data visualization with Chart.js

**Chart.js CDN:**
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

**Chart Initialization:**
```javascript
const ctx = document.getElementById('modelChart');
const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Model-A', 'Model-B', 'Model-C'],
    datasets: [{
      label: 'Serial Numbers Generated',
      data: [50, 30, 20],
      backgroundColor: ['rgba(102, 126, 234, 0.8)', ...]
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    }
  }
});
```

**Three Chart Types:**
1. **Bar Chart**: Serials per Model
2. **Pie Chart**: Serials per Operator  
3. **Line Chart**: Monthly trends (last 12 months)

---

### 9. pages/admin.html
**Purpose**: Admin CRUD operations

**Edit Modal:**
```javascript
function editSerial(id) {
  const record = allSerials.find(s => s.id === id);
  
  // Populate form fields
  document.getElementById('editId').value = record.id;
  document.getElementById('editModel').value = record.modelNumber;
  // ... more fields ...
  
  // Show modal
  document.getElementById('editModal').style.display = 'block';
}
```

**Update Operation:**
```javascript
const result = await ipcRenderer.invoke('update-serial', { 
  id, 
  data 
});
```

**Delete with Confirmation:**
```javascript
async function deleteSerial(id) {
  if (!confirm('Are you sure?')) return;
  
  const result = await ipcRenderer.invoke('delete-serial', id);
  
  if (result.success) {
    await loadAllSerials(); // Refresh
  }
}
```

---

### 10. styles/main.css
**Purpose**: Global styling

**Key Design Patterns:**

**Gradient Backgrounds:**
```css
body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

**Card Layout:**
```css
.card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
```

**Button Styles:**
```css
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 30px;
  border-radius: 8px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}
```

**Responsive Grid:**
```css
.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}
```

---

## Database Schema Deep Dive

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('Admin', 'User')),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

**Indexes:** UNIQUE on username
**Constraints:** Role must be 'Admin' or 'User'

### Serials Table
```sql
CREATE TABLE serials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  modelNumber TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  dateOfManufacturing TEXT NOT NULL,
  brazerName TEXT NOT NULL,
  operatorCode TEXT NOT NULL,
  codeA TEXT,
  codeB TEXT,
  codeC TEXT,
  codeD TEXT,
  serialNumber TEXT UNIQUE NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  userId INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
)
```

**Indexes:** UNIQUE on serialNumber
**Foreign Keys:** userId → users.id
**Timestamps:** Auto-generated on insert

---

## IPC Communication Flow

### Example: Generate Serial Numbers

**1. User Action (generate.html):**
```javascript
const formData = { ... };
const result = await ipcRenderer.invoke('generate-serial', formData);
```

**2. IPC Handler (main.js):**
```javascript
ipcMain.handle('generate-serial', async (event, data) => {
  try {
    const results = [];
    for (let i = 0; i < data.quantity; i++) {
      let serialNumber = generateSerialNumber();
      db.insertSerial({ ...data, serialNumber });
      results.push(serialNumber);
    }
    return { success: true, serials: results };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
```

**3. Database Operation (database.js):**
```javascript
insertSerial(data) {
  const stmt = this.db.prepare(`
    INSERT INTO serials (...) VALUES (?, ?, ?, ...)
  `);
  return stmt.run(...values);
}
```

**4. Response to Renderer:**
```javascript
if (result.success) {
  // Display generated serials
  serialList.innerHTML = result.serials.map(serial => 
    `<div class="serial-item">${serial}</div>`
  ).join('');
}
```

---

## Session Management

### Login Flow
1. User submits credentials
2. Backend validates against database
3. On success, user object returned
4. User object stored in localStorage
5. Redirect to dashboard

### Session Persistence
```javascript
// Store
localStorage.setItem('user', JSON.stringify(user));

// Retrieve
const user = JSON.parse(localStorage.getItem('user'));

// Check
if (!user) {
  window.location.href = 'login.html';
}

// Clear
localStorage.removeItem('user');
```

---

## Error Handling

### Database Errors
```javascript
try {
  db.insertSerial(data);
} catch (error) {
  if (error.message.includes('UNIQUE')) {
    // Handle duplicate serial
  } else {
    // Handle other errors
  }
}
```

### IPC Error Responses
```javascript
return { 
  success: false, 
  message: error.message 
};
```

### UI Error Display
```javascript
if (!result.success) {
  alertDiv.innerHTML = `
    <div class="alert alert-error">
      Error: ${result.message}
    </div>
  `;
}
```

---

## Performance Considerations

### Database Queries
- **Prepared Statements**: Used throughout for performance
- **Indexes**: UNIQUE constraints create automatic indexes
- **SQLite**: In-memory database option available for speed

### Large Batch Generation
```javascript
// Generates 1000 serials in ~1-2 seconds
for (let i = 0; i < 1000; i++) {
  // Retry logic for uniqueness
  while (!unique) {
    serialNumber = generateSerialNumber();
    try {
      db.insertSerial({ ...data, serialNumber });
      unique = true;
    } catch (err) {
      // Retry with new serial
    }
  }
}
```

### Export Performance
- **Excel**: Fast with XLSX library
- **PDF**: Slower for large datasets (pagination recommended)

---

## Security Implementation

### Current Implementation
- ✅ SQL injection prevention (prepared statements)
- ✅ UNIQUE constraints on serials and usernames
- ✅ Role-based access control
- ✅ Input validation (client-side)

### Production Recommendations
- ⚠️ **Hash passwords**: Use bcrypt
- ⚠️ **Server-side validation**: Don't trust client
- ⚠️ **Session tokens**: Replace localStorage
- ⚠️ **HTTPS**: For remote access
- ⚠️ **Audit logs**: Track all changes

---

## Extension Points

### Add New Features

**1. Add New Model:**
```html
<!-- generate.html -->
<option value="Model-D">Model-D</option>
```

**2. Custom Serial Format:**
```javascript
// main.js
function generateSerialNumber() {
  // Modify format here
  return customFormat;
}
```

**3. Add New Chart:**
```javascript
// analytics.html
createChart('newChart', {
  type: 'doughnut',
  data: { ... },
  options: { ... }
});
```

**4. Add New Export Format:**
```javascript
// main.js
ipcMain.handle('export-csv', async (event, { data, filename }) => {
  // CSV generation logic
});
```

---

## Build Configuration

### electron-builder (package.json)
```json
"build": {
  "appId": "com.serialnumber.app",
  "productName": "Serial Number Generator",
  "win": {
    "target": ["nsis"],
    "icon": "assets/icon.ico"
  },
  "directories": {
    "output": "dist"
  }
}
```

### Build Process
1. `npm run build`
2. Electron-builder packages app
3. Creates NSIS installer
4. Output in `dist/` folder
5. Size: ~150-200 MB (includes Electron runtime)

---

## Testing Checklist

### Unit Tests (Manual)
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Generate 1 serial
- [ ] Generate 100 serials
- [ ] Generate 1000 serials
- [ ] Filter by month
- [ ] Export to Excel
- [ ] Export to PDF
- [ ] View analytics
- [ ] Edit entry (admin)
- [ ] Delete entry (admin)

### Integration Tests
- [ ] User sees only own data
- [ ] Admin sees all data
- [ ] Serial uniqueness enforced
- [ ] Export files created
- [ ] Charts render correctly

---

## Deployment

### For Single PC:
```bash
npm install
npm start
```

### For Multiple PCs:
```bash
npm run build
# Distribute installer from dist/
```

### For Updates:
1. Modify code
2. Update version in package.json
3. Rebuild installer
4. Distribute new version

---

## Environment Variables (Optional)

Create `.env` file:
```
DB_PATH=./serialnumbers.db
DEV_MODE=true
LOG_LEVEL=debug
```

Load in main.js:
```javascript
require('dotenv').config();
const dbPath = process.env.DB_PATH || './serialnumbers.db';
```

---

## Debugging

### Enable DevTools:
```bash
npm run dev
```

### Console Logging:
```javascript
console.log('Debug:', data);
```

### SQLite Debugging:
```javascript
this.db.pragma('journal_mode = WAL');
console.log(this.db.prepare('SELECT * FROM serials').all());
```

---

## Version History

### v1.0.0 (Current)
- Initial release
- All core features implemented
- Windows desktop app
- SQLite database
- Export to Excel/PDF
- Analytics with Chart.js

---

## API Reference

### IPC Handlers

#### login
```javascript
ipcRenderer.invoke('login', { username, password, role })
// Returns: { success: boolean, user?: User, message?: string }
```

#### generate-serial
```javascript
ipcRenderer.invoke('generate-serial', { 
  modelNumber, 
  quantity, 
  dateOfManufacturing, 
  brazerName, 
  operatorCode, 
  codeA, 
  codeB, 
  codeC, 
  codeD, 
  userId 
})
// Returns: { success: boolean, serials?: string[], message?: string }
```

#### get-monthly-count
```javascript
ipcRenderer.invoke('get-monthly-count', userId)
// Returns: { success: boolean, count?: number, message?: string }
```

#### get-serials
```javascript
ipcRenderer.invoke('get-serials', userId)
// Returns: { success: boolean, serials?: Serial[], message?: string }
```

#### get-analytics
```javascript
ipcRenderer.invoke('get-analytics', userId)
// Returns: { 
//   success: boolean, 
//   analytics?: { 
//     byModel: Array, 
//     byOperator: Array, 
//     byMonth: Array 
//   }, 
//   message?: string 
// }
```

---

## Conclusion

This technical reference provides complete documentation for developers to:
- ✅ Understand architecture
- ✅ Modify and extend features
- ✅ Debug issues
- ✅ Deploy application
- ✅ Maintain codebase

**Happy Coding! 👨‍💻**
