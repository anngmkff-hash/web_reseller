const { pool, handleOptions, successResponse, errorResponse } = require('./db');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  const { httpMethod, path } = event;
  const id = path.split('/').pop();

  try {
    // GET /api/howitworks
    if (httpMethod === 'GET' && !id.match(/^\d+$/)) {
      const result = await pool.query('SELECT * FROM howitworks ORDER BY id');
      return successResponse(result.rows);
    }

    // POST /api/howitworks
    if (httpMethod === 'POST') {
      const { icon, title, description } = JSON.parse(event.body);
      
      const result = await pool.query(
        'INSERT INTO howitworks (icon, title, description) VALUES ($1, $2, $3) RETURNING *',
        [icon, title, description]
      );
      
      return successResponse(result.rows[0], 201);
    }

    // PUT /api/howitworks/:id
    if (httpMethod === 'PUT' && id.match(/^\d+$/)) {
      const { icon, title, description } = JSON.parse(event.body);
      
      const result = await pool.query(
        'UPDATE howitworks SET icon = $1, title = $2, description = $3 WHERE id = $4 RETURNING *',
        [icon, title, description, id]
      );
      
      if (result.rows.length === 0) {
        return errorResponse({ message: 'Item not found' }, 404);
      }
      
      return successResponse(result.rows[0]);
    }

    // DELETE /api/howitworks/:id
    if (httpMethod === 'DELETE' && id.match(/^\d+$/)) {
      const result = await pool.query(
        'DELETE FROM howitworks WHERE id = $1 RETURNING *',
        [id]
      );
      
      if (result.rows.length === 0) {
        return errorResponse({ message: 'Item not found' }, 404);
      }
      
      return successResponse({ message: 'Item deleted successfully' });
    }

    return errorResponse({ message: 'Method not allowed' }, 405);
    
  } catch (error) {
    console.error('Error in howitworks function:', error);
    return errorResponse(error);
  }
};
