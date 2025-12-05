const { pool, handleOptions, successResponse, errorResponse } = require('./db');

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  const { httpMethod, path } = event;
  const id = path.split('/').pop();

  try {
    // GET /api/benefits - Get all benefits
    if (httpMethod === 'GET' && !id.match(/^\d+$/)) {
      const result = await pool.query('SELECT * FROM benefits ORDER BY id');
      return successResponse(result.rows);
    }

    // POST /api/benefits - Create new benefit
    if (httpMethod === 'POST') {
      const { icon, title, description } = JSON.parse(event.body);
      
      const result = await pool.query(
        'INSERT INTO benefits (icon, title, description) VALUES ($1, $2, $3) RETURNING *',
        [icon, title, description]
      );
      
      return successResponse(result.rows[0], 201);
    }

    // PUT /api/benefits/:id - Update benefit
    if (httpMethod === 'PUT' && id.match(/^\d+$/)) {
      const { icon, title, description } = JSON.parse(event.body);
      
      const result = await pool.query(
        'UPDATE benefits SET icon = $1, title = $2, description = $3 WHERE id = $4 RETURNING *',
        [icon, title, description, id]
      );
      
      if (result.rows.length === 0) {
        return errorResponse({ message: 'Benefit not found' }, 404);
      }
      
      return successResponse(result.rows[0]);
    }

    // DELETE /api/benefits/:id - Delete benefit
    if (httpMethod === 'DELETE' && id.match(/^\d+$/)) {
      const result = await pool.query(
        'DELETE FROM benefits WHERE id = $1 RETURNING *',
        [id]
      );
      
      if (result.rows.length === 0) {
        return errorResponse({ message: 'Benefit not found' }, 404);
      }
      
      return successResponse({ message: 'Benefit deleted successfully' });
    }

    // Method not allowed
    return errorResponse({ message: 'Method not allowed' }, 405);
    
  } catch (error) {
    console.error('Error in benefits function:', error);
    return errorResponse(error);
  }
};
