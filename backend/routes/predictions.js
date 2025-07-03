const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { requireAdmin, requireAuth } = require('../middleware/authMiddleware');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();

// Initialize SQLite database connection
const db = new sqlite3.Database(path.join(__dirname, '../database.db'));

// Initialize Supabase client if environment variables are provided
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  console.log('Initializing Supabase client with provided credentials');
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
} else {
  console.log('Supabase credentials not found in environment variables. Using SQLite fallback.');
}

/**
 * POST /api/predictions/create
 * Create a new prediction (Admin only)
 */
router.post('/create', requireAdmin, async (req, res) => {
  try {
    const { match, sport, odds, date, tipster } = req.body;
    const { userId: userId, role } = req.user;

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
 * GET /api/predictions/followed
 * Get all predictions followed by the current user
 */
router.get('/followed', requireAuth, async (req, res) => {
  try {
    const { userId } = req.user;

    if (supabase) {
      // Use Supabase if configured
      const { data, error } = await supabase
        .from('user_predictions')
        .select(`
          saved_at,
          predictions (
            id,
            match_name,
            sport,
            odds,
            tipster,
            event_date
          )
        `)
        .eq('user_id', userId)
        .order('saved_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({
          error: 'Failed to fetch followed predictions',
          details: error.message
        });
      }

      // Transform the data to match the expected format
      const followedPredictions = data.map(item => ({
        ...item.predictions,
        saved_at: item.saved_at
      }));

      res.json({
        success: true,
        predictions: followedPredictions
      });
    } else {
      // Fallback to SQLite
      db.all(
        `SELECT 
          up.saved_at,
          p.id,
          p.match_name as match,
          p.sport,
          p.odds,
          p.tipster_name as tipster,
          p.event_date as date
        FROM user_predictions up
        JOIN predictions p ON up.prediction_id = p.id
        WHERE up.user_id = ?
        ORDER BY up.saved_at DESC`,
        [userId],
        (err, rows) => {
          if (err) {
            console.error('SQLite error:', err);
            return res.status(500).json({
              error: 'Failed to fetch followed predictions',
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
    console.error('Error fetching followed predictions:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * GET /api/predictions/all
 * Get all predictions with isFollowed status for current user
 */
router.get('/all', requireAuth, async (req, res) => {
  try {
    const { userId } = req.user;

    if (supabase) {
      // Use Supabase if configured
      const { data: predictions, error: predictionsError } = await supabase
        .from('predictions')
        .select('*')
        .order('event_date', { ascending: true });

      if (predictionsError) {
        console.error('Supabase error:', predictionsError);
        return res.status(500).json({
          error: 'Failed to fetch predictions',
          details: predictionsError.message
        });
      }

      // Get user's followed predictions
      const { data: userPredictions, error: userError } = await supabase
        .from('user_predictions')
        .select('prediction_id')
        .eq('user_id', userId);

      if (userError) {
        console.error('Supabase error:', userError);
        return res.status(500).json({
          error: 'Failed to fetch user predictions',
          details: userError.message
        });
      }

      const followedIds = userPredictions.map(up => up.prediction_id);
      
      // Add isFollowed field to each prediction
      const predictionsWithFollowStatus = predictions.map(prediction => ({
        ...prediction,
        isFollowed: followedIds.includes(prediction.id)
      }));

      res.json({
        success: true,
        predictions: predictionsWithFollowStatus
      });
    } else {
      // Fallback to SQLite
      db.all(
        `SELECT 
          p.*,
          CASE WHEN up.prediction_id IS NOT NULL THEN 1 ELSE 0 END as isFollowed
        FROM predictions p
        LEFT JOIN user_predictions up ON p.id = up.prediction_id AND up.user_id = ?
        ORDER BY p.event_date ASC`,
        [userId],
        (err, rows) => {
          if (err) {
            console.error('SQLite error:', err);
            return res.status(500).json({
              error: 'Failed to fetch predictions',
              details: err.message
            });
          }

          // Convert isFollowed from 0/1 to boolean
          const predictions = rows.map(row => ({
            ...row,
            isFollowed: Boolean(row.isFollowed)
          }));

          res.json({
            success: true,
            predictions
          });
        }
      );
    }

  } catch (error) {
    console.error('Error fetching all predictions:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * POST /api/predictions/follow
 * Follow a prediction
 */
router.post('/follow', requireAuth, async (req, res) => {
  try {
    const { userId } = req.user;
    const { predictionId } = req.body;

    if (!predictionId) {
      return res.status(400).json({
        error: 'Prediction ID is required'
      });
    }

    if (supabase) {
      // Check if prediction exists
      const { data: prediction, error: predictionError } = await supabase
        .from('predictions')
        .select('id')
        .eq('id', predictionId)
        .single();

      if (predictionError || !prediction) {
        return res.status(404).json({
          error: 'Prediction not found'
        });
      }

      // Check if already following
      const { data: existing, error: existingError } = await supabase
        .from('user_predictions')
        .select('id')
        .eq('user_id', userId)
        .eq('prediction_id', predictionId)
        .single();

      if (existing) {
        return res.status(400).json({
          error: 'Already following this prediction'
        });
      }

      // Add to user_predictions
      const { data, error } = await supabase
        .from('user_predictions')
        .insert([{
          user_id: userId,
          prediction_id: predictionId,
          saved_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({
          error: 'Failed to follow prediction',
          details: error.message
        });
      }

      res.json({
        success: true,
        message: 'Prediction followed successfully'
      });
    } else {
      // Fallback to SQLite
      // Check if prediction exists
      db.get(
        'SELECT id FROM predictions WHERE id = ?',
        [predictionId],
        (err, prediction) => {
          if (err) {
            console.error('SQLite error:', err);
            return res.status(500).json({
              error: 'Database error',
              details: err.message
            });
          }

          if (!prediction) {
            return res.status(404).json({
              error: 'Prediction not found'
            });
          }

          // Check if already following
          db.get(
            'SELECT id FROM user_predictions WHERE user_id = ? AND prediction_id = ?',
            [userId, predictionId],
            (err, existing) => {
              if (err) {
                console.error('SQLite error:', err);
                return res.status(500).json({
                  error: 'Database error',
                  details: err.message
                });
              }

              if (existing) {
                return res.status(400).json({
                  error: 'Already following this prediction'
                });
              }

              // Add to user_predictions
              db.run(
                'INSERT INTO user_predictions (user_id, prediction_id, saved_at) VALUES (?, ?, ?)',
                [userId, predictionId, new Date().toISOString()],
                function(err) {
                  if (err) {
                    console.error('SQLite error:', err);
                    return res.status(500).json({
                      error: 'Failed to follow prediction',
                      details: err.message
                    });
                  }

                  // Get prediction details for notification
                  db.get(
                    'SELECT match_name FROM predictions WHERE id = ?',
                    [predictionId],
                    (err, predictionData) => {
                      if (!err && predictionData) {
                        // Create notification
                        db.run(
                          'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
                          [userId, `Hai seguito ${predictionData.match_name}`, 'new_tip'],
                          (err) => {
                            if (err) {
                              console.error('Failed to create notification:', err);
                            }
                          }
                        );
                      }
                    }
                  );

                  res.json({
                    success: true,
                    message: 'Prediction followed successfully'
                  });
                }
              );
            }
          );
        }
      );
    }

  } catch (error) {
    console.error('Error following prediction:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

module.exports = router;