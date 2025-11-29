const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class DatabaseManager {
  constructor() {
    const dbPath = path.join(__dirname, 'serialnumbers.db');
    this.db = new Database(dbPath);
    this.initialize();
  }

  initialize() {
    // Create Users table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('Admin', 'User')),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Serials table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS serials (
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
    `);

    // Insert default admin user if not exists (password: admin123)
    const checkAdmin = this.db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
    if (!checkAdmin) {
      this.db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run('admin', 'admin123', 'Admin');
    }

    // Insert default user if not exists (password: user123)
    const checkUser = this.db.prepare('SELECT * FROM users WHERE username = ?').get('user');
    if (!checkUser) {
      this.db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run('user', 'user123', 'User');
    }
  }

  // User operations
  authenticateUser(username, password, role) {
    const stmt = this.db.prepare('SELECT * FROM users WHERE username = ? AND password = ? AND role = ?');
    return stmt.get(username, password, role);
  }

  getAllUsers() {
    return this.db.prepare('SELECT id, username, role, createdAt FROM users ORDER BY createdAt DESC').all();
  }

  createUser(username, password, role) {
    const stmt = this.db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)');
    return stmt.run(username, password, role);
  }

  deleteUser(id) {
    // Don't allow deleting the default admin
    const user = this.db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (user && user.username === 'admin') {
      throw new Error('Cannot delete default admin user');
    }
    return this.db.prepare('DELETE FROM users WHERE id = ?').run(id);
  }

  updateUser(id, data) {
    const stmt = this.db.prepare('UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?');
    return stmt.run(data.username, data.password, data.role, id);
  }

  getUserById(id) {
    return this.db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }

  // Serial number operations
  insertSerial(data) {
    const stmt = this.db.prepare(`
      INSERT INTO serials (
        modelNumber, quantity, dateOfManufacturing, brazerName, 
        operatorCode, codeA, codeB, codeC, codeD, serialNumber, userId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    return stmt.run(
      data.modelNumber,
      data.quantity,
      data.dateOfManufacturing,
      data.brazerName,
      data.operatorCode,
      data.codeA,
      data.codeB,
      data.codeC,
      data.codeD,
      data.serialNumber,
      data.userId
    );
  }

  getSerialsForUser(userId) {
    return this.db.prepare('SELECT * FROM serials WHERE userId = ? ORDER BY createdAt DESC').all(userId);
  }

  getAllSerials() {
    return this.db.prepare(`
      SELECT s.*, u.username 
      FROM serials s 
      JOIN users u ON s.userId = u.id 
      ORDER BY s.createdAt DESC
    `).all();
  }

  getMonthlyCount(userId = null) {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    let query = `SELECT COUNT(*) as count FROM serials WHERE strftime('%Y-%m', createdAt) = ?`;
    let params = [currentMonth];
    
    if (userId) {
      query += ' AND userId = ?';
      params.push(userId);
    }
    
    const result = this.db.prepare(query).get(...params);
    return result.count;
  }

  getSerialsByMonth(month, userId = null) {
    let query = `
      SELECT s.*, u.username 
      FROM serials s 
      JOIN users u ON s.userId = u.id 
      WHERE strftime('%Y-%m', s.createdAt) = ?
    `;
    let params = [month];
    
    if (userId) {
      query += ' AND s.userId = ?';
      params.push(userId);
    }
    
    query += ' ORDER BY s.createdAt DESC';
    return this.db.prepare(query).all(...params);
  }

  getAnalyticsByModel(userId = null) {
    let query = `
      SELECT modelNumber, COUNT(*) as count 
      FROM serials
    `;
    let params = [];
    
    if (userId) {
      query += ' WHERE userId = ?';
      params.push(userId);
    }
    
    query += ' GROUP BY modelNumber';
    return this.db.prepare(query).all(...params);
  }

  getAnalyticsByOperator(userId = null) {
    let query = `
      SELECT operatorCode, COUNT(*) as count 
      FROM serials
    `;
    let params = [];
    
    if (userId) {
      query += ' WHERE userId = ?';
      params.push(userId);
    }
    
    query += ' GROUP BY operatorCode';
    return this.db.prepare(query).all(...params);
  }

  getAnalyticsByMonth(userId = null) {
    let query = `
      SELECT strftime('%Y-%m', createdAt) as month, COUNT(*) as count 
      FROM serials
    `;
    let params = [];
    
    if (userId) {
      query += ' WHERE userId = ?';
      params.push(userId);
    }
    
    query += ' GROUP BY month ORDER BY month DESC LIMIT 12';
    return this.db.prepare(query).all(...params);
  }

  deleteSerial(id) {
    return this.db.prepare('DELETE FROM serials WHERE id = ?').run(id);
  }

  updateSerial(id, data) {
    const stmt = this.db.prepare(`
      UPDATE serials SET 
        modelNumber = ?, 
        quantity = ?, 
        dateOfManufacturing = ?, 
        brazerName = ?, 
        operatorCode = ?, 
        codeA = ?, 
        codeB = ?, 
        codeC = ?, 
        codeD = ?
      WHERE id = ?
    `);
    
    return stmt.run(
      data.modelNumber,
      data.quantity,
      data.dateOfManufacturing,
      data.brazerName,
      data.operatorCode,
      data.codeA,
      data.codeB,
      data.codeC,
      data.codeD,
      id
    );
  }

  close() {
    this.db.close();
  }
}

module.exports = DatabaseManager;
