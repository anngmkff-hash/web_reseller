const { pool, handleOptions, successResponse, errorResponse } = require('./db');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  const { httpMethod, path } = event;
  const id = path.split('/').pop();

  try {
    // GET /api/registrations
    if (httpMethod === 'GET' && !id.match(/^\d+$/)) {
      const result = await pool.query(
        'SELECT * FROM registrations ORDER BY created_at DESC'
      );
      return successResponse(result.rows);
    }

    // POST /api/registrations
    if (httpMethod === 'POST') {
      const { fullName, email, whatsapp, city } = JSON.parse(event.body);
      
      const result = await pool.query(
        'INSERT INTO registrations (fullName, email, whatsapp, city) VALUES ($1, $2, $3, $4) RETURNING *',
        [fullName, email, whatsapp, city]
      );
      
      return successResponse(result.rows[0], 201);
    }

    // PUT /api/registrations/:id
    if (httpMethod === 'PUT' && id.match(/^\d+$/)) {
      const { fullName, email, whatsapp, city } = JSON.parse(event.body);
      
      const result = await pool.query(
        'UPDATE registrations SET fullName = $1, email = $2, whatsapp = $3, city = $4 WHERE id = $5 RETURNING *',
        [fullName, email, whatsapp, city, id]
      );
      
      if (result.rows.length === 0) {
        return errorResponse({ message: 'Registration not found' }, 404);
      }
      
      return successResponse(result.rows[0]);
    }

    // DELETE /api/registrations/:id
    if (httpMethod === 'DELETE' && id.match(/^\d+$/)) {
      const result = await pool.query(
        'DELETE FROM registrations WHERE id = $1 RETURNING *',
        [id]
      );
      
      if (result.rows.length === 0) {
        return errorResponse({ message: 'Registration not found' }, 404);
      }
      
      return successResponse({ message: 'Registration deleted successfully' });
    }

    return errorResponse({ message: 'Method not allowed' }, 405);
    
  } catch (error) {
    console.error('Error in registrations function:', error);
    return errorResponse(error);
  }
};
