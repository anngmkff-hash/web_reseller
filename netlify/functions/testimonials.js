const { pool, handleOptions, successResponse, errorResponse } = require('./db');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  const { httpMethod, path } = event;
  const id = path.split('/').pop();

  try {
    // GET /api/testimonials
    if (httpMethod === 'GET' && !id.match(/^\d+$/)) {
      const result = await pool.query('SELECT * FROM testimonials ORDER BY id');
      return successResponse(result.rows);
    }

    // POST /api/testimonials
    if (httpMethod === 'POST') {
      const { name, role, content, stars, avatar } = JSON.parse(event.body);
      
      const result = await pool.query(
        'INSERT INTO testimonials (name, role, content, stars, avatar) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, role, content, stars, avatar]
      );
      
      return successResponse(result.rows[0], 201);
    }

    // PUT /api/testimonials/:id
    if (httpMethod === 'PUT' && id.match(/^\d+$/)) {
      const { name, role, content, stars, avatar } = JSON.parse(event.body);
      
      const result = await pool.query(
        'UPDATE testimonials SET name = $1, role = $2, content = $3, stars = $4, avatar = $5 WHERE id = $6 RETURNING *',
        [name, role, content, stars, avatar, id]
      );
      
      if (result.rows.length === 0) {
        return errorResponse({ message: 'Testimonial not found' }, 404);
      }
      
      return successResponse(result.rows[0]);
    }

    // DELETE /api/testimonials/:id
    if (httpMethod === 'DELETE' && id.match(/^\d+$/)) {
      const result = await pool.query(
        'DELETE FROM testimonials WHERE id = $1 RETURNING *',
        [id]
      );
      
      if (result.rows.length === 0) {
        return errorResponse({ message: 'Testimonial not found' }, 404);
      }
      
      return successResponse({ message: 'Testimonial deleted successfully' });
    }

    return errorResponse({ message: 'Method not allowed' }, 405);
    
  } catch (error) {
    console.error('Error in testimonials function:', error);
    return errorResponse(error);
  }
};
