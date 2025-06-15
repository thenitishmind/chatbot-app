const { pgPool } = require('../config/database');

class PostgresService {
  // Message Operations
  static async createMessage({ sessionId, text, sender, metadata }) {
    const query = `
      INSERT INTO messages (session_id, text, sender, metadata)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [sessionId, text, sender, JSON.stringify(metadata)];
    const result = await pgPool.query(query, values);
    return result.rows[0];
  }

  static async getMessagesBySessionId(sessionId, limit = 100) {
    const query = `
      SELECT * FROM messages
      WHERE session_id = $1
      ORDER BY timestamp ASC
      LIMIT $2
    `;
    const result = await pgPool.query(query, [sessionId, limit]);
    return result.rows;
  }

  // Chat Session Operations
  static async createSession(userId) {
    const query = `
      INSERT INTO chat_sessions (id, user_id, status)
      VALUES ($1, $2, 'active')
      RETURNING *
    `;
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const result = await pgPool.query(query, [sessionId, userId]);
    return result.rows[0];
  }

  static async updateSessionActivity(sessionId) {
    const query = `
      UPDATE chat_sessions
      SET last_activity = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pgPool.query(query, [sessionId]);
    return result.rows[0];
  }

  static async endSession(sessionId) {
    const query = `
      UPDATE chat_sessions
      SET status = 'ended'
      WHERE id = $1
      RETURNING *
    `;
    const result = await pgPool.query(query, [sessionId]);
    return result.rows[0];
  }

  static async getActiveSessionsByUserId(userId) {
    const query = `
      SELECT * FROM chat_sessions
      WHERE user_id = $1 AND status = 'active'
      ORDER BY started_at DESC
    `;
    const result = await pgPool.query(query, [userId]);
    return result.rows;
  }

  // Cleanup Operations
  static async deleteOldSessions(daysOld = 30) {
    const query = `
      DELETE FROM chat_sessions
      WHERE last_activity < NOW() - INTERVAL '${daysOld} days'
      AND status = 'ended'
    `;
    await pgPool.query(query);
  }

  static async deleteSessionMessages(sessionId) {
    const query = `
      DELETE FROM messages
      WHERE session_id = $1
    `;
    await pgPool.query(query, [sessionId]);
  }
}

module.exports = PostgresService; 