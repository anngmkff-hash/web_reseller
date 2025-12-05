const { pool, handleOptions, successResponse, errorResponse } = require('./db');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  const { httpMethod, path } = event;
  const id = path.split('/').pop();

  try {
    // GET /api/contactinfo
    if (httpMethod === 'GET' && !id.match(/^\d+$/)) {
      const result = await pool.query('SELECT * FROM contactinfo ORDER BY id');
      return successResponse(result.rows);
    }

    // PUT /api/contactinfo/:id
    if (httpMethod === 'PUT' && id.match(/^\d+$/)) {
      const { phone, email, instagram, address } = JSON.parse(event.body);
      
      const result = await pool.query(
        'UPDATE contactinfo SET phone = $1, email = $2, instagram = $3, address = $4 WHERE id = $5 RETURNING *',
        [phone, email, instagram, address, id]
      );
      
      if (result.rows.length === 0) {
        return errorResponse({ message: 'Contact info not found' }, 404);
      }
      
      return successResponse(result.rows[0]);
    }

    return errorResponse({ message: 'Method not allowed' }, 405);
    
  } catch (error) {
    console.error('Error in contactinfo function:', error);
    return errorResponse(error);
  }
};
