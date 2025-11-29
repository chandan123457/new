const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const DatabaseManager = require('./database');
const XLSX = require('xlsx');
const PDFDocument = require('pdfkit');
const fs = require('fs');

let mainWindow;
let db;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true,
    resizable: true
  });

  mainWindow.loadFile('pages/login.html');

  // Open DevTools in development mode
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  db = new DatabaseManager();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    db.close();
    app.quit();
  }
});

// Generate unique serial number
function generateSerialNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let serial = '';
  for (let i = 0; i < 10; i++) {
    if (i === 5) serial += '-';
    serial += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return serial;
}

// IPC Handlers
ipcMain.handle('login', async (event, { username, password, role }) => {
  try {
    const user = db.authenticateUser(username, password, role);
    if (user) {
      return { success: true, user: { id: user.id, username: user.username, role: user.role } };
    }
    return { success: false, message: 'Invalid credentials' };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle('get-monthly-count', async (event, userId) => {
  try {
    const count = db.getMonthlyCount(userId);
    return { success: true, count };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle('generate-serial', async (event, data) => {
  try {
    const results = [];
    for (let i = 0; i < data.quantity; i++) {
      let serialNumber;
      let unique = false;
      
      // Ensure unique serial number
      while (!unique) {
        serialNumber = generateSerialNumber();
        try {
          db.insertSerial({ ...data, serialNumber });
          unique = true;
          results.push(serialNumber);
        } catch (err) {
          if (!err.message.includes('UNIQUE')) {
            throw err;
          }
          // If not unique, loop will continue and generate new one
        }
      }
    }
    return { success: true, serials: results };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle('get-serials', async (event, userId) => {
  try {
    const serials = userId ? db.getSerialsForUser(userId) : db.getAllSerials();
    return { success: true, serials };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle('get-serials-by-month', async (event, { month, userId }) => {
  try {
    const serials = db.getSerialsByMonth(month, userId);
    return { success: true, serials };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle('get-analytics', async (event, userId) => {
  try {
    const byModel = db.getAnalyticsByModel(userId);
    const byOperator = db.getAnalyticsByOperator(userId);
    const byMonth = db.getAnalyticsByMonth(userId);
    
    return { 
      success: true, 
      analytics: { byModel, byOperator, byMonth } 
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle('delete-serial', async (event, id) => {
  try {
    db.deleteSerial(id);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle('update-serial', async (event, { id, data }) => {
  try {
    db.updateSerial(id, data);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle('export-excel', async (event, { data, filename }) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Serials');
    
    const filePath = path.join(app.getPath('downloads'), `${filename}.xlsx`);
    XLSX.writeFile(workbook, filePath);
    
    return { success: true, path: filePath };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle('export-pdf', async (event, { data, filename }) => {
  try {
    const filePath = path.join(app.getPath('downloads'), `${filename}.pdf`);
    const doc = new PDFDocument({ margin: 30 });
    const stream = fs.createWriteStream(filePath);
    
    doc.pipe(stream);
    
    // Title
    doc.fontSize(20).text('Serial Number Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown(2);
    
    // Table headers
    doc.fontSize(8);
    const headers = ['ID', 'Model', 'Qty', 'Date', 'Brazer', 'Operator', 'Serial Number'];
    let yPos = doc.y;
    let xPos = 30;
    const colWidths = [30, 60, 35, 70, 80, 80, 100];
    
    headers.forEach((header, i) => {
      doc.text(header, xPos, yPos, { width: colWidths[i], continued: false });
      xPos += colWidths[i];
    });
    
    doc.moveDown(0.5);
    doc.moveTo(30, doc.y).lineTo(570, doc.y).stroke();
    doc.moveDown(0.5);
    
    // Table rows
    data.forEach((row) => {
      yPos = doc.y;
      xPos = 30;
      
      const values = [
        row.id || '',
        row.modelNumber || '',
        row.quantity || '',
        row.dateOfManufacturing || '',
        row.brazerName || '',
        row.operatorCode || '',
        row.serialNumber || ''
      ];
      
      values.forEach((value, i) => {
        doc.text(String(value), xPos, yPos, { width: colWidths[i], continued: false });
        xPos += colWidths[i];
      });
      
      doc.moveDown(0.3);
      
      // Add new page if needed
      if (doc.y > 720) {
        doc.addPage();
        doc.moveDown();
      }
    });
    
    doc.end();
    
    return new Promise((resolve) => {
      stream.on('finish', () => {
        resolve({ success: true, path: filePath });
      });
    });
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle('get-all-users', async () => {
  try {
    const users = db.getAllUsers();
    return { success: true, users };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle('create-user', async (event, { username, password, role }) => {
  try {
    db.createUser(username, password, role);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle('delete-user', async (event, id) => {
  try {
    db.deleteUser(id);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle('update-user', async (event, { id, data }) => {
  try {
    db.updateUser(id, data);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
