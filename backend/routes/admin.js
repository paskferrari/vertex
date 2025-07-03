const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');
const { createClient } = require('@supabase/supabase-js');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();

// Apply auth and admin middleware to all admin routes
router.use(requireAuth);
router.use(isAdmin);

// Initialize SQLite database connection
const db = new sqlite3.Database(path.join(__dirname, '../database.db'));

// Initialize Supabase client if environment variables are provided
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
}

/**
 * POST /api/admin/create-prediction
 * Create a new prediction (Admin only)
 */
router.post('/create-prediction', async (req, res) => {
  try {
    const { match, sport, odds, date, tipster } = req.body;
    const { userId } = req.user;

    // Validate required fields
    if (!match || !sport || !odds || !date || !tipster) {
      return res.status(400).json({
        error: 'All fields are required: match, sport, odds, date, tipster'
      });
    }

    // Validate odds is a number
    if (isNaN(parseFloat(odds))) {
      return res.status(400).json({
        error: 'Odds must be a valid number'
      });
    }

    // Validate date format
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({
        error: 'Date must be a valid date format'
      });
    }

    if (supabase) {
      // Use Supabase if configured
      const { data, error } = await supabase
        .from('predictions')
        .insert([
          {
            match_name: match,
            sport,
            odds: parseFloat(odds),
            event_date: eventDate.toISOString(),
            tipster,
            status: 'pending',
            created_by: userId,
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({
          error: 'Failed to create prediction',
          details: error.message
        });
      }

      res.status(201).json({
        success: true,
        message: 'Prediction created successfully',
        prediction: data[0]
      });
    } else {
      // Fallback to SQLite
      db.run(
        'INSERT INTO predictions (match_name, sport, odds, event_date, tipster_name) VALUES (?, ?, ?, ?, ?)',
        [match, sport, parseFloat(odds), eventDate.toISOString(), tipster],
        function(err) {
          if (err) {
            console.error('SQLite error:', err);
            return res.status(500).json({
              error: 'Failed to create prediction',
              details: err.message
            });
          }

          res.status(201).json({
            success: true,
            message: 'Prediction created successfully',
            prediction: {
              id: this.lastID,
              match_name: match,
              sport,
              odds: parseFloat(odds),
              event_date: eventDate.toISOString(),
              tipster_name: tipster,
              status: 'pending'
            }
          });
        }
      );
    }

  } catch (error) {
    console.error('Error creating prediction:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * GET /api/admin/predictions
 * Get all predictions for admin management
 */
router.get('/predictions', async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({
          error: 'Failed to fetch predictions',
          details: error.message
        });
      }

      res.json({
        success: true,
        predictions: data
      });
    } else {
      db.all(
        'SELECT * FROM predictions ORDER BY created_at DESC',
        [],
        (err, rows) => {
          if (err) {
            console.error('SQLite error:', err);
            return res.status(500).json({
              error: 'Failed to fetch predictions',
              details: err.message
            });
          }

          res.json({
            success: true,
            predictions: rows
          });
        }
      );
    }
  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * PATCH /api/admin/predictions/:id/status
 * Update prediction status (Admin only)
 */
router.patch('/predictions/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status || !['pending', 'won', 'lost'].includes(status)) {
      return res.status(400).json({
        error: 'Status must be one of: pending, won, lost'
      });
    }

    if (supabase) {
      // Use Supabase if configured
      const { data, error } = await supabase
        .from('predictions')
        .update({ status })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({
          error: 'Failed to update prediction status',
          details: error.message
        });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({
          error: 'Prediction not found'
        });
      }

      res.json({
        success: true,
        message: 'Prediction status updated successfully',
        prediction: data[0]
      });
    } else {
      // Fallback to SQLite
      db.run(
        'UPDATE predictions SET status = ? WHERE id = ?',
        [status, id],
        function(err) {
          if (err) {
            console.error('SQLite error:', err);
            return res.status(500).json({
              error: 'Failed to update prediction status',
              details: err.message
            });
          }

          if (this.changes === 0) {
            return res.status(404).json({
              error: 'Prediction not found'
            });
          }

          // Create notifications for users who followed this prediction
          if (status === 'won' || status === 'lost') {
            db.get(
              'SELECT match_name FROM predictions WHERE id = ?',
              [id],
              (err, predictionData) => {
                if (!err && predictionData) {
                  const statusText = status === 'won' ? 'Vinto' : 'Perso';
                  const message = `Esito: ${predictionData.match_name} è stato ${statusText}`;
                  
                  // Get all users who followed this prediction
                  db.all(
                    'SELECT user_id FROM user_predictions WHERE prediction_id = ?',
                    [id],
                    (err, followers) => {
                      if (!err && followers) {
                        followers.forEach(follower => {
                          db.run(
                            'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
                            [follower.user_id, message, 'result'],
                            (err) => {
                              if (err) {
                                console.error('Failed to create notification:', err);
                              }
                            }
                          );
                        });
                      }
                    }
                  );
                }
              }
            );
          }

          res.json({
            success: true,
            message: 'Prediction status updated successfully'
          });
        }
      );
    }

  } catch (error) {
    console.error('Error updating prediction status:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * GET /api/admin/users
 * Get all users (Admin only)
 */
router.get('/users', async (req, res) => {
  try {
    if (supabase) {
      // Use Supabase if configured
      const { data, error } = await supabase
        .from('users')
        .select('id, email, role, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({
          error: 'Failed to fetch users',
          details: error.message
        });
      }

      res.json({
        success: true,
        users: data
      });
    } else {
      // Fallback to SQLite
      db.all(
        'SELECT id, email, role, created_at FROM users ORDER BY created_at DESC',
        [],
        (err, rows) => {
          if (err) {
            console.error('SQLite error:', err);
            return res.status(500).json({
              error: 'Failed to fetch users',
              details: err.message
            });
          }

          res.json({
            success: true,
            users: rows
          });
        }
      );
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * PATCH /api/admin/users/:id
 * Update user role (Admin only)
 */
router.patch('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        error: 'Role must be either "user" or "admin"'
      });
    }

    if (supabase) {
      // Use Supabase if configured
      const { data, error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', id)
        .select('id, email, role, created_at');

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({
          error: 'Failed to update user role',
          details: error.message
        });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'User role updated successfully',
        user: data[0]
      });
    } else {
      // Fallback to SQLite
      db.run(
        'UPDATE users SET role = ? WHERE id = ?',
        [role, id],
        function(err) {
          if (err) {
            console.error('SQLite error:', err);
            return res.status(500).json({
              error: 'Failed to update user role',
              details: err.message
            });
          }

          if (this.changes === 0) {
            return res.status(404).json({
              error: 'User not found'
            });
          }

          res.json({
            success: true,
            message: 'User role updated successfully'
          });
        }
      );
    }

  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

module.exports = router;