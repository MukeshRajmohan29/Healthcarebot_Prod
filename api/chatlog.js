// Vercel serverless API for chatlog
const { getDatabase } = require('./_lib/database');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId, healthcareContext, privacyStyle, userInput, botReply, userDetails } = req.body;
  if (!sessionId || !healthcareContext || !privacyStyle || !userInput || !botReply) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const pool = getDatabase();
  const insertSQL = `
    INSERT INTO chat_logs (session_id, healthcare_context, privacy_style, user_first_name, user_last_name, user_age, user_dob, user_input, bot_reply, timestamp)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING id
  `;

  try {
    const result = await pool.query(insertSQL, [
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
    ]);
    res.status(200).json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
