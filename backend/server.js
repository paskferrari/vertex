// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:5175',
    'https://vertex-frontend.vercel.app',
    /\.vercel\.app$/,
    /\.ngrok\.io$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers for mobile compatibility
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.sendStatus(200);
  } else {
    next();
  }
});

// Database setup
const db = new sqlite3.Database('./database.db');

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Predictions table
  db.run(`CREATE TABLE IF NOT EXISTS predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    match_name TEXT NOT NULL,
    sport TEXT NOT NULL,
    odds REAL NOT NULL,
    event_date DATETIME NOT NULL,
    tipster_name TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // User predictions (followed predictions)
  db.run(`CREATE TABLE IF NOT EXISTS user_predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    prediction_id INTEGER NOT NULL,
    followed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (prediction_id) REFERENCES predictions (id),
    UNIQUE(user_id, prediction_id)
  )`);

  // Create default admin user
  const adminEmail = 'admin@vertex.com';
  const adminPassword = bcrypt.hashSync('admin123', 10);
  
  db.get('SELECT id FROM users WHERE email = ?', [adminEmail], (err, row) => {
    if (!row) {
      db.run('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', 
        [adminEmail, adminPassword, 'admin']);
      console.log('Default admin user created: admin@vertex.com / admin123');
    }
  });
});

// Import middleware
const authMiddleware = require('./middleware/authMiddleware');

// Import routes
const predictionRoutes = require('./routes/predictions');
const adminRoutes = require('./routes/admin');

// Use routes
app.use('/api/predictions', predictionRoutes);
app.use('/api/admin', adminRoutes);

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  });
});

// Predictions routes
app.get('/api/predictions', (req, res) => {
  const query = `
    SELECT p.*, 
           CASE WHEN up.user_id IS NOT NULL THEN 1 ELSE 0 END as is_followed
    FROM predictions p
    LEFT JOIN user_predictions up ON p.id = up.prediction_id AND up.user_id = ?
    WHERE p.event_date > datetime('now')
    ORDER BY p.event_date ASC
  `;
  
  const userId = req.query.userId || null;
  
  db.all(query, [userId], (err, predictions) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(predictions);
  });
});

app.post('/api/predictions/create', authMiddleware.requireAdmin, (req, res) => {
  const { match_name, sport, odds, event_date, tipster_name } = req.body;

  if (!match_name || !sport || !odds || !event_date || !tipster_name) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.run(
    'INSERT INTO predictions (match_name, sport, odds, event_date, tipster_name) VALUES (?, ?, ?, ?, ?)',
    [match_name, sport, odds, event_date, tipster_name],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, message: 'Prediction created successfully' });
    }
  );
});

app.post('/api/predictions/follow', authMiddleware.requireAuth, (req, res) => {
  const { prediction_id } = req.body;
  const userId = req.user.userId;

  db.run(
    'INSERT OR IGNORE INTO user_predictions (user_id, prediction_id) VALUES (?, ?)',
    [userId, prediction_id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Prediction followed successfully' });
    }
  );
});

app.get('/api/predictions/followed', authMiddleware.requireAuth, (req, res) => {
  const userId = req.user.userId;
  const { status } = req.query;

  let query = `
    SELECT p.*, up.followed_at
    FROM predictions p
    JOIN user_predictions up ON p.id = up.prediction_id
    WHERE up.user_id = ?
  `;

  const params = [userId];

  if (status && status !== 'all') {
    query += ' AND p.status = ?';
    params.push(status);
  }

  query += ' ORDER BY up.followed_at DESC';

  db.all(query, params, (err, predictions) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(predictions);
  });
});

// Get latest predictions for admin panel
app.get('/api/predictions/latest', authMiddleware.requireAdmin, (req, res) => {
  db.all(
    'SELECT * FROM predictions ORDER BY created_at DESC LIMIT 10',
    [],
    (err, predictions) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(predictions);
    }
  );
});

// ROI calculation endpoint
app.get('/api/user/roi', authMiddleware.requireAuth, (req, res) => {
  const userId = req.user.userId;

  const query = `
    SELECT 
      COUNT(up.id) as total_followed,
      SUM(CASE WHEN p.status = 'won' THEN 1 ELSE 0 END) as total_won,
      SUM(CASE WHEN p.status = 'lost' THEN 1 ELSE 0 END) as total_lost,
      SUM(CASE WHEN p.status = 'pending' THEN 1 ELSE 0 END) as total_pending,
      SUM(CASE WHEN p.status = 'won' THEN p.odds - 1 ELSE 0 END) - SUM(CASE WHEN p.status = 'lost' THEN 1 ELSE 0 END) as roi
    FROM user_predictions up
    JOIN predictions p ON up.prediction_id = p.id
    WHERE up.user_id = ?
  `;

  db.get(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    // Format the response
    const response = {
      total_followed: result.total_followed || 0,
      total_won: result.total_won || 0,
      total_lost: result.total_lost || 0,
      total_pending: result.total_pending || 0,
      roi: result.roi || 0,
      roi_percentage: result.total_followed > 0 ? (result.roi / result.total_followed) * 100 : 0
    };

    res.json(response);
  });
});

// Create notifications table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);
});

// Get user notifications
app.get('/api/notifications', authMiddleware.requireAuth, (req, res) => {
  const userId = req.user.userId;

  db.all(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, notifications) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      res.json(notifications);
    }
  );
});

// Mark notification as read
app.patch('/api/notifications/:id/read', authMiddleware.requireAuth, (req, res) => {
  const userId = req.user.userId;
  const notificationId = req.params.id;

  db.run(
    'UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?',
    [notificationId, userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Notification not found or not owned by user' });
      }
      
      res.json({ message: 'Notification marked as read' });
    }
  );
});

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});