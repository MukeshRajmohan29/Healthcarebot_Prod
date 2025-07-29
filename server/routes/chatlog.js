const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDatabase } = require('../models/database');

const router = express.Router();

// Validation middleware
const validateChatlogRequest = [
  body('sessionId').isLength({ min: 1, max: 255 }).withMessage('Session ID is required'),
  body('healthcareContext').isLength({ min: 1, max: 100 }).withMessage('Healthcare context is required'),
  body('privacyStyle').isLength({ min: 1, max: 50 }).withMessage('Privacy style is required'),
  body('userInput').isLength({ min: 1, max: 2000 }).withMessage('User input is required and must be under 2000 characters'),
  body('botReply').isLength({ min: 1, max: 5000 }).withMessage('Bot reply is required and must be under 5000 characters')
];

// POST /api/chatlog
router.post('/', validateChatlogRequest, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { sessionId, healthcareContext, privacyStyle, userInput, botReply, userDetails } = req.body;

    const pool = getDatabase();
    
    // Insert chat log into database
    const insertSQL = `
      INSERT INTO chat_logs (session_id, healthcare_context, privacy_style, user_first_name, user_last_name, user_age, user_dob, user_input, bot_reply, timestamp)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `;

    pool.query(insertSQL, [
      sessionId,
      healthcareContext,
      privacyStyle,
      userDetails?.firstName || null,
      userDetails?.lastName || null,
      userDetails?.age || null,
      userDetails?.dateOfBirth || null,
      userInput,
      botReply,
      new Date().toISOString()
    ], (err, result) => {
      if (err) {
        console.error('Database insert error:', err);
        return res.status(500).json({ 
          error: 'Failed to save chat log',
          message: process.env.NODE_ENV === 'development' ? err.message : 'Database error'
        });
      }

      res.json({
        success: true,
        message: 'Chat log saved successfully',
        logId: result.rows[0].id,
        sessionId,
        timestamp: new Date().toISOString()
      });
    });

  } catch (error) {
    console.error('Chatlog API Error:', error);
    res.status(500).json({ 
      error: 'Failed to save chat log',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/chatlog/:sessionId - Get chat logs for a specific session
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Validate session ID format (now accepts custom format)
    if (!sessionId || sessionId.length < 3) {
      return res.status(400).json({ error: 'Invalid session ID format' });
    }

    const pool = getDatabase();
    
    const selectSQL = `
      SELECT id, session_id, healthcare_context, privacy_style, user_first_name, user_last_name, user_age, user_input, bot_reply, timestamp
      FROM chat_logs 
      WHERE session_id = $1 
      ORDER BY timestamp ASC
    `;

    pool.query(selectSQL, [sessionId], (err, result) => {
      if (err) {
        console.error('Database select error:', err);
        return res.status(500).json({ 
          error: 'Failed to retrieve chat logs',
          message: process.env.NODE_ENV === 'development' ? err.message : 'Database error'
        });
      }

      res.json({
        success: true,
        sessionId,
        chatLogs: result.rows,
        count: result.rows.length
      });
    });

  } catch (error) {
    console.error('Chatlog GET API Error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve chat logs',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/chatlog - Get summary statistics
router.get('/', async (req, res) => {
  try {
    const pool = getDatabase();
    
    const statsSQL = `
      SELECT 
        COUNT(*) as total_conversations,
        COUNT(DISTINCT session_id) as unique_sessions,
        healthcare_context,
        privacy_style,
        COUNT(*) as context_count
      FROM chat_logs 
      GROUP BY healthcare_context, privacy_style
      ORDER BY healthcare_context, privacy_style
    `;

    pool.query(statsSQL, [], (err, result) => {
      if (err) {
        console.error('Database stats error:', err);
        return res.status(500).json({ 
          error: 'Failed to retrieve statistics',
          message: process.env.NODE_ENV === 'development' ? err.message : 'Database error'
        });
      }

      // Calculate totals
      const totalConversations = result.rows.reduce((sum, row) => sum + parseInt(row.context_count), 0);
      const uniqueSessions = result.rows.length > 0 ? parseInt(result.rows[0].unique_sessions) : 0;

      res.json({
        success: true,
        statistics: {
          totalConversations,
          uniqueSessions,
          breakdown: result.rows
        }
      });
    });

  } catch (error) {
    console.error('Chatlog Stats API Error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve statistics',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router; 